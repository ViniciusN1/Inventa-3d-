import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getUserAccount, isAdminRequest, ordersFilterForUser } from "@/lib/auth";
export const dynamic = "force-dynamic";

/** Um pedido: só se for do cliente logado (ou se for admin). */
export async function GET(req: Request, context: any) {
  try {
    const admin = isAdminRequest(req);
    const user = admin ? null : await getUserAccount(req);

    if (!admin && !user) {
      return Response.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(String(id))) {
      return Response.json(
        { success: false, error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const filter = admin
      ? { _id: new ObjectId(String(id)) }
      : { $and: [{ _id: new ObjectId(String(id)) }, ordersFilterForUser(user)] };

    const order = await db.collection("orders").findOne(filter);

    if (!order) {
      return Response.json(
        { success: false, error: "Pedido não encontrado" },
        { status: 404 }
      );
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
