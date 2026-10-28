"use client";

export const dynamic = "force-dynamic";


import { useState } from "react";

export default function StoryEditorPage() {
  const [title, setTitle] = useState("A História do Véu");
  const [subtitle, setSubtitle] = useState("");
  const [cover, setCover] = useState("");
  const [content, setContent] = useState("");

  async function saveStory() {
    alert("No próximo passo iremos salvar no MongoDB.");
  }

  return (
    <div className="space-y-8">

      <div>

        <p className="uppercase tracking-[6px] text-sm text-purple-300 font-bold">
          Terra do Véu
        </p>

        <h1 className="text-5xl font-black mt-3">
          Editor da História
        </h1>

        <p className="text-zinc-400 mt-4">
          Escreva toda a narrativa oficial do universo.
        </p>

      </div>

      <div className="rounded-3xl bg-[#111633] border border-white/10 p-8 space-y-6">

        <div>

          <label className="block mb-2 font-bold">
            Título
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl bg-[#1B2148] p-4 outline-none border border-transparent focus:border-violet-500"
          />

        </div>

        <div>

          <label className="block mb-2 font-bold">
            Subtítulo
          </label>

          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full rounded-2xl bg-[#1B2148] p-4 outline-none border border-transparent focus:border-violet-500"
          />

        </div>

        <div>

          <label className="block mb-2 font-bold">
            Imagem de capa
          </label>

          <input
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-2xl bg-[#1B2148] p-4 outline-none border border-transparent focus:border-violet-500"
          />

        </div>

        {cover && (
          <img
            src={cover}
            className="rounded-3xl border border-white/10 max-h-[300px] object-cover"
          />
        )}

        <div>

          <label className="block mb-2 font-bold">
            História
          </label>

          <textarea
            rows={18}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-2xl bg-[#1B2148] p-5 outline-none border border-transparent focus:border-violet-500 resize-none"
            placeholder="Escreva toda a história..."
          />

        </div>

        <div className="flex gap-4">

          <button
            onClick={saveStory}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 font-black"
          >
            💾 Salvar História
          </button>

          <button
            className="px-8 py-4 rounded-2xl bg-[#1B2148] font-black"
          >
            👁 Pré-visualizar
          </button>

        </div>

      </div>

    </div>
  );
}