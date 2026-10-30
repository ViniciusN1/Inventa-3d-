import { requireAdmin } from "@/lib/auth";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function toNumber(value: any) {
  return Number(value || 0);
}

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const calculations = await db
      .collection("price_calculations")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      calculations: JSON.parse(JSON.stringify(calculations)),
    });
  } catch (error) {
    console.log("GET PRICE CALC ERROR:", error);

    return Response.json({
      success: false,
      calculations: [],
      error: "Erro ao buscar cálculos",
    });
  }
}

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const productObjectId = body.productId
      ? new ObjectId(body.productId)
      : null;

    const materials = Array.isArray(body.materials)
      ? body.materials.map((material: any) => ({
          materialId: material.materialId || "",
          name: material.name || "",
          unit: material.unit || "",
          unitCost: toNumber(material.unitCost),
          used: toNumber(material.used),
          totalCost: toNumber(material.unitCost) * toNumber(material.used),
        }))
      : [];

    const calculation = {
      productId: productObjectId,
      productName: body.productName || "",

      printHours: toNumber(body.printHours),
      printerPower: toNumber(body.printerPower),
      energyKwhPrice: toNumber(body.energyKwhPrice),

      packagingCost: toNumber(body.packagingCost),
      finishCost: toNumber(body.finishCost),
      extraCost: toNumber(body.extraCost),
      profitMargin: toNumber(body.profitMargin),

      salesChannelName: body.salesChannelName || "Site próprio",
      salesChannelFee: toNumber(body.salesChannelFee),

      paymentName: body.paymentName || "Pix Mercado Pago",
      paymentFee: toNumber(body.paymentFee),

      materials,

      result: {
        materialsCost: toNumber(body.result?.materialsCost),
        energyConsumed: toNumber(body.result?.energyConsumed),
        energyCost: toNumber(body.result?.energyCost),
        packagingCost: toNumber(body.result?.packagingCost),
        finishCost: toNumber(body.result?.finishCost),
        extraCost: toNumber(body.result?.extraCost),
        baseCost: toNumber(body.result?.baseCost),
        profit: toNumber(body.result?.profit),
        priceBeforeFees: toNumber(body.result?.priceBeforeFees),
        salesChannelCost: toNumber(body.result?.salesChannelCost),
        paymentCost: toNumber(body.result?.paymentCost),
        finalPrice: toNumber(body.result?.finalPrice),
        realProfit: toNumber(body.result?.realProfit),
      },

      note: body.note || "",
      updateProductPrice: Boolean(body.updateProductPrice),

      stockPrepared: true,
      stockReduced: false,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const saved = await db
      .collection("price_calculations")
      .insertOne(calculation);

    if (body.productId && body.applyToProduct) {
      await db.collection("products").updateOne(
  {
    _id: new ObjectId(body.productId),
  },
  {
    $set: {
      price: toNumber(body.result?.finalPrice),

      productionCost: toNumber(body.result?.baseCost),

      realProfit: toNumber(body.result?.realProfit),

      lastPriceCalculationId:
        saved.insertedId,

      updatedAt: new Date(),
    },
  }
);
    }

    return Response.json({
      success: true,
      calculationId: saved.insertedId,
    });
  } catch (error) {
    console.log("SAVE PRICE CALC ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao salvar cálculo",
    });
  }
}