import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

interface Props {
  params: {
    id: string;
  };
}

async function getCharacter(id: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  try {
    return await db.collection("terra_characters").findOne({
      _id: new ObjectId(id),
    });
  } catch {
    return null;
  }
}

export default async function EditCharacterPage({ params }: Props) {
  const character = await getCharacter(params.id);

  if (!character) {
    notFound();
  }

  return (
    <div className="space-y-8">

      <div>
        <p className="uppercase tracking-[6px] text-sm text-purple-300 font-bold">
          Editar Personagem
        </p>

        <h1 className="text-5xl font-black mt-2">
          {character.name}
        </h1>
      </div>

      <div className="rounded-3xl bg-[#111633] border border-white/10 p-8">

        <div className="grid gap-6">

          <div>
            <label className="text-zinc-400 block mb-2">
              Nome
            </label>

            <input
              defaultValue={character.name}
              className="w-full rounded-xl bg-[#1A2146] p-4"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-2">
              Raça
            </label>

            <input
              defaultValue={character.race}
              className="w-full rounded-xl bg-[#1A2146] p-4"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-2">
              Classe
            </label>

            <input
              defaultValue={character.class}
              className="w-full rounded-xl bg-[#1A2146] p-4"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-2">
              História
            </label>

            <textarea
              defaultValue={character.story}
              rows={8}
              className="w-full rounded-xl bg-[#1A2146] p-4"
            />
          </div>

          <button
            className="
              mt-4
              bg-gradient-to-r
              from-purple-600
              to-pink-500
              rounded-xl
              py-4
              font-bold
            "
          >
            Salvar Alterações
          </button>

        </div>

      </div>

    </div>
  );
}