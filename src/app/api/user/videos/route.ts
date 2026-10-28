import clientPromise, { DB_NAME } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    const token = auth?.replace("Bearer ", "");

    if (!token) {
      return Response.json({
        success: false,
        videos: [],
      });
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const email = String(decoded.email || "")
      .toLowerCase()
      .trim();

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const orders = await db
      .collection("orders")
      .find({
        "customer.email": email,
        status: {
          $in: [
            "approved",
            "paid",
            "shipped",
            "delivered",
          ],
        },
      })
      .toArray();

    const purchasedItems = orders.flatMap((order: any) =>
      order.cart || []
    );

    const productIds = [
      ...new Set(
        purchasedItems.map((item: any) =>
          String(item._id)
        )
      ),
    ];

    const { ObjectId } = await import("mongodb");

    const products = await db
      .collection("products")
      .find({
        _id: {
          $in: productIds.map(
            (id) => new ObjectId(id)
          ),
        },
        videoUrl: {
          $exists: true,
          $ne: "",
        },
      })
      .toArray();

    return Response.json({
      success: true,
      videos: JSON.parse(JSON.stringify(products)),
    });
  } catch (error) {
    console.log("USER VIDEOS ERROR:", error);

    return Response.json({
      success: false,
      videos: [],
    });
  }
}