"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  _id: string;
  name: string;
};

type Material = {
  _id: string;
  name: string;
  unit: string;
  unitCost: number;
};

const salesChannels = [
  { name: "Site Próprio", fee: 0 },
  { name: "Shopee", fee: 14 },
  { name: "Mercado Livre", fee: 16 },
];

const paymentMethods = [
  { name: "Pix Mercado Pago", fee: 0.99 },
  { name: "Cartão Mercado Pago", fee: 4.99 },
  { name: "Dinheiro / Transferência", fee: 0 },
];

export default function PriceCalculator3D({
  products = [],
}: {
  products?: Product[];
}) {
  const [materials, setMaterials] = useState<Material[]>([]);

  const [weight, setWeight] = useState("77");
  const [filamentId, setFilamentId] = useState("");

  const [printHours, setPrintHours] = useState("9");
  const [printMinutes, setPrintMinutes] = useState("0");
  const [printerPowerW, setPrinterPowerW] = useState("110");
  const [energyKwhPrice, setEnergyKwhPrice] = useState("0.79");

  const [profitMargin, setProfitMargin] = useState("100");
  const [selectedChannel, setSelectedChannel] = useState("Shopee");
  const [selectedPayment, setSelectedPayment] = useState("Pix Mercado Pago");

  const [productId, setProductId] = useState("");
  const [applyToProduct, setApplyToProduct] = useState(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMaterials();
  }, []);

  async function loadMaterials() {
    try {
      const res = await fetch("/api/materials", { cache: "no-store" });
      const data = await res.json();
      setMaterials(data.materials || []);
    } catch {
      setMaterials([]);
    }
  }

  const filament = materials.find((m) => m._id === filamentId);

  const channel =
    salesChannels.find((item) => item.name === selectedChannel) ||
    salesChannels[0];

  const payment =
    paymentMethods.find((item) => item.name === selectedPayment) ||
    paymentMethods[0];

  const result = useMemo(() => {
    const weightGrams = Number(weight || 0);

    const totalHours =
      Number(printHours || 0) + Number(printMinutes || 0) / 60;

    const watts = Number(printerPowerW || 0);
    const kwhPrice = Number(energyKwhPrice || 0);
    const profitPercent = Number(profitMargin || 0);

    const filamentCost =
      Number(filament?.unitCost || 0) * weightGrams;

    const energyConsumed = (watts / 1000) * totalHours;
    const energyCost = energyConsumed * kwhPrice;

    const baseCost = filamentCost + energyCost;

    const desiredProfit = baseCost * (profitPercent / 100);
    const priceBeforeFees = baseCost + desiredProfit;

    const totalFeePercent = channel.fee + payment.fee;

    const finalPrice =
      totalFeePercent >= 100
        ? priceBeforeFees
        : priceBeforeFees / (1 - totalFeePercent / 100);

    const channelCost = finalPrice * (channel.fee / 100);
    const paymentCost = finalPrice * (payment.fee / 100);

    const realProfit =
      finalPrice - baseCost - channelCost - paymentCost;

    const channelResults = salesChannels.map((salesChannel) => {
      const feeTotal = salesChannel.fee + payment.fee;

      const price =
        feeTotal >= 100
          ? priceBeforeFees
          : priceBeforeFees / (1 - feeTotal / 100);

      return {
        name: salesChannel.name,
        fee: salesChannel.fee,
        price,
      };
    });

    return {
      weightGrams,
      totalHours,
      filamentCost,
      energyConsumed,
      energyCost,
      baseCost,
      desiredProfit,
      priceBeforeFees,
      channelCost,
      paymentCost,
      finalPrice,
      realProfit,
      channelResults,
    };
  }, [
    weight,
    printHours,
    printMinutes,
    printerPowerW,
    energyKwhPrice,
    profitMargin,
    filament,
    channel,
    payment,
  ]);

  function money(value: number) {
    return Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  async function saveCalculation() {
    setSaving(true);

    try {
      const selectedProduct = products.find((p) => p._id === productId);

      const materialsUsed = filament
        ? [
            {
              materialId: filament._id,
              name: filament.name,
              unit: filament.unit,
              unitCost: filament.unitCost,
              used: Number(weight || 0),
              totalCost: result.filamentCost,
            },
          ]
        : [];

      const res = await fetch("/api/admin/price-calculations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          productName: selectedProduct?.name || "",
          weight: Number(weight || 0),

          printHours: result.totalHours,
          printHoursInput: Number(printHours || 0),
          printMinutesInput: Number(printMinutes || 0),

          printerPower: Number(printerPowerW || 0) / 1000,
          printerPowerW: Number(printerPowerW || 0),
          energyKwhPrice,

          packagingCost: 0,
          finishCost: 0,
          extraCost: 0,
          profitMargin,

          salesChannelName: channel.name,
          salesChannelFee: channel.fee,
          paymentName: payment.name,
          paymentFee: payment.fee,

          materials: materialsUsed,
          result,
          note,
          applyToProduct,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Erro ao salvar cálculo");
        return;
      }

      alert("Cálculo salvo com sucesso!");
    } catch (error) {
      console.log(error);
      alert("Erro ao salvar cálculo");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-8 text-white">
      <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
        Balanço de preço
      </p>

      <h2 className="text-4xl font-black text-[#DCCBFF] mt-2">
        Calculadora de Preço 3D
      </h2>

      <p className="text-zinc-400 mt-3">
        Escolha o filamento, informe o peso da peça e o tempo de impressão.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Field label="Peso da peça (gramas)" value={weight} setValue={setWeight} />
        <Field label="Consumo da impressora (W)" value={printerPowerW} setValue={setPrinterPowerW} />
        <Field label="Horas" value={printHours} setValue={setPrintHours} />
        <Field label="Minutos" value={printMinutes} setValue={setPrintMinutes} />
        <Field label="Energia (R$/kWh)" value={energyKwhPrice} setValue={setEnergyKwhPrice} />
        <Field label="Lucro desejado (%)" value={profitMargin} setValue={setProfitMargin} />
      </div>

      <div className="mt-8 bg-white/5 border border-[#B69AF8]/20 rounded-2xl p-6">
        <h3 className="text-2xl font-black text-[#DCCBFF]">
          Filamento usado
        </h3>

        <select
          value={filamentId}
          onChange={(e) => setFilamentId(e.target.value)}
          className="input-dark mt-5"
        >
          <option value="">Selecione o filamento</option>

          {materials.map((material) => (
            <option key={material._id} value={material._id}>
              {material.name}
            </option>
          ))}
        </select>

        <div className="grid md:grid-cols-3 gap-4 mt-5">
          <MiniResult title="Peso usado" value={`${weight || 0}g`} />
          <MiniResult
            title="Custo por g"
            value={money(Number(filament?.unitCost || 0))}
          />
          <MiniResult
            title="Custo do filamento"
            value={money(result.filamentCost)}
          />
        </div>
      </div>

      <div className="mt-8 bg-white/5 border border-[#B69AF8]/20 rounded-2xl p-6">
        <h3 className="text-2xl font-black text-[#DCCBFF]">
          Canais e taxas
        </h3>

        <div className="grid md:grid-cols-2 gap-5 mt-5">
          <label>
            <span className="block text-sm font-black text-[#DCCBFF] mb-2">
              Canal de venda
            </span>

            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="input-dark"
            >
              {salesChannels.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} - {item.fee}%
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="block text-sm font-black text-[#DCCBFF] mb-2">
              Forma de pagamento
            </span>

            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="input-dark"
            >
              {paymentMethods.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} - {item.fee}%
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-4 mt-8">
        <Card title="Filamento" value={money(result.filamentCost)} />
        <Card title="Energia" value={money(result.energyCost)} />
        <Card title="Custo base" value={money(result.baseCost)} />
        <Card title="Lucro 100%" value={money(result.desiredProfit)} />
        <Card title="Valor sugerido" value={money(result.finalPrice)} highlight />
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-[#B69AF8]/20 rounded-2xl p-6">
          <h3 className="text-2xl font-black text-[#DCCBFF]">
            Detalhamento
          </h3>

          <div className="mt-5 space-y-3 text-sm">
            <Row label="Peso da peça" value={`${weight}g`} />
            <Row label="Tempo total" value={`${result.totalHours.toFixed(2)}h`} />
            <Row label="Energia consumida" value={`${result.energyConsumed.toFixed(3)} kWh`} />
            <Row label="Custo do filamento" value={money(result.filamentCost)} />
            <Row label="Custo energia" value={money(result.energyCost)} />
            <Row label="Custo base" value={money(result.baseCost)} />
            <Row label="Lucro 100%" value={money(result.desiredProfit)} />
            <Row label="Antes das taxas" value={money(result.priceBeforeFees)} />
            <Row label={`${channel.name} (${channel.fee}%)`} value={money(result.channelCost)} />
            <Row label={`${payment.name} (${payment.fee}%)`} value={money(result.paymentCost)} />
            <Row label="Valor sugerido" value={money(result.finalPrice)} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#B69AF8]/20 to-[#F3B4A8]/20 border border-[#F3B4A8]/30 rounded-2xl p-6">
          <p className="text-zinc-300">
            Resultado final {channel.name}
          </p>

          <h3 className="text-6xl font-black mt-3 text-[#F3B4A8]">
            {money(result.finalPrice)}
          </h3>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <MiniResult title="Custo" value={money(result.baseCost)} />
            <MiniResult title="Lucro 100%" value={money(result.desiredProfit)} />
            <MiniResult title="Taxas" value={money(result.channelCost + result.paymentCost)} />
            <MiniResult title="Lucro real" value={money(result.realProfit)} />
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white/5 border border-[#B69AF8]/20 rounded-2xl p-6">
        <h3 className="text-2xl font-black text-[#DCCBFF]">
          Preços por canal
        </h3>

        <div className="grid md:grid-cols-3 gap-4 mt-5">
          {result.channelResults.map((item) => (
            <div
              key={item.name}
              className="bg-black/20 border border-white/10 rounded-2xl p-5"
            >
              <p className="text-zinc-400 text-sm font-bold">
                {item.name} ({item.fee}%)
              </p>

              <strong className="block text-2xl font-black text-white mt-2">
                {money(item.price)}
              </strong>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-white/5 border border-[#B69AF8]/20 rounded-2xl p-6">
        <h3 className="text-2xl font-black text-[#DCCBFF]">
          Salvar orçamento
        </h3>

        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="input-dark mt-5"
        >
          <option value="">Sem produto</option>

          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>

        <label className="flex gap-3 mt-5">
          <input
            type="checkbox"
            checked={applyToProduct}
            disabled={!productId}
            onChange={(e) => setApplyToProduct(e.target.checked)}
          />
          Aplicar preço ao produto
        </label>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Observação..."
          className="input-dark mt-5 min-h-28"
        />

        <button
          onClick={saveCalculation}
          disabled={saving}
          className="mt-5 w-full bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] py-4 rounded-2xl font-black"
        >
          {saving ? "Salvando..." : "Salvar cálculo"}
        </button>
      </div>

      <style jsx global>{`
        .input-dark {
          width: 100%;
          background: #11142f;
          border: 1px solid rgba(182, 154, 248, 0.2);
          border-radius: 1rem;
          padding: 1rem 1.25rem;
          color: white;
          outline: none;
        }

        .input-dark:focus {
          border-color: #f3b4a8;
        }

        .input-dark option {
          background: #080b2a;
          color: white;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <label>
      <span className="block text-sm font-black text-[#DCCBFF] mb-2">
        {label}
      </span>

      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="input-dark"
      />
    </label>
  );
}

function Card({
  title,
  value,
  highlight,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white/5 border border-[#B69AF8]/20 rounded-3xl p-5">
      <p className="text-zinc-400 text-sm font-bold">{title}</p>

      <strong
        className={`block mt-2 text-2xl font-black ${
          highlight ? "text-[#F3B4A8]" : "text-white"
        }`}
      >
        {value}
      </strong>
    </div>
  );
}

function MiniResult({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-black/20 rounded-2xl p-4">
      <p className="text-xs text-zinc-400">{title}</p>
      <strong className="text-lg">{value}</strong>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-2 gap-4">
      <span className="text-zinc-400">{label}</span>
      <strong className="text-right">{value}</strong>
    </div>
  );
}