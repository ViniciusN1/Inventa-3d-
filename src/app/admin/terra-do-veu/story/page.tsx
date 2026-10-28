import Link from "next/link";
export const dynamic = "force-dynamic";


const storySections = [
  {
    title: "Introdução",
    description: "Apresentação do universo Terra do Véu.",
    icon: "🌍",
    href: "/admin/terra-do-veu/story/intro",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Linha do Tempo",
    description: "Eventos históricos do mundo.",
    icon: "⏳",
    href: "/admin/terra-do-veu/story/timeline",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Grandes Guerras",
    description: "Conflitos que mudaram o Véu.",
    icon: "⚔️",
    href: "/admin/terra-do-veu/story/wars",
    color: "from-red-500 to-orange-500",
  },
  {
    title: "Lendas",
    description: "Histórias antigas e mitologia.",
    icon: "📜",
    href: "/admin/terra-do-veu/story/legends",
    color: "from-yellow-500 to-amber-500",
  },
  {
    title: "Religiões",
    description: "Deuses, cultos e crenças.",
    icon: "⛪",
    href: "/admin/terra-do-veu/story/religions",
    color: "from-indigo-500 to-violet-500",
  },
  {
    title: "Artefatos",
    description: "Itens lendários do universo.",
    icon: "💎",
    href: "/admin/terra-do-veu/story/artifacts",
    color: "from-emerald-500 to-green-500",
  },
];

export default function StoryDashboard() {
  return (
    <div className="space-y-10">

      <div>

        <p className="uppercase tracking-[6px] text-sm text-purple-300 font-bold">
          Terra do Véu
        </p>

        <h1 className="text-6xl font-black mt-3">
          História do Universo
        </h1>

        <p className="text-zinc-400 mt-4 text-lg max-w-3xl">
          Toda a narrativa do universo será organizada aqui.
          Cada seção poderá ser editada pelo painel administrativo.
        </p>

      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {storySections.map((item) => (

          <Link
            key={item.title}
            href={item.href}
            className="rounded-3xl bg-[#111633] border border-white/10 hover:border-purple-500 duration-300 p-8"
          >

            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br ${item.color}`}
            >
              {item.icon}
            </div>

            <h2 className="text-3xl font-black mt-6">
              {item.title}
            </h2>

            <p className="text-zinc-400 mt-3">
              {item.description}
            </p>

          </Link>

        ))}

      </div>

      <div className="rounded-3xl bg-[#111633] border border-white/10 p-8">

        <h2 className="text-3xl font-black">
          📖 História Principal
        </h2>

        <p className="text-zinc-400 mt-4 leading-8">

          Após a Grande Ruptura, o Véu separou os mundos.
          Fragmentos de magia deram origem às Torres Ancestrais,
          criaturas despertaram e antigas civilizações desapareceram.

          Toda a narrativa principal será construída através do painel.

        </p>

        <div className="mt-8">

          <Link
            href="/admin/terra-do-veu/story/editor"
            className="inline-flex px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 font-black"
          >
            ✍ Editar História Principal
          </Link>

        </div>

      </div>

    </div>
  );
}