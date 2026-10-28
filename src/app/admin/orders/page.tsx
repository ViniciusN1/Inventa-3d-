export const dynamic = "force-dynamic";

import clientPromise, { DB_NAME } from "@/lib/mongodb";
import AdminSidebar from "@/components/AdminSidebar";
import OrdersTable from "@/components/OrdersTable";

async function getOrders() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const orders = await db
    .collection("orders")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return JSON.parse(JSON.stringify(orders));
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <main className="min-h-screen bg-[#07070A] text-white p-6 lg:p-8">
      <AdminSidebar />

      <section className="max-w-7xl mx-auto pt-24">
        <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
          Pedidos
        </p>

        <h1 className="text-5xl font-black text-[#DCCBFF] mt-3">
          Controle de Pedidos
        </h1>

        <p className="text-zinc-400 mt-3 mb-10">
          Gerencie pedidos, produção, rastreio e entregas da Inventta 3D.
        </p>

        <OrdersTable orders={orders} />
      </section>
    </main>
  );
}