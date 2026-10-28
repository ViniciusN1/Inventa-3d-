"use client";

import { useAuth } from "./AuthProvider";
import { useIdleLogout } from "./useIdleLogout";

export default function GlobalSessionManager() {
  const { logout } = useAuth();

  useIdleLogout(logout, 10 * 60 * 1000); // 10 minutos

  return null; // não renderiza nada
}