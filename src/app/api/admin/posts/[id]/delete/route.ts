import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise, { DB_NAME } from "@/lib/mongodb";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID inválido.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db.collection("posts").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Post não encontrado.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Post removido com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao excluir post:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor.",
      },
      { status: 500 }
    );
  }
}