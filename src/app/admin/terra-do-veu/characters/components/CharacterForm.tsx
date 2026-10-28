"use client";

import { useState } from "react";
export const dynamic = "force-dynamic";

export interface Character {
  _id?: string;

  name: string;
  subtitle: string;

  image: string;
  biography: string;

  race: string;
  faction: string;
  class: string;

  level: number;

  hp: number;
  mana: number;

  attack: number;
  defense: number;

  rarity: string;

  printable: boolean;
  store: boolean;

  price: number;
}

interface CharacterFormProps {
  initialData?: Partial<Character>;
  loading?: boolean;
  onSubmit: (character: Character) => Promise<void>;
}

export default function CharacterForm({
  initialData,
  loading = false,
  onSubmit,
}: CharacterFormProps) {
  const [character, setCharacter] = useState<Character>({
    name: "",
    subtitle: "",
    image: "",
    biography: "",

    race: "",
    faction: "",
    class: "",

    level: 1,

    hp: 100,
    mana: 50,

    attack: 10,
    defense: 10,

    rarity: "Comum",

    printable: true,
    store: true,

    price: 0,

    ...initialData,
  });

  function update<K extends keyof Character>(
    field: K,
    value: Character[K]
  ) {
    setCharacter((old) => ({
      ...old,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    await onSubmit(character);
  }

  return (
    <div className="space-y-8">

      {/* Informações */}

      <div className="rounded-3xl bg-[#111633] border border-white/10 p-8">

        <h2 className="text-2xl font-black mb-8">
          Informações Gerais
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <Input
            label="Nome"
            value={character.name}
            onChange={(value) => update("name", value)}
          />

          <Input
            label="Subtítulo"
            value={character.subtitle}
            onChange={(value) => update("subtitle", value)}
          />

          <Input
            label="Imagem"
            value={character.image}
            onChange={(value) => update("image", value)}
          />

          <Input
            label="Raça"
            value={character.race}
            onChange={(value) => update("race", value)}
          />

          <Input
            label="Classe"
            value={character.class}
            onChange={(value) => update("class", value)}
          />

          <Input
            label="Facção"
            value={character.faction}
            onChange={(value) => update("faction", value)}
          />

        </div>

      </div>

      {/* História */}

      <div className="rounded-3xl bg-[#111633] border border-white/10 p-8">

        <h2 className="text-2xl font-black mb-6">
          História
        </h2>

        <textarea
          rows={10}
          value={character.biography}
          onChange={(e) =>
            update("biography", e.target.value)
          }
          className="w-full rounded-2xl bg-[#1A2146] p-5 outline-none"
        />

      </div>

      {/* Status */}

      <div className="rounded-3xl bg-[#111633] border border-white/10 p-8">

        <h2 className="text-2xl font-black mb-8">
          Atributos
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <NumberInput
            label="Level"
            value={character.level}
            onChange={(value) => update("level", value)}
          />

          <NumberInput
            label="HP"
            value={character.hp}
            onChange={(value) => update("hp", value)}
          />

          <NumberInput
            label="Mana"
            value={character.mana}
            onChange={(value) => update("mana", value)}
          />

          <NumberInput
            label="Ataque"
            value={character.attack}
            onChange={(value) => update("attack", value)}
          />

          <NumberInput
            label="Defesa"
            value={character.defense}
            onChange={(value) => update("defense", value)}
          />

          <Input
            label="Raridade"
            value={character.rarity}
            onChange={(value) => update("rarity", value)}
          />

        </div>

      </div>

      {/* Loja */}

      <div className="rounded-3xl bg-[#111633] border border-white/10 p-8">

        <h2 className="text-2xl font-black mb-8">
          Loja
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <NumberInput
            label="Preço"
            value={character.price}
            onChange={(value) => update("price", value)}
          />

          <CheckBox
            label="Disponível na Loja"
            checked={character.store}
            onChange={(value) => update("store", value)}
          />

          <CheckBox
            label="Modelo para Impressão"
            checked={character.printable}
            onChange={(value) => update("printable", value)}
          />

        </div>

      </div>

      <button
        disabled={loading}
        onClick={handleSubmit}
        className="
          w-full
          rounded-2xl
          bg-gradient-to-r
          from-violet-600
          to-pink-600
          py-5
          text-xl
          font-black
          disabled:opacity-50
        "
      >
        {loading ? "Salvando..." : "Salvar Personagem"}
      </button>

    </div>
  );
}

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function Input({
  label,
  value,
  onChange,
}: InputProps) {
  return (
    <div>

      <label className="block text-sm text-zinc-400 mb-2">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-xl
          bg-[#1A2146]
          p-4
          outline-none
          border border-white/10
        "
      />

    </div>
  );
}

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function NumberInput({
  label,
  value,
  onChange,
}: NumberInputProps) {
  return (
    <div>

      <label className="block text-sm text-zinc-400 mb-2">
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="
          w-full
          rounded-xl
          bg-[#1A2146]
          p-4
          outline-none
          border border-white/10
        "
      />

    </div>
  );
}

interface CheckBoxProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function CheckBox({
  label,
  checked,
  onChange,
}: CheckBoxProps) {
  return (
    <label className="flex items-center gap-3 mt-8 cursor-pointer">

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(e.target.checked)
        }
      />

      <span>{label}</span>

    </label>
  );
}