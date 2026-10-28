"use client";

import {
  initMercadoPago,
  CardPayment,
} from "@mercadopago/sdk-react";

import { useEffect, useState } from "react";

interface Props {
  orderData: any;
}

export default function CardPaymentComponent({ orderData }: Props) {
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const publicKey =
      process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

    console.log("MP PUBLIC KEY:", publicKey);

    if (!publicKey) {
      setMessage("Public Key do Mercado Pago não encontrada.");
      return;
    }

    initMercadoPago(publicKey, {
      locale: "pt-BR",
    });

    setReady(true);
  }, []);

  async function onSubmit(formData: any) {
    setMessage("");

    const res = await fetch("/api/checkout/card", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: formData.token,
        issuer_id: formData.issuer_id,
        payment_method_id: formData.payment_method_id,
        installments: formData.installments,

        amount: Number(orderData.total),

        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        cpf: orderData.cpf,

        cep: orderData.cep,
        address: orderData.address,
        number: orderData.number,
        city: orderData.city,
        state: orderData.state,

        cart: orderData.cart,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setMessage(data.error || "Erro no pagamento.");
      return;
    }

    if (data.status === "approved") {
      window.location.href =
        `/checkout/success?orderId=${data.orderId}`;
      return;
    }

    setMessage(`Status: ${data.status}`);
  }

  if (!ready) {
    return (
      <div className="bg-[#101014] border border-white/10 rounded-[2rem] p-6 text-white">
        Carregando cartão...
        {message && (
          <p className="text-red-400 mt-4">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#101014] border border-white/10 rounded-[2rem] p-6 space-y-5 text-white">
      <h2 className="text-2xl font-black">
        Cartão de crédito
      </h2>

      {message && (
        <div className="bg-red-500/15 border border-red-400/30 text-red-300 rounded-2xl px-5 py-4 font-bold">
          {message}
        </div>
      )}

      <div className="bg-white rounded-3xl p-4">
        <CardPayment
          key={Number(orderData.total)}
          initialization={{
            amount: Number(orderData.total),
            payer: {
              email: orderData.email,
              },
        }}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}