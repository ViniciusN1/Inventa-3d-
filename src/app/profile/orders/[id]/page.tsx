"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

function getStatus(status: string) {
  switch (status) {
    case "approved":
    case "paid":
      return {
        label: "Pagamento aprovado",
        className: "bg-green-100 text-green-700",
      };

    case "pending":
      return {
        label: "Aguardando pagamento",
        className: "bg-yellow-100 text-yellow-700",
      };

    case "rejected":
      return {
        label: "Pagamento recusado",
        className: "bg-red-100 text-red-700",
      };

    case "shipped":
      return {
        label: "Pedido enviado",
        className: "bg-blue-100 text-blue-700",
      };

    case "delivered":
      return {
        label: "Pedido entregue",
        className: "bg-purple-100 text-purple-700",
      };

    case "cancelled":
      return {
        label: "Pedido cancelado",
        className: "bg-red-100 text-red-700",
      };

    default:
      return {
        label: status || "Status desconhecido",
        className: "bg-gray-100 text-gray-700",
      };
  }
}

function timelineSteps(status: string) {
  const steps = [
    {
      key: "created",
      label: "Pedido recebido",
    },
    {
      key: "approved",
      label: "Pagamento aprovado",
    },
    {
      key: "shipped",
      label: "Pedido enviado",
    },
    {
      key: "delivered",
      label: "Pedido entregue",
    },
  ];

  let activeIndex = 0;

  if (
    status === "approved" ||
    status === "paid"
  ) {
    activeIndex = 1;
  }

  if (status === "shipped") {
    activeIndex = 2;
  }

  if (status === "delivered") {
    activeIndex = 3;
  }

  return steps.map((step, index) => ({
    ...step,
    active: index <= activeIndex,
  }));
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const [order, setOrder] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadOrder() {
      const token =
        localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(
        `/api/user/orders/${params.id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(
          data.error ||
            "Pedido não encontrado"
        );

        router.push("/profile");
        return;
      }

      setOrder(data.order);
      setLoading(false);
    }

    loadOrder();
  }, [params.id, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-2xl font-black text-gray-900">
          Carregando pedido...
        </p>
      </main>
    );
  }

  const status = getStatus(order.status);
  const steps = timelineSteps(order.status);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
        <button
          onClick={() =>
            router.push("/profile")
          }
          className="
            mb-8
            bg-gray-900
            hover:bg-black
            text-white
            px-6
            py-3
            rounded-2xl
            font-bold
          "
        >
          ← Voltar ao perfil
        </button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900">
              Pedido #
              {String(order._id).slice(-6)}
            </h1>

            <p className="text-gray-500 mt-2">
              Criado em{" "}
              {new Date(
                order.createdAt
              ).toLocaleDateString("pt-BR")}
            </p>
          </div>

          <span
            className={`
              px-5
              py-3
              rounded-full
              font-black
              text-sm
              w-fit
              ${status.className}
            `}
          >
            {status.label}
          </span>
        </div>

        {/* TIMELINE */}
        <div className="mt-10 bg-gray-50 rounded-3xl p-6 border border-gray-200">
          <h2 className="text-2xl font-black text-gray-900 mb-6">
            Acompanhamento
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((step) => (
              <div
                key={step.key}
                className={`
                  rounded-2xl
                  p-5
                  border
                  ${
                    step.active
                      ? "bg-green-50 border-green-300"
                      : "bg-white border-gray-200"
                  }
                `}
              >
                <div
                  className={`
                    w-10
                    h-10
                    rounded-full
                    flex
                    items-center
                    justify-center
                    font-black
                    mb-3
                    ${
                      step.active
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }
                  `}
                >
                  ✓
                </div>

                <p
                  className={`
                    font-bold
                    ${
                      step.active
                        ? "text-green-700"
                        : "text-gray-500"
                    }
                  `}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RESUMO */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
            <h2 className="text-2xl font-black text-gray-900 mb-4">
              Pagamento
            </h2>

            <p className="text-gray-700">
              Método:{" "}
              <strong>
                {order.payment?.method || "-"}
              </strong>
            </p>

            <p className="text-gray-700 mt-2">
              Status:{" "}
              <strong>
                {order.payment?.status ||
                  order.status}
              </strong>
            </p>

            <p className="text-gray-700 mt-2">
              Parcelas:{" "}
              <strong>
                {order.payment?.installments ||
                  1}
              </strong>
            </p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
            <h2 className="text-2xl font-black text-gray-900 mb-4">
              Total
            </h2>

            <p className="text-4xl font-black text-pink-600">
              R${" "}
              {Number(order.total).toFixed(2)}
            </p>
          </div>
        </div>

        {/* PRODUTOS */}
        <div className="mt-8 bg-gray-50 rounded-3xl p-6 border border-gray-200">
          <h2 className="text-2xl font-black text-gray-900 mb-4">
            Produtos
          </h2>

          <div className="space-y-4">
            {(order.cart || []).map(
              (item: any) => (
                <div
                  key={item._id}
                  className="
                    flex
                    justify-between
                    items-center
                    border-b
                    border-gray-200
                    pb-4
                    gap-4
                  "
                >
                  <div>
                    <p className="font-bold text-gray-900">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Quantidade:{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <span className="text-pink-600 font-black">
                    R${" "}
                    {Number(
                      item.price
                    ).toFixed(2)}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* ENDEREÇO */}
        <div className="mt-8 bg-gray-50 rounded-3xl p-6 border border-gray-200">
          <h2 className="text-2xl font-black text-gray-900 mb-4">
            Endereço de entrega
          </h2>

          <p className="text-gray-800">
            {order.address?.address},{" "}
            {order.address?.number}
          </p>

          <p className="text-gray-800">
            {order.address?.city}/
            {order.address?.state}
          </p>

          <p className="text-gray-800">
            CEP: {order.address?.cep}
          </p>
        </div>
        {/* RASTREIO */}
{order.tracking?.code && (

  <div className="mt-8 bg-gray-50 rounded-3xl p-6 border border-gray-200">

    <h2 className="text-2xl font-black text-gray-900 mb-4">
      Rastreamento
    </h2>

    <div className="space-y-3">

      <p className="text-gray-800">
        <strong>Transportadora:</strong>{" "}
        {order.tracking?.carrier || "-"}
      </p>

      <p className="text-gray-800">
        <strong>Código:</strong>{" "}
        {order.tracking?.code || "-"}
      </p>

      {order.tracking?.note && (

        <p className="text-gray-700">
          <strong>Observação:</strong>{" "}
          {order.tracking.note}
        </p>

      )}

      {order.tracking?.url && (

        <a
          href={order.tracking.url}
          target="_blank"
          className="
            inline-block
            mt-4
            bg-blue-500
            hover:bg-blue-600
            text-white
            px-6
            py-3
            rounded-2xl
            font-bold
          "
        >

          Acompanhar pedido

        </a>

      )}

    </div>

  </div>

)}
      </div>
    </main>
  );
}