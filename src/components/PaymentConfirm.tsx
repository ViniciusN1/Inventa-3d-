"use client";

import { useEffect, useState } from "react";

const LABELS: Record<string, string> = {
  paid: "Pagamento aprovado ✅",
  pending: "Pagamento em análise ⏳",
  payment_rejected: "Pagamento recusado ❌",
  cancelled: "Pagamento cancelado",
  payment_review: "Pagamento em revisão pela loja",
};

/**
 * Confirma o pagamento do Checkout Pro no servidor (que consulta o Mercado Pago)
 * e mostra o status atualizado do pedido.
 */
export default function PaymentConfirm({ paymentId }: { paymentId?: string }) {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentId) return;

    fetch(`/api/checkout/confirm?payment_id=${encodeURIComponent(paymentId)}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => setStatus(data?.success ? String(data.status) : null))
      .catch(() => setStatus(null));
  }, [paymentId]);

  if (!paymentId || !status) return null;

  return (
    <p className="mt-6 inline-block bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm font-bold text-[#DCCBFF]">
      {LABELS[status] || `Status: ${status}`}
    </p>
  );
}
