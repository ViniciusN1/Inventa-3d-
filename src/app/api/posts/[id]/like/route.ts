import clientPromise, { DB_NAME } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

function getUser(req: Request) {
  const auth = req.headers.get("authorization");

  const token =
    auth?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  const decoded: any = jwt.verify(
    token,
    process.env.JWT_SECRET!
  );

  return decoded;
}

export async function POST(
  req: Request,
  context: any
) {
  try {
    const user = getUser(req);

    if (!user) {
      return Response.json({
        success: false,
        error: "Usuário não logado",
      });
    }

    const { id } = await context.params;

    const client = await clientPromise;

    const db = client.db(DB_NAME);

    const post = await db
      .collection("posts")
      .findOne({
        _id: new ObjectId(id),
      });

    if (!post) {
      return Response.json({
        success: false,
        error: "Post não encontrado",
      });
    }

    const likedBy =
      post.likedBy || [];

    const alreadyLiked =
      likedBy.includes(user.userId);

    if (alreadyLiked) {

      await db
        .collection("posts")
        .updateOne(
          {
            _id: new ObjectId(id),
          },
          {
            $pull: {
              likedBy: user.userId,
            },

            $inc: {
              likes: -1,
            },
          }
        );

      return Response.json({
        success: true,
        liked: false,
      });

    }

    await db
      .collection("posts")
      .updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $push: {
            likedBy: user.userId,
          },

          $inc: {
            likes: 1,
          },
        }
      );

    return Response.json({
      success: true,
      liked: true,
    });

  } catch (error) {

    console.log(
      "LIKE ERROR:",
      error
    );

    return Response.json({
      success: false,
      error: "Erro ao curtir",
    });

  }

}