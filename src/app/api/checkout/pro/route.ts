import { Preference } from "mercadopago";

import client from "@/lib/mercadopago";
import { getUserFromRequest } from "@/lib/auth";
import { CartError, priceCart, totalsMatch } from "@/lib/pricing";
import {
  cleanCustomer,
  createPendingOrder,
  markOrderFailed,
  setOrderPreference,
} from "@/lib/orders";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Checkout Pro (Mercado Pago).
 * 1. Recalcula itens, frete e total com preços/estoque do banco.
 * 2. Salva o pedido como "pending" (external_reference = id do pedido).
 * 3. Cria a preferência; o webhook e a página de retorno atualizam o status.
 */
export async function POST(req: Request) {
  let orderId: any = null;

  try {
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      return Response.json(
        { success: false, error: "Pagamento indisponível no momento." },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const customer = cleanCustomer(body);

    if (!customer.name || !customer.email.includes("@")) {
      return Response.json({ success: false, error: "Preencha nome e e-mail válidos" });
    }

    const priced = await priceCart(body.cart, customer.state);

    // O cliente viu um total diferente? Pede para revisar em vez de cobrar outro valor.
    if (body.total !== undefined && !totalsMatch(body.total, priced.total)) {
      return Response.json({
        success: false,
        error: `Os valores do carrinho foram atualizados. Novo total: R$ ${priced.total.toFixed(2)}. Atualize a página e tente novamente.`,
        total: priced.total,
      });
    }

    const user = getUserFromRequest(req);

    orderId = await createPendingOrder({
      customer,
      priced,
      paymentMethod: "checkout_pro",
      userId: user?.userId || null,
    });

    const baseUrl = SITE_URL;
    const isPublicUrl = /^https:\/\//i.test(baseUrl) && !/localhost|127\.0\.0\.1/.test(baseUrl);

    const items = priced.items.map((item) => ({
      id: item._id,
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "BRL",
    }));

    if (priced.deliveryFee > 0) {
      items.push({
        id: "delivery",
        title: "Entrega discreta",
        quantity: 1,
        unit_price: priced.deliveryFee,
        currency_id: "BRL",
      });
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items,

        payer: {
          name: customer.name,
          email: customer.email,
          ...(customer.cpf
            ? { identification: { type: "CPF", number: customer.cpf } }
            : {}),
          phone: { number: customer.phone },
          address: {
            zip_code: customer.cep,
            street_name: customer.address,
            street_number: customer.number,
          },
        },

        back_urls: {
          success: `${baseUrl}/checkout/success`,
          failure: `${baseUrl}/checkout/failure`,
          pending: `${baseUrl}/checkout/pending`,
        },
        ...(isPublicUrl
          ? {
              auto_return: "approved",
              notification_url: `${baseUrl}/api/webhooks/mercadopago`,
            }
          : {}),

        external_reference: String(orderId),
        metadata: { order_id: String(orderId) },
        statement_descriptor: "INVENTTA3D",
      },
    });

    await setOrderPreference(orderId, String(result.id || ""));

    return Response.json({
      success: true,
      orderId: String(orderId),
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      preferenceId: result.id,
    });
  } catch (error: any) {
    if (error instanceof CartError) {
      return Response.json({ success: false, error: error.message });
    }

    console.log("CHECKOUT PRO ERROR:", error);

    if (orderId) {
      await markOrderFailed(orderId, "Erro ao criar preferência do Checkout Pro").catch(() => {});
    }

    return Response.json({
      success: false,
      error:
        error?.cause?.[0]?.description ||
        error?.message ||
        "Erro ao criar Checkout Pro",
    });
  }
}
