import clientPromise, { DB_NAME } from "@/lib/mongodb";

export async function getStoreSettings() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const settings = await db.collection("settings").findOne({
    key: "store",
  });

  return JSON.parse(
    JSON.stringify(
      settings || {
        storeName: "Inventta 3D",
        slogan: "Ideias que ganham forma",
        whatsapp: "5567992730601",
        instagram: "inventta.3dd",
        deliveryMS: 1,
        deliverySP: 24.9,
        deliveryBR: 34.9,
        freeShippingFrom: 299,
      }
    )
  );
}