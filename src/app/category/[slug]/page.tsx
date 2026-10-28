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

async function getProductsByCategory(
  slug: string
): Promise<Product[]> {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const products = await db
    .collection("products")
    .find({
      category: slug.toLowerCase(),
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  return JSON.parse(JSON.stringify(products));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const categoryName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const products = await getProductsByCategory(slug);

  return (
    <main className="min-h-screen bg-[#080B2A] text-white">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-12">

        <Link
          href="/"
          className="text-[#F3B4A8] font-bold hover:text-[#DCCBFF]"
        >
          ← Voltar
        </Link>

        <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm mt-8">
          Categoria
        </p>

        <h1 className="text-5xl font-black mt-3 text-[#DCCBFF]">
          {categoryName}
        </h1>

        <p className="text-zinc-400 mt-3">
          Produtos desta categoria.
        </p>

        {products.length === 0 ? (

          <div className="mt-12 bg-[#101014] border border-[#B69AF8]/20 rounded-[2rem] p-10 text-center">

            <h2 className="text-3xl font-black">
              Nenhum produto encontrado
            </h2>

            <p className="text-zinc-400 mt-3">
              Ainda não existem produtos nesta categoria.
            </p>

            <Link
              href="/products"
              className="inline-block mt-8 bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] px-8 py-4 rounded-2xl font-black"
            >
              Ver catálogo completo
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">

            {products.map((product) => (

              <div key={product._id} className="group">

                <div className="relative bg-[#101014] border border-[#B69AF8]/20 rounded-[32px] p-5 hover:border-[#F3B4A8]/40 hover:-translate-y-2 transition-all">

                  <div className="absolute top-4 left-4 z-10 bg-[#F3B4A8]/15 border border-[#F3B4A8]/30 text-[#F3B4A8] text-xs font-black px-3 py-2 rounded-full">
                    {categoryName}
                  </div>

                  <Link href={`/product/${product._id}`}>

                    <div className="bg-[#18181d] rounded-[26px] p-6 overflow-hidden border border-white/5 min-h-[280px] flex items-center justify-center">

                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-64 object-contain group-hover:scale-105 transition"
                      />

                    </div>

                  </Link>

                  <div className="mt-6">

                    <h2 className="text-lg font-black text-white min-h-[56px]">
                      {product.name}
                    </h2>

                    <p className="mt-3 text-3xl font-black bg-gradient-to-r from-[#DCCBFF] to-[#F3B4A8] bg-clip-text text-transparent">
                      R$ {Number(product.price).toFixed(2)}
                    </p>

                    <p className="mt-2 text-sm text-zinc-400">
                      Impressão 3D • Produto Exclusivo
                    </p>

                    <div className="mt-6">
                      <AddToCartButton product={product} />
                    </div>

                  </div>

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