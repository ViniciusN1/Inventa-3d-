import { requireAdmin } from "@/lib/auth";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: Request,
  context: any
) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const { id } = await context.params;

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const orders =
      db.collection<any>("orders");

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    if (body.productionStatus !== undefined) {
      updateData.productionStatus = body.productionStatus;
    }

    if (body.tracking !== undefined) {
      updateData.tracking = body.tracking;
      updateData.trackingCode = body.tracking.code || "";
    }

    if (body.note !== undefined) {
      updateData.note = body.note;
    }

    await db.collection("orders").updateOne(
  { _id: new ObjectId(id) },
  {
    $set: updateData,
    $push: {
      history: {
        status: body.status || "updated",
        productionStatus:
          body.productionStatus ||
          body.status ||
          "updated",
        message:
          body.note ||
          "Pedido atualizado",
        date: new Date(),
      },
    } as any,
  }
);
    return Response.json({ success: true });
  } catch (error) {
    console.log(error);

    return Response.json({
      success: false,
      error: "Erro ao atualizar pedido",
    });
  }
}

export async function DELETE(
  req: Request,
  context: any
) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const { id } = await context.params;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection("orders").deleteOne({
      _id: new ObjectId(id),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.log(error);

    return Response.json({
      success: false,
      error: "Erro ao excluir pedido",
    });
  }
}