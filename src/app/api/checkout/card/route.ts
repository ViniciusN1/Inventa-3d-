import { Payment } from "mercadopago";

import client from "@/lib/mercadopago";
import { getUserFromRequest } from "@/lib/auth";
import { CartError, priceCart, totalsMatch } from "@/lib/pricing";
import {
  applyPaymentToOrder,
  cleanCustomer,
  createPendingOrder,
  markOrderFailed,
} from "@/lib/orders";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Cartão (Card Payment Brick). O valor cobrado é o total do servidor;
 * se o valor que o cliente viu (amount) for diferente, o pagamento não é feito.
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
    const { token, issuer_id, payment_method_id, installments, amount } = body;

    if (!token) {
      return Response.json({ success: false, error: "Token do cartão não recebido" });
    }

    if (!customer.email || !customer.email.includes("@")) {
      return Response.json({ success: false, error: "Email inválido" });
    }

    if (customer.cpf.length !== 11) {
      return Response.json({ success: false, error: "CPF inválido" });
    }

    const priced = await priceCart(body.cart, customer.state);

    // O Brick calcula parcelas a partir do valor mostrado: precisa bater com o servidor
    if (!totalsMatch(amount, priced.total)) {
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
      paymentMethod: "card",
      userId: user?.userId || null,
    });

    const isPublicUrl = /^https:\/\//i.test(SITE_URL) && !/localhost|127\.0\.0\.1/.test(SITE_URL);

    const payment = new Payment(client);

    const result: any = await payment.create({
      body: {
        transaction_amount: priced.total,
        token,
        description: "Pedido Inventta 3D",
        installments: Math.max(1, Number(installments || 1)),
        payment_method_id,
        ...(issuer_id ? { issuer_id: Number(issuer_id) } : {}),
        external_reference: String(orderId),
        metadata: { order_id: String(orderId) },
        ...(isPublicUrl
          ? { notification_url: `${SITE_URL}/api/webhooks/mercadopago` }
          : {}),
        payer: {
          email: customer.email,
          identification: { type: "CPF", number: customer.cpf },
        },
      },
      requestOptions: { idempotencyKey: `card-${String(orderId)}` },
    });

    // Atualiza status (e baixa estoque se aprovado) com a resposta da API do MP
    const synced = await applyPaymentToOrder(result);

    return Response.json({
      success: true,
      orderId: String(orderId),
      paymentId: result.id,
      status: result.status,
      statusDetail: result.status_detail,
      orderStatus: synced.ok ? synced.status : undefined,
    });
  } catch (error: any) {
    if (error instanceof CartError) {
      return Response.json({ success: false, error: error.message });
    }

    console.log("CARD ERROR:", error);

    if (orderId) {
      await markOrderFailed(orderId, "Erro ao processar cartão").catch(() => {});
    }

    return Response.json({
      success: false,
      error:
        error?.cause?.[0]?.description ||
        error?.message ||
        "Erro ao processar cartão",
    });
  }
}
