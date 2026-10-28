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
        orders: [],
        error: "Token não enviado",
      });
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const orders = await db
      .collection("orders")
      .find({
        "customer.email": decoded.email,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    return Response.json({
      success: true,
      orders: JSON.parse(JSON.stringify(orders)),
    });
  } catch (error) {
    console.log(error);

    return Response.json({
      success: false,
      orders: [],
      error: "Erro ao buscar pedidos",
    });
  }
}