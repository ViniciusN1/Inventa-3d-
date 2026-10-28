"use client";

import { useState } from "react";
export const dynamic = "force-dynamic";


export default function TerraHomeEditor() {
  const [data, setData] = useState({
    title: "Terra do Véu",
    subtitle:
      "Um mundo de fantasia com peças 3D, torres, criaturas e aventuras.",
    banner: "",
    buttonText: "Acompanhar a saga",
    buttonLink: "https://instagram.com/inventta.3dd",
  });

  function update(field: string, value: string) {
    setData({
      ...data,
      [field]: value,
    });
  }

  async function save() {
    alert("No próximo passo vamos salvar no MongoDB.");
  }

  return (
    <div className="space-y-10">

      <div>

        <p className="uppercase tracking-[6px] text-sm text-purple-300 font-bold">
          Terra do Véu
        </p>

        <h1 className="text-6xl font-black mt-3">
          Página Inicial
        </h1>

        <p className="text-zinc-400 mt-4">
          Edite todo o conteúdo da Home do universo.
        </p>

      </div>

      <div className="rounded-3xl bg-[#111633] border border-white/10 p-8 space-y-6">

        <div>

          <label className="font-bold block mb-2">
            Título Principal
          </label>

          <input
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full rounded-2xl bg-[#1A2145] p-4"
          />

        </div>

        <div>

          <label className="font-bold block mb-2">
            Subtítulo
          </label>

          <textarea
            rows={4}
            value={data.subtitle}
            onChange={(e) => update("subtitle", e.target.value)}
            className="w-full rounded-2xl bg-[#1A2145] p-4"
          />

        </div>

        <div>

          <label className="font-bold block mb-2">
            Banner
          </label>

          <input
            value={data.banner}
            onChange={(e) => update("banner", e.target.value)}
            placeholder="https://..."
            className="w-full rounded-2xl bg-[#1A2145] p-4"
          />

        </div>

        {data.banner && (

          <img
            src={data.banner}
            className="rounded-3xl border border-white/10 max-h-[320px] object-cover"
          />

        )}

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="font-bold block mb-2">
              Texto do botão
            </label>

            <input
              value={data.buttonText}
              onChange={(e) => update("buttonText", e.target.value)}
              className="w-full rounded-2xl bg-[#1A2145] p-4"
            />

          </div>

          <div>

            <label className="font-bold block mb-2">
              Link
            </label>

            <input
              value={data.buttonLink}
              onChange={(e) => update("buttonLink", e.target.value)}
              className="w-full rounded-2xl bg-[#1A2145] p-4"
            />

          </div>

        </div>

        <div className="flex gap-4">

          <button
            onClick={save}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 font-black"
          >
            💾 Salvar
          </button>

          <button
            className="px-8 py-4 rounded-2xl bg-[#1A2145] font-black"
          >
            👁 Pré-visualizar
          </button>

        </div>

      </div>

      <div className="rounded-3xl bg-[#111633] border border-white/10 p-8">

        <h2 className="text-3xl font-black">
          Próximos módulos
        </h2>

        <div className="grid md:grid-cols-3 gap-5 mt-8">

          <div className="rounded-2xl bg-[#191F44] p-6">
            🏰 Cards da Home
          </div>

          <div className="rounded-2xl bg-[#191F44] p-6">
            🌳 Biomas
          </div>

          <div className="rounded-2xl bg-[#191F44] p-6">
            🛒 Produtos
          </div>

          <div className="rounded-2xl bg-[#191F44] p-6">
            📖 História
          </div>

          <div className="rounded-2xl bg-[#191F44] p-6">
            📸 Galeria
          </div>

          <div className="rounded-2xl bg-[#191F44] p-6">
            🎥 Vídeos
          </div>

        </div>

      </div>

    </div>
  );
}