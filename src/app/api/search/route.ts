import { toPublicProducts } from "@/lib/public-product";
import clientPromise, { DB_NAME } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim();

    if (!q) {
      return Response.json([]);
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const products = await db
      .collection("products")
      .find({
        $or: [
          {
            name: {
              $regex: q,
              $options: "i",
            },
          },
          {
            description: {
              $regex: q,
              $options: "i",
            },
          },
          {
            category: {
              $regex: q,
              $options: "i",
            },
          },
          {
            material: {
              $regex: q,
              $options: "i",
            },
          },
        ],
      })
      .limit(5)
      .toArray();

    return Response.json(toPublicProducts(products));
  } catch (err) {
    console.error(err);

    return Response.json([]);
  }
}