import clientPromise, { DB_NAME } from "@/lib/mongodb";

import jwt
from "jsonwebtoken";

import { ObjectId }
from "mongodb";

export async function GET(
  req: Request
) {

  try {

    const auth =
      req.headers.get(
        "authorization"
      );

    if (!auth) {

      return Response.json({

        success: false,

      });

    }

    const token =
      auth.split(" ")[1];

    const decoded: any =
      jwt.verify(

        token,

        process.env.JWT_SECRET!

      );

    const client =
      await clientPromise;

    const db =
      client.db(DB_NAME);

    const user =
      await db
        .collection("users")
        .findOne({

          _id:
            new ObjectId(
              decoded.userId
            ),

        });

    return Response.json({

      success: true,

      user,

    });

  } catch (error) {

    console.log(error);

    return Response.json({

      success: false,

    });

  }

}