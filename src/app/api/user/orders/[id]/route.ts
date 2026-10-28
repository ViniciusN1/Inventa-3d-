import clientPromise, { DB_NAME } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  context: any
) {
  try {
    const auth =
      req.headers.get("authorization");

    const token =
      auth?.replace("Bearer ", "");

    if (!token) {
      return Response.json({
        success: false,
        error: "Token não enviado",
      });
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const { id } = await context.params;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const order = await db
      .collection("orders")
      .findOne({
        _id: new ObjectId(id),
        "customer.email": decoded.email,
      });

    if (!order) {
      return Response.json({
        success: false,
        error: "Pedido não encontrado",
      });
    }

    return Response.json({
      success: true,
      order: JSON.parse(JSON.stringify(order)),
    });
  } catch (error) {
    console.log(error);

    return Response.json({
      success: false,
      error: "Erro ao buscar pedido",
    });
  }
}