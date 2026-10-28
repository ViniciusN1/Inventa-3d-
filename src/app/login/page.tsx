import AuthCheckout from "@/components/AuthCheckout";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#080B2A] text-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-180px] left-[-120px] w-[420px] h-[420px] bg-[#B69AF8]/25 rounded-full blur-3xl" />
      <div className="absolute bottom-[-180px] right-[-120px] w-[420px] h-[420px] bg-[#F3B4A8]/20 rounded-full blur-3xl" />

      <div className="relative z-10 bg-[#0B0E33] rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.45)] border border-[#B69AF8]/20 p-8 w-full max-w-md">
        <Link
          href="/"
          className="text-[#F3B4A8] font-bold hover:text-[#DCCBFF] transition"
        >
          ← Voltar para loja
        </Link>

        <div className="mt-8 flex items-center gap-4">
          <img
            src="https://res.cloudinary.com/dkn7d79wh/image/upload/v1782591290/Logo_icon_gwdpgo.png"
            alt="Inventta 3D"
            className="w-16 h-16 object-contain"
          />

          <div>
            <h1 className="text-4xl font-black text-[#DCCBFF]">
              Entrar
            </h1>

            <p className="text-sm font-bold text-[#F3B4A8]">
              Inventta 3D
            </p>
          </div>
        </div>

        <p className="text-zinc-300 mt-6 mb-8 leading-relaxed">
          Entre ou crie sua conta para acompanhar pedidos, acessar vídeos e comprar mais rápido.
        </p>

        <AuthCheckout />
      </div>
    </main>
  );
}