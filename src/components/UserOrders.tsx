"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function getStatus(status: string) {
  switch (status) {
    case "approved":
      return {
        label: "Pagamento aprovado",
        className: "bg-green-100 text-green-700",
      };

    case "pending":
      return {
        label: "Pagamento pendente",
        className: "bg-yellow-100 text-yellow-700",
      };

    case "rejected":
      return {
        label: "Pagamento recusado",
        className: "bg-red-100 text-red-700",
      };

    case "in_process":
      return {
        label: "Processando",
        className: "bg-blue-100 text-blue-700",
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

export default function UserOrders() {
  const router = useRouter();

  const [orders, setOrders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const token =
          localStorage.getItem("token");

        const res = await fetch(
          "/api/user/orders",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setOrders(data.orders || []);
      } catch (error) {
        console.log(
          "Erro ao carregar pedidos:",
          error
        );

        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="mt-10 bg-white rounded-3xl border border-gray-200 p-6">
        <p className="text-gray-500 font-medium">
          Carregando pedidos...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 bg-white rounded-3xl border border-gray-200 p-6">
      <h2 className="text-2xl font-black text-gray-900 mb-6">
        Meus Pedidos
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">
          Você ainda não possui pedidos.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status =
              getStatus(order.status);

            return (
              <div
                key={order._id}
                onClick={() =>
                  router.push(
                    `/profile/orders/${order._id}`
                  )
                }
                className="
                  border
                  border-gray-200
                  rounded-2xl
                  p-5
                  cursor-pointer
                  hover:shadow-lg
                  hover:border-pink-300
                  transition
                "
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-black text-gray-900">
                      Pedido #
                      {String(order._id).slice(-6)}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>

                  <span className="font-black text-pink-600">
                    R${" "}
                    {Number(order.total).toFixed(2)}
                  </span>
                </div>

                <div className="mt-4">
                  <span
                    className={`
                      px-4
                      py-2
                      rounded-full
                      text-sm
                      font-bold
                      ${status.className}
                    `}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {(order.cart || []).map(
                    (item: any) => (
                      <div
                        key={item._id}
                        className="
                          text-sm
                          text-gray-600
                          flex
                          justify-between
                          gap-4
                        "
                      >
                        <span>
                          {item.name} x
                          {item.quantity}
                        </span>

                        <span>
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
            );
          })}
        </div>
      )}
    </div>
  );
}