"use client";

import { useState } from "react";

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  category?: string;
  videoUrl?: string;
  videoTitle?: string;
  videoDescription?: string;
  productDetails?: string;
  careInstructions?: string;
  productionNotes?: string;
}

export default function AdminVideosClient({
  products,
}: {
  products: Product[];
}) {
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  function selectProduct(product: Product) {
    setSelected(product);

    setForm({
      videoUrl: product.videoUrl || "",
      videoTitle: product.videoTitle || "",
      videoDescription: product.videoDescription || "",
      productDetails: product.productDetails || "",
      careInstructions: product.careInstructions || "",
      productionNotes: product.productionNotes || "",
    });
  }

  async function saveProductVideo() {
    if (!selected) return;

    setSaving(true);

    const res = await fetch(`/api/products/${selected._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setSaving(false);

    if (!data.success) {
      alert(data.error || "Erro ao salvar");
      return;
    }

    alert("Vídeo e detalhes salvos!");
    location.reload();
  }

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-8">
      <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-5">
        <h2 className="text-2xl font-black text-[#DCCBFF]">
          Produtos
        </h2>

        <div className="space-y-4 mt-6 max-h-[720px] overflow-y-auto pr-2">
          {products.map((product) => (
            <button
              key={product._id}
              onClick={() => selectProduct(product)}
              className={`
                w-full text-left flex gap-4 p-4 rounded-2xl border transition
                ${
                  selected?._id === product._id
                    ? "bg-[#B69AF8]/15 border-[#F3B4A8]/50"
                    : "bg-white/5 border-white/10 hover:border-[#B69AF8]/40"
                }
              `}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 rounded-xl object-contain bg-black/30"
              />

              <div>
                <p className="font-black text-white">
                  {product.name}
                </p>

                <p className="text-sm text-zinc-400 mt-1">
                  R$ {Number(product.price || 0).toFixed(2)}
                </p>

                <p className="text-xs text-[#F3B4A8] mt-2 font-bold">
                  {product.videoUrl ? "Com vídeo" : "Sem vídeo"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {!selected ? (
        <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-10 flex items-center justify-center text-center">
          <div>
            <div className="text-7xl">🎥</div>

            <h2 className="text-3xl font-black text-[#DCCBFF] mt-6">
              Selecione um produto
            </h2>

            <p className="text-zinc-400 mt-3">
              Depois você poderá adicionar vídeo, detalhes e instruções.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-8">
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <img
              src={selected.image}
              alt={selected.name}
              className="w-40 h-40 object-contain rounded-3xl bg-black/30 border border-white/10"
            />

            <div>
              <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
                Produto selecionado
              </p>

              <h2 className="text-4xl font-black text-[#DCCBFF] mt-2">
                {selected.name}
              </h2>

              <p className="text-zinc-400 mt-2">
                Configure o conteúdo que aparecerá na página do produto.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Field
              label="Título do vídeo"
              value={form.videoTitle}
              onChange={(value) =>
                setForm({ ...form, videoTitle: value })
              }
              placeholder="Ex: Como usar / demonstração da peça"
            />

            <Field
              label="URL do vídeo"
              value={form.videoUrl}
              onChange={(value) =>
                setForm({ ...form, videoUrl: value })
              }
              placeholder="Cole link de vídeo ou URL do arquivo"
            />

            <TextArea
              label="Descrição do vídeo"
              value={form.videoDescription}
              onChange={(value) =>
                setForm({ ...form, videoDescription: value })
              }
              placeholder="Explique o que o cliente verá no vídeo."
            />

            <TextArea
              label="Detalhes da página do produto"
              value={form.productDetails}
              onChange={(value) =>
                setForm({ ...form, productDetails: value })
              }
              placeholder="Material, tamanho, acabamento, cores, uso recomendado..."
            />

            <TextArea
              label="Cuidados e instruções"
              value={form.careInstructions}
              onChange={(value) =>
                setForm({ ...form, careInstructions: value })
              }
              placeholder="Evitar calor, limpar com pano seco, não molhar..."
            />

            <TextArea
              label="Notas de produção"
              value={form.productionNotes}
              onChange={(value) =>
                setForm({ ...form, productionNotes: value })
              }
              placeholder="Tempo médio, tipo de impressão, pós-processamento..."
            />
          </div>

          {form.videoUrl && (
            <div className="mt-8 bg-black/30 border border-white/10 rounded-3xl p-5">
              <h3 className="text-2xl font-black text-[#DCCBFF] mb-4">
                Prévia do vídeo
              </h3>

              <video
                src={form.videoUrl}
                controls
                className="w-full max-h-[420px] rounded-2xl bg-black"
              />
            </div>
          )}

          <button
            onClick={saveProductVideo}
            disabled={saving}
            className="mt-8 w-full bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] py-5 rounded-2xl font-black text-lg disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar vídeo e detalhes"}
          </button>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-black text-[#DCCBFF] mb-2">
        {label}
      </span>

      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-[#B69AF8]/20 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-[#F3B4A8]"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-black text-[#DCCBFF] mb-2">
        {label}
      </span>

      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-36 bg-white/5 border border-[#B69AF8]/20 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-[#F3B4A8]"
      />
    </label>
  );
}