import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  featured?: boolean;
  isNew?: boolean;
  createdAt?: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/products`, {
      cache: "no-store",
    });

    const data = await res.json();

    return data.products || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  const weeklyNews = products
    .filter((product) => product.isNew || product.featured)
    .slice(0, 5);

  const displayProducts =
    weeklyNews.length > 0 ? weeklyNews : products.slice(0, 5);

  const categories = [
    { name: "Geek", href: "/category/geek", icon: "🎮" },
    { name: "Infantil", href: "/category/infantil", icon: "👶" },
    { name: "Decoração", href: "/category/decoracao", icon: "🏠" },
    { name: "Miniaturas", href: "/category/miniaturas", icon: "⚔️" },
    { name: "Chaveiros", href: "/category/chaveiros", icon: "🔑" },
    { name: "RPG", href: "/category/rpg", icon: "🧙" },
    { name: "Personalizados", href: "/category/personalizados", icon: "✨" },
    { name: "Terra do Véu", href: "/category/terra-do-veu", icon: "🌑", },
  ];

  return (
    <main className="min-h-screen bg-[#080B2A] text-white overflow-hidden">
      <Navbar />

      {/* HERO */}
      <section className="max-w-[1600px] mx-auto px-4 pt-8">
        <div className="relative overflow-hidden rounded-[40px] border border-[#B69AF8]/20 bg-[#0B0E33] min-h-[620px] shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
          <div className="absolute top-[-220px] left-[-160px] w-[520px] h-[520px] bg-[#B69AF8]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-240px] right-[-140px] w-[520px] h-[520px] bg-[#F3B4A8]/20 rounded-full blur-3xl" />

          <div className="grid lg:grid-cols-2 items-center min-h-[620px]">
            <div className="px-8 md:px-20 py-20 relative z-10">
              <span className="inline-flex bg-white/5 border border-[#B69AF8]/20 px-5 py-3 rounded-full text-sm font-bold text-[#DCCBFF] backdrop-blur-xl">
                ✨ IMPRESSÃO 3D PERSONALIZADA
              </span>

              <h1 className="mt-8 text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
                Impressão 3D
                <br />
                <span className="bg-gradient-to-r from-[#DCCBFF] to-[#F3B4A8] bg-clip-text text-transparent">
                  personalizada
                </span>
              </h1>

              <p className="mt-8 text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed">
                Criamos peças únicas para decoração, presentes, miniaturas,
                RPG, chaveiros, universo geek e projetos sob medida.
              </p>

              <div className="flex flex-wrap gap-5 mt-12">
                <a
                  href="#novidades"
                  className="bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] px-10 py-5 rounded-2xl font-black shadow-[0_0_40px_rgba(182,154,248,0.35)] hover:scale-105 transition"
                >
                  Ver novidades
                </a>

                <a
                  href="#orcamento"
                  className="border border-[#B69AF8]/20 bg-white/5 backdrop-blur-xl text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition"
                >
                  Pedir orçamento
                </a>
              </div>

              <div className="grid grid-cols-3 gap-5 mt-14 max-w-xl">
                <div className="bg-white/5 border border-[#B69AF8]/20 rounded-3xl p-5">
                  <p className="text-3xl font-black text-[#B69AF8]">3D</p>
                  <p className="text-zinc-400 mt-1 text-sm">personalizado</p>
                </div>

                <div className="bg-white/5 border border-[#B69AF8]/20 rounded-3xl p-5">
                  <p className="text-3xl font-black text-[#F3B4A8]">BR</p>
                  <p className="text-zinc-400 mt-1 text-sm">todo Brasil</p>
                </div>

                <div className="bg-white/5 border border-[#B69AF8]/20 rounded-3xl p-5">
                  <p className="text-3xl font-black text-[#DCCBFF]">✨</p>
                  <p className="text-zinc-400 mt-1 text-sm">exclusivo</p>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center items-center p-10">
              <div className="absolute w-[420px] h-[420px] bg-gradient-to-br from-[#B69AF8]/25 to-[#F3B4A8]/20 rounded-full blur-3xl" />

              <div className="relative z-10 bg-white/5 border border-[#B69AF8]/20 rounded-[3rem] p-10 max-w-md text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
                <img
                  src={  "https://res.cloudinary.com/dkn7d79wh/image/upload/v1782591290/Logo_icon_gwdpgo.png" }
                  alt="Inventta 3D"
                  className="w-40 h-40 mx-auto object-contain"
                />

                <h2 className="text-3xl font-black mt-6 text-[#DCCBFF]">
                  Transformamos ideias em realidade
                </h2>

                <p className="text-zinc-400 mt-4">
                  Envie sua ideia, referência ou arquivo STL e receba uma peça
                  exclusiva feita em impressão 3D.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="max-w-7xl mx-auto mt-12 px-4">
        <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
          Categorias
        </p>

        <h2 className="text-3xl md:text-4xl font-black mt-2">
          Escolha seu universo
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
          {categories.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group bg-white/5 border border-[#B69AF8]/20 backdrop-blur-xl rounded-3xl p-8 text-center font-black text-white hover:border-[#F3B4A8]/60 hover:bg-[#B69AF8]/10 hover:-translate-y-1 transition"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition">
                {item.icon}
              </div>

              {item.name}
            </Link>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA + ORÇAMENTO */}
      <section id="orcamento" className="max-w-7xl mx-auto mt-20 px-4">
        <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2.5rem] p-8 md:p-12">
          <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
            Como funciona
          </p>

          <h2 className="text-4xl md:text-5xl font-black mt-3 text-[#DCCBFF]">
            Do digital para o real
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mt-10">
            {[
              ["1", "Você envia a ideia", "Referência, desenho, foto ou arquivo STL."],
              ["2", "Montamos o orçamento", "Calculamos material, tempo e acabamento."],
              ["3", "Produzimos em 3D", "A peça é impressa, revisada e finalizada."],
              ["4", "Enviamos para você", "Produto embalado e enviado para todo o Brasil."],
            ].map(([num, title, text]) => (
              <div
                key={num}
                className="bg-white/5 border border-white/10 rounded-3xl p-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] flex items-center justify-center font-black text-xl">
                  {num}
                </div>

                <h3 className="text-xl font-black mt-5 text-white">
                  {title}
                </h3>

                <p className="text-zinc-400 mt-3 leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-gradient-to-r from-[#B69AF8]/20 to-[#F3B4A8]/20 border border-[#B69AF8]/20 rounded-[2rem] p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-white">
                Tem uma ideia personalizada?
              </h3>

              <p className="text-zinc-300 mt-3 max-w-3xl">
                Transformamos desenhos, logotipos, personagens, miniaturas,
                presentes e projetos exclusivos em peças físicas.
              </p>
            </div>

            <a
              href="https://wa.me/5567992730601"
              target="_blank"
              className="inline-flex justify-center bg-green-500 text-white px-8 py-5 rounded-2xl font-black hover:scale-105 transition"
            >
              💬 Solicitar orçamento
            </a>
          </div>
        </div>
      </section>

      {/* NOVIDADES DA SEMANA */}
      <section id="novidades" className="max-w-7xl mx-auto py-20 px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
              Novidades da semana
            </p>

            <h2 className="text-4xl md:text-5xl font-black mt-3">
              5 produtos em destaque
            </h2>

            <p className="text-zinc-400 mt-3">
              Essa seleção pode ser trocada toda semana pelo painel admin.
            </p>
          </div>

          <Link
            href="/products"
            className="hidden md:block text-[#F3B4A8] font-bold hover:text-[#DCCBFF] transition"
          >
            Ver catálogo completo
          </Link>
        </div>

        {displayProducts.length === 0 ? (
          <div className="bg-white/5 border border-[#B69AF8]/20 rounded-3xl p-10 text-center">
            <p className="text-zinc-400 font-bold">
              Nenhum produto encontrado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {displayProducts.map((product) => (
              <div key={product._id} className="group">
                <div className="relative bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[32px] p-5 hover:border-[#F3B4A8]/50 hover:shadow-[0_0_45px_rgba(182,154,248,0.14)] hover:-translate-y-2 transition-all duration-300">
                  <div className="absolute top-4 left-4 z-10 bg-[#F3B4A8]/15 border border-[#F3B4A8]/30 text-[#F3B4A8] text-xs font-black px-3 py-2 rounded-full">
                    NOVIDADE
                  </div>

                  <Link href={`/product/${product._id}`}>
                    <div className="bg-[#080B2A] rounded-[26px] p-6 overflow-hidden border border-white/5 min-h-[220px] flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-52 object-contain mx-auto group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  </Link>

                  <div className="mt-6">
                    <h3 className="text-base font-bold text-white min-h-[48px]">
                      {product.name}
                    </h3>

                    <p className="mt-3 text-2xl font-black bg-gradient-to-r from-[#DCCBFF] to-[#F3B4A8] bg-clip-text text-transparent">
                      R$ {Number(product.price).toFixed(2)}
                    </p>

                    <p className="mt-2 text-sm text-zinc-400">
                      Impressão 3D • Personalizado
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