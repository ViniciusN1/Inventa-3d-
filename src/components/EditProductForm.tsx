"use client";

import { useState } from "react";
import "@/app/globals.css";

export default function EditProductForm({
product,
}: {
product: any;
}) {
const [saving, setSaving] = useState(false);

const [form, setForm] = useState({
...product,
images: product.images || [],
});

async function uploadImage(file: File) {
  const reader = new FileReader();

  return new Promise<void>((resolve) => {
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: reader.result,
          type: "image",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setForm((prev: any) => ({
          ...prev,
          image: prev.image || data.url,
          images: [...prev.images, data.url],
        }));
      }

      resolve();
    };
  });
}

async function save() {
try {
setSaving(true);


  const res = await fetch(
    `/api/products/${product._id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    }
  );

  const data = await res.json();

  if (data.success) {
    alert("Produto atualizado!");
  }
} finally {
  setSaving(false);
}


}

return (
  <div className="max-w-7xl mx-auto">

    <div className="mb-10">
      <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
        Inventta 3D
      </p>

      <h1 className="text-5xl font-black text-[#DCCBFF] mt-2">
        Editar Produto
      </h1>

      <p className="text-zinc-400 mt-2">
        Atualize informações, imagens e vídeos do produto.
      </p>
    </div>

    <div className="grid xl:grid-cols-[520px_1fr] gap-8">

      {/* GALERIA */}

      <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-6 h-fit">

        {form.image && (
          <img
            src={form.image}
            alt=""
            className="
            w-full
            h-[450px]
            object-contain
            bg-black/20
            rounded-[2rem]
            "
          />
        )}

        <div className="mt-6">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={async (e) => {
              const files = Array.from(
                e.target.files || []
              );

              for (const file of files) {
                await uploadImage(file);
              }
            }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">

          {form.images?.map(
            (img: string, index: number) => (
              <div
                key={index}
                className="relative"
              >

                <img
                  src={img}
                  className="
                  w-full
                  h-28
                  object-cover
                  rounded-xl
                  border
                  border-white/10
                  "
                />

                {form.image === img && (
                  <span
                    className="
                    absolute
                    top-2
                    left-2
                    bg-green-500
                    text-white
                    text-xs
                    px-2
                    py-1
                    rounded
                    font-bold
                    "
                  >
                    CAPA
                  </span>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      image: img,
                    })
                  }
                  className="
                  absolute
                  bottom-2
                  left-2
                  bg-[#B69AF8]
                  text-[#080B2A]
                  text-xs
                  px-2
                  py-1
                  rounded
                  font-bold
                  "
                >
                  Capa
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      images:
                        form.images.filter(
                          (
                            _: any,
                            i: number
                          ) => i !== index
                        ),
                    })
                  }
                  className="
                  absolute
                  top-2
                  right-2
                  bg-red-500
                  text-white
                  px-2
                  rounded
                  "
                >
                  X
                </button>

              </div>
            )
          )}

        </div>

      </div>

      {/* FORMULÁRIO */}

      <div className="space-y-6">

        <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-6">

          <h2 className="text-2xl font-black text-[#DCCBFF] mb-5">
            Informações Básicas
          </h2>

          <div className="space-y-4">

            <input
              className="input-admin"
              value={form.name}
              placeholder="Nome"
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <textarea
              className="input-admin h-40"
              value={form.description}
              placeholder="Descrição"
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
            />

          </div>

        </div>

        <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-6">

          <h2 className="text-2xl font-black text-[#DCCBFF] mb-5">
            Venda
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              className="input-admin"
              type="number"
              value={form.price}
              placeholder="Preço"
              onChange={(e) =>
                setForm({
                  ...form,
                  price: Number(
                    e.target.value
                  ),
                })
              }
            />

            <input
              className="input-admin"
              type="number"
              value={form.stock}
              placeholder="Estoque"
              onChange={(e) =>
                setForm({
                  ...form,
                  stock: Number(
                    e.target.value
                  ),
                })
              }
            />

          </div>

        </div>

        <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-6">

          <h2 className="text-2xl font-black text-[#DCCBFF] mb-5">
            Produção
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              className="input-admin"
              value={form.category || ""}
              placeholder="Categoria"
              onChange={(e) =>
                setForm({
                  ...form,
                  category:
                    e.target.value,
                })
              }
            />

            <input
              className="input-admin"
              value={form.material || ""}
              placeholder="Material"
              onChange={(e) =>
                setForm({
                  ...form,
                  material:
                    e.target.value,
                })
              }
            />

            <input
              className="input-admin"
              value={form.color || ""}
              placeholder="Cor"
              onChange={(e) =>
                setForm({
                  ...form,
                  color:
                    e.target.value,
                })
              }
            />

            <input
              className="input-admin"
              value={form.weight || ""}
              placeholder="Peso"
              onChange={(e) =>
                setForm({
                  ...form,
                  weight:
                    e.target.value,
                })
              }
            />

            <input
              className="input-admin"
              value={
                form.dimensions || ""
              }
              placeholder="Dimensões"
              onChange={(e) =>
                setForm({
                  ...form,
                  dimensions:
                    e.target.value,
                })
              }
            />

            <input
              className="input-admin"
              value={
                form.productionTime ||
                ""
              }
              placeholder="Tempo Produção"
              onChange={(e) =>
                setForm({
                  ...form,
                  productionTime:
                    e.target.value,
                })
              }
            />

          </div>

        </div>

        <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-6">

          <h2 className="text-2xl font-black text-[#DCCBFF] mb-5">
            Vídeo e Destaque
          </h2>

          <div className="space-y-4">

            <input
              className="input-admin"
              value={form.videoUrl || ""}
              placeholder="Vídeo"
              onChange={(e) =>
                setForm({
                  ...form,
                  videoUrl:
                    e.target.value,
                })
              }
            />

            <label className="flex items-center gap-3 text-white font-bold">

              <input
                type="checkbox"
                checked={
                  form.featured ||
                  false
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    featured:
                      e.target.checked,
                  })
                }
              />

              Produto em destaque

            </label>

          </div>

        </div>

        <button
          onClick={save}
          disabled={saving}
          className="
          w-full
          bg-gradient-to-r
          from-[#B69AF8]
          to-[#F3B4A8]
          text-[#080B2A]
          py-5
          rounded-2xl
          font-black
          text-lg
          hover:opacity-90
          transition
          disabled:opacity-50
          "
        >
          {saving
            ? "Salvando..."
            : "Salvar Alterações"}
        </button>

      </div>

    </div>

  </div>
);

}
