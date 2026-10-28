import clientPromise, { DB_NAME } from "@/lib/mongodb";
import AdminSidebar from "@/components/AdminSidebar";
import AdminVideosClient from "@/components/AdminVideosClient";
export const dynamic = "force-dynamic";


async function getProducts() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const products = await db
    .collection("products")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return JSON.parse(JSON.stringify(products));
}

export default async function AdminVideosPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#07070A] text-white p-6 lg:p-8">
      <AdminSidebar />

      <section className="max-w-7xl mx-auto pt-24">
        <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
          Vídeos dos produtos
        </p>

        <h1 className="text-5xl font-black text-[#DCCBFF] mt-3">
          Conteúdo e página do produto
        </h1>

        <p className="text-zinc-400 mt-3 mb-10">
          Escolha um produto, adicione vídeo, detalhes, instruções e informações pós-compra.
        </p>

        <AdminVideosClient products={products} />
      </section>
    </main>
  );
}