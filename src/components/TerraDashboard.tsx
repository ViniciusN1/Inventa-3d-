import Link from "next/link";

const menus = [
  {
    title: "Página Inicial",
    icon: "🏠",
    href: "/admin/terra-do-veu/home",
    color: "from-violet-500 to-purple-600",
  },
  {
    title: "História",
    icon: "📖",
    href: "/admin/terra-do-veu/story",
    color: "from-blue-500 to-cyan-600",
  },
  {
    title: "Personagens",
    icon: "🧙",
    href: "/admin/terra-do-veu/characters",
    color: "from-pink-500 to-fuchsia-600",
  },
  {
    title: "Criaturas",
    icon: "🐉",
    href: "/admin/terra-do-veu/creatures",
    color: "from-red-500 to-orange-600",
  },
  {
    title: "Regiões",
    icon: "🗺️",
    href: "/admin/terra-do-veu/regions",
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Torres",
    icon: "🏰",
    href: "/admin/terra-do-veu/towers",
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Loja",
    icon: "🛒",
    href: "/admin/terra-do-veu/store",
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "Doações",
    icon: "❤️",
    href: "/admin/terra-do-veu/donations",
    color: "from-rose-500 to-red-600",
  },
];

export default function TerraDashboard() {
  return (
    <div className="space-y-10">

      <div>
        <p className="uppercase tracking-[6px] text-sm text-purple-300 font-bold">
          Universo RPG
        </p>

        <h1 className="text-6xl font-black mt-3">
          Terra do Véu
        </h1>

        <p className="text-zinc-400 mt-4">
          Gerencie completamente todo o universo.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">

        {menus.map((item) => (

          <Link
            key={item.title}
            href={item.href}
            className="bg-[#111633] rounded-3xl border border-white/10 p-8 hover:scale-105 duration-300"
          >

            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br ${item.color}`}
            >
              {item.icon}
            </div>

            <h2 className="mt-8 text-2xl font-black">
              {item.title}
            </h2>

          </Link>

        ))}

      </div>

    </div>
  );
}