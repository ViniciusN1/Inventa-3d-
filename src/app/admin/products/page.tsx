export const dynamic = "force-dynamic";

import clientPromise, { DB_NAME } from "@/lib/mongodb";
import AdminProductsClient from "@/components/AdminProductsClient";
import AdminSidebar from "@/components/AdminSidebar";

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

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#080B2A] text-white p-8 pt-24">
      <AdminSidebar />

      <div className="mb-10">
        <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
          Catálogo Inventta 3D
        </p>

        <h1 className="text-5xl font-black mt-3 text-[#DCCBFF]">
          Produtos
        </h1>

        <p className="text-zinc-400 mt-2">
          Cadastre peças 3D, categorias, estoque, materiais, vídeos e arquivos.
        </p>
      </div>

      <AdminProductsClient products={products} />
    </main>
  );
}