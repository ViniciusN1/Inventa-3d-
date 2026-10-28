"use client";

import { useCart } from "@/context/CartContext";

interface Props {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
}

export default function AddToCartButton({
  product,
}: Props) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="
        w-full
        mt-6
        py-4
        rounded-2xl
        font-black
        text-[#080B2A]
        bg-gradient-to-r
        from-[#B69AF8]
        via-[#DCCBFF]
        to-[#F3B4A8]
        hover:scale-[1.02]
        transition-all
        duration-300
        shadow-[0_0_25px_rgba(182,154,248,0.35)]
      "
    >
      🛒 Adicionar ao Carrinho
    </button>
  );
}