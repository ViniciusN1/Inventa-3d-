import clientPromise, { DB_NAME } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

function getUser(req: Request) {
  const auth = req.headers.get("authorization");
  const token = auth?.replace("Bearer ", "");

  if (!token) return null;

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  return decoded;
}

export async function GET(req: Request, context: any) {
  try {
    const { id } = await context.params;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const comments = await db
      .collection("comments")
      .find({
        postId: id,
      })
      .sort({
        createdAt: 1,
      })
      .toArray();

    return Response.json({
      success: true,
      comments: JSON.parse(JSON.stringify(comments)),
    });
  } catch (error) {
    console.log("GET COMMENTS ERROR:", error);

    return Response.json({
      success: false,
      comments: [],
      error: "Erro ao buscar comentários",
    });
  }
}

export async function POST(req: Request, context: any) {
  try {
    const user = getUser(req);

    if (!user) {
      return Response.json({
        success: false,
        error: "Usuário não logado",
      });
    }

    const { id } = await context.params;
    const body = await req.json();

    const text = String(body.text || "").trim();

    if (!text) {
      return Response.json({
        success: false,
        error: "Comentário vazio",
      });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const post = await db.collection("posts").findOne({
      _id: new ObjectId(id),
    });

    if (!post) {
      return Response.json({
        success: false,
        error: "Post não encontrado",
      });
    }

    const userData = await db.collection("users").findOne({
      _id: new ObjectId(user.userId),
    });

    const result = await db.collection("comments").insertOne({
      postId: id,
      userId: user.userId,
      userName: userData?.name || "Usuário",
      text,
      createdAt: new Date(),
    });

    await db.collection("posts").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $inc: {
          commentsCount: 1,
        },
      }
    );

    return Response.json({
      success: true,
      commentId: result.insertedId,
    });
  } catch (error) {
    console.log("CREATE COMMENT ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao comentar",
    });
  }
}