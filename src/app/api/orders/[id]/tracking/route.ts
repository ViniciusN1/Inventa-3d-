import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: Request,
  context: any
) {
  try {
    const { id } = await context.params;

    const body = await req.json();

    const {
      trackingCode,
      carrier,
      trackingUrl,
      note,
    } = body;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection("orders").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          status: "shipped",
          tracking: {
            code: trackingCode || "",
            carrier: carrier || "",
            url: trackingUrl || "",
            note: note || "",
            updatedAt: new Date(),
          },
          updatedAt: new Date(),
        },
      }
    );

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.log("TRACKING ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao atualizar rastreio",
    });
  }
}