import clientPromise, { DB_NAME } from "@/lib/mongodb";

/**
 * Frete da Inventta 3D — mesma regra que o checkout mostra na tela
 * (src/app/checkout/page.tsx), agora também calculada no servidor.
 */

/** Padrões usados quando ainda não existe configuração salva no admin. */
export const DEFAULT_SHIPPING = {
  deliveryMS: 19.9,
  deliverySP: 24.9,
  deliveryBR: 34.9,
  freeShippingFrom: 299,
};

export interface ShippingSettings {
  deliveryMS?: number | string;
  deliverySP?: number | string;
  deliveryBR?: number | string;
  freeShippingFrom?: number | string;
}

export function calculateDeliveryFee(
  settings: ShippingSettings | null | undefined,
  state: string | undefined,
  subtotal: number
): number {
  const s = settings || {};
  const freeShippingFrom = Number(s.freeShippingFrom || 299);

  if (subtotal >= freeShippingFrom) return 0;

  const uf = String(state || "").trim().toUpperCase();

  if (uf === "MS") return Number(s.deliveryMS || 0);
  if (uf === "SP") return Number(s.deliverySP || 24.9);

  return Number(s.deliveryBR || 34.9);
}

/** Configurações de frete salvas no admin (coleção settings, key "store"). */
export async function getShippingSettings(): Promise<ShippingSettings> {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const settings = await db.collection("settings").findOne({ key: "store" });
  return (settings as ShippingSettings | null) || DEFAULT_SHIPPING;
}
