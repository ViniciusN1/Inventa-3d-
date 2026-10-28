import AdminSidebar from "@/components/AdminSidebar";
export const dynamic = "force-dynamic";


export default function TerraDoVeuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#080B2A] text-white">
      <AdminSidebar />

      <div className="ml-24 lg:ml-28 p-8">
        {children}
      </div>
    </main>
  );
}