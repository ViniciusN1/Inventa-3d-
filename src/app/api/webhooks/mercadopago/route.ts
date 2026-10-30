import { syncPaymentFromMercadoPago } from "@/lib/orders";
import { isValidMercadoPagoSignature } from "@/lib/mercadopago-signature";

export const dynamic = "force-dynamic";

/**
 * Webhook do Mercado Pago.
 * - Nunca confia no corpo: busca o pagamento na API do Mercado Pago pelo id.
 * - Se MERCADOPAGO_WEBHOOK_SECRET estiver definido, exige x-signature válido.
 * - Aceita o formato novo (JSON { type, data.id }) e o antigo (?topic=payment&id=).
 */
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const body: any = await req.json().catch(() => ({}));

    const type = String(
      body?.type || body?.topic || url.searchParams.get("type") || url.searchParams.get("topic") || ""
    );

    const dataId = String(
      url.searchParams.get("data.id") ||
        body?.data?.id ||
        url.searchParams.get("id") ||
        ""
    );

    const secret = (process.env.MERCADOPAGO_WEBHOOK_SECRET || "").trim();
    if (secret) {
      const valid = isValidMercadoPagoSignature({
        secret,
        xSignature: req.headers.get("x-signature"),
        xRequestId: req.headers.get("x-request-id"),
        dataId,
      });

      if (!valid) {
        console.log("WEBHOOK MP: assinatura inválida", { type, dataId });
        return Response.json({ success: false, error: "Assinatura inválida" }, { status: 401 });
      }
    }

    if (type !== "payment" && !String(body?.action || "").startsWith("payment.")) {
      return Response.json({ received: true });
    }

    if (!/^\d+$/.test(dataId)) {
      return Response.json({ received: true, ignored: "paymentId inválido" });
    }

    const result = await syncPaymentFromMercadoPago(dataId);

    // 200 mesmo quando o pedido não existe, para o MP não reenviar sem fim
    return Response.json({ received: true, ...result });
  } catch (error) {
    console.log("WEBHOOK ERROR:", error);

    // 500 faz o Mercado Pago tentar de novo mais tarde
    return Response.json({ success: false }, { status: 500 });
  }
}
