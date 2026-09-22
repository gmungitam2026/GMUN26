import { getDashboardStats } from "@/lib/admin/queries";
import { committees } from "@/config/committees";
import { registrationPackages } from "@/config/pricing";
import { AdminStatCard, AdminBreakdownList } from "@/components/admin/AdminStatCard";

export default async function AdminOverviewPage() {
  const stats = await getDashboardStats();

  const committeeItems = stats.committeeBreakdown.map((c) => ({
    label: committees.find((cm) => cm.id === c.committee)?.shortName ?? c.committee,
    count: c.count,
  }));
  const packageItems = stats.packageBreakdown.map((p) => ({
    label: registrationPackages.find((pkg) => pkg.id === p.packageId)?.name ?? p.packageId,
    count: p.count,
  }));
  const genderItems = stats.genderBreakdown.map((g) => ({ label: g.gender, count: g.count }));

  return (
    <div>
      <h1 className="font-display text-2xl text-ivory">Overview</h1>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-6">
        <AdminStatCard label="Total Registrations" value={stats.totalRegistrations} />
        <AdminStatCard label="Pending Verification" value={stats.pendingVerification} />
        <AdminStatCard label="Under Verification" value={stats.underVerification} />
        <AdminStatCard label="Payment Confirmed" value={stats.confirmedRegistrations} />
        <AdminStatCard label="Rejected" value={stats.rejectedRegistrations} />
        <AdminStatCard label="Revenue Collected" value={`₹${stats.revenue.toLocaleString("en-IN")}`} />
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        <AdminBreakdownList title="Committee-wise Registrations" items={committeeItems} />
        <AdminBreakdownList title="Package-wise Registrations" items={packageItems} />
        <AdminBreakdownList title="Gender-wise Registrations" items={genderItems} />
      </div>
    </div>
  );
}
