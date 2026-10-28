import AdminSidebar from "@/components/AdminSidebar";
import AdminSettingsClient from "@/components/AdminSettingsClient";

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-[#07070A] text-white p-6 lg:p-8">
      <AdminSidebar />

      <section className="max-w-7xl mx-auto pt-24">
        <p className="text-[#F3B4A8] font-bold uppercase tracking-widest text-sm">
          Configurações
        </p>

        <h1 className="text-5xl font-black text-[#DCCBFF] mt-3">
          Configurações da Loja
        </h1>

        <p className="text-zinc-400 mt-3 mb-10">
          Configure marca, WhatsApp, Instagram, frete, pagamento e integrações.
        </p>

        <AdminSettingsClient />
      </section>
    </main>
  );
}