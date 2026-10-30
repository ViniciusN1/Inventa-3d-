import { syncPaymentFromMercadoPago } from "@/lib/orders";

export const dynamic = "force-dynamic";

/**
 * Retorno do Checkout Pro: a página /checkout/success|pending|failure chama
 * esta rota com o payment_id da URL. O status é lido na API do Mercado Pago,
 * então um payment_id falso não altera nada.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const paymentId = String(
      url.searchParams.get("payment_id") || url.searchParams.get("collection_id") || ""
    );

    if (!/^\d+$/.test(paymentId)) {
      return Response.json({ success: false, error: "Pagamento não informado" });
    }

    const result = await syncPaymentFromMercadoPago(paymentId);

    if (!result.ok) {
      return Response.json({ success: false, error: result.error });
    }

    return Response.json({
      success: true,
      status: result.status,
      paymentStatus: result.paymentStatus,
    });
  } catch (error) {
    console.log("CHECKOUT CONFIRM ERROR:", error);
    return Response.json({ success: false, error: "Erro ao confirmar pagamento" });
  }
}
