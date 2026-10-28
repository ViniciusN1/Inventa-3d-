import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import EditProductForm from "@/components/EditProductForm";

async function getProduct(id: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const product = await db.collection("products").findOne({
    _id: new ObjectId(id),
  });

  return JSON.parse(JSON.stringify(product));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);

  return (
    <main className="p-8">
      <EditProductForm product={product} />
    </main>
  );
}