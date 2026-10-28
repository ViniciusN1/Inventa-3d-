import Link from "next/link";

import Navbar from "@/components/Navbar";
import AddToCartButton from "@/components/AddToCartButton";
import clientPromise, { DB_NAME } from "@/lib/mongodb";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category?: string;
  material?: string;
  color?: string;
  stock?: number;
  productionTime?: string;
  featured?: boolean;
}

async function getProducts(): Promise<Product[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const products = await db
      .collection("products")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.log("PRODUCTS PAGE ERROR:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#080B2A] text-white">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
            Catálogo Inventta 3D
          </p>

          <h1 className="text-5xl md:text-6xl font-black mt-3 text-[#DCCBFF]">
            Todos os produtos
          </h1>

          <p className="text-zinc-400 mt-4 max-w-2xl text-lg">
            Peças personalizadas em impressão 3D: miniaturas, RPG, decoração,
            chaveiros, universo geek, infantil e projetos sob encomenda.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-10 text-center">
            <div className="text-6xl mb-5">🖨️</div>

            <h2 className="text-3xl font-black text-[#DCCBFF]">
              Nenhum produto cadastrado
            </h2>

            <p className="text-zinc-400 mt-3">
              Cadastre produtos pelo painel administrativo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              const stock = Number(product.stock || 0);
              const hasStock = stock > 0;

              return (
                <div key={product._id} className="group">
                  <div className="relative bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[32px] p-5 hover:border-[#F3B4A8]/50 hover:-translate-y-2 hover:shadow-[0_0_45px_rgba(182,154,248,0.14)] transition-all duration-300">
                    <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
                      <span className="bg-[#B69AF8]/15 border border-[#B69AF8]/30 text-[#DCCBFF] text-xs font-black px-3 py-2 rounded-full">
                        {product.category || "3D"}
                      </span>

                      {product.featured && (
                        <span className="bg-[#F3B4A8]/15 border border-[#F3B4A8]/30 text-[#F3B4A8] text-xs font-black px-3 py-2 rounded-full">
                          Destaque
                        </span>
                      )}
                    </div>

                    <Link href={`/product/${product._id}`}>
                      <div className="bg-[#080B2A] rounded-[26px] p-6 overflow-hidden border border-white/5 min-h-[280px] flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-64 object-contain group-hover:scale-105 transition duration-300"
                        />
                      </div>
                    </Link>

                    <div className="mt-6">
                      <h2 className="text-lg font-black text-white min-h-[56px]">
                        {product.name}
                      </h2>

                      <p className="mt-3 text-3xl font-black bg-gradient-to-r from-[#DCCBFF] to-[#F3B4A8] bg-clip-text text-transparent">
                        R$ {Number(product.price || 0).toFixed(2)}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                          <p className="text-[11px] text-zinc-500 font-bold">
                            Material
                          </p>
                          <p className="text-sm text-zinc-300 font-bold truncate">
                            {product.material || "PLA"}
                          </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                          <p className="text-[11px] text-zinc-500 font-bold">
                            Produção
                          </p>
                          <p className="text-sm text-zinc-300 font-bold truncate">
                            {product.productionTime || "Sob consulta"}
                          </p>
                        </div>
                      </div>

                      <p
                        className={`mt-4 text-sm font-bold ${
                          hasStock ? "text-green-300" : "text-red-300"
                        }`}
                      >
                        {hasStock ? `Estoque: ${stock}` : "Produto sob encomenda"}
                      </p>

                      <p className="mt-2 text-sm text-zinc-400">
                        Impressão 3D • Produto personalizado
                      </p>

                      <div className="mt-6">
                        {hasStock ? (
                          <AddToCartButton product={product} />
                        ) : (
                          <Link
                            href="https://wa.me/5511987654321"
                            target="_blank"
                            className="block text-center w-full bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] py-4 rounded-2xl font-black hover:scale-[1.02] transition"
                          >
                            Pedir orçamento
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}