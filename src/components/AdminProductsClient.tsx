"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  "Geek",
  "Infantil",
  "Decoração",
  "Miniaturas",
  "RPG",
  "Chaveiros",
  "Personalizados",
  "Terra do Véu",
];

const materials = [
  "PLA",
  "PETG",
  "ABS",
  "Resina",
  "PLA Madeira",
  "PLA Silk",
  "PLA Fosco",
];

export default function AdminProductsClient({
  products,
}: {
  products: any[];
}) {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [form, setForm] = useState({
  name: "",
  description: "",
  price: "",
  image: "",
  images: [] as string[],
  stock: "",
  category: "",
  material: "",
  color: "",
  dimensions: "",
  weight: "",
  productionTime: "",
  supplier: "",
  videoUrl: "",
  featured: false,
});

async function uploadImageToGallery(file: File) {
  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onloadend = async () => {
    try {
      setUploadingImage(true);

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

      if (!data.success) {
        alert("Erro ao enviar imagem");
        return;
      }

      setForm((prev: any) => ({
        ...prev,
        image: prev.image || data.url,
        images: [...(prev.images || []), data.url],
      }));
    } catch (error) {
      console.log(error);
      alert("Erro ao enviar imagem");
    } finally {
      setUploadingImage(false);
    }
  };
}

  async function uploadFile(file: File, type: "image" | "video") {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      try {
        type === "image"
          ? setUploadingImage(true)
          : setUploadingVideo(true);

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file: reader.result,
            type,
          }),
        });

        const data = await res.json();

        if (!data.success) {
          alert(data.error || "Erro no upload");
          return;
        }

        setForm((prev) => ({
          ...prev,
          [type === "image" ? "image" : "videoUrl"]: data.url,
        }));
      } catch {
        alert("Erro ao enviar arquivo");
      } finally {
        setUploadingImage(false);
        setUploadingVideo(false);
      }
    };
  }

  async function createProduct() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          images: form.images,
          image: form.images[0] || form.image,
          price: Number(form.price),
          stock: Number(form.stock),
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Erro ao criar produto");
        return;
      }

      alert("Produto criado!");
      location.reload();
    } catch {
      alert("Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: string) {
    const confirmDelete = confirm("Deseja excluir este produto?");

    if (!confirmDelete) return;

    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    location.reload();
  }
  

  async function updateStock(id: string, stock: number) {
    const newStock = Math.max(0, stock);

    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stock: newStock,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Erro ao atualizar estoque");
      return;
    }

    location.reload();
  }

  return (
    <div className="grid xl:grid-cols-[520px_1fr] gap-10">
      {/* FORM */}
      <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-8 h-fit">
        <p className="text-[#F3B4A8] text-sm font-bold uppercase tracking-widest">
          Cadastro
        </p>

        <h2 className="text-4xl font-black mt-2 text-[#DCCBFF]">
          Novo Produto 3D
        </h2>

        <div className="space-y-5 mt-8">
          <input
            placeholder="Nome do produto"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="input-admin"
          />

          <textarea
            placeholder="Descrição"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className="input-admin h-40"
          />

          <div className="grid md:grid-cols-2 gap-5">
            <input
              placeholder="Preço"
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value,
                })
              }
              className="input-admin"
            />

            <input
              placeholder="Estoque"
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({
                  ...form,
                  stock: e.target.value,
                })
              }
              className="input-admin"
            />
          </div>

          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
            className="input-admin"
          >
            <option value="">Categoria</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={form.material}
            onChange={(e) =>
              setForm({
                ...form,
                material: e.target.value,
              })
            }
            className="input-admin"
          >
            <option value="">Material</option>
            {materials.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <div className="grid md:grid-cols-2 gap-5">
            <input
              placeholder="Cor principal"
              value={form.color}
              onChange={(e) =>
                setForm({
                  ...form,
                  color: e.target.value,
                })
              }
              className="input-admin"
            />

            <input
              placeholder="Tempo de produção"
              value={form.productionTime}
              onChange={(e) =>
                setForm({
                  ...form,
                  productionTime: e.target.value,
                })
              }
              className="input-admin"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <input
              placeholder="Dimensões. Ex: 10x8x6cm"
              value={form.dimensions}
              onChange={(e) =>
                setForm({
                  ...form,
                  dimensions: e.target.value,
                })
              }
              className="input-admin"
            />

            <input
              placeholder="Peso. Ex: 120g"
              value={form.weight}
              onChange={(e) =>
                setForm({
                  ...form,
                  weight: e.target.value,
                })
              }
              className="input-admin"
            />
          </div>

          <input
            placeholder="Fornecedor / Observação"
            value={form.supplier}
            onChange={(e) =>
              setForm({
                ...form,
                supplier: e.target.value,
              })
            }
            className="input-admin"
          />

          {/* UPLOAD IMAGEM */}
          <div className="upload-box">
            <p className="font-bold text-white mb-4">
              Imagem do produto
            </p>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);

                for (const file of files) {
                  await uploadImageToGallery(file);
                }
              }}
            />

            {uploadingImage && (
              <p className="mt-3 text-[#F3B4A8]">
                Enviando imagem...
              </p>
            )}

           {form.images.length > 0 && (
  <div className="grid grid-cols-3 gap-3 mt-4">
    {form.images.map((img: string, index: number) => (
      <div key={index} className="relative">
        <img
          src={img}
          className="w-full h-28 object-cover rounded-xl"
        />

        <button
          type="button"
          onClick={() =>
            setForm((prev: any) => ({
              ...prev,
              images: prev.images.filter(
                (_: any, i: number) => i !== index
              ),
            }))
          }
          className="absolute top-1 right-1 bg-red-500 text-white px-2 rounded"
        >
          X
        </button>
      </div>
    ))}
  </div>
)}
          </div>

          {/* UPLOAD VIDEO */}
          <div className="upload-box">
            <p className="font-bold text-white mb-4">
              Vídeo tutorial / demonstração
            </p>

            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFile(file, "video");
              }}
              className="text-zinc-400"
            />

            {uploadingVideo && (
              <p className="mt-3 text-[#F3B4A8]">
                Enviando vídeo...
              </p>
            )}

            {form.videoUrl && (
              <video
                src={form.videoUrl}
                controls
                className="mt-5 rounded-2xl max-h-60"
              />
            )}
          </div>

          <label className="flex items-center gap-3 text-white font-bold">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm({
                  ...form,
                  featured: e.target.checked,
                })
              }
            />

            Produto em destaque
          </label>

          <button
            onClick={createProduct}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] py-5 rounded-2xl font-black text-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar Produto"}
          </button>
        </div>
      </div>

      {/* LISTA */}
      <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-8">
        <p className="text-[#F3B4A8] text-sm font-bold uppercase tracking-widest">
          Catálogo
        </p>

        <h2 className="text-4xl font-black mt-2 text-[#DCCBFF]">
          Produtos Cadastrados
        </h2>

        <div className="space-y-5 max-h-[1400px] overflow-auto pr-2 mt-8">
          {products.map((product) => {
            const stock = Number(product.stock || 0);

            return (
              <div
                key={product._id}
                className="bg-white/5 border border-[#B69AF8]/20 rounded-[2rem] p-5 flex gap-5"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-28 h-28 object-contain bg-black/30 rounded-2xl p-3"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-black text-xl text-white">
                        {product.name}
                      </h3>

                      <p className="text-zinc-400 text-sm mt-1">
                        {product.category || "Sem categoria"}
                      </p>
                    </div>

                    {product.featured && (
                      <span className="bg-[#B69AF8]/20 text-[#DCCBFF] px-3 py-2 rounded-full text-xs font-black">
                        DESTAQUE
                      </span>
                    )}
                  </div>

                  <p className="text-zinc-400 line-clamp-2 mt-3">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="tag-admin">
                      R$ {Number(product.price || 0).toFixed(2)}
                    </span>

                    <span className="tag-admin">
                      {product.material || "Material não informado"}
                    </span>

                    <span className="tag-admin">
                      Cor: {product.color || "-"}
                    </span>

                    <span className="tag-admin">
                      Produção: {product.productionTime || "-"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-5">
                    <button
                      onClick={() =>
                        updateStock(product._id, stock - 1)
                      }
                      className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black"
                    >
                      -
                    </button>

                    <span className="bg-black/30 border border-white/10 px-5 py-3 rounded-xl font-black text-white">
                      Estoque: {stock}
                    </span>

                    <button
                      onClick={() =>
                        updateStock(product._id, stock + 1)
                      }
                      className="w-10 h-10 rounded-xl bg-green-500 hover:bg-green-600 text-white font-black"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-5">
                    {product.videoUrl && (
                      <a
                        href={product.videoUrl}
                        target="_blank"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
                      >
                        Ver vídeo
                      </a>
                    )}

                    <button
                      onClick={() =>
                        deleteProduct(product._id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-bold"
                    >
                      Excluir
                    </button>
                      <Link href={`/admin/products/${product._id}`}
                        className="bg-blue-600 px-4 py-2 rounded-xl"
                        >
                      Editar
                      </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .input-admin {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(182, 154, 248, 0.2);
          border-radius: 1rem;
          padding: 1rem 1.25rem;
          color: white;
          outline: none;
        }

        .input-admin::placeholder {
          color: #a1a1aa;
        }

        .input-admin:focus {
          border-color: #f3b4a8;
        }

        .input-admin option {
          background: #080b2a;
          color: white;
        }

        .upload-box {
          background: rgba(255, 255, 255, 0.05);
          border: 1px dashed rgba(182, 154, 248, 0.3);
          border-radius: 1rem;
          padding: 1.25rem;
        }

        .tag-admin {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.5rem 0.75rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          color: #e4e4e7;
        }
      `}</style>
    </div>
  );
}