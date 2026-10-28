import Link from "next/link";
import CreatureForm from "@/app/admin/terra-do-veu/creatures/CreatureForm";
export const dynamic = "force-dynamic";

export default function NewCreaturePage() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <p className="uppercase tracking-[5px] text-purple-300 text-sm font-bold">
            Terra do Véu
          </p>

          <h1 className="text-5xl font-black mt-2">
            Nova Criatura
          </h1>

          <p className="text-zinc-400 mt-3">
            Cadastre uma criatura do universo.
          </p>

        </div>

        <Link
          href="/admin/terra-do-veu/creatures"
          className="px-6 py-3 rounded-2xl bg-[#191F44] hover:bg-[#242B5A] duration-300"
        >
          ← Voltar
        </Link>

      </div>

      <div className="rounded-3xl bg-[#111633] border border-white/10 p-8">

        <CreatureForm />

      </div>

    </div>
  );
}