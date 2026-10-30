import Link from "next/link";

import PaymentConfirm from "@/components/PaymentConfirm";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const paymentId = String(params.payment_id || params.collection_id || "") || undefined;

  return (
    <main className="min-h-screen bg-[#07070A] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-[#101014] border border-white/10 rounded-[2rem] p-10 text-center">

        <div className="text-7xl mb-6">
          🎉
        </div>

        <p className="text-pink-400 font-bold uppercase tracking-widest text-sm">
          {paymentId ? "Pagamento recebido" : "Pagamento confirmado"}
        </p>

        <h1 className="text-5xl font-black mt-4">
          Pedido realizado com sucesso!
        </h1>

        <p className="text-zinc-400 mt-6 text-lg">
          Seu pedido foi registrado e já está sendo processado.
          Você poderá acompanhar a entrega e acessar conteúdos exclusivos dos produtos adquiridos.
        </p>

        <PaymentConfirm paymentId={paymentId} />

        <div className="grid gap-4 mt-10">

          <Link
            href="/profile/videos"
            className="
              bg-gradient-to-r
              from-pink-500
              to-purple-600
              text-white
              py-5
              rounded-2xl
              font-black
              hover:opacity-90
              transition
            "
          >
            🎥 Ver vídeos exclusivos
          </Link>

          <Link
            href="/"
            className="
              bg-white/5
              border
              border-white/10
              text-white
              py-5
              rounded-2xl
              font-black
              hover:bg-white/10
              transition
            "
          >
            Continuar comprando
          </Link>

          <Link
            href="/profile"
            className="
              bg-white/5
              border
              border-white/10
              text-white
              py-5
              rounded-2xl
              font-black
              hover:bg-white/10
              transition
            "
          >
            Minha conta
          </Link>

        </div>

        <div className="grid grid-cols-3 gap-4 mt-10">

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-3xl">🔒</div>
            <p className="font-bold mt-2">Seguro</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-3xl">📦</div>
            <p className="font-bold mt-2">Discreto</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-3xl">🚚</div>
            <p className="font-bold mt-2">Entrega</p>
          </div>

        </div>
      </div>
    </main>
  );
}