import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface DashboardStats {
  totalRegistrations: number;
  pendingVerification: number;
  underVerification: number;
  confirmedRegistrations: number;
  rejectedRegistrations: number;
  cancelledRegistrations: number;
  revenue: number;
  committeeBreakdown: { committee: string; count: number }[];
  packageBreakdown: { packageId: string; count: number }[];
  genderBreakdown: { gender: string; count: number }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createAdminClient();

  const [{ data: registrations }, { data: registrationRows }] =
    await Promise.all([
      supabase.from("registrations").select("status, payment_amount"),
      // Totals and breakdowns count confirmed payments only; every other
      // status is reported in its own count.
      supabase.from("registrations").select("committee_preference, package_id, gender").eq("status", "PAYMENT_CONFIRMED"),
    ]);

  const rows = registrations ?? [];
  const countStatus = (status: string) => rows.filter((row) => row.status === status).length;
  const revenue = rows
    .filter((row) => row.status === "PAYMENT_CONFIRMED")
    .reduce((sum, row) => sum + (row.payment_amount ?? 0), 0);

  const committeeCounts = new Map<string, number>();
  const packageCounts = new Map<string, number>();
  const genderCounts = new Map<string, number>();
  for (const row of registrationRows ?? []) {
    committeeCounts.set(row.committee_preference, (committeeCounts.get(row.committee_preference) ?? 0) + 1);
    packageCounts.set(row.package_id, (packageCounts.get(row.package_id) ?? 0) + 1);
    genderCounts.set(row.gender, (genderCounts.get(row.gender) ?? 0) + 1);
  }

  return {
    totalRegistrations: countStatus("PAYMENT_CONFIRMED"),
    pendingVerification: countStatus("PENDING_VERIFICATION"),
    underVerification: countStatus("UNDER_VERIFICATION"),
    confirmedRegistrations: countStatus("PAYMENT_CONFIRMED"),
    rejectedRegistrations: countStatus("REJECTED"),
    cancelledRegistrations: countStatus("CANCELLED"),
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

/** Profile photos live in a private bucket; admins see them through short-lived signed URLs. */
const PHOTO_URL_TTL_SECONDS = 60 * 60;

async function signProfilePhotos(supabase: ReturnType<typeof createAdminClient>, paths: string[]) {
  const urls = new Map<string, string>();
  if (paths.length === 0) return urls;
  const { data } = await supabase.storage.from("profile-photos").createSignedUrls(paths, PHOTO_URL_TTL_SECONDS);
  for (const item of data ?? []) if (item.path && item.signedUrl) urls.set(item.path, item.signedUrl);
  return urls;
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
      "id, registration_id, full_name, email, phone, committee_preference, package_id, gender, status, created_at, profile_photo_path",
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

  const rows = data ?? [];
  const photoUrls = await signProfilePhotos(
    supabase,
    rows.map((r) => r.profile_photo_path).filter((p): p is string => Boolean(p))
  );
  const registrations = rows.map((r) => ({ ...r, photoUrl: r.profile_photo_path ? photoUrls.get(r.profile_photo_path) ?? null : null }));

  return { registrations, total: count ?? 0, page, pageSize };
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

  const [{ data: history }, { data: notes }] = await Promise.all([
    supabase.from("registration_status_history").select("*, admin_profiles(name)").eq("registration_id", id).order("created_at", { ascending: false }),
    supabase.from("registration_notes").select("*, admin_profiles(name)").eq("registration_id", id).order("created_at", { ascending: false }),
  ]);

  const photoUrl = registration.profile_photo_path
    ? (await signProfilePhotos(supabase, [registration.profile_photo_path])).get(registration.profile_photo_path) ?? null
    : null;

  return { registration, photoUrl, history: history ?? [], notes: notes ?? [] };
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

/**
 * Not user-specific and not sensitive, so this reads via the admin client
 * for simplicity rather than threading a cookie-bound anon client through
 * every public page that needs to know whether registration is open.
 */
export async function getRegistrationOpen(): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("platform_settings").select("registration_open").eq("id", true).maybeSingle();
    return data?.registration_open ?? true;
  } catch {
    // No Supabase configured (e.g. local dev without credentials) — default open.
    return true;
  }
}
