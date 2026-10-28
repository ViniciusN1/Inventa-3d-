"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  const links = [
    
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/products", label: "Produtos", icon: "🖨️" },
    { href: "/admin/orders", label: "Pedidos", icon: "📦" },
    { href: "/admin/posts", label: "Comunidade", icon: "🌎" },
    { href: "/admin/custom", label: "Personalizados", icon: "✨" },
    { href: "/admin/balance", label: "Precificação", icon: "⚖️" },
    { href: "/admin/news", label: "Novidades", icon: "🆕" },
    { href: "/admin/videos", label: "Vídeos", icon: "🎥" },
    { href: "/admin/messages", label: "Mensagens", icon: "💬" },
    { href: "/admin/settings", label: "Configurações", icon: "⚙️" },
    { href: "/admin/materials", label: "Materiais", icon: "🧱" },
    { href: "/admin/terra-do-veu", label: "Terra do Véu", icon: "🏰", },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          fixed top-5 left-5 z-[100]
          w-14 h-14 rounded-2xl
          bg-gradient-to-br from-[#B69AF8] to-[#F3B4A8]
          text-[#080B2A] font-black shadow-xl
        "
      >
        ☰
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/70 z-[90]"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-[95]
          h-screen w-72
          bg-[#080B2A]
          border-r border-[#B69AF8]/20
          flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 border-b border-[#B69AF8]/10 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-5 right-5 text-zinc-400 hover:text-white text-2xl"
          >
            ✕
          </button>

          <Link href="/admin" className="flex items-center gap-4 pr-8">
            <img
              src="/logo-icon.svg"
              alt="Inventta 3D"
              className="w-14 h-14 shrink-0"
            />

            <div>
              <h1 className="text-2xl font-black text-[#DCCBFF] leading-none">
                Inventta 3D
              </h1>

              <p className="text-sm text-[#F3B4A8] font-bold mt-1">
                Admin Dashboard
              </p>
            </div>
          </Link>
        </div>

        <div className="p-5">
          <div className="bg-white/5 border border-[#B69AF8]/20 rounded-3xl p-5">
            <p className="text-zinc-400 text-sm">Sistema</p>

            <p className="text-[#DCCBFF] font-black mt-2">
              Loja Online
            </p>

            <div className="flex items-center gap-2 mt-3">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-sm text-zinc-300">
                Operando normalmente
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <nav className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="
                  flex items-center gap-4
                  px-5 py-4 rounded-2xl
                  font-bold text-zinc-300
                  hover:bg-[#B69AF8]/10
                  hover:border-[#B69AF8]/30
                  hover:text-[#DCCBFF]
                  border border-transparent
                  transition-all
                "
              >
                <span className="text-2xl w-8 text-center">
                  {link.icon}
                </span>

                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-5 border-t border-[#B69AF8]/10">
          <div className="bg-gradient-to-r from-[#B69AF8]/15 to-[#F3B4A8]/15 border border-[#B69AF8]/20 rounded-3xl p-5">
            <p className="text-sm text-zinc-400">Inventta 3D</p>

            <p className="font-black text-[#DCCBFF] mt-1">
              Ideias que ganham forma
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}