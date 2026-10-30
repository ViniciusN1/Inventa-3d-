import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { getUserAccount, isAdminRequest, ordersFilterForUser } from "@/lib/auth";
export const dynamic = "force-dynamic";

/**
 * Pedidos do cliente logado (Bearer token).
 * Cliente vê só os próprios pedidos; admin (cookie) vê todos.
 */
export async function GET(req: Request) {
  try {
    const admin = isAdminRequest(req);
    const user = admin ? null : await getUserAccount(req);

    if (!admin && !user) {
      return Response.json(
        { success: false, orders: [], error: "Não autorizado" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const orders = await db
      .collection("orders")
      .find(admin ? {} : ordersFilterForUser(user))
      .sort({ createdAt: -1 })
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
