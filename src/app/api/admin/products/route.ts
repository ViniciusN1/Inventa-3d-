import clientPromise, { DB_NAME } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db.collection("products").insertOne({
      name: body.name || "",
      description: body.description || "",

      price: Number(body.price || 0),

      image: body.image || "",

      stock: Number(body.stock || 0),

      category: body.category || "Impressão 3D",

      material: body.material || "",

      color: body.color || "",

      dimensions: body.dimensions || "",

      weight: body.weight || "",

      productionTime:
        body.productionTime || "",

      supplier: body.supplier || "",

      videoUrl: body.videoUrl || "",

      featured:
        body.featured === true,

      createdAt: new Date(),

      updatedAt: new Date(),
    });

    return Response.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.log(error);

    return Response.json({
      success: false,
      error: "Erro ao criar produto",
    });
  }
}