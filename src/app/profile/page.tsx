"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserOrders from "@/components/UserOrders";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingUsername, setSavingUsername] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      setUser(data.user);

      setForm({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        cpf: data.user.cpf || "",

        username: data.user.username || "",
        bio: data.user.bio || "",

        cep: data.user.address?.cep || "",
        address: data.user.address?.address || "",
        number: data.user.address?.number || "",
        city: data.user.address?.city || "",
        state: data.user.address?.state || "",
      });

      setLoading(false);
    }

    loadUser();
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  async function saveProfile() {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/auth/update-profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Erro ao salvar");
      return;
    }

    alert("Perfil atualizado!");
    setEditing(false);
    location.reload();
  }

  async function saveUsername() {
    const token = localStorage.getItem("token");

    if (!token) return;

    const cleanUsername = String(form.username || "")
      .replace("@", "")
      .toLowerCase()
      .replace(/\s/g, "")
      .trim();

    if (cleanUsername.length < 3) {
      alert("O @usuario precisa ter pelo menos 3 caracteres.");
      return;
    }

    setSavingUsername(true);

    const res = await fetch("/api/auth/update-username", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: cleanUsername,
      }),
    });

    const data = await res.json();

    setSavingUsername(false);

    if (!data.success) {
      alert(data.error || "Erro ao salvar @usuario");
      return;
    }

    alert("@usuario salvo com sucesso!");
    location.reload();
  }

  function input(name: string, placeholder: string, disabled = false) {
    return (
      <input
        value={form[name] || ""}
        disabled={disabled || !editing}
        placeholder={placeholder}
        onChange={(e) =>
          setForm({
            ...form,
            [name]: e.target.value,
          })
        }
        className="
          w-full
          bg-white/5
          border
          border-[#B69AF8]/20
          rounded-2xl
          px-5
          py-4
          text-white
          placeholder:text-zinc-500
          disabled:bg-white/5
          disabled:text-zinc-300
          outline-none
          focus:border-[#F3B4A8]
          focus:shadow-[0_0_20px_rgba(182,154,248,0.18)]
          transition
        "
      />
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080B2A] flex items-center justify-center">
        <p className="text-2xl font-black text-[#DCCBFF]">
          Carregando perfil...
        </p>
      </main>
    );
  }

  const publicProfileUrl = form.username
    ? `/profile/${String(form.username).replace("@", "")}`
    : "";

  return (
    <main className="min-h-screen bg-[#080B2A] text-white p-6 relative overflow-hidden">
      <div className="absolute top-[-180px] left-[-120px] w-[420px] h-[420px] bg-[#B69AF8]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-180px] right-[-120px] w-[420px] h-[420px] bg-[#F3B4A8]/15 rounded-full blur-3xl" />

      <section className="relative z-10 max-w-6xl mx-auto">
        <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2.5rem] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#B69AF8] to-[#F3B4A8] flex items-center justify-center text-[#080B2A] font-black text-3xl">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
                  Minha conta
                </p>

                <h1 className="text-4xl md:text-5xl font-black text-[#DCCBFF] mt-2">
                  {user?.name || "Cliente"}
                </h1>

                <p className="text-zinc-400 mt-2">
                  Gerencie seus dados, endereço, pedidos e perfil público da comunidade.
                </p>

                {form.username && (
                  <p className="text-[#F3B4A8] font-black mt-3">
                    @{String(form.username).replace("@", "")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 h-fit">
              <button
                onClick={() => router.push("/")}
                className="bg-white/5 border border-[#B69AF8]/20 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-black transition"
              >
                Início
              </button>

              <button
                onClick={() => router.push("/feed")}
                className="bg-white/5 border border-[#B69AF8]/20 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-black transition"
              >
                Comunidade
              </button>

              {publicProfileUrl && (
                <Link
                  href={publicProfileUrl}
                  className="bg-white text-[#080B2A] px-6 py-4 rounded-2xl font-black transition"
                >
                  Ver perfil público
                </Link>
              )}

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] px-6 py-4 rounded-2xl font-black transition"
                >
                  Editar Perfil
                </button>
              ) : (
                <button
                  onClick={saveProfile}
                  className="bg-green-500 text-white px-6 py-4 rounded-2xl font-black transition"
                >
                  Salvar
                </button>
              )}

              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-black transition"
              >
                Sair
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-5 mt-10">
            <InfoCard icon="🖨️" title="Peças 3D" text="Pedidos personalizados" />
            <InfoCard icon="📦" title="Entregas" text="Acompanhe seus pedidos" />
            <InfoCard icon="🎥" title="Vídeos" text="Conteúdos liberados" />
            <InfoCard icon="✨" title="Exclusivos" text="Criações sob medida" />
          </div>

          <div className="mt-10 bg-white/5 border border-[#B69AF8]/20 rounded-[2rem] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
                  Comunidade
                </p>

                <h2 className="text-3xl font-black text-[#DCCBFF] mt-2">
                  Perfil público
                </h2>
              </div>

              <span className="bg-[#B69AF8]/15 text-[#DCCBFF] border border-[#B69AF8]/20 px-4 py-2 rounded-full text-sm font-black">
                Inventta Social
              </span>
            </div>

            <div className="grid md:grid-cols-[1fr_auto] gap-4">
              <label>
                <span className="block text-sm font-black text-[#F3B4A8] mb-2">
                  @usuario
                </span>

                <input
                  value={form.username || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      username: e.target.value
                        .replace("@", "")
                        .toLowerCase()
                        .replace(/\s/g, ""),
                    })
                  }
                  placeholder="ex: vinicius3d"
                  className="w-full bg-white/5 border border-[#B69AF8]/20 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-[#F3B4A8]"
                />
              </label>

              <button
                onClick={saveUsername}
                disabled={savingUsername}
                className="self-end bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] px-6 py-4 rounded-2xl font-black disabled:opacity-50"
              >
                {savingUsername ? "Salvando..." : "Salvar @"}
              </button>
            </div>

            <label className="block mt-5">
              <span className="block text-sm font-black text-[#F3B4A8] mb-2">
                Bio
              </span>

              <textarea
                value={form.bio || ""}
                disabled={!editing}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bio: e.target.value,
                  })
                }
                placeholder="Ex: gosto de miniaturas, RPG, pintura e impressão 3D..."
                className="w-full min-h-28 bg-white/5 border border-[#B69AF8]/20 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 disabled:text-zinc-300 outline-none focus:border-[#F3B4A8]"
              />
            </label>

            <p className="text-xs text-zinc-500 mt-3">
              O @usuario será usado em menções, perfil público e comunidade.
            </p>
          </div>

          <div className="mt-8 bg-white/5 border border-[#B69AF8]/20 rounded-[2rem] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
                  Dados pessoais
                </p>

                <h2 className="text-3xl font-black text-[#DCCBFF] mt-2">
                  Informações da conta
                </h2>
              </div>

              {!editing && (
                <span className="bg-green-500/15 text-green-300 border border-green-500/20 px-4 py-2 rounded-full text-sm font-black">
                  Protegido
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {input("name", "Nome completo")}
              {input("email", "Email", true)}
              {input("phone", "Telefone")}
              {input("cpf", "CPF")}
            </div>
          </div>

          <div className="mt-8 bg-white/5 border border-[#B69AF8]/20 rounded-[2rem] p-6">
            <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
              Entrega
            </p>

            <h2 className="text-3xl font-black text-[#DCCBFF] mt-2 mb-6">
              Endereço de entrega
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              {input("cep", "CEP")}
              {input("address", "Rua / Avenida")}
              {input("number", "Número")}
              {input("city", "Cidade")}
              {input("state", "Estado")}
            </div>
          </div>

          <div className="mt-10">
            <UserOrders />
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
      <p className="text-3xl">{icon}</p>

      <p className="font-black mt-3 text-[#DCCBFF]">
        {title}
      </p>

      <p className="text-zinc-400 text-sm mt-1">
        {text}
      </p>
    </div>
  );
}