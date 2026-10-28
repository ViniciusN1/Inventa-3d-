import clientPromise, { DB_NAME } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

function getUserFromToken(req: Request) {
  const auth = req.headers.get("authorization");
  const token = auth?.replace("Bearer ", "");
  if (!token) return null;
  return jwt.verify(token, process.env.JWT_SECRET!) as any;
}

function cleanUsername(value: any) {
  return String(value || "")
    .replace("@", "")
    .toLowerCase()
    .replace(/\s/g, "")
    .trim();
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const posts = await db.collection("posts").find({}).sort({ createdAt: -1 }).toArray();

    const fixedPosts = await Promise.all(
      posts.map(async (post: any) => {
        const userData = post.userId
          ? await db.collection("users").findOne({ _id: new ObjectId(post.userId) })
          : null;

        const username =
          cleanUsername(post.username) ||
          cleanUsername(userData?.username) ||
          cleanUsername(userData?.name) ||
          cleanUsername(post.userName);

        return {
          ...post,
          userName: post.userName || userData?.name || "Usuário",
          username,
          userAvatar: post.userAvatar || userData?.avatar || "",
        };
      })
    );

    return Response.json({
      success: true,
      posts: JSON.parse(JSON.stringify(fixedPosts)),
    });
  } catch (error) {
    console.log("GET POSTS ERROR:", error);

    return Response.json({
      success: false,
      posts: [],
      error: "Erro ao buscar posts",
    });
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromToken(req);

    if (!user) {
      return Response.json({
        success: false,
        error: "Usuário não logado",
      });
    }

    const body = await req.json();

    const {
      image,
      caption,
      hashtags = [],
      mentions = [],
      category = "geral",
      productId = "",
      productName = "",
    } = body;

    if (!image) {
      return Response.json({
        success: false,
        error: "Imagem obrigatória",
      });
    }

    const cleanHashtags = Array.isArray(hashtags)
      ? hashtags.map((tag) => String(tag).replace("#", "").toLowerCase().trim()).filter(Boolean)
      : [];

    const cleanMentions = Array.isArray(mentions)
      ? mentions.map((tag) => cleanUsername(tag)).filter(Boolean)
      : [];

    const cleanCategory =
      String(category || cleanHashtags[0] || "geral")
        .replace("#", "")
        .toLowerCase()
        .trim() || "geral";

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const userData = await db.collection("users").findOne({
      _id: new ObjectId(user.userId),
    });

    if (!userData) {
      return Response.json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    const username =
      cleanUsername(userData.username) ||
      cleanUsername(userData.name) ||
      `user-${String(user.userId).slice(-5)}`;

    const result = await db.collection("posts").insertOne({
      userId: user.userId,
      userName: userData.name || "Usuário",
      userEmail: userData.email || "",
      userAvatar: userData.avatar || "",
      username,

      image,
      caption: caption || "",

      category: cleanCategory,
      hashtags: cleanHashtags,
      mentions: cleanMentions,

      productId: productId || "",
      productName: productName || "",

      points: 10,
      likes: 0,
      likedBy: [],
      commentsCount: 0,

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return Response.json({
      success: true,
      postId: result.insertedId,
    });
  } catch (error) {
    console.log("CREATE POST ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao criar post",
    });
  }
}