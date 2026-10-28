"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
export const dynamic = "force-dynamic";

interface CreatureFormProps {
  creature?: any;
}

export default function CreatureForm({
  creature,
}: CreatureFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: creature?.name || "",
    species: creature?.species || "",
    race: creature?.race || "",
    biome: creature?.biome || "",
    rarity: creature?.rarity || "Comum",

    hp: creature?.hp || 100,
    attack: creature?.attack || 20,
    defense: creature?.defense || 10,
    speed: creature?.speed || 5,
    level: creature?.level || 1,

    image: creature?.image || "",

    lore: creature?.lore || "",
    skills: creature?.skills || "",
    weakness: creature?.weakness || "",
    loot: creature?.loot || "",
  });

  function update(
    field: keyof typeof form,
    value: string | number
  ) {
    setForm((old) => ({
      ...old,
      [field]: value,
    }));
  }

  async function saveCreature() {
    try {
      setLoading(true);

      const url = creature
        ? `/api/admin/terra-do-veu/creatures/${creature._id}`
        : "/api/admin/terra-do-veu/creatures";

      const method = creature ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const json = await response.json();

      if (!json.success) {
        alert(json.error || "Erro");
        return;
      }

      alert("Criatura salva!");

      router.push("/admin/terra-do-veu/creatures");
      router.refresh();
    } catch {
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">

      <div className="grid md:grid-cols-2 gap-6">

        <Input
          label="Nome"
          value={form.name}
          onChange={(v: string) => update("name", v)}
        />

        <Input
          label="Espécie"
          value={form.species}
          onChange={(v: string) => update("species", v)}
        />

        <Input
          label="Raça"
          value={form.race}
          onChange={(v: string) => update("race", v)}
        />

        <Input
          label="Bioma"
          value={form.biome}
          onChange={(v: string) => update("biome", v)}
        />

        <Input
          label="Raridade"
          value={form.rarity}
          onChange={(v: string) => update("rarity", v)}
        />

        <Input
          label="Imagem (URL)"
          value={form.image}
          onChange={(v: string) => update("image", v)}
        />

      </div>

      {form.image && (
        <img
          src={form.image}
          className="w-72 rounded-3xl border border-white/10"
          alt={form.name}
        />
      )}

      <div className="grid md:grid-cols-5 gap-5">

        <NumberInput
          label="HP"
          value={form.hp}
          onChange={(v: number) => update("hp", v)}
        />

        <NumberInput
          label="Ataque"
          value={form.attack}
          onChange={(v: number) => update("attack", v)}
        />

        <NumberInput
          label="Defesa"
          value={form.defense}
          onChange={(v: number) => update("defense", v)}
        />

        <NumberInput
          label="Velocidade"
          value={form.speed}
          onChange={(v: number) => update("speed", v)}
        />

        <NumberInput
          label="Nível"
          value={form.level}
          onChange={(v: number) => update("level", v)}
        />

      </div>

      <TextArea
        label="História"
        value={form.lore}
        onChange={(v: string) => update("lore", v)}
      />

      <TextArea
        label="Habilidades"
        value={form.skills}
        onChange={(v: string) => update("skills", v)}
      />

      <TextArea
        label="Fraquezas"
        value={form.weakness}
        onChange={(v: string) => update("weakness", v)}
      />

      <TextArea
        label="Loot"
        value={form.loot}
        onChange={(v: string) => update("loot", v)}
      />

      <button
        onClick={saveCreature}
        disabled={loading}
        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 font-black hover:scale-105 duration-300"
      >
        {loading ? "Salvando..." : "Salvar Criatura"}
      </button>

    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm text-zinc-400">{label}</label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl bg-[#191F44] p-4 outline-none"
      />
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="text-sm text-zinc-400">{label}</label>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full rounded-2xl bg-[#191F44] p-4 outline-none"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm text-zinc-400">{label}</label>

      <textarea
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl bg-[#191F44] p-4 outline-none resize-none"
      />
    </div>
  );
}