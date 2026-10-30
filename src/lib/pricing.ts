import { ObjectId } from "mongodb";

import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { calculateDeliveryFee, getShippingSettings } from "@/lib/shipping";

/**
 * Recalcula o carrinho no servidor usando preço e estoque do banco.
 * Preços, subtotal, frete e total enviados pelo navegador são ignorados.
 */

export interface PricedItem {
  _id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface PricedCart {
  items: PricedItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export class CartError extends Error {}

const MAX_QTY_PER_ITEM = 100;
const round = (n: number) => Math.round(n * 100) / 100;

function isInactive(product: any): boolean {
  if (product?.active === false) return true;
  const status = String(product?.status || "").toLowerCase();
  return ["inactive", "inativo", "archived", "draft"].includes(status);
}

export async function priceCart(cart: any, state?: string): Promise<PricedCart> {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw new CartError("Carrinho vazio");
  }

  // Junta itens repetidos e valida quantidades
  const wanted = new Map<string, number>();
  for (const item of cart) {
    const id = String(item?.productId || item?._id || "");
    if (!ObjectId.isValid(id)) throw new CartError("Produto inválido no carrinho");

    const qty = Math.floor(Number(item?.quantity ?? 1));
    if (!Number.isFinite(qty) || qty < 1 || qty > MAX_QTY_PER_ITEM) {
      throw new CartError("Quantidade inválida no carrinho");
    }

    wanted.set(id, (wanted.get(id) || 0) + qty);
  }

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const products = await db
    .collection("products")
    .find({ _id: { $in: [...wanted.keys()].map((id) => new ObjectId(id)) } })
    .toArray();

  const items: PricedItem[] = [];

  for (const [id, quantity] of wanted) {
    const product: any = products.find((p) => String(p._id) === id);

    if (!product || isInactive(product)) {
      throw new CartError("Um produto do carrinho não está mais disponível. Atualize o carrinho.");
    }

    const price = round(Number(product.price));
    if (!Number.isFinite(price) || price <= 0) {
      throw new CartError(`Produto sem preço válido: ${product.name || id}`);
    }

    // stock vazio/nulo = sem controle de estoque (produção sob demanda)
    if (product.stock !== undefined && product.stock !== null && product.stock !== "") {
      const stock = Number(product.stock);
      if (Number.isFinite(stock) && quantity > stock) {
        throw new CartError(
          stock > 0
            ? `Estoque insuficiente para ${product.name}: disponível ${stock}.`
            : `${product.name} está esgotado.`
        );
      }
    }

    items.push({
      _id: id,
      productId: id,
      name: String(product.name || ""),
      image: String(product.image || ""),
      price,
      quantity,
    });
  }

  const subtotal = round(items.reduce((acc, i) => acc + i.price * i.quantity, 0));
  const settings = await getShippingSettings();
  const deliveryFee = round(calculateDeliveryFee(settings, state, subtotal));

  return { items, subtotal, deliveryFee, total: round(subtotal + deliveryFee) };
}

/** true se o total que o cliente viu bate com o do servidor (tolerância de 1 centavo). */
export function totalsMatch(clientTotal: unknown, serverTotal: number): boolean {
  const n = Number(clientTotal);
  return Number.isFinite(n) && Math.abs(n - serverTotal) <= 0.01;
}
