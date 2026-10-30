import { ObjectId } from "mongodb";
import { Payment } from "mercadopago";

import mpClient from "@/lib/mercadopago";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import type { PricedCart } from "@/lib/pricing";

/**
 * Criação de pedidos e sincronização com o Mercado Pago.
 *
 * Fluxo: o pedido é salvo como "pending" ANTES do pagamento, com
 * external_reference = id do pedido. O status só muda com dados lidos
 * diretamente da API do Mercado Pago (webhook, retorno do Checkout Pro
 * ou resposta do pagamento por cartão) — nunca com o corpo da requisição.
 */

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  address: string;
  number: string;
  city: string;
  state: string;
}

export function cleanCustomer(body: any): CheckoutCustomer {
  const str = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);
  return {
    name: str(body?.name),
    email: str(body?.email).toLowerCase(),
    phone: str(body?.phone, 40),
    cpf: str(body?.cpf, 20).replace(/\D/g, ""),
    cep: str(body?.cep, 20),
    address: str(body?.address),
    number: str(body?.number, 20),
    city: str(body?.city, 100),
    state: str(body?.state, 2).toUpperCase(),
  };
}

export async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

/** Salva o pedido como pendente e devolve o id. */
export async function createPendingOrder(params: {
  customer: CheckoutCustomer;
  priced: PricedCart;
  paymentMethod: "pix" | "card" | "checkout_pro";
  userId?: string | null;
}): Promise<ObjectId> {
  const { customer, priced, paymentMethod, userId } = params;
  const db = await getDb();
  const now = new Date();

  const result = await db.collection("orders").insertOne({
    userId: userId || null,

    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      cpf: customer.cpf,
    },

    address: {
      cep: customer.cep,
      address: customer.address,
      number: customer.number,
      city: customer.city,
      state: customer.state,
    },

    // itens com preço do banco (nunca do navegador)
    cart: priced.items,

    subtotal: priced.subtotal,
    deliveryFee: priced.deliveryFee,
    total: priced.total,

    paymentMethod,
    paymentStatus: "pending",
    status: "pending",
    productionStatus: "waiting",

    mercadoPago: {
      preferenceId: "",
      paymentId: "",
      status: "pending",
      statusDetail: "",
    },

    trackingCode: "",
    stockUpdated: false,
    stockReduced: false,

    history: [{ status: "pending", date: now, message: "Pedido criado" }],

    createdAt: now,
    updatedAt: now,
  });

  return result.insertedId;
}

export async function setOrderPreference(orderId: ObjectId, preferenceId: string) {
  const db = await getDb();
  await db.collection("orders").updateOne(
    { _id: orderId },
    {
      $set: {
        preferenceId,
        "mercadoPago.preferenceId": preferenceId,
        updatedAt: new Date(),
      },
    }
  );
}

export async function markOrderFailed(orderId: ObjectId, message: string) {
  const db = await getDb();
  await db.collection("orders").updateOne(
    { _id: orderId },
    {
      $set: { status: "payment_error", paymentStatus: "error", updatedAt: new Date() },
      $push: { history: { status: "payment_error", date: new Date(), message } } as any,
    }
  );
}

function safeObjectId(id: unknown): ObjectId | null {
  const s = String(id ?? "");
  return ObjectId.isValid(s) && s.length === 24 ? new ObjectId(s) : null;
}

function orderStatusFromPayment(paymentStatus: string, current?: string): string {
  // não "volta" um pedido já enviado/entregue por causa de uma notificação
  if (["shipped", "delivered"].includes(String(current || ""))) return String(current);

  if (paymentStatus === "approved") return "paid";
  if (paymentStatus === "rejected") return "payment_rejected";
  if (paymentStatus === "cancelled") return "cancelled";
  if (paymentStatus === "refunded" || paymentStatus === "charged_back") return paymentStatus;
  return "pending";
}

/**
 * Baixa estoque de produtos e insumos (receita) de um pedido aprovado.
 * Idempotente: o pedido é "reservado" atomicamente antes da baixa.
 */
export async function reduceStockForOrder(orderId: ObjectId) {
  const db = await getDb();

  const claimed = await db.collection("orders").findOneAndUpdate(
    { _id: orderId, stockReduced: { $ne: true }, stockUpdated: { $ne: true } },
    { $set: { stockReduced: true, stockUpdated: true, stockUpdatedAt: new Date() } },
    { returnDocument: "after" }
  );

  const order: any = claimed;
  if (!order) return; // já baixado antes

  const items: any[] = Array.isArray(order.products)
    ? order.products
    : Array.isArray(order.cart)
    ? order.cart
    : [];

  const movements: any[] = [];

  for (const item of items) {
    const productObjectId = safeObjectId(item.productId || item._id);
    if (!productObjectId) continue;

    const quantitySold = Math.max(1, Number(item.quantity || 1));
    const product: any = await db.collection("products").findOne({ _id: productObjectId });
    if (!product) continue;

    if (Array.isArray(product.recipeMaterials)) {
      for (const material of product.recipeMaterials) {
        const materialObjectId = safeObjectId(material.materialId);
        if (!materialObjectId) continue;

        const quantityUsed = Number(material.quantityUsed || 0);
        const quantityReduced = quantityUsed * quantitySold;
        if (quantityReduced <= 0) continue;

        await db.collection("materials").updateOne(
          { _id: materialObjectId },
          { $inc: { stock: -quantityReduced }, $set: { updatedAt: new Date() } }
        );

        movements.push({
          orderId: String(order._id),
          productId: String(product._id),
          productName: product.name || item.name || "",
          materialId: String(material.materialId),
          materialName: material.name || "",
          unit: material.unit || "",
          quantityUsed,
          quantitySold,
          quantityReduced,
          type: "sale",
          reason: "Venda aprovada Mercado Pago",
          createdAt: new Date(),
        });
      }
    }

    // só baixa estoque do produto quando ele tem controle de estoque
    if (product.stock !== undefined && product.stock !== null && product.stock !== "") {
      await db.collection("products").updateOne(
        { _id: productObjectId },
        { $inc: { stock: -quantitySold }, $set: { updatedAt: new Date() } }
      );
    }
  }

  if (movements.length > 0) {
    await db.collection("inventory_movements").insertMany(movements);
  }

  await db.collection("orders").updateOne(
    { _id: order._id },
    {
      $push: {
        history: {
          status: "stock_reduced",
          date: new Date(),
          message: "Estoque baixado automaticamente",
        },
      } as any,
    }
  );
}

/**
 * Busca o pagamento NA API do Mercado Pago e atualiza o pedido.
 * Usado pelo webhook, pelo retorno do Checkout Pro e pelo cartão.
 */
export async function syncPaymentFromMercadoPago(paymentId: string) {
  const id = String(paymentId || "").trim();
  if (!/^\d+$/.test(id)) return { ok: false as const, error: "paymentId inválido" };

  const payment = new Payment(mpClient);
  const paymentData: any = await payment.get({ id });

  return applyPaymentToOrder(paymentData);
}

/** Aplica um pagamento já obtido da API do Mercado Pago ao pedido correspondente. */
export async function applyPaymentToOrder(paymentData: any) {
  const db = await getDb();

  const paymentId = String(paymentData?.id || "");
  const paymentStatus = String(paymentData?.status || "pending");
  const externalReference = String(paymentData?.external_reference || "");
  const preferenceId = String(paymentData?.preference_id || "");

  let order: any = null;

  const refId = safeObjectId(externalReference);
  if (refId) order = await db.collection("orders").findOne({ _id: refId });

  if (!order && paymentId) {
    order = await db.collection("orders").findOne({
      $or: [
        { "mercadoPago.paymentId": paymentId },
        { "payment.payment_id": Number(paymentId) },
      ],
    });
  }

  if (!order && externalReference) {
    order = await db.collection("orders").findOne({ externalReference });
  }

  if (!order) {
    // Não cria pedido a partir de metadados: o pedido sempre nasce no checkout.
    console.log("MP: pedido não encontrado para pagamento", paymentId, externalReference);
    return { ok: false as const, error: "Pedido não encontrado" };
  }

  // Confere se o valor pago cobre o total do pedido salvo
  const paidAmount = Number(paymentData?.transaction_amount || 0);
  const amountOk = paidAmount + 0.01 >= Number(order.total || 0);

  let effectiveStatus = paymentStatus;
  if (paymentStatus === "approved" && !amountOk) {
    effectiveStatus = "amount_mismatch";
  }

  const status =
    effectiveStatus === "amount_mismatch"
      ? "payment_review"
      : orderStatusFromPayment(paymentStatus, order.status);

  const changed =
    order.paymentStatus !== effectiveStatus ||
    String(order?.mercadoPago?.paymentId || "") !== paymentId;

  const update: any = {
    $set: {
      paymentStatus: effectiveStatus,
      status,
      externalReference: externalReference || String(order._id),

      "mercadoPago.paymentId": paymentId,
      "mercadoPago.status": paymentStatus,
      "mercadoPago.statusDetail": String(paymentData?.status_detail || ""),
      "mercadoPago.amount": paidAmount,

      "payment.payment_id": Number(paymentId),
      "payment.status": paymentStatus,
      "payment.status_detail": String(paymentData?.status_detail || ""),
      "payment.method": String(paymentData?.payment_method_id || order.paymentMethod || ""),
      "payment.type": String(paymentData?.payment_type_id || ""),
      "payment.installments": Number(paymentData?.installments || 1),

      updatedAt: new Date(),
    },
  };

  if (preferenceId) {
    update.$set.preferenceId = preferenceId;
    update.$set["mercadoPago.preferenceId"] = preferenceId;
  }

  if (changed) {
    update.$push = {
      history: {
        status: effectiveStatus,
        date: new Date(),
        message:
          effectiveStatus === "amount_mismatch"
            ? `Pagamento aprovado com valor diferente do pedido (R$ ${paidAmount.toFixed(2)})`
            : `Pagamento Mercado Pago: ${paymentStatus}`,
      },
    };
  }

  await db.collection("orders").updateOne({ _id: order._id }, update);

  if (effectiveStatus === "approved") {
    await reduceStockForOrder(order._id);
  }

  return {
    ok: true as const,
    orderId: String(order._id),
    status,
    paymentStatus: effectiveStatus,
  };
}
