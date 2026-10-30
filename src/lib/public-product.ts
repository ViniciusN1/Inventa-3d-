// Campos internos (custos, margens, fornecedor) que nunca devem chegar ao navegador.
const PRIVATE_FIELDS = new Set([
  "supplier",
  "productionCost",
  "realProfit",
  "profit",
  "profitMargin",
  "profitPercent",
  "desiredProfit",
  "baseCost",
  "unitCost",
  "totalCost",
  "filamentCost",
  "energyCost",
  "extraCost",
  "finishCost",
  "materialsCost",
  "packagingCost",
  "paymentCost",
  "channelCost",
  "salesChannelCost",
  "priceCalculation",
  "calculation",
  "productionNotes",
]);

function isPrivateKey(key: string) {
  if (PRIVATE_FIELDS.has(key)) return true;
  return /cost|profit|margin|supplier/i.test(key);
}

export function toPublicProduct<T extends Record<string, any>>(product: T): T {
  if (!product || typeof product !== "object") return product;
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(product)) {
    if (!isPrivateKey(key)) clean[key] = value;
  }
  return clean as T;
}

export function toPublicProducts<T extends Record<string, any>>(products: T[]): T[] {
  return (products || []).map((p) => toPublicProduct(p));
}
