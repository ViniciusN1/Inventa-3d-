import { Payment } from "mercadopago";

import client from "@/lib/mercadopago";
import { getUserFromRequest } from "@/lib/auth";
import { CartError, priceCart, totalsMatch } from "@/lib/pricing";
import {
  applyPaymentToOrder,
  cleanCustomer,
  createPendingOrder,
  getDb,
  markOrderFailed,
} from "@/lib/orders";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * PIX (Mercado Pago). O valor cobrado é sempre o total calculado no servidor.
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

    if (
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      !customer.cep ||
      !customer.address ||
      !customer.number ||
      !customer.city ||
      !customer.state
    ) {
      return Response.json({ success: false, error: "Preencha todos os campos" });
    }

    if (!customer.email.includes("@")) {
      return Response.json({ success: false, error: "Email inválido" });
    }

    const priced = await priceCart(body.cart, customer.state);

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
      paymentMethod: "pix",
      userId: user?.userId || null,
    });

    const isPublicUrl = /^https:\/\//i.test(SITE_URL) && !/localhost|127\.0\.0\.1/.test(SITE_URL);

    const payment = new Payment(client);

    const result: any = await payment.create({
      body: {
        transaction_amount: priced.total,
        description: "Pedido Inventta 3D",
        payment_method_id: "pix",
        external_reference: String(orderId),
        metadata: { order_id: String(orderId) },
        ...(isPublicUrl
          ? { notification_url: `${SITE_URL}/api/webhooks/mercadopago` }
          : {}),
        payer: {
          email: customer.email,
          first_name: customer.name,
          ...(customer.cpf.length === 11
            ? { identification: { type: "CPF", number: customer.cpf } }
            : {}),
        },
      },
      requestOptions: { idempotencyKey: `pix-${String(orderId)}` },
    });

    const qrCode = result?.point_of_interaction?.transaction_data?.qr_code || null;
    const qrCodeBase64 =
      result?.point_of_interaction?.transaction_data?.qr_code_base64 || null;

    const db = await getDb();
    await db.collection("orders").updateOne(
      { _id: orderId },
      { $set: { qr_code: qrCode, qr_code_base64: qrCodeBase64, updatedAt: new Date() } }
    );

    // Resposta veio da própria API do Mercado Pago: pode atualizar o pedido
    await applyPaymentToOrder(result);

    return Response.json({
      success: true,
      orderId: String(orderId),
      paymentId: result.id,
      total: priced.total,
      qr_code: qrCode,
      qr_code_base64: qrCodeBase64,
    });
  } catch (error: any) {
    if (error instanceof CartError) {
      return Response.json({ success: false, error: error.message });
    }

    console.log("PIX ERROR:", error);

    if (orderId) {
      await markOrderFailed(orderId, "Erro ao gerar PIX").catch(() => {});
    }

    return Response.json({
      success: false,
      error:
        error?.cause?.[0]?.description ||
        error?.message ||
        "Erro ao gerar PIX",
    });
  }
}
