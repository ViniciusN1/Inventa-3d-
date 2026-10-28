"use client";

import { useState } from "react";

export default function AuthCheckout() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    password: "",
  });

  async function handleSubmit() {
    try {
      setLoading(true);

      const endpoint = isLogin
        ? "/api/auth/login"
        : "/api/auth/register";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Erro ao autenticar.");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/profile";
        return;
      }

      alert("Conta criada com sucesso. Agora faça login.");
      setIsLogin(true);
    } catch (error) {
      console.log(error);
      alert("Erro interno. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full bg-white/5 border border-[#B69AF8]/20 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-[#F3B4A8] focus:shadow-[0_0_20px_rgba(182,154,248,0.18)] transition";

  return (
    <div className="space-y-5">
      {!isLogin && (
        <>
          <input
            type="text"
            placeholder="Nome completo"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className={inputClass}
          />

          <input
            type="tel"
            placeholder="Telefone"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            className={inputClass}
          />

          <input
            type="text"
            placeholder="CPF"
            value={form.cpf}
            onChange={(e) =>
              setForm({
                ...form,
                cpf: e.target.value,
              })
            }
            className={inputClass}
          />
        </>
      )}

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
        className={inputClass}
      />

      <input
        type="password"
        placeholder="Senha"
        value={form.password}
        onChange={(e) =>
          setForm({
            ...form,
            password: e.target.value,
          })
        }
        className={inputClass}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="
          w-full
          bg-gradient-to-r
          from-[#B69AF8]
          via-[#DCCBFF]
          to-[#F3B4A8]
          text-[#080B2A]
          py-4
          rounded-2xl
          font-black
          text-lg
          transition
          shadow-[0_0_25px_rgba(182,154,248,0.35)]
          hover:scale-[1.02]
          disabled:opacity-60
        "
      >
        {loading
          ? "Carregando..."
          : isLogin
          ? "Entrar"
          : "Criar Conta"}
      </button>

      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className="
          text-sm
          text-[#DCCBFF]
          hover:text-[#F3B4A8]
          font-bold
          transition
        "
      >
        {isLogin
          ? "Não tenho conta, quero criar"
          : "Já tenho conta"}
      </button>
    </div>
  );
}