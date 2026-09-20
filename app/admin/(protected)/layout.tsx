import { verifyAdminSession } from "@/lib/supabase/dal";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

// Auth-gated, always-fresh data — never statically prerendered.
export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await verifyAdminSession();

  return (
    <div className="flex min-h-screen bg-ink pt-20">
      <AdminSidebar adminName={`${session.name} · ${session.role}`} />
      <div className="flex-1 px-10 py-10">{children}</div>
    </div>
  );
}
