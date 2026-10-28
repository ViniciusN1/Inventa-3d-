"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function loginAdmin() {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/admin-login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(
          data.error ||
            "Credenciais inválidas"
        );
        return;
      }

      window.location.href = "/admin";
    } catch (error) {
      alert("Erro no login admin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07070A] flex items-center justify-center px-4">
      <div className="bg-[#101014] border border-white/10 rounded-3xl shadow-xl p-8 w-full max-w-md">
        <Link
          href="/"
          className="text-pink-400 font-bold"
        >
          ← Voltar para loja
        </Link>

        <h1 className="text-4xl font-black text-white mt-6 mb-2">
          Admin
        </h1>

        <p className="text-zinc-400 mb-8">
          Acesse o painel administrativo.
        </p>

        <div className="space-y-5">
          <input
            type="email"
            placeholder="Email admin"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border border-white/10 rounded-2xl px-5 py-4 bg-white/5 text-white placeholder:text-zinc-500 outline-none focus:border-pink-500"
          />

          <input
            type="password"
            placeholder="Senha admin"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border border-white/10 rounded-2xl px-5 py-4 bg-white/5 text-white placeholder:text-zinc-500 outline-none focus:border-pink-500"
          />

          <button
            onClick={loginAdmin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-2xl font-black disabled:opacity-50"
          >
            {loading
              ? "Entrando..."
              : "Entrar no Admin"}
          </button>
        </div>
      </div>
    </main>
  );
}