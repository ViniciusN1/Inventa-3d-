import AdminSidebar from "@/components/AdminSidebar";
import TerraDashboard from "@/components/TerraDashboard";
export const dynamic = "force-dynamic";


export default function TerraDoVeuAdminPage() {
  return (
    <main className="min-h-screen bg-[#080B2A] text-white">

      <AdminSidebar />

      <div className="ml-24 lg:ml-28 p-8">

        <TerraDashboard />

      </div>

    </main>
  );
}