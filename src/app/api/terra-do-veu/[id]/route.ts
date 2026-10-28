export const dynamic = "force-dynamic";

import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// =========================
// BUSCAR PERSONAGEM
// =========================
export async function GET(
  req: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const character = await db.collection("terra_characters").findOne({
      _id: new ObjectId(id),
    });

    if (!character) {
      return Response.json(
        {
          success: false,
          error: "Personagem não encontrado",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      character,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Erro ao buscar personagem",
      },
      { status: 500 }
    );
  }
}

// =========================
// EDITAR PERSONAGEM
// =========================
export async function PUT(
  req: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection("terra_characters").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    );

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Erro ao atualizar personagem",
      },
      { status: 500 }
    );
  }
}

// =========================
// EXCLUIR PERSONAGEM
// =========================
export async function DELETE(
  req: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection("terra_characters").deleteOne({
      _id: new ObjectId(id),
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Erro ao excluir personagem",
      },
      { status: 500 }
    );
  }
}