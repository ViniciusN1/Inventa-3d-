"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import AuthCheckout from "@/components/AuthCheckout";
import CheckoutForm from "@/components/CheckoutForm";
import HybridCheckout from "@/components/HybridCheckout";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/app/auth/AuthProvider";

export default function CheckoutPage() {
  const { cart } = useCart();
  const { user, login } = useAuth();

  const [form, setForm] = useState<any>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const [settings, setSettings] = useState<any>({
    deliveryMS: 0,
    deliverySP: 24.9,
    deliveryBR: 34.9,
    freeShippingFrom: 299,
  });

  const subtotal = cart.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );

  function getDeliveryFee(state?: string, value = 0) {
    const freeShippingFrom = Number(settings.freeShippingFrom || 299);

    if (value >= freeShippingFrom) return 0;

    const uf = String(state || "").toUpperCase();

    if (uf === "MS") return Number(settings.deliveryMS || 0);
    if (uf === "SP") return Number(settings.deliverySP || 24.9);

    return Number(settings.deliveryBR || 34.9);
  }

  const deliveryFee = getDeliveryFee(form?.state, subtotal);
  const finalTotal = subtotal + deliveryFee;

  useEffect(() => {
    async function loadSettings() {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();

      if (data.success) {
        setSettings(data.settings);
      }

      setLoadingSettings(false);
    }

    loadSettings();
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        cpf: user.cpf || "",
        cep: user.address?.cep || "",
        address: user.address?.address || "",
        number: user.address?.number || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
      });
    }
  }, [user]);

  if (loadingSettings) {
    return (
      <main className="min-h-screen bg-[#080B2A] flex items-center justify-center">
        <p className="text-3xl font-black text-[#DCCBFF]">
          Carregando checkout...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080B2A] text-white">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid xl:grid-cols-[1fr_520px] gap-10 items-start">
          
          {/* LADO ESQUERDO */}
          <div className="space-y-8">
            {!user ? (
              <AuthCheckout />
            ) : (
              <CheckoutForm onComplete={setForm} initialData={form} />
            )}
          </div>

          {/* LADO DIREITO */}
          <div className="space-y-8">
            {!user ? (
              <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 rounded-[2rem] p-6 font-bold">
                Faça login para liberar o pagamento.
              </div>
            ) : !form ? (
              <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 rounded-[2rem] p-6 font-bold">
                Complete os dados de entrega.
              </div>
            ) : (
              <HybridCheckout
                orderData={{
                  ...form,
                  cart,
                  subtotal,
                  deliveryFee,
                  total: finalTotal,
                }}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}