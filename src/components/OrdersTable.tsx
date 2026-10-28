"use client";

import { useState } from "react";

export default function OrdersTable({ orders }: { orders: any[] }) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        productionStatus: status,
      }),
    });

    location.reload();
  }

  async function deleteOrder(id: string) {
    if (!confirm("Deseja excluir este pedido?")) return;

    await fetch(`/api/orders/${id}`, {
      method: "DELETE",
    });

    location.reload();
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-10 text-center">
        <div className="text-6xl mb-5">📦</div>

        <h2 className="text-3xl font-black text-[#DCCBFF]">
          Nenhum pedido encontrado
        </h2>

        <p className="text-zinc-400 mt-3">
          Quando um cliente finalizar uma compra, o pedido aparecerá aqui.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-white/5 text-zinc-300">
              <tr>
                <th className="text-left px-6 py-5">Cliente</th>
                <th className="text-left px-6 py-5">Contato</th>
                <th className="text-left px-6 py-5">Total</th>
                <th className="text-left px-6 py-5">Status</th>
                <th className="text-left px-6 py-5">Data</th>
                <th className="text-left px-6 py-5">Ações</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-6">
                    <p className="font-black text-white">
                      {order.customer?.name || order.name || "Cliente"}
                    </p>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-[#F3B4A8] text-sm mt-2 font-bold"
                    >
                      Ver detalhes
                    </button>
                  </td>

                  <td className="px-6 py-6">
                    <p className="text-zinc-300">
                      {order.customer?.email || order.email || "-"}
                    </p>

                    <p className="text-zinc-500 text-sm mt-1">
                      {order.customer?.phone || order.phone || "-"}
                    </p>
                  </td>

                  <td className="px-6 py-6">
                    <p className="font-black text-3xl text-[#F3B4A8]">
                      R$ {Number(order.total || 0).toFixed(2)}
                    </p>
                  </td>

                  <td className="px-6 py-6">
                    <span className="px-4 py-2 rounded-full text-sm font-black bg-[#B69AF8]/15 text-[#DCCBFF] border border-[#B69AF8]/20">
                      {order.status || "pending"}
                    </span>
                  </td>

                  <td className="px-6 py-6 text-zinc-400">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>

                  <td className="px-6 py-6">
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => updateStatus(order._id, "approved")}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-bold"
                      >
                        Pago
                      </button>

                      <button
                        onClick={() => updateStatus(order._id, "producing")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-bold"
                      >
                        Produzindo
                      </button>

                      <button
                        onClick={() => updateStatus(order._id, "delivered")}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-xl font-bold"
                      >
                        Entregue
                      </button>

                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-bold"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-[2rem] p-8 w-full max-w-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-2xl text-white"
            >
              ✕
            </button>

            <h2 className="text-4xl font-black text-[#DCCBFF] mb-6">
              Detalhes do pedido
            </h2>

            <pre className="bg-black/30 rounded-2xl p-5 overflow-auto text-sm text-zinc-300">
              {JSON.stringify(selectedOrder, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </>
  );
}