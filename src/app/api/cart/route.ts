import clientPromise, { DB_NAME } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

function getUserId(req: Request) {
  const auth = req.headers.get("authorization");
  const token = auth?.replace("Bearer ", "");

  if (!token) return null;

  const decoded: any = jwt.verify(
    token,
    process.env.JWT_SECRET!
  );

  return decoded.userId;
}

export async function GET(req: Request) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return Response.json({
        success: false,
        cart: [],
      });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    });

    return Response.json({
      success: true,
      cart: user?.cart || [],
    });
  } catch {
    return Response.json({
      success: false,
      cart: [],
    });
  }
}

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const { cart } = await req.json();

    if (!userId) {
      return Response.json({
        success: false,
        error: "Usuário não logado",
      });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection("users").updateOne(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: {
          cart,
          cartUpdatedAt: new Date(),
        },
      }
    );

    return Response.json({
      success: true,
    });
  } catch {
    return Response.json({
      success: false,
      error: "Erro ao salvar carrinho",
    });
  }
}