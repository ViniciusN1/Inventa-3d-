import { NextRequest, NextResponse } from "next/server";

import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth-token";

/**
 * Proteção das páginas /admin (Next.js 16 "proxy", antigo middleware).
 * As APIs administrativas também checam a sessão admin dentro de cada rota
 * (requireAdmin), então mesmo sem este proxy elas continuam protegidas.
 */
export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(ADMIN_COOKIE)?.value;

    if (!verifyAdminToken(token)) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
