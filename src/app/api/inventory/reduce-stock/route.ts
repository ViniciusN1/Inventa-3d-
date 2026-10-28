import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function toNumber(value: any) {
  return Number(value || 0);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { orderId, items = [] } = body;

    if (!orderId) {
      return Response.json({
        success: false,
        error: "ID do pedido obrigatório",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({
        success: false,
        error: "Itens do pedido obrigatórios",
      });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const alreadyReduced = await db.collection("inventory_movements").findOne({
      orderId,
      type: "sale",
    });

    if (alreadyReduced) {
      return Response.json({
        success: true,
        message: "Estoque já baixado para este pedido",
      });
    }

    const movements: any[] = [];

    for (const item of items) {
      const productId = item.productId || item._id;
      const quantitySold = toNumber(item.quantity || 1);

      if (!productId) continue;

      const product = await db.collection("products").findOne({
        _id: new ObjectId(productId),
      });

      if (!product?.recipeMaterials?.length) continue;

      for (const material of product.recipeMaterials) {
        const materialId = material.materialId;
        const quantityUsed = toNumber(material.quantityUsed);
        const totalToReduce = quantityUsed * quantitySold;

        if (!materialId || totalToReduce <= 0) continue;

        await db.collection("materials").updateOne(
          {
            _id: new ObjectId(materialId),
          },
          {
            $inc: {
              stock: -totalToReduce,
            },
            $set: {
              updatedAt: new Date(),
            },
          }
        );

        movements.push({
          orderId,
          productId,
          productName: product.name || item.name || "",
          materialId,
          materialName: material.name || "",
          unit: material.unit || "",
          quantityUsed,
          quantitySold,
          quantityReduced: totalToReduce,
          type: "sale",
          createdAt: new Date(),
        });
      }
    }

    if (movements.length > 0) {
      await db.collection("inventory_movements").insertMany(movements);
    }

    return Response.json({
      success: true,
      movements,
    });
  } catch (error) {
    console.log("REDUCE STOCK ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao baixar estoque",
    });
  }
}