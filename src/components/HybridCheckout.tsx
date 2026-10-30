"use client";

import { useState } from "react";

import PixPayment from "./PixPayment";

interface Props {
  orderData: any;
}

export default function HybridCheckout({
  orderData,
}: Props) {
  const [loadingCard, setLoadingCard] =
    useState(false);

  async function openCheckoutPro() {
    try {
      setLoadingCard(true);

      const res = await fetch(
        "/api/checkout/pro",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          ...(typeof window !== "undefined" && localStorage.getItem("token")
            ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
            : {}),
          },

          body: JSON.stringify(
            orderData
          ),
        }
      );

      const data =
        await res.json();

      if (!data.success) {
        alert(
          data.error ||
            "Erro ao abrir pagamento."
        );

        return;
      }

      window.location.href =
        data.init_point;
    } catch (error) {
      console.log(error);

      alert(
        "Erro ao abrir checkout."
      );
    } finally {
      setLoadingCard(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-[#101014] border border-white/10 rounded-[2rem] p-8 text-white">
        <p className="text-pink-400 font-bold uppercase tracking-widest text-sm">
          Pagamento
        </p>

        <h2 className="text-4xl font-black mt-2">
          Escolha como pagar
        </h2>

        <p className="text-zinc-400 mt-3">
          Total com entrega:{" "}
          <strong className="text-pink-400">
            R${" "}
            {Number(
              orderData.total || 0
            ).toFixed(2)}
          </strong>
        </p>

        {/* RESUMO */}
        <div className="mt-6 bg-white/5 border border-white/10 rounded-3xl p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">
              Subtotal
            </span>

            <strong className="text-white">
              R${" "}
              {Number(
                orderData.subtotal || 0
              ).toFixed(2)}
            </strong>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">
              Entrega discreta
            </span>

            <strong className="text-white">
              {Number(
                orderData.deliveryFee || 0
              ) === 0
                ? "Grátis"
                : `R$ ${Number(
                    orderData.deliveryFee || 0
                  ).toFixed(2)}`}
            </strong>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {/* PIX */}
          <div className="rounded-3xl p-5 border bg-gradient-to-br from-pink-500 to-purple-600 border-transparent shadow-[0_0_30px_rgba(255,79,163,0.25)]">
            <div className="text-4xl">
              ⚡
            </div>

            <h3 className="text-2xl font-black mt-4">
              PIX
            </h3>

            <p className="text-sm mt-2 text-pink-100">
              Aprovação rápida e prática.
            </p>
          </div>

          {/* CARTÃO */}
          <button
            onClick={
              openCheckoutPro
            }
            disabled={loadingCard}
            className="
              rounded-3xl
              p-5
              border
              bg-white/5
              border-white/10
              hover:bg-white/10
              transition-all
              text-left
              disabled:opacity-60
            "
          >
            <div className="text-4xl">
              💳
            </div>

            <h3 className="text-2xl font-black mt-4 text-white">
              Cartão
            </h3>

            <p className="text-sm mt-2 text-zinc-400">
              Checkout oficial Mercado Pago.
            </p>

            <div className="mt-5">
              <span className="inline-flex items-center gap-2 bg-green-500/15 text-green-300 border border-green-500/20 rounded-full px-4 py-2 text-xs font-bold">
                🔒 Ambiente seguro
              </span>
            </div>

            {loadingCard && (
              <p className="text-pink-400 text-sm font-bold mt-4">
                Abrindo checkout...
              </p>
            )}
          </button>
        </div>
      </div>

      {/* PIX */}
      <PixPayment
        orderData={orderData}
      />

      {/* SEGURANÇA */}
      <div className="bg-[#101014] border border-white/10 rounded-[2rem] p-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            [
              "🔒",
              "Seguro",
              "Dados protegidos",
            ],
            [
              "⚡",
              "Rápido",
              "Aprovação ágil",
            ],
            [
              "📦",
              "Discreto",
              "Embalagem neutra",
            ],
          ].map(
            ([
              icon,
              title,
              text,
            ]) => (
              <div
                key={title}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
              >
                <div className="text-3xl">
                  {icon}
                </div>

                <p className="text-sm font-bold text-white mt-3">
                  {title}
                </p>

                <p className="text-xs text-zinc-400 mt-1">
                  {text}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}