import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#080B2A] border-t border-[#B69AF8]/20 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/dkn7d79wh/image/upload/v1782591290/Logo_icon_gwdpgo.png"
              alt="Inventta 3D"
              className="w-12 h-12 object-contain"
            />

            <div>
              <h2 className="text-2xl font-black text-[#DCCBFF]">
                Inventta 3D
              </h2>

              <p className="text-sm text-[#B69AF8]">
                Ideias que ganham forma
              </p>
            </div>
          </div>

          <p className="text-zinc-300 mt-5 leading-relaxed">
            Impressão 3D personalizada para decoração, universo geek,
            infantil, RPG, miniaturas e presentes criativos.
          </p>
        </div>

        <div>
          <h3 className="font-black text-[#F3B4A8] mb-4">
            Categorias
          </h3>

          <div className="space-y-3 text-zinc-300">
            <Link href="/category/geek" className="block hover:text-[#F3B4A8]">
              Geek
            </Link>
            <Link href="/category/infantil" className="block hover:text-[#F3B4A8]">
              Infantil
            </Link>
            <Link href="/category/decoracao" className="block hover:text-[#F3B4A8]">
              Decoração
            </Link>
            <Link href="/category/miniaturas" className="block hover:text-[#F3B4A8]">
              Miniaturas
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-black text-[#F3B4A8] mb-4">
            Loja
          </h3>

          <div className="space-y-3 text-zinc-300">
            <Link href="/products" className="block hover:text-[#F3B4A8]">
              Todos os produtos
            </Link>
            <Link href="/checkout" className="block hover:text-[#F3B4A8]">
              Checkout
            </Link>
            <Link href="/profile" className="block hover:text-[#F3B4A8]">
              Minha conta
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-black text-[#F3B4A8] mb-4">
            Atendimento
          </h3>

          <div className="space-y-3 text-zinc-300">
            <a href="https://wa.me/5567992730601">WhatsApp: (67) 99273-0601</a>
            <a href="https://www.instagram.com/inventta.3dd?igsh=MXZuOXl2bGc2bmxkeQ%3D%3D">Instagram: @inventta3d</a>
            <p>Enviamos para todo o Brasil</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#B69AF8]/20 py-5 text-center text-sm text-zinc-400">
        © {new Date().getFullYear()} Inventta 3D — Transformando ideias em realidade.
      </div>
    </footer>
  );
}