import clientPromise, { DB_NAME } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

function getUser(req: Request) {
  const auth = req.headers.get("authorization");
  const token = auth?.replace("Bearer ", "");

  if (!token) return null;

  return jwt.verify(token, process.env.JWT_SECRET!) as any;
}

export async function PATCH(req: Request) {
  try {
    const user = getUser(req);

    if (!user) {
      return Response.json({
        success: false,
        error: "Usuário não logado",
      });
    }

    const body = await req.json();

    const username = String(body.username || "")
      .replace("@", "")
      .toLowerCase()
      .trim();

    if (!username || username.length < 3) {
      return Response.json({
        success: false,
        error: "Username inválido",
      });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const exists = await db.collection("users").findOne({
      username,
      _id: {
        $ne: new ObjectId(user.userId),
      },
    });

    if (exists) {
      return Response.json({
        success: false,
        error: "Esse @ já está em uso",
      });
    }

    await db.collection("users").updateOne(
      {
        _id: new ObjectId(user.userId),
      },
      {
        $set: {
          username,
          updatedAt: new Date(),
        },
      }
    );

    return Response.json({
      success: true,
      username,
    });
  } catch (error) {
    console.log("UPDATE USERNAME ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao atualizar username",
    });
  }
}