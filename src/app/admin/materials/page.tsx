"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    unit: "unidade",
    quantity: "",
    price: "",
  });

  async function loadMaterials() {
    try {
      const res = await fetch("/api/materials", {
        cache: "no-store",
      });

      const data = await res.json();

      setMaterials(data.materials || []);
    } catch {
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMaterials();
  }, []);

  async function saveMaterial() {
    const res = await fetch("/api/materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Erro ao salvar material");
      return;
    }

    setForm({
      name: "",
      unit: "unidade",
      quantity: "",
      price: "",
    });

    loadMaterials();
  }

  async function deleteMaterial(id: string) {
    if (!confirm("Excluir este material?")) return;

    const res = await fetch(`/api/materials?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Erro ao excluir");
      return;
    }

    loadMaterials();
  }

  function money(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <main className="min-h-screen bg-[#07070A] text-white p-6 lg:p-8">
      <AdminSidebar />

      <section className="max-w-7xl mx-auto pt-24">
        <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
          Estoque
        </p>

        <h1 className="text-5xl font-black text-[#DCCBFF] mt-3">
          Materiais
        </h1>

        <p className="text-zinc-400 mt-3">
          Cadastre filamentos, imãs, LEDs, embalagens e outros itens usados na produção.
        </p>

        <div className="grid lg:grid-cols-[420px_1fr] gap-8 mt-10">
          <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-6 h-fit">
            <h2 className="text-3xl font-black text-[#DCCBFF]">
              Novo material
            </h2>

            <div className="space-y-4 mt-6">
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Nome do material"
                className="input-admin"
              />

              <select
                value={form.unit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    unit: e.target.value,
                  })
                }
                className="input-admin"
              >
                <option value="unidade">Unidade</option>
                <option value="g">Gramas</option>
                <option value="kg">Quilo</option>
                <option value="ml">ML</option>
                <option value="m">Metro</option>
                <option value="pacote">Pacote</option>
              </select>

              <input
                type="number"
                value={form.quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity: e.target.value,
                  })
                }
                placeholder="Quantidade comprada. Ex: 100, 1000, 1"
                className="input-admin"
              />

              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value,
                  })
                }
                placeholder="Preço total pago. Ex: 80"
                className="input-admin"
              />

              <button
                onClick={saveMaterial}
                className="w-full bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] px-6 py-4 rounded-2xl font-black"
              >
                Salvar material
              </button>
            </div>
          </div>

          <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-6">
            <h2 className="text-3xl font-black text-[#DCCBFF]">
              Materiais cadastrados
            </h2>

            {loading ? (
              <p className="text-zinc-400 mt-6">
                Carregando materiais...
              </p>
            ) : materials.length === 0 ? (
              <p className="text-zinc-400 mt-6">
                Nenhum material cadastrado ainda.
              </p>
            ) : (
              <div className="space-y-4 mt-6">
                {materials.map((material) => (
                  <div
                    key={material._id}
                    className="bg-white/5 border border-[#B69AF8]/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="text-xl font-black text-white">
                        {material.name}
                      </h3>

                      <p className="text-zinc-400 text-sm mt-1">
                        Compra: {material.quantity} {material.unit} por{" "}
                        {money(Number(material.price || 0))}
                      </p>

                      <p className="text-[#F3B4A8] font-black mt-2">
                        Custo unitário: {money(Number(material.unitCost || 0))}
                      </p>

                      <p className="text-zinc-300 text-sm mt-1">
                        Estoque atual: {material.stock} {material.unit}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteMaterial(material._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-black"
                    >
                      Excluir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

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
          color: #71717a;
        }

        .input-admin:focus {
          border-color: #f3b4a8;
        }

        .input-admin option {
          background: #080b2a;
          color: white;
        }
      `}</style>
    </main>
  );
}