import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function normalizeUnit(unit: string) {
  if (unit === "kg") return "g";
  return unit || "unidade";
}

function normalizeQuantity(unit: string, quantity: number) {
  if (unit === "kg") return quantity * 1000;
  return quantity;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const materials = await db
      .collection("materials")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      materials: JSON.parse(JSON.stringify(materials)),
    });
  } catch (error) {
    console.log("GET MATERIALS ERROR:", error);

    return Response.json({
      success: false,
      materials: [],
      error: "Erro ao buscar materiais",
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const originalUnit = String(body.unit || "unidade").trim();

    const quantityRaw = Number(body.quantity || 0);
    const price = Number(body.price || 0);

    if (!name) {
      return Response.json({
        success: false,
        error: "Nome do material obrigatório",
      });
    }

    if (quantityRaw <= 0 || price <= 0) {
      return Response.json({
        success: false,
        error: "Quantidade e preço precisam ser maiores que zero",
      });
    }

    const unit = normalizeUnit(originalUnit);
    const quantity = normalizeQuantity(originalUnit, quantityRaw);
    const unitCost = price / quantity;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db.collection("materials").insertOne({
      name,

      originalUnit,
      originalQuantity: quantityRaw,

      unit,
      quantity,
      price,
      unitCost,

      stock: quantity,

      active: true,

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return Response.json({
      success: true,
      materialId: result.insertedId,
    });
  } catch (error) {
    console.log("CREATE MATERIAL ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao cadastrar material",
    });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const id = String(body.id || "");
    const stock = Number(body.stock || 0);

    if (!id) {
      return Response.json({
        success: false,
        error: "ID obrigatório",
      });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection("materials").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          stock,
          updatedAt: new Date(),
        },
      }
    );

    return Response.json({ success: true });
  } catch (error) {
    console.log("UPDATE MATERIAL ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao atualizar material",
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({
        success: false,
        error: "ID obrigatório",
      });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection("materials").deleteOne({
      _id: new ObjectId(id),
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.log("DELETE MATERIAL ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao excluir material",
    });
  }
}