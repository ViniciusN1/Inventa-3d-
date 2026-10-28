"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    isOpen,
    setIsOpen,
  } = useCart();

  const total = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        className={`
          fixed inset-0 bg-black/70 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${
            isOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
        `}
      />

      <div
        className={`
          fixed top-0 right-0 h-full
          w-full sm:w-[460px]
          bg-[#101014]
          border-l border-white/10
          z-50 shadow-2xl
          transition-transform duration-300
          flex flex-col text-white
          ${
            isOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black">
              Seu Carrinho
            </h2>

            <p className="text-sm text-zinc-400 mt-1">
              {cart.length} itens adicionados
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 text-2xl transition"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-7xl">🛒</div>

              <h3 className="mt-6 text-2xl font-black">
                Carrinho vazio
              </h3>

              <p className="text-zinc-400 mt-2">
                Adicione produtos para continuar
              </p>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-8 bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 rounded-2xl font-black"
              >
                Continuar comprando
              </button>
            </div>
          )}

          {cart.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 bg-white/5 border border-white/10 rounded-3xl p-4"
            >
              <div className="bg-black/30 rounded-2xl p-3 border border-white/5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-contain"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-black text-white leading-tight">
                  {item.name}
                </h3>

                <p className="text-pink-400 font-black mt-2 text-lg">
                  R$ {Number(item.price).toFixed(2)}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-zinc-400">
                    Qtd: {item.quantity}
                  </p>

                  <button
                    onClick={() =>
                      removeFromCart(item._id)
                    }
                    className="text-red-400 text-sm font-bold hover:text-red-300"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 p-6 bg-[#0b0b0f]">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 font-bold">
              Total
            </span>

            <span className="text-3xl font-black text-pink-400">
              R$ {total.toFixed(2)}
            </span>
          </div>

          <Link
            href="/checkout"
            onClick={() => setIsOpen(false)}
            className="
              w-full mt-6
              bg-gradient-to-r from-pink-500 to-purple-600
              hover:opacity-90
              text-white py-5
              rounded-2xl
              font-black text-lg
              transition
              flex items-center justify-center
              shadow-[0_0_30px_rgba(255,79,163,0.25)]
            "
          >
            Finalizar Compra
          </Link>
        </div>
      </div>
    </>
  );
}