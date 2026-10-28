import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.image !== undefined) updateData.image = body.image;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.category !== undefined) updateData.category = body.category;
    if (body.material !== undefined) updateData.material = body.material;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.dimensions !== undefined) updateData.dimensions = body.dimensions;
    if (body.weight !== undefined) updateData.weight = body.weight;
    if (body.productionTime !== undefined) updateData.productionTime = body.productionTime;
    if (body.supplier !== undefined) updateData.supplier = body.supplier;
    if (body.featured !== undefined) updateData.featured = Boolean(body.featured);
    if (body.isNew !== undefined) updateData.isNew = Boolean(body.isNew);

    if (body.videoUrl !== undefined) updateData.videoUrl = body.videoUrl;
    if (body.videoTitle !== undefined) updateData.videoTitle = body.videoTitle;
    if (body.videoDescription !== undefined) updateData.videoDescription = body.videoDescription;
    if (body.productDetails !== undefined) updateData.productDetails = body.productDetails;
    if (body.careInstructions !== undefined) updateData.careInstructions = body.careInstructions;
    if (body.productionNotes !== undefined) updateData.productionNotes = body.productionNotes;

    await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return Response.json({ success: true });
  } catch (error) {
    console.log("UPDATE PRODUCT ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao atualizar produto",
    });
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.log("DELETE PRODUCT ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao excluir produto",
    });
  }
}

