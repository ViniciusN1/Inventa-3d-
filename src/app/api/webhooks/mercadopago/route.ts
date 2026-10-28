import clientPromise, { DB_NAME } from "@/lib/mongodb";
import client from "@/lib/mercadopago";
import { ObjectId } from "mongodb";
import { Payment } from "mercadopago";
export const dynamic = "force-dynamic";

function safeObjectId(id: string) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

function getOrderItems(order: any) {
  if (Array.isArray(order.products)) return order.products;
  if (Array.isArray(order.cart)) return order.cart;
  return [];
}

async function reduceRecipeStock({
  db,
  order,
}: {
  db: any;
  order: any;
}) {
  const orderId = String(order._id);

  const alreadyReduced = await db.collection("inventory_movements").findOne({
    orderId,
    type: "sale",
  });

  if (alreadyReduced) return;

  const items = getOrderItems(order);
  const movements: any[] = [];

  for (const item of items) {
    const rawProductId = item.productId || item._id;
    const productObjectId = safeObjectId(String(rawProductId));

    if (!productObjectId) continue;

    const quantitySold = Number(item.quantity || 1);

    const product = await db.collection("products").findOne({
      _id: productObjectId,
    });

    if (!product) continue;

    if (Array.isArray(product.recipeMaterials)) {
      for (const material of product.recipeMaterials) {
        const materialObjectId = safeObjectId(String(material.materialId));

        if (!materialObjectId) continue;

        const quantityUsed = Number(material.quantityUsed || 0);
        const quantityReduced = quantityUsed * quantitySold;

        if (quantityReduced <= 0) continue;

        await db.collection("materials").updateOne(
          {
            _id: materialObjectId,
          },
          {
            $inc: {
              stock: -quantityReduced,
            },
            $set: {
              updatedAt: new Date(),
            },
          }
        );

        movements.push({
          orderId,
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

    await db.collection("products").updateOne(
      {
        _id: productObjectId,
      },
      {
        $inc: {
          stock: -quantitySold,
        },
        $set: {
          updatedAt: new Date(),
        },
      }
    );
  }

  if (movements.length > 0) {
    await db.collection("inventory_movements").insertMany(movements);
  }

  await db.collection("orders").updateOne(
    {
      _id: order._id,
    },
    {
      $set: {
        stockUpdated: true,
        stockReduced: true,
        stockUpdatedAt: new Date(),
        updatedAt: new Date(),
      },
      $push: {
        history: {
          $each: [
            {
              status: "stock_reduced",
              date: new Date(),
              message: "Estoque de materiais baixado automaticamente",
            },
          ],
        },
      },
    } as any
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("WEBHOOK MP:", JSON.stringify(body));

    if (body.type !== "payment") {
      return Response.json({
        received: true,
      });
    }

    const paymentId = String(body.data?.id || "");

    if (!paymentId) {
      return Response.json({
        success: false,
        error: "paymentId não recebido",
      });
    }

    const payment = new Payment(client);

    const paymentData: any = await payment.get({
      id: paymentId,
    });

    const mongo = await clientPromise;
    const db = mongo.db(DB_NAME);

    const paymentStatus = paymentData.status || "pending";
    const metadata = paymentData.metadata || {};
    const externalReference = paymentData.external_reference || "";
    const preferenceId = paymentData.preference_id || "";

    let order = null;

    const externalOrderId = safeObjectId(String(externalReference));

    if (externalOrderId) {
      order = await db.collection("orders").findOne({
        _id: externalOrderId,
      });
    }

    if (!order) {
      order = await db.collection("orders").findOne({
        "mercadoPago.paymentId": String(paymentId),
      });
    }

    if (!order) {
      order = await db.collection("orders").findOne({
        "payment.payment_id": Number(paymentId),
      });
    }

    if (!order && externalReference) {
      order = await db.collection("orders").findOne({
        externalReference,
      });
    }

    if (!order && metadata?.cart) {
      const cart = Array.isArray(metadata.cart) ? metadata.cart : [];

      const inserted = await db.collection("orders").insertOne({
        customer: {
          name: metadata.name || "",
          email: String(metadata.email || "").toLowerCase().trim(),
          phone: metadata.phone || "",
          cpf: String(metadata.cpf || "").replace(/\D/g, ""),
        },

        address: {
          cep: metadata.cep || "",
          address: metadata.address || "",
          number: metadata.number || "",
          city: metadata.city || "",
          state: metadata.state || "",
        },

        products: cart.map((item: any) => ({
          productId: item.productId || item._id,
          name: item.name || "",
          image: item.image || "",
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 1),
        })),

        subtotal: Number(metadata.subtotal || 0),
        deliveryFee: Number(metadata.deliveryFee || 0),
        total: Number(metadata.total || paymentData.transaction_amount || 0),

        paymentMethod: "mercadopago",
        paymentStatus,
        status: paymentStatus === "approved" ? "paid" : paymentStatus,
        productionStatus: paymentStatus === "approved" ? "waiting" : "pending",

        mercadoPago: {
          preferenceId,
          paymentId: String(paymentId),
          status: paymentStatus,
          statusDetail: paymentData.status_detail || "",
        },

        payment: {
          payment_id: Number(paymentId),
          status: paymentStatus,
          status_detail: paymentData.status_detail || "",
          method: paymentData.payment_method_id || "checkout_pro",
          type: paymentData.payment_type_id || "",
          installments: Number(paymentData.installments || 1),
        },

        externalReference,
        stockUpdated: false,
        stockReduced: false,

        history: [
          {
            status: paymentStatus,
            date: new Date(),
            message: "Pedido criado pelo webhook Mercado Pago",
          },
        ],

        createdAt: new Date(),
        updatedAt: new Date(),
      });

      order = await db.collection("orders").findOne({
        _id: inserted.insertedId,
      });
    }

    if (!order) {
      console.log("Pedido não encontrado/criado para paymentId:", paymentId);

      return Response.json({
        success: false,
        error: "Pedido não encontrado",
      });
    }

    const orderStatus =
      paymentStatus === "approved"
        ? "paid"
        : paymentStatus === "rejected"
        ? "payment_rejected"
        : paymentStatus;

    await db.collection("orders").updateOne(
      {
        _id: order._id,
      },
      {
        $set: {
          paymentStatus,
          status: orderStatus,
          productionStatus:
            paymentStatus === "approved"
              ? "waiting"
              : order.productionStatus || "pending",

          externalReference,
          preferenceId,

          "mercadoPago.preferenceId": preferenceId,
          "mercadoPago.paymentId": String(paymentId),
          "mercadoPago.status": paymentStatus,
          "mercadoPago.statusDetail": paymentData.status_detail || "",

          "payment.payment_id": Number(paymentId),
          "payment.status": paymentStatus,
          "payment.status_detail": paymentData.status_detail || "",
          "payment.method": paymentData.payment_method_id || "checkout_pro",
          "payment.type": paymentData.payment_type_id || "",

          updatedAt: new Date(),
        },
        $push: {
          history: {
            $each: [
              {
                status: paymentStatus,
                date: new Date(),
                message: `Pagamento Mercado Pago: ${paymentStatus}`,
              },
            ],
          },
        },
      } as any
    );

    const updatedOrder = await db.collection("orders").findOne({
      _id: order._id,
    });

    if (
      paymentStatus === "approved" &&
      updatedOrder &&
      updatedOrder.stockUpdated !== true &&
      updatedOrder.stockReduced !== true
    ) {
      await reduceRecipeStock({
        db,
        order: updatedOrder,
      });
    }

    return Response.json({
      success: true,
      status: paymentStatus,
    });
  } catch (error) {
    console.log("WEBHOOK ERROR:", error);

    return Response.json({
      success: false,
    });
  }
}