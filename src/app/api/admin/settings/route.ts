import clientPromise, { DB_NAME } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS = {
  storeName: "Inventta 3D",
  slogan: "Ideias que ganham forma",
  whatsapp: "5567992730601",
  instagram: "inventta.3dd",
  siteUrl: "https://inventta3d.com.br",

  deliveryMS: 19.9,
  deliverySP: 24.9,
  deliveryBR: 34.9,
  freeShippingFrom: 299,

  pixEnabled: true,
  cardEnabled: true,
  mercadoPagoEnabled: true,

  metaEnabled: false,
  whatsappBusinessEnabled: false,
  instagramEnabled: false,

  updatedAt: new Date(),
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    let settings = await db.collection("settings").findOne({
      key: "store",
    });

    if (!settings) {
      await db.collection("settings").insertOne({
        key: "store",
        ...DEFAULT_SETTINGS,
        createdAt: new Date(),
      });

      settings = await db.collection("settings").findOne({
        key: "store",
      });
    }

    return Response.json({
      success: true,
      settings: JSON.parse(JSON.stringify(settings)),
    });
  } catch (error) {
    console.log("GET SETTINGS ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao buscar configurações",
    });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection("settings").updateOne(
      {
        key: "store",
      },
      {
        $set: {
          storeName: body.storeName || "",
          slogan: body.slogan || "",
          whatsapp: body.whatsapp || "",
          instagram: body.instagram || "",
          siteUrl: body.siteUrl || "",

          deliveryMS: Number(body.deliveryMS || 0),
          deliverySP: Number(body.deliverySP || 0),
          deliveryBR: Number(body.deliveryBR || 0),
          freeShippingFrom: Number(body.freeShippingFrom || 0),

          pixEnabled: Boolean(body.pixEnabled),
          cardEnabled: Boolean(body.cardEnabled),
          mercadoPagoEnabled: Boolean(body.mercadoPagoEnabled),

          metaEnabled: Boolean(body.metaEnabled),
          whatsappBusinessEnabled: Boolean(body.whatsappBusinessEnabled),
          instagramEnabled: Boolean(body.instagramEnabled),

          updatedAt: new Date(),
        },
      },
      {
        upsert: true,
      }
    );

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.log("UPDATE SETTINGS ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao salvar configurações",
    });
  }
}