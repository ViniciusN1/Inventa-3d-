import { v2 as cloudinary } from "cloudinary";
import { getUserFromRequest, isAdminRequest } from "@/lib/auth";
export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  // Upload só para admin (cookie) ou cliente logado (Bearer token)
  const admin = isAdminRequest(req);
  if (!admin && !getUserFromRequest(req)) {
    return Response.json(
      { success: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const file = body.file || body.image;

    if (!file) {
      return Response.json({
        success: false,
        error: "Imagem não enviada",
      });
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: "inventta3d/posts",
      // clientes só enviam imagens; admin pode enviar vídeo também
      resource_type: admin ? "auto" : "image",
    });

    return Response.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error: any) {
    console.log("UPLOAD ERROR:", error);

    return Response.json({
      success: false,
      error: error?.message || "Erro ao fazer upload",
    });
  }
}