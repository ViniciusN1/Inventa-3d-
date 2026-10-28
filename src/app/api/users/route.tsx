import clientPromise, { DB_NAME } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
export const dynamic = "force-dynamic";

function getUser(req: Request) {
  const auth = req.headers.get("authorization");
  const token = auth?.replace("Bearer ", "");

  if (!token) return null;

  return jwt.verify(token, process.env.JWT_SECRET!) as any;
}

export async function GET(req: Request) {
  try {
    const user = getUser(req);

    if (!user) {
      return Response.json({
        success: false,
        following: false,
      });
    }

    const { searchParams } = new URL(req.url);
    const followingId = searchParams.get("followingId");

    if (!followingId) {
      return Response.json({
        success: false,
        following: false,
      });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const exists = await db.collection("followers").findOne({
      followerId: user.userId,
      followingId,
    });

    return Response.json({
      success: true,
      following: Boolean(exists),
    });
  } catch (error) {
    console.log("FOLLOW STATUS ERROR:", error);

    return Response.json({
      success: false,
      following: false,
    });
  }
}

export async function POST(req: Request) {
  try {
    const user = getUser(req);

    if (!user) {
      return Response.json({
        success: false,
        error: "Usuário não logado",
      });
    }

    const body = await req.json();
    const followingId = String(body.followingId || "");

    if (!followingId) {
      return Response.json({
        success: false,
        error: "Usuário inválido",
      });
    }

    if (followingId === user.userId) {
      return Response.json({
        success: false,
        error: "Você não pode seguir você mesmo",
      });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const targetUser = await db.collection("users").findOne({
      _id: new ObjectId(followingId),
    });

    if (!targetUser) {
      return Response.json({
        success: false,
        error: "Perfil não encontrado",
      });
    }

    const alreadyFollowing = await db.collection("followers").findOne({
      followerId: user.userId,
      followingId,
    });

    if (alreadyFollowing) {
      await db.collection("followers").deleteOne({
        _id: alreadyFollowing._id,
      });

      return Response.json({
        success: true,
        following: false,
      });
    }

    await db.collection("followers").insertOne({
      followerId: user.userId,
      followingId,
      createdAt: new Date(),
    });

    return Response.json({
      success: true,
      following: true,
    });
  } catch (error) {
    console.log("FOLLOW ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao seguir usuário",
    });
  }
}