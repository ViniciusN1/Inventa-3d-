"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/terra-do-veu", label: "Dashboard", icon: "🏰" },
  { href: "/admin/terra-do-veu/posts", label: "Posts", icon: "📝" },
  { href: "/admin/terra-do-veu/chapters", label: "Capítulos", icon: "📖" },
  { href: "/admin/terra-do-veu/characters", label: "Personagens", icon: "🧙" },
  { href: "/admin/terra-do-veu/creatures", label: "Criaturas", icon: "🐲" },
  { href: "/admin/terra-do-veu/factions", label: "Facções", icon: "⚔️" },
  { href: "/admin/terra-do-veu/towers", label: "Torres", icon: "🏯" },
  { href: "/admin/terra-do-veu/maps", label: "Mapas", icon: "🗺️" },
  { href: "/admin/terra-do-veu/gallery", label: "Galeria", icon: "🖼️" },
  { href: "/admin/terra-do-veu/store", label: "Loja", icon: "🛒" },
  { href: "/admin/terra-do-veu/donations", label: "Doações", icon: "❤️" },
  { href: "/admin/terra-do-veu/settings", label: "Configurações", icon: "⚙️" },
];

export default function TerraSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#090B24] border-r border-purple-500/20 overflow-y-auto">
      <div className="p-8 border-b border-purple-500/20">
        <h1 className="text-3xl font-black text-[#DCCBFF]">
          Terra do Véu
        </h1>

        <p className="text-zinc-400 mt-2">
          Painel Administrativo
        </p>
      </div>

      <nav className="p-5 space-y-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition ${
              pathname === item.href
                ? "bg-purple-500 text-white"
                : "hover:bg-white/5 text-zinc-300"
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}