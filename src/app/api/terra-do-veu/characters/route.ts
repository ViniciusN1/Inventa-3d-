import clientPromise, { DB_NAME } from "@/lib/mongodb";
export const dynamic = "force-dynamic";

export async function GET() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const characters = await db
    .collection("terra_characters")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return Response.json(characters);
}

export async function POST(req: Request) {
  const body = await req.json();

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection("terra_characters").insertOne({
    name: body.name,
    subtitle: body.subtitle,
    image: body.image,
    biography: body.biography,
    race: body.race,
    faction: body.faction,
    class: body.class,
    level: body.level,
    hp: body.hp,
    mana: body.mana,
    attack: body.attack,
    defense: body.defense,
    rarity: body.rarity,
    printable: body.printable,
    store: body.store,
    price: body.price,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return Response.json({
    success: true,
    id: result.insertedId,
  });
}