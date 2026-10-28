"use client";

import { useEffect, useState } from "react";

interface Props {
  onComplete: (data: any) => void;
  initialData?: any;
}

export default function CheckoutForm({
  onComplete,
  initialData,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    cep: "",
    address: "",
    number: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...form,
        ...initialData,
      });
    }
  }, []);

  useEffect(() => {
    const completed =
      form.name &&
      form.email &&
      form.phone &&
      form.cpf &&
      form.cep &&
      form.address &&
      form.number &&
      form.city &&
      form.state;

    if (completed) {
      onComplete(form);
    }
  }, [form]);

  async function handleCep(
    cep: string
  ) {
    const cleanCep =
      cep.replace(/\D/g, "");

    if (
      cleanCep.length !== 8
    )
      return;

    try {
      const res = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );

      const data =
        await res.json();

      if (data.erro) return;

      setForm((prev) => ({
        ...prev,
        cep,
        address: data.logradouro,
        city: data.localidade,
        state: data.uf,
      }));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="space-y-8">
      {/* DADOS */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(255,79,163,0.25)]">
            👤
          </div>

          <div>
            <h2 className="text-3xl font-black text-white">
              Dados pessoais
            </h2>

            <p className="text-zinc-400 text-sm mt-1">
              Informações do comprador.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <input
            placeholder="Nome completo"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target.value,
              })
            }
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-pink-500"
          />

          <input
            placeholder="CPF"
            value={form.cpf}
            onChange={(e) =>
              setForm({
                ...form,
                cpf:
                  e.target.value,
              })
            }
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-pink-500"
          />

          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target.value,
              })
            }
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-pink-500"
          />

          <input
            placeholder="Telefone"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone:
                  e.target.value,
              })
            }
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-pink-500"
          />
        </div>
      </div>

      {/* ENTREGA */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(255,79,163,0.25)]">
            📦
          </div>

          <div>
            <h2 className="text-3xl font-black text-white">
              Entrega
            </h2>

            <p className="text-zinc-400 text-sm mt-1">
              Endereço para envio.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <input
            placeholder="CEP"
            value={form.cep}
            onChange={(e) => {
              setForm({
                ...form,
                cep:
                  e.target.value,
              });

              handleCep(
                e.target.value
              );
            }}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-pink-500"
          />

          <input
            placeholder="Número"
            value={form.number}
            onChange={(e) =>
              setForm({
                ...form,
                number:
                  e.target.value,
              })
            }
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-pink-500"
          />

          <input
            placeholder="Endereço"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address:
                  e.target.value,
              })
            }
            className="md:col-span-2 w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-pink-500"
          />

          <input
            placeholder="Cidade"
            value={form.city}
            onChange={(e) =>
              setForm({
                ...form,
                city:
                  e.target.value,
              })
            }
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-pink-500"
          />

          <input
            placeholder="Estado"
            value={form.state}
            onChange={(e) =>
              setForm({
                ...form,
                state:
                  e.target.value,
              })
            }
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-pink-500"
          />
        </div>
      </div>

      {/* INFO */}
      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">
            🔒
          </div>

          <div>
            <h3 className="text-xl font-black text-white">
              Compra protegida
            </h3>

            <p className="text-zinc-400 mt-2 leading-relaxed">
              Seus dados são utilizados apenas para processamento do pedido e entrega discreta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}