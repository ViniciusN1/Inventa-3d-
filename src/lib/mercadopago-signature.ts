import { createHmac, timingSafeEqual } from "crypto";

/**
 * Valida o header x-signature das notificações do Mercado Pago.
 * Formato: "ts=1704908010,v1=<hmac-sha256 hex>"
 * Manifesto: "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"
 * Docs: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
export function isValidMercadoPagoSignature(params: {
  secret: string;
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string;
}): boolean {
  const { secret, xSignature, xRequestId, dataId } = params;
  if (!secret || !xSignature) return false;

  let ts = "";
  let v1 = "";
  for (const part of xSignature.split(",")) {
    const [k, v] = part.split("=").map((x) => (x || "").trim());
    if (k === "ts") ts = v;
    if (k === "v1") v1 = v;
  }
  if (!ts || !v1) return false;

  // IDs alfanuméricos devem ir em minúsculas no manifesto
  const id = /^[a-z0-9]+$/i.test(dataId) ? dataId.toLowerCase() : dataId;

  let manifest = "";
  if (id) manifest += `id:${id};`;
  if (xRequestId) manifest += `request-id:${xRequestId};`;
  manifest += `ts:${ts};`;

  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(v1, "hex");
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}
