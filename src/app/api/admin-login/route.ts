import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";

import { ADMIN_COOKIE, getJwtSecret, safeEqual } from "@/lib/auth-token";

export const dynamic = "force-dynamic";

/**
 * Login do painel admin.
 * Falha fechada: sem ADMIN_EMAIL, ADMIN_PASSWORD e JWT_SECRET configurados
 * (não vazios) ninguém consegue entrar.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    const adminEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPassword = String(process.env.ADMIN_PASSWORD || "");
    const secret = getJwtSecret();

    if (!adminEmail || !adminPassword || !secret) {
      console.error(
        "ADMIN LOGIN: ADMIN_EMAIL, ADMIN_PASSWORD e JWT_SECRET precisam estar configurados."
      );
      return NextResponse.json(
        { success: false, error: "Login admin indisponível" },
        { status: 503 }
      );
    }

    // Avalia as duas comparações sempre (tempo constante)
    const emailOk = safeEqual(email, adminEmail);
    const passwordOk = safeEqual(password, adminPassword);

    if (!email || !password || !emailOk || !passwordOk) {
      return NextResponse.json(
        { success: false, error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ email: adminEmail, role: "admin" }, secret, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: ADMIN_COOKIE,
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}

/** Logout: remove o cookie admin. */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  return response;
}
