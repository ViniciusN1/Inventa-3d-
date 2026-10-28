import AdminSidebar from "@/components/AdminSidebar";

export default function AdminNewsPage() {
  return (
    <main className="min-h-screen bg-[#07070A] text-white p-6 lg:p-8">
      <AdminSidebar />

      <div className="max-w-7xl mx-auto pt-20">
        <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
          Novidades
        </p>

        <h1 className="text-5xl font-black text-[#DCCBFF] mt-3">
          Novidades da Inventta
        </h1>

        <p className="text-zinc-400 mt-3 mb-10">
          Área para cadastrar lançamentos, avisos, promoções e atualizações da loja.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["🆕", "Lançamentos", "Novos produtos e modelos 3D."],
            ["🎁", "Promoções", "Cupons, descontos e campanhas."],
            ["📢", "Avisos", "Comunicados para clientes."],
          ].map(([icon, title, text]) => (
            <div
              key={title}
              className="bg-[#0B0E33] border border-[#B69AF8]/20 rounded-3xl p-6"
            >
              <div className="text-4xl">{icon}</div>

              <h2 className="text-2xl font-black text-[#DCCBFF] mt-4">
                {title}
              </h2>

              <p className="text-zinc-400 mt-2">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}