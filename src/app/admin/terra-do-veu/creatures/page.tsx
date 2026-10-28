import Link from "next/link";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
export const dynamic = "force-dynamic";

async function getCreatures() {
  const client = await clientPromise;

  const db = client.db(DB_NAME);

  const creatures = await db
    .collection("terra_creatures")
    .find({})
    .sort({
      createdAt: -1,
    })
    .toArray();

  return JSON.parse(JSON.stringify(creatures));
}

export default async function CreaturesPage() {
  const creatures = await getCreatures();

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">

        <div>

          <p className="uppercase tracking-[5px] text-purple-300 text-sm font-bold">
            Terra do Véu
          </p>

          <h1 className="text-5xl font-black mt-2">
            Criaturas
          </h1>

        </div>

        <Link
          href="/admin/terra-do-veu/creatures/new"
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 font-black"
        >
          + Nova Criatura
        </Link>

      </div>

      <div className="grid lg:grid-cols-4 gap-6">

        {creatures.map((creature: any) => (

          <Link
            key={creature._id}
            href={`/admin/terra-do-veu/creatures/${creature._id}`}
            className="rounded-3xl bg-[#111633] border border-white/10 overflow-hidden hover:border-violet-500 duration-300"
          >

            <img
              src={creature.image || "/placeholder.png"}
              className="w-full h-60 object-cover"
            />

            <div className="p-6">

              <h2 className="text-2xl font-black">
                {creature.name}
              </h2>

              <p className="text-zinc-400 mt-2">
                {creature.species}
              </p>

              <div className="flex justify-between mt-6">

                <span className="text-red-400">
                  ❤️ {creature.hp}
                </span>

                <span className="text-yellow-300">
                  ⚔ {creature.attack}
                </span>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </div>
  );
}