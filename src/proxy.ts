import {
  NextRequest,
  NextResponse,
} from "next/server";

import * as jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin-login")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token =
      req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }

    try {
      jwt.verify(
        token,
        process.env.JWT_SECRET as string
      );
    } catch {
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};