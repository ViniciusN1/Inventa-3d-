"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  FaInstagram,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";

export default function Navbar() {

  const router = useRouter();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { totalItems, setIsOpen } = useCart();

  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [settings, setSettings] = useState<any>({
    storeName: "Inventta 3D",
    slogan: "Ideias que ganham forma",
    whatsapp: "5567992730601",
    instagram: "inventta.3dd",
  });

useEffect(() => {
  if (!search.trim()) {
    setResults([]);
    setShowResults(false);
    return;
  }

  const timer = setTimeout(async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/search?q=${encodeURIComponent(search)}`
      );

      const data = await res.json();

      setResults(data || []);
      setShowResults(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  return () => clearTimeout(timer);
}, [search]);
  function handleUserClick() {
    window.location.href = isLogged ? "/profile" : "/login";
  }
  function handleSearch(e: React.FormEvent) {
  e.preventDefault();

  if (!search.trim()) return;

  router.push(`/search?q=${encodeURIComponent(search.trim())}`);
}

  const whatsappNumber = String(settings.whatsapp || "")
    .replace(/\D/g, "");

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        "Olá! Vim pelo site da Inventta 3D e gostaria de fazer um orçamento."
      )}`
    : "#";

  const instagramUser = String(settings.instagram || "inventta.3dd")
    .replace("@", "")
    .trim();

  const instagramUrl = `https://www.instagram.com/${instagramUser}`;

  return (
    <>
      <div className="bg-gradient-to-r from-[#B69AF8] via-[#DCCBFF] to-[#F3B4A8] text-[#080B2A] text-center py-2 text-xs md:text-sm font-black tracking-wide">
        ✨ Impressão 3D personalizada • Geek • Infantil • Decoração • Enviamos para todo Brasil
      </div>

      <header className="sticky top-0 z-50 bg-[#080B2A]/90 backdrop-blur-2xl border-b border-[#B69AF8]/20 shadow-[0_15px_50px_rgba(0,0,0,0.35)]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 min-w-fit">
            <div className="w-13 h-13 rounded-2xl bg-white/5 border border-[#B69AF8]/20 flex items-center justify-center shadow-[0_0_25px_rgba(182,154,248,0.22)]">
              <img
                src={
                  settings.logo ||
                  "https://res.cloudinary.com/dkn7d79wh/image/upload/v1782591290/Logo_icon_gwdpgo.png"
                }
                alt={settings.storeName || "Inventta 3D"}
                className="w-12 h-12 object-contain"
              />
            </div>

            <div className="hidden sm:block">
              <h1 className="text-2xl font-black text-[#DCCBFF] leading-none">
                {settings.storeName || "Inventta 3D"}
              </h1>

              <p className="text-xs text-[#F3B4A8] font-bold mt-1">
                {settings.slogan || "Ideias que ganham forma"}
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            <Link
              href="/category/personalizados"
              className="px-4 py-3 rounded-2xl text-sm font-black text-zinc-300 hover:text-[#F3B4A8] hover:bg-white/5 transition"
            >
              Personalizados
            </Link>
          </nav>

              <form
                  onSubmit={handleSearch}
                  className="hidden md:flex items-center bg-white/5 border border-[#B69AF8]/20 rounded-full px-4 py-3 flex-1 max-w-sm focus-within:border-[#F3B4A8] transition"
                >
                  <FaSearch className="text-[#B69AF8]" />

                  <input
                    type="text"
                    value={search}
                    onFocus={() => setShowResults(true)}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar produtos..."
                    className="bg-transparent outline-none ml-3 w-full text-white placeholder:text-zinc-500"
                  />
              </form>
              {showResults && search && (
  <div className="absolute top-full left-0 right-0 mt-2 bg-[#080B2A] border border-[#B69AF8]/20 rounded-2xl overflow-hidden z-50">
    
    {loading && (
      <div className="p-4 text-center text-zinc-400">
        Buscando...
      </div>
    )}

    {!loading && results.length === 0 && (
      <div className="p-4 text-center text-zinc-500">
        Nenhum produto encontrado
      </div>
    )}

    {!loading &&
      results.map((product) => (
        <Link
          key={product._id}
          href={`/product/${product._id}`}
          onClick={() => {
            setSearch("");
            setResults([]);
            setShowResults(false);
          }}
          className="flex items-center gap-3 p-3 hover:bg-white/5 transition"
        >
          <img
            src={product.image}
            className="w-12 h-12 rounded-xl object-cover"
          />

          <div>
            <p className="text-white font-bold line-clamp-1">
              {product.name}
            </p>

            <p className="text-[#F3B4A8] font-black">
              R$ {Number(product.price).toFixed(2)}
            </p>
          </div>
        </Link>
      ))}
  </div>
)}

          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/feed"
              className="hidden md:flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] font-black hover:scale-105 transition shadow-[0_0_25px_rgba(182,154,248,0.25)]"
              title="Comunidade"
            >
              <FaUsers />
              <span>Comunidade</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              className="hidden xl:flex w-12 h-12 rounded-2xl bg-white/5 border border-[#B69AF8]/20 hover:bg-[#B69AF8]/10 items-center justify-center transition"
              title="WhatsApp"
            >
              <FaWhatsapp className="text-[#F3B4A8] text-xl" />
            </a>

            <Link
              href={instagramUrl}
              target="_blank"
              className="w-12 h-12 rounded-2xl bg-white/5 border border-[#B69AF8]/20 hover:bg-[#B69AF8]/10 flex items-center justify-center transition"
              title="Instagram"
            >
              <FaInstagram className="text-[#F3B4A8] text-xl" />
            </Link>

            <button
              type="button"
              onClick={handleUserClick}
              
              className="w-12 h-12 rounded-2xl bg-white/5 border border-[#B69AF8]/20 hover:bg-[#B69AF8]/10 flex items-center justify-center transition"
              title={isLogged ? "Minha conta" : "Entrar"}
            >
              {user?.name ? (
                <span className="font-black text-[#DCCBFF]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <FaUser className="text-[#DCCBFF]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative w-12 h-12 rounded-2xl bg-white/5 border border-[#B69AF8]/20 hover:bg-[#B69AF8]/10 flex items-center justify-center transition"
              title="Carrinho"
            >
              <FaShoppingCart className="text-white text-xl" />

              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#F3B4A8] text-[#080B2A] text-[11px] min-w-6 h-6 px-1 flex items-center justify-center rounded-full font-black border-2 border-[#080B2A]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}