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

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection("users").updateOne(
      {
        _id: new ObjectId(user.userId),
      },
      {
        $set: {
          name: body.name || "",
          phone: body.phone || "",
          cpf: body.cpf || "",
          bio: body.bio || "",

          address: {
            cep: body.cep || "",
            address: body.address || "",
            number: body.number || "",
            city: body.city || "",
            state: body.state || "",
          },

          updatedAt: new Date(),
        },
      }
    );

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao atualizar perfil",
    });
  }
}