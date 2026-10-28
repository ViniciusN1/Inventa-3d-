"use client";

import { useState } from "react";

interface Props {
  orderData: any;
}

export default function PixPayment({
  orderData,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [pixData, setPixData] =
    useState<any>(null);

  async function generatePix() {
  try {
    setLoading(true);

    const total = Number(orderData.total || 0);
    const safeTotal = Math.round(total * 100) / 100;

    const res = await fetch("/api/checkout/pix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transaction_amount: safeTotal,
        total: safeTotal,

        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        cpf: orderData.cpf,

        cep: orderData.cep,
        address: orderData.address,
        number: orderData.number,
        city: orderData.city,
        state: orderData.state,

        cart: orderData.cart,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Erro PIX");
      return;
    }

    setPixData(data);
  } catch (error) {
    console.log(error);
    alert("Erro ao gerar PIX");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="bg-[#101014] border border-white/10 rounded-[2rem] p-8 text-white">
      {!pixData ? (
        <>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(255,79,163,0.25)]">
              ⚡
            </div>

            <div>
              <h2 className="text-3xl font-black">
                PIX instantâneo
              </h2>

              <p className="text-zinc-400 mt-1">
                Aprovação rápida.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-3xl">
                ⚡
              </p>

              <p className="font-black mt-3">
                Instantâneo
              </p>

              <p className="text-zinc-400 text-sm mt-1">
                Aprovação rápida
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-3xl">
                🔒
              </p>

              <p className="font-black mt-3">
                Seguro
              </p>

              <p className="text-zinc-400 text-sm mt-1">
                Proteção total
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-3xl">
                📦
              </p>

              <p className="font-black mt-3">
                Discreto
              </p>

              <p className="text-zinc-400 text-sm mt-1">
                Embalagem neutra
              </p>
            </div>
          </div>

          <button
            onClick={generatePix}
            disabled={loading}
            className="
              w-full mt-8
              bg-gradient-to-r
              from-pink-500
              to-purple-600
              hover:opacity-90
              text-white
              py-5
              rounded-2xl
              font-black
              text-lg
              transition
              disabled:opacity-50
            "
          >
            {loading
              ? "Gerando PIX..."
              : "Gerar PIX"}
          </button>
        </>
      ) : (
        <div className="text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-green-500/15 border border-green-400/20 flex items-center justify-center text-5xl">
            ✓
          </div>

          <h2 className="text-4xl font-black mt-6">
            PIX gerado
          </h2>

          <p className="text-zinc-400 mt-3">
            Faça o pagamento para confirmar seu pedido.
          </p>

          {pixData.qr_code_base64 && (
            <img
              src={`data:image/png;base64,${pixData.qr_code_base64}`}
              alt="PIX"
              className="w-72 h-72 mx-auto mt-8 rounded-3xl bg-white p-4"
            />
          )}

          <div className="bg-black/30 border border-white/10 rounded-3xl p-5 mt-8">
            <p className="text-zinc-400 text-sm mb-3">
              Código PIX
            </p>

            <textarea
              readOnly
              value={
               pixData.qr_code
              }
              className="
                w-full
                bg-transparent
                text-white
                outline-none
                resize-none
                h-40
              "
            />
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(
                pixData.qr_code
              );

              alert(
                "Código copiado!"
              );
            }}
            className="
              w-full mt-6
              bg-gradient-to-r
              from-pink-500
              to-purple-600
              text-white
              py-5
              rounded-2xl
              font-black
              text-lg
            "
          >
            Copiar código PIX
          </button>
        </div>
      )}
    </div>
  );
}