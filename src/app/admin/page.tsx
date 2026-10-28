import clientPromise, { DB_NAME } from "@/lib/mongodb";
import AdminSidebar from "@/components/AdminSidebar";
import OrdersTable from "@/components/OrdersTable";
export const dynamic = "force-dynamic";


import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) redirect("/admin/login");

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (decoded.role !== "admin") {
      redirect("/admin/login");
    }
  } catch {
    redirect("/admin/login");
  }
}

async function getData() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const orders = await db
    .collection("orders")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const products = await db
    .collection("products")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const posts = await db
    .collection("posts")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return JSON.parse(
    JSON.stringify({
      orders,
      products,
      posts,
    })
  );
}

export default async function AdminPage() {
  await checkAdmin();

  const { orders, products, posts } = await getData();

  const totalRevenue = orders.reduce(
    (acc: number, order: any) => acc + Number(order.total || 0),
    0
  );

  const paidOrders = orders.filter((order: any) =>
    ["approved", "paid", "shipped", "delivered"].includes(order.status)
  );

  const pendingOrders = orders.filter(
    (order: any) => order.status === "pending"
  );

  const lowStockProducts = products.filter(
    (product: any) => Number(product.stock || 0) <= 3
  );

  const customProducts = products.filter(
    (product: any) =>
      product.category === "Personalizados" ||
      product.category === "Impressão 3D"
  );

  const featuredProducts = products.filter(
    (product: any) => product.featured === true
  );

  const monthlyRevenue = orders
    .filter((order: any) => {
      const createdAt = new Date(order.createdAt);
      const now = new Date();

      return (
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear()
      );
    })
    .reduce(
      (acc: number, order: any) => acc + Number(order.total || 0),
      0
    );

  const popularPosts = posts
    .sort((a: any, b: any) => Number(b.likes || 0) - Number(a.likes || 0))
    .slice(0, 3);

  const cards = [
    {
      label: "Pedidos",
      value: orders.length,
      color: "text-[#DCCBFF]",
      icon: "📦",
    },
    {
      label: "Faturamento",
      value: `R$ ${totalRevenue.toFixed(2)}`,
      color: "text-[#F3B4A8]",
      icon: "💰",
    },
    {
      label: "Pagos",
      value: paidOrders.length,
      color: "text-green-300",
      icon: "✅",
    },
    {
      label: "Pendentes",
      value: pendingOrders.length,
      color: "text-yellow-300",
      icon: "⏳",
    },
  ];

  return (
    <main className="min-h-screen bg-[#080B2A] text-white p-8 pt-24">
      <AdminSidebar />

      <div className="mb-10">
        <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
          Painel administrativo
        </p>

        <h1 className="text-5xl font-black mt-3">
          Inventta 3D Dashboard
        </h1>

        <p className="text-zinc-400 mt-2">
          Gerencie pedidos, produtos, estoque, criações personalizadas e conteúdos.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-3xl p-6 shadow-[0_0_40px_rgba(182,154,248,0.08)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-zinc-400">{card.label}</p>
              <span className="text-3xl">{card.icon}</span>
            </div>

            <h2 className={`text-4xl font-black mt-3 ${card.color}`}>
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-3xl p-6">
          <p className="text-zinc-400">Receita do mês</p>

          <h2 className="text-4xl font-black mt-2 text-[#F3B4A8]">
            R$ {monthlyRevenue.toFixed(2)}
          </h2>
        </div>

        <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-3xl p-6">
          <p className="text-zinc-400">Produtos</p>

          <h2 className="text-4xl font-black mt-2 text-[#DCCBFF]">
            {products.length}
          </h2>
        </div>

        <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-3xl p-6">
          <p className="text-zinc-400">Destaques</p>

          <h2 className="text-4xl font-black mt-2 text-[#B69AF8]">
            {featuredProducts.length}
          </h2>
        </div>

        <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-3xl p-6">
          <p className="text-zinc-400">Personalizados</p>

          <h2 className="text-4xl font-black mt-2 text-[#F3B4A8]">
            {customProducts.length}
          </h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-3xl p-6">
          <h2 className="text-2xl font-black text-[#DCCBFF]">
            🧠 Inteligência
          </h2>

          <div className="mt-5 space-y-3 text-zinc-300">
            <p>⚠️ Pedidos pendentes: {pendingOrders.length}</p>
            <p>📦 Produtos com baixo estoque: {lowStockProducts.length}</p>
            <p>✨ Produtos em destaque: {featuredProducts.length}</p>
            <p>🖨️ Produtos personalizados: {customProducts.length}</p>
          </div>
        </div>

        <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-3xl p-6">
          <h2 className="text-2xl font-black text-[#DCCBFF]">
            Estoque crítico
          </h2>

          <div className="mt-5 space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-zinc-400">
                Nenhum produto crítico.
              </p>
            ) : (
              lowStockProducts.slice(0, 5).map((product: any) => (
                <p key={product._id} className="text-zinc-300">
                  {product.name} — estoque:{" "}
                  <span className="text-[#F3B4A8] font-black">
                    {product.stock || 0}
                  </span>
                </p>
              ))
            )}
          </div>
        </div>

        <div className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-3xl p-6">
          <h2 className="text-2xl font-black text-[#DCCBFF]">
            Posts populares
          </h2>

          <div className="mt-5 space-y-3">
            {popularPosts.length === 0 ? (
              <p className="text-zinc-400">
                Nenhum post ainda.
              </p>
            ) : (
              popularPosts.map((post: any) => (
                <p key={post._id} className="text-zinc-300">
                  ❤️ {post.likes || 0} — {post.userName || "Usuário"}
                </p>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mb-8 bg-gradient-to-r from-[#B69AF8]/15 to-[#F3B4A8]/15 border border-[#B69AF8]/20 rounded-3xl p-6">
        <h2 className="text-2xl font-black text-[#DCCBFF]">
          Próximas ações recomendadas
        </h2>

        <div className="grid md:grid-cols-4 gap-4 mt-5">
          <a
            href="/admin/products"
            className="bg-white/5 border border-white/10 hover:border-[#F3B4A8]/50 rounded-2xl p-5 transition"
          >
            <p className="text-3xl">🖨️</p>
            <p className="font-black mt-3">Cadastrar produto</p>
            <p className="text-sm text-zinc-400 mt-1">
              Adicione PLA, cor, estoque e categoria.
            </p>
          </a>

          <a
            href="/admin/products"
            className="bg-white/5 border border-white/10 hover:border-[#F3B4A8]/50 rounded-2xl p-5 transition"
          >
            <p className="text-3xl">📈</p>
            <p className="font-black mt-3">Ajustar estoque</p>
            <p className="text-sm text-zinc-400 mt-1">
              Atualize quantidades antes de vender.
            </p>
          </a>

          <a
            href="/admin/posts"
            className="bg-white/5 border border-white/10 hover:border-[#F3B4A8]/50 rounded-2xl p-5 transition"
          >
            <p className="text-3xl">📸</p>
            <p className="font-black mt-3">Ver posts</p>
            <p className="text-sm text-zinc-400 mt-1">
              Controle publicações da comunidade.
            </p>
          </a>

          <a
            href="/admin"
            className="bg-white/5 border border-white/10 hover:border-[#F3B4A8]/50 rounded-2xl p-5 transition"
          >
            <p className="text-3xl">🚚</p>
            <p className="font-black mt-3">Pedidos</p>
            <p className="text-sm text-zinc-400 mt-1">
              Acompanhe pagamentos e entregas.
            </p>
          </a>
        </div>
      </div>

      <OrdersTable orders={orders} />
    </main>
  );
}