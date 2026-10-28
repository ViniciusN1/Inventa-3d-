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

export async function POST(req: Request) {
  try {
    const user = getUser(req);

    if (!user) {
      return Response.json({
        success: false,
        error: "Usuário não logado",
      });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const userData = await db.collection("users").findOne({
      _id: new ObjectId(user.userId),
    });

    if (!userData || userData.role !== "admin") {
      return Response.json({
        success: false,
        error: "Somente administradores podem publicar",
      });
    }

    const body = await req.json();

    const result = await db.collection("terra_do_veu_posts").insertOne({
      title: body.title || "",
      description: body.description || "",
      image: body.image || "",
      type: body.type || "lore",
      createdBy: user.userId,
      createdByName: userData.name || "Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return Response.json({
      success: true,
      postId: result.insertedId,
    });
  } catch (error) {
    console.log("TERRA DO VEU POST ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao publicar",
    });
  }
}