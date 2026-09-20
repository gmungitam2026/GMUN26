import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface DashboardStats {
  totalRegistrations: number;
  paidRegistrations: number;
  pendingPayments: number;
  failedPayments: number;
  revenue: number;
  committeeBreakdown: { committee: string; count: number }[];
  packageBreakdown: { packageId: string; count: number }[];
  genderBreakdown: { gender: string; count: number }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createAdminClient();

  const [{ count: total }, { count: paid }, { data: paymentRows }, { data: registrationRows }] =
    await Promise.all([
      supabase.from("registrations").select("id", { count: "exact", head: true }),
      supabase.from("registrations").select("id", { count: "exact", head: true }).eq("status", "PAID"),
      supabase.from("payments").select("status, amount"),
      supabase.from("registrations").select("committee_preference, package_id, gender"),
    ]);

  const pendingPayments = paymentRows?.filter((p) => p.status === "PENDING").length ?? 0;
  const failedPayments = paymentRows?.filter((p) => p.status === "FAILED").length ?? 0;
  const revenue = paymentRows?.filter((p) => p.status === "PAID").reduce((sum, p) => sum + (p.amount ?? 0), 0) ?? 0;

  const committeeCounts = new Map<string, number>();
  const packageCounts = new Map<string, number>();
  const genderCounts = new Map<string, number>();
  for (const row of registrationRows ?? []) {
    committeeCounts.set(row.committee_preference, (committeeCounts.get(row.committee_preference) ?? 0) + 1);
    packageCounts.set(row.package_id, (packageCounts.get(row.package_id) ?? 0) + 1);
    genderCounts.set(row.gender, (genderCounts.get(row.gender) ?? 0) + 1);
  }

  return {
    totalRegistrations: total ?? 0,
    paidRegistrations: paid ?? 0,
    pendingPayments,
    failedPayments,
    revenue,
    committeeBreakdown: [...committeeCounts.entries()]
      .map(([committee, count]) => ({ committee, count }))
      .sort((a, b) => b.count - a.count),
    packageBreakdown: [...packageCounts.entries()]
      .map(([packageId, count]) => ({ packageId, count }))
      .sort((a, b) => b.count - a.count),
    genderBreakdown: [...genderCounts.entries()]
      .map(([gender, count]) => ({ gender, count }))
      .sort((a, b) => b.count - a.count),
  };
}

export interface RegistrationListFilters {
  query?: string;
  committee?: string;
  paymentStatus?: string;
  packageId?: string;
  page?: number;
  pageSize?: number;
}

export async function listRegistrations(filters: RegistrationListFilters) {
  const supabase = createAdminClient();
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("registrations")
    .select(
      "id, registration_id, full_name, email, phone, committee_preference, package_id, gender, status, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.query) {
    const q = filters.query;
    query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,registration_id.ilike.%${q}%`);
  }
  if (filters.committee) query = query.eq("committee_preference", filters.committee);
  if (filters.paymentStatus) query = query.eq("status", filters.paymentStatus);
  if (filters.packageId) query = query.eq("package_id", filters.packageId);

  const { data, count, error } = await query;
  if (error) throw error;

  return { registrations: data ?? [], total: count ?? 0, page, pageSize };
}

/** Same filters as listRegistrations, but every matching row (no pagination) — used for CSV export. */
export async function listRegistrationsForExport(filters: Omit<RegistrationListFilters, "page" | "pageSize">) {
  const supabase = createAdminClient();

  let query = supabase.from("registrations").select("*").order("created_at", { ascending: false });

  if (filters.query) {
    const q = filters.query;
    query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,registration_id.ilike.%${q}%`);
  }
  if (filters.committee) query = query.eq("committee_preference", filters.committee);
  if (filters.paymentStatus) query = query.eq("status", filters.paymentStatus);
  if (filters.packageId) query = query.eq("package_id", filters.packageId);

  const { data, error } = await query;
  if (error) throw error;

  return data ?? [];
}

export async function getRegistrationDetail(id: string) {
  const supabase = createAdminClient();

  const { data: registration } = await supabase.from("registrations").select("*").eq("id", id).maybeSingle();
  if (!registration) return null;

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("registration_id", id)
    .order("created_at", { ascending: false });

  return { registration, payments: payments ?? [] };
}

export async function listPayments(page = 1, pageSize = 20) {
  const supabase = createAdminClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from("payments")
    .select("id, registration_id, provider, order_id, payment_id, amount, status, method, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { payments: data ?? [], total: count ?? 0, page, pageSize };
}
