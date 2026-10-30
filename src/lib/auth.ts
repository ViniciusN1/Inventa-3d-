import * as jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import clientPromise, { DB_NAME } from "@/lib/mongodb";
import {
  ADMIN_COOKIE,
  getJwtSecret,
  verifyAdminToken,
} from "@/lib/auth-token";

export {
  ADMIN_COOKIE,
  getJwtSecret,
  requireJwtSecret,
  safeEqual,
  verifyAdminToken,
} from "@/lib/auth-token";

/**
 * Autenticação compartilhada (admin + clientes).
 *
 * Regras de segurança:
 * - Sem JWT_SECRET configurado, nenhum token é emitido nem aceito (falha fechada).
 * - Sessão admin = cookie httpOnly "admin_token" com role "admin".
 * - Sessão de cliente = header "Authorization: Bearer <token>" (token do /api/auth/login).
 */

function readCookie(req: Request, name: string): string {
  const anyReq = req as any;
  const fromNext = anyReq?.cookies?.get?.(name)?.value;
  if (fromNext) return String(fromNext);

  const header = req.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return "";
}

/** true se a requisição tem uma sessão admin válida. */
export function isAdminRequest(req: Request): boolean {
  return verifyAdminToken(readCookie(req, ADMIN_COOKIE));
}

/** Para usar no topo de rotas admin: retorna uma resposta 401 ou null se ok. */
export function requireAdmin(req: Request): Response | null {
  if (isAdminRequest(req)) return null;
  return Response.json(
    { success: false, error: "Não autorizado" },
    { status: 401 }
  );
}

/** Para Server Components/páginas admin (usa next/headers). */
export async function isAdminSession(): Promise<boolean> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  return verifyAdminToken(store.get(ADMIN_COOKIE)?.value);
}

export interface UserTokenPayload {
  userId: string;
  [key: string]: any;
}

/** Lê e verifica o token Bearer do cliente. Retorna null se ausente/inválido. */
export function getUserFromRequest(req: Request): UserTokenPayload | null {
  const secret = getJwtSecret();
  if (!secret) return null;

  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, secret) as any;
    if (!decoded?.userId) return null;
    return { ...decoded, userId: String(decoded.userId) };
  } catch {
    return null;
  }
}

/** Busca o usuário logado no banco (sem a senha). */
export async function getUserAccount(req: Request): Promise<any | null> {
  const payload = getUserFromRequest(req);
  if (!payload || !ObjectId.isValid(payload.userId)) return null;

  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const user = await db
    .collection("users")
    .findOne(
      { _id: new ObjectId(payload.userId) },
      { projection: { password: 0 } }
    );

  return user || null;
}

/**
 * Filtro MongoDB para os pedidos de um usuário:
 * pedidos ligados ao userId ou com o e-mail da conta.
 */
export function ordersFilterForUser(user: any): Record<string, any> {
  const email = String(user?.email || "").toLowerCase().trim();
  const or: any[] = [{ userId: String(user._id) }];
  if (email) or.push({ "customer.email": email });
  return { $or: or };
}
