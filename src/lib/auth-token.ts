import { createHash, timingSafeEqual } from "crypto";
import * as jwt from "jsonwebtoken";

/**
 * Núcleo de tokens (sem banco de dados), usado pelo proxy e pelas rotas.
 * Sem JWT_SECRET configurado, nenhum token é emitido nem aceito (falha fechada).
 */

export const ADMIN_COOKIE = "admin_token";

/** Segredo JWT ou null se não configurado (nunca usa valor padrão). */
export function getJwtSecret(): string | null {
  const secret = (process.env.JWT_SECRET || "").trim();
  return secret ? secret : null;
}

/** Igual a getJwtSecret, mas lança erro quando falta (para emitir tokens). */
export function requireJwtSecret(): string {
  const secret = getJwtSecret();
  if (!secret) throw new Error("JWT_SECRET não configurado");
  return secret;
}

/** Comparação em tempo constante (evita timing attacks). */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(String(a)).digest();
  const hb = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

/** Verifica um token admin (string). */
export function verifyAdminToken(token: string | undefined | null): boolean {
  const secret = getJwtSecret();
  if (!secret || !token) return false;
  try {
    const decoded = jwt.verify(token, secret) as { role?: string };
    return decoded?.role === "admin";
  } catch {
    return false;
  }
}

