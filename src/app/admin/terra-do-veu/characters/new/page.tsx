"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";

export default function NewCharacterPage() {
  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    description: "",
    history: "",
    image: "",
    category: "Heroi",
    race: "",
    class: "",
    faction: "",
    region: "",
    rarity: "Comum",
    level: 1,
    hp: 100,
    attack: 10,
    defense: 10,
    speed: 10,
    magic: 0,
    featured: false,
    isHero: true,
    isBoss: false,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  }

  async function saveCharacter() {
    console.log(form);

    alert("Na próxima etapa iremos salvar no MongoDB.");
  }

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <p className="uppercase tracking-[6px] text-purple-300 text-sm font-bold">
            Terra do Véu
          </p>

          <h1 className="text-5xl font-black mt-2">
            Novo Personagem
          </h1>

        </div>

        <Link
          href="/admin/terra-do-veu/characters"
          className="px-5 py-3 rounded-xl bg-white/10"
        >
          Voltar
        </Link>

      </div>

      <div className="rounded-3xl bg-[#111633] border border-white/10 p-8 space-y-8">

        <div className="grid md:grid-cols-2 gap-6">

          <Input
            label="Nome"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            label="Subtítulo"
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
          />

        </div>

        <Input
          label="Imagem (URL)"
          name="image"
          value={form.image}
          onChange={handleChange}
        />

        <div>

          <label className="font-bold block mb-2">
            Descrição
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-xl bg-[#1A2148] border border-white/10 p-4"
          />

        </div>

        <div>

          <label className="font-bold block mb-2">
            História
          </label>

          <textarea
            name="history"
            value={form.history}
            onChange={handleChange}
            rows={8}
            className="w-full rounded-xl bg-[#1A2148] border border-white/10 p-4"
          />

        </div>

        <div className="grid md:grid-cols-3 gap-5">

          <Input
            label="Raça"
            name="race"
            value={form.race}
            onChange={handleChange}
          />

          <Input
            label="Classe"
            name="class"
            value={form.class}
            onChange={handleChange}
          />

          <Input
            label="Facção"
            name="faction"
            value={form.faction}
            onChange={handleChange}
          />

          <Input
            label="Região"
            name="region"
            value={form.region}
            onChange={handleChange}
          />

          <Input
            label="Nível"
            name="level"
            type="number"
            value={form.level}
            onChange={handleChange}
          />

          <select
            name="rarity"
            value={form.rarity}
            onChange={handleChange}
            className="rounded-xl bg-[#1A2148] border border-white/10 p-4"
          >
            <option>Comum</option>
            <option>Raro</option>
            <option>Épico</option>
            <option>Lendário</option>
          </select>

        </div>

        <div className="grid md:grid-cols-5 gap-5">

          <Input
            label="HP"
            name="hp"
            type="number"
            value={form.hp}
            onChange={handleChange}
          />

          <Input
            label="Ataque"
            name="attack"
            type="number"
            value={form.attack}
            onChange={handleChange}
          />

          <Input
            label="Defesa"
            name="defense"
            type="number"
            value={form.defense}
            onChange={handleChange}
          />

          <Input
            label="Velocidade"
            name="speed"
            type="number"
            value={form.speed}
            onChange={handleChange}
          />

          <Input
            label="Magia"
            name="magic"
            type="number"
            value={form.magic}
            onChange={handleChange}
          />

        </div>

        <div className="flex gap-8">

          <label className="flex gap-2 items-center">

            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />

            Destaque

          </label>

          <label className="flex gap-2 items-center">

            <input
              type="checkbox"
              name="isHero"
              checked={form.isHero}
              onChange={handleChange}
            />

            Herói

          </label>

          <label className="flex gap-2 items-center">

            <input
              type="checkbox"
              name="isBoss"
              checked={form.isBoss}
              onChange={handleChange}
            />

            Chefe

          </label>

        </div>

        <button
          onClick={saveCharacter}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 font-black text-xl"
        >
          Salvar Personagem
        </button>

      </div>

    </div>
  );
}

function Input({
  label,
  ...props
}: any) {
  return (
    <div>

      <label className="block mb-2 font-bold">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl bg-[#1A2148] border border-white/10 p-4"
      />

    </div>
  );
}