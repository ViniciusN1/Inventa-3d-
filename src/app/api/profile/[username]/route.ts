import clientPromise, { DB_NAME } from "@/lib/mongodb";

function cleanUsername(value: any) {
  return String(value || "")
    .replace("@", "")
    .toLowerCase()
    .replace(/\s/g, "")
    .trim();
}

export async function GET(req: Request, context: any) {
  try {
    const { username } = await context.params;
    const clean = cleanUsername(username);

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const users = await db.collection("users").find({}, { projection: { password: 0 } }).toArray();

    const user = users.find((u: any) => {
      const byUsername = cleanUsername(u.username);
      const byName = cleanUsername(u.name);

      return byUsername === clean || byName === clean;
    });

    if (!user) {
      return Response.json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    const userId = String(user._id);

    const posts = await db
      .collection("posts")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    const totalLikes = posts.reduce(
      (acc: number, post: any) => acc + Number(post.likes || 0),
      0
    );

    const followersCount = await db.collection("followers").countDocuments({
      followingId: userId,
    });

    const followingCount = await db.collection("followers").countDocuments({
      followerId: userId,
    });

    return Response.json({
      success: true,
      // perfil público: nunca expor e-mail, CPF, telefone, endereço etc.
      user: {
        _id: userId,
        name: user.name || "",
        username: user.username || "",
        avatar: user.avatar || "",
        bio: user.bio || "",
        points: Number(user.points || 0),
        createdAt: user.createdAt || null,
      },
      posts: JSON.parse(JSON.stringify(posts)),
      stats: {
        posts: posts.length,
        likes: totalLikes,
        points: Number(user.points || 0),
        followers: followersCount,
        following: followingCount,
      },
    });
  } catch (error) {
    console.log("PROFILE ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao buscar perfil",
    });
  }
}