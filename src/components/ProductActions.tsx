

"use client";

import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";

interface Props {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
}

export default function ProductActions({
  product,
}: Props) {

  const router = useRouter();

  const { addToCart } = useCart();

  return (
    <div className="flex flex-wrap gap-4 mt-10">

      {/* VOLTAR */}
      <button
        onClick={() => router.back()}
        className="
          border border-gray-300
          px-8 py-5
          rounded-2xl
          font-bold
          hover:bg-gray-100
          transition
        "
      >
        ← Voltar
      </button>

      {/* COMPRAR */}
      <button
        className="
          bg-pink-500 hover:bg-pink-600
          text-white
          px-10 py-5
          rounded-2xl
          font-bold
          transition
        "
      >
        Comprar Agora
      </button>

      {/* CARRINHO */}
      <button
        onClick={() => addToCart(product)}
        className="
          border border-pink-500
          text-pink-600
          px-10 py-5
          rounded-2xl
          font-bold
          hover:bg-pink-50
          transition
        "
      >
        Adicionar ao Carrinho
      </button>

    </div>
  );
}