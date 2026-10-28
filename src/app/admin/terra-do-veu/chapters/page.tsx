import Link from "next/link";
export const dynamic = "force-dynamic";

export default function CharactersPage() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <p className="uppercase tracking-[6px] text-sm text-purple-300 font-bold">
            Terra do Véu
          </p>

          <h1 className="text-5xl font-black mt-2">
            Personagens
          </h1>

          <p className="text-zinc-400 mt-3">
            Cadastre todos os heróis, NPCs e chefes do universo.
          </p>

        </div>

        <Link
          href="/admin/terra-do-veu/characters/new"
          className="px-6 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 font-bold"
        >
          + Novo Personagem
        </Link>

      </div>

      <div className="rounded-3xl border border-white/10 bg-[#111633] p-12 text-center">

        <div className="text-7xl">
          🧙
        </div>

        <h2 className="text-3xl font-black mt-6">
          Nenhum personagem cadastrado
        </h2>

        <p className="text-zinc-400 mt-3">
          Clique em "Novo Personagem" para começar.
        </p>

      </div>

    </div>
  );
}