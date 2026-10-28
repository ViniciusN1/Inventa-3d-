"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsClient() {
  const [form, setForm] = useState<any>({
    storeName: "",
    slogan: "",
    whatsapp: "",
    instagram: "",
    siteUrl: "",

    deliveryMS: 0,
    deliverySP: 0,
    deliveryBR: 0,
    freeShippingFrom: 0,

    pixEnabled: true,
    cardEnabled: true,
    mercadoPagoEnabled: true,

    metaEnabled: false,
    whatsappBusinessEnabled: false,
    instagramEnabled: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadSettings() {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();

      if (data.success && data.settings) {
        setForm({
          ...form,
          ...data.settings,
        });
      }
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Erro ao salvar");
        return;
      }

      alert("Configurações salvas!");
    } catch (error) {
      console.log(error);
      alert("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function update(name: string, value: any) {
    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  }

  if (loading) {
    return (
      <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-10 text-center">
        <p className="text-2xl font-black text-[#DCCBFF]">
          Carregando configurações...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Section
        title="Loja"
        description="Dados principais usados no site, WhatsApp e identidade da marca."
      >
        <div className="grid md:grid-cols-2 gap-5">
          <Field
            label="Nome da loja"
            value={form.storeName}
            onChange={(value) => update("storeName", value)}
            placeholder="Inventta 3D"
          />

          <Field
            label="Slogan"
            value={form.slogan}
            onChange={(value) => update("slogan", value)}
            placeholder="Ideias que ganham forma"
          />

          <Field
            label="WhatsApp"
            value={form.whatsapp}
            onChange={(value) => update("whatsapp", value)}
            placeholder="5567992730601"
          />

          <Field
            label="Instagram"
            value={form.instagram}
            onChange={(value) => update("instagram", value)}
            placeholder="inventta.3dd"
          />

          <Field
            label="Site"
            value={form.siteUrl}
            onChange={(value) => update("siteUrl", value)}
            placeholder="https://inventta3d.com.br"
          />
        </div>
      </Section>

      <Section
        title="Frete"
        description="Valores usados no checkout para calcular entrega."
      >
        <div className="grid md:grid-cols-4 gap-5">
          <Field
            label="Frete MS"
            type="number"
            value={form.deliveryMS}
            onChange={(value) => update("deliveryMS", value)}
            placeholder="19.90"
          />

          <Field
            label="Frete SP"
            type="number"
            value={form.deliverySP}
            onChange={(value) => update("deliverySP", value)}
            placeholder="24.90"
          />

          <Field
            label="Frete Brasil"
            type="number"
            value={form.deliveryBR}
            onChange={(value) => update("deliveryBR", value)}
            placeholder="34.90"
          />

          <Field
            label="Frete grátis acima de"
            type="number"
            value={form.freeShippingFrom}
            onChange={(value) => update("freeShippingFrom", value)}
            placeholder="299"
          />
        </div>
      </Section>

      <Section
        title="Pagamento"
        description="Controle quais métodos aparecem no checkout."
      >
        <div className="grid md:grid-cols-3 gap-5">
          <Toggle
            label="PIX"
            checked={form.pixEnabled}
            onChange={(value) => update("pixEnabled", value)}
          />

          <Toggle
            label="Cartão"
            checked={form.cardEnabled}
            onChange={(value) => update("cardEnabled", value)}
          />

          <Toggle
            label="Mercado Pago"
            checked={form.mercadoPagoEnabled}
            onChange={(value) => update("mercadoPagoEnabled", value)}
          />
        </div>
      </Section>

      <Section
        title="Integrações"
        description="Preparação para Meta, WhatsApp Business e Instagram."
      >
        <div className="grid md:grid-cols-3 gap-5">
          <Toggle
            label="Meta"
            checked={form.metaEnabled}
            onChange={(value) => update("metaEnabled", value)}
          />

          <Toggle
            label="WhatsApp Business"
            checked={form.whatsappBusinessEnabled}
            onChange={(value) => update("whatsappBusinessEnabled", value)}
          />

          <Toggle
            label="Instagram"
            checked={form.instagramEnabled}
            onChange={(value) => update("instagramEnabled", value)}
          />
        </div>
      </Section>

      <button
        onClick={saveSettings}
        disabled={saving}
        className="w-full bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] py-5 rounded-2xl font-black text-lg disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Salvar configurações"}
      </button>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-8">
      <h2 className="text-3xl font-black text-[#DCCBFF]">
        {title}
      </h2>

      <p className="text-zinc-400 mt-2 mb-8">
        {description}
      </p>

      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: any;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-black text-[#F3B4A8] mb-2">
        {label}
      </span>

      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-[#B69AF8]/20 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-[#F3B4A8]"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        text-left rounded-2xl p-5 border transition
        ${
          checked
            ? "bg-green-500/15 border-green-400/30 text-green-300"
            : "bg-white/5 border-white/10 text-zinc-400"
        }
      `}
    >
      <p className="font-black text-lg">
        {checked ? "✅" : "⚪"} {label}
      </p>

      <p className="text-sm mt-2 opacity-80">
        {checked ? "Ativado" : "Desativado"}
      </p>
    </button>
  );
}