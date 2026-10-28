import AdminSidebar from "@/components/AdminSidebar";

export default function AdminCustomPage() {
  return (
    <main className="min-h-screen bg-[#07070A] text-white p-6 lg:p-8">
      <AdminSidebar />

      <section className="max-w-7xl mx-auto pt-24">
        <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
          Projetos personalizados
        </p>

        <h1 className="text-5xl font-black text-[#DCCBFF] mt-3">
          Orçamentos e Encomendas
        </h1>

        <p className="text-zinc-400 mt-3 mb-10">
          Área para controlar pedidos sob medida, ideias dos clientes e produção especial.
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            ["📩", "Solicitações", "Novos pedidos de orçamento."],
            ["🧠", "Ideias", "Referências e projetos enviados."],
            ["🖨️", "Produção", "Peças em fila de impressão."],
            ["✅", "Finalizados", "Projetos entregues."],
          ].map(([icon, title, text]) => (
            <div
              key={title}
              className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-3xl p-6"
            >
              <div className="text-4xl">{icon}</div>

              <h2 className="text-2xl font-black text-[#DCCBFF] mt-4">
                {title}
              </h2>

              <p className="text-zinc-400 mt-2">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}