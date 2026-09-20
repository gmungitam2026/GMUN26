import { getDashboardStats } from "@/lib/admin/queries";
import { committees } from "@/config/committees";
import { AdminStatCard, AdminBreakdownList } from "@/components/admin/AdminStatCard";

export default async function AdminOverviewPage() {
  const stats = await getDashboardStats();

  const committeeItems = stats.committeeBreakdown.map((c) => ({
    label: committees.find((cm) => cm.id === c.committee)?.shortName ?? c.committee,
    count: c.count,
  }));
  const typeItems = stats.participantTypeBreakdown.map((t) => ({ label: t.type, count: t.count }));

  return (
    <div>
      <h1 className="font-display text-2xl text-ivory">Overview</h1>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <AdminStatCard label="Total Registrations" value={stats.totalRegistrations} />
        <AdminStatCard label="Paid Registrations" value={stats.paidRegistrations} />
        <AdminStatCard label="Pending Payments" value={stats.pendingPayments} />
        <AdminStatCard label="Failed Payments" value={stats.failedPayments} />
        <AdminStatCard label="Revenue Collected" value={`₹${stats.revenue.toLocaleString("en-IN")}`} />
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <AdminBreakdownList title="Committee-wise Registrations" items={committeeItems} />
        <AdminBreakdownList title="Participant Type Breakdown" items={typeItems} />
      </div>
    </div>
  );
}
