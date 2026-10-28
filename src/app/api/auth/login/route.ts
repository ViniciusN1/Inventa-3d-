import clientPromise, { DB_NAME } from "@/lib/mongodb";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const {
      email,
      password,
    } = body;

    const client =
      await clientPromise;

    const db =
      client.db(DB_NAME);

    const user =
      await db
        .collection("users")
        .findOne({
          email,
        });

    if (!user) {

      return Response.json({
        success: false,
        error:
          "Usuário não encontrado",
      });

    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {

      return Response.json({
        success: false,
        error:
          "Senha inválida",
      });

    }

    const token =
      jwt.sign(

        {
          userId:
            user._id,
        },

        process.env.JWT_SECRET!,

        {
          expiresIn: "7d",
        }

      );

    return Response.json({

      success: true,

      token,

      user: {

        name:
          user.name,

        email:
          user.email,

      },

    });

  } catch (error) {

    console.log(error);

    return Response.json({
      success: false,
      error:
        "Erro no login",
    });

  }

}