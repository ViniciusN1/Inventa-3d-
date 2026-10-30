import { toPublicProducts } from "@/lib/public-product";
import { requireAdmin } from "@/lib/auth";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { slugify } from "@/lib/slug";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const products = await db
      .collection("products")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      products: toPublicProducts(products),
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao buscar produtos",
    });
  }
}

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();

    const {
      name,
      description,
      price,
      image,
      images,
      stock,
      category,
      material,
      color,
      dimensions,
      weight,
      productionTime,
      supplier,
      videoUrl,
      featured,
    } = body;

    if (!name || !price || !image) {
      return Response.json({
        success: false,
        error: "Nome, preço e imagem são obrigatórios",
      });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Gera automaticamente o slug da categoria
    const categorySlug = slugify(category || "Geral");

    const result = await db.collection("products").insertOne({
        name,
        description: description || "",
        price: Number(price),

        image,
        images: images || [],

        stock: Number(stock || 0),

        category: category || "Geral",
        categorySlug,

        material,
        color,
        dimensions,
        weight,
        productionTime,
        supplier,

        videoUrl,
        featured: Boolean(featured),

        createdAt: new Date(),
        updatedAt: new Date(),
      });

    return Response.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao criar produto",
    });
  }
}