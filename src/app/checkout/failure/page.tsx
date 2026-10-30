import Link from "next/link";

import PaymentConfirm from "@/components/PaymentConfirm";

export const dynamic = "force-dynamic";

export default async function CheckoutFailurePage({
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
          ⚠️
        </div>

        <p className="text-pink-400 font-bold uppercase tracking-widest text-sm">
          Pagamento não concluído
        </p>

        <h1 className="text-5xl font-black mt-4">
          Não foi possível concluir o pagamento
        </h1>

        <p className="text-zinc-400 mt-6 text-lg">
          Nenhuma cobrança foi confirmada. Você pode tentar de novo com outro meio de pagamento.
        </p>

        <PaymentConfirm paymentId={paymentId} />

        <div className="grid gap-4 mt-10">

          <Link
            href="/checkout"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-5 rounded-2xl font-black hover:opacity-90 transition"
          >
            Tentar novamente
          </Link>

          <Link
            href="/"
            className="bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black hover:bg-white/10 transition"
          >
            Continuar comprando
          </Link>

        </div>
      </div>
    </main>
  );
}
