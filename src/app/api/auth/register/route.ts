import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { resend } from "@/lib/resend";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      password,
      phone,
      cpf,
    } = body;

    if (!name || !email || !password || !phone || !cpf) {
      return Response.json({
        success: false,
        error: "Preencha todos os campos",
      });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanCpf = String(cpf).replace(/\D/g, "");
    const cleanPhone = String(phone).replace(/\D/g, "");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return Response.json({
        success: false,
        error: "Email inválido",
      });
    }

    if (password.length < 6) {
      return Response.json({
        success: false,
        error: "Senha precisa ter no mínimo 6 caracteres",
      });
    }

    if (cleanCpf.length !== 11) {
      return Response.json({
        success: false,
        error: "CPF inválido",
      });
    }

    if (cleanPhone.length < 10) {
      return Response.json({
        success: false,
        error: "Telefone inválido",
      });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const existingUser = await db.collection("users").findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return Response.json({
        success: false,
        error: "Este email já está cadastrado",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const newUser = await db.collection("users").insertOne({
      name,
      email: cleanEmail,
      password: hashedPassword,
      phone: cleanPhone,
      cpf: cleanCpf,
      role: "customer",
      verified: false,
      verifyToken,
      address: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    try {
      await resend.emails.send({
        from: "Inventta 3D <onboarding@resend.dev>",
        to: cleanEmail,
        subject: "Confirme sua conta",
        html: `
          <div style="font-family: Arial; background:#f7f7f7; padding:40px;">
            <div style="max-width:600px; margin:auto; background:white; border-radius:24px; padding:40px;">
              <h1>Bem-vindo(a) à Inventta 3D</h1>
              <p>Sua conta foi criada com sucesso.</p>
              <p>Clique no botão abaixo para confirmar seu email.</p>
              <a href="${siteUrl}/verify-email?token=${verifyToken}"
                style="display:inline-block; margin-top:25px; background:#ec4899; color:white; padding:16px 28px; border-radius:14px; text-decoration:none; font-weight:bold;">
                Confirmar Email
              </a>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.log("EMAIL ERROR:", emailError);
    }

    return Response.json({
      success: true,
      message: "Conta criada com sucesso",
      userId: newUser.insertedId,
    });
  } catch (error) {
    console.log(error);

    return Response.json({
      success: false,
      error: "Erro interno no servidor",
    });
  }
}