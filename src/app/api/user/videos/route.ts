import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { getUserAccount, ordersFilterForUser } from "@/lib/auth";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getUserAccount(req);

    if (!user) {
      return Response.json(
        { success: false, videos: [] },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const orders = await db
      .collection("orders")
      .find({
        ...ordersFilterForUser(user),
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
      order.cart || order.products || []
    );

    const productIds = [
      ...new Set(
        purchasedItems.map((item: any) =>
          String(item.productId || item._id)
        )
      ),
    ];

    const { ObjectId } = await import("mongodb");

    const products = await db
      .collection("products")
      .find({
        _id: {
          $in: productIds
            .filter((id) => ObjectId.isValid(String(id)))
            .map((id) => new ObjectId(String(id))),
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