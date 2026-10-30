import { toPublicProducts } from "@/lib/public-product";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import clientPromise, { DB_NAME } from "@/lib/mongodb";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category?: string;
}

async function searchProducts(query: string): Promise<Product[]> {
  const client = await clientPromise;

  const db = client.db(DB_NAME);

  const products = await db
    .collection("products")
    .find({
      $or: [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          description: {
            $regex: query,
            $options: "i",
          },
        },
        {
          category: {
            $regex: query,
            $options: "i",
          },
        },
        {
          material: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    })
    .sort({ createdAt: -1 })
    .toArray();

  return toPublicProducts(JSON.parse(JSON.stringify(products)));
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const query = q?.trim() || "";

  const products =
    query.length > 0
      ? await searchProducts(query)
      : [];

  return (
    <main className="min-h-screen bg-[#080B2A] text-white">

      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-12">

        <Link
          href="/"
          className="text-[#F3B4A8] font-bold"
        >
          ← Voltar
        </Link>

        <p className="text-[#F3B4A8] font-bold uppercase tracking-widest mt-8">
          Pesquisa
        </p>

        <h1 className="text-5xl font-black mt-2">
          {query
            ? `Resultados para "${query}"`
            : "Pesquisar"}
        </h1>

        <p className="text-zinc-400 mt-3">
          {products.length} produto(s) encontrado(s)
        </p>

        {products.length === 0 ? (
          <div className="mt-12 bg-[#101014] rounded-3xl p-12 text-center">

            <h2 className="text-3xl font-black">
              Nenhum produto encontrado
            </h2>

            <p className="text-zinc-400 mt-4">
              Tente pesquisar por outro termo.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">

            {products.map((product) => (
              <div
                key={product._id}
                className="bg-[#101014] border border-white/10 rounded-[32px] p-5 hover:border-[#B69AF8] transition"
              >
                <Link href={`/product/${product._id}`}>

                  <div className="bg-[#18181d] rounded-[24px] p-6 flex justify-center items-center h-[250px]">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-[220px] object-contain"
                    />

                  </div>

                </Link>

                <h2 className="mt-6 text-lg font-black">
                  {product.name}
                </h2>

                <p className="text-2xl font-black mt-3 text-[#DCCBFF]">
                  R$ {Number(product.price).toFixed(2)}
                </p>

                <div className="mt-5">
                  <AddToCartButton product={product} />
                </div>

              </div>
            ))}

          </div>
        )}

      </section>

      <Footer />

    </main>
  );
}