import "server-only";
import * as XLSX from "xlsx";
import { createAdminClient } from "@/lib/supabase/admin";
import { committees } from "@/config/committees";
import { registrationPackages } from "@/config/pricing";

const STATUS_LABELS: Record<string, string> = {
  PENDING_VERIFICATION: "Pending verification",
  UNDER_VERIFICATION: "Under verification",
  PAYMENT_CONFIRMED: "Payment confirmed",
  REJECTED: "Payment rejected",
  CANCELLED: "Cancelled",
};

const committeeName = (id: string | null) => (id ? committees.find((c) => c.id === id)?.shortName ?? id : "");
const packageName = (id: string) => registrationPackages.find((p) => p.id === id)?.name ?? id;
const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) : "";

const PHOTO_COLUMN = "Profile Photo";

/**
 * A sheet whose columns are sized to their content, so it's readable without
 * resizing. URLs in the Profile Photo column become clickable "View photo"
 * links.
 */
function sheet(rows: Record<string, unknown>[], emptyMessage: string) {
  if (rows.length === 0) return XLSX.utils.json_to_sheet([{ Note: emptyMessage }]);
  const ws = XLSX.utils.json_to_sheet(rows);
  const keys = Object.keys(rows[0]);
  ws["!cols"] = keys.map((key) => ({
    wch:
      key === PHOTO_COLUMN
        ? 14
        : Math.min(60, Math.max(key.length, ...rows.map((r) => String(r[key] ?? "").length)) + 2),
  }));

  const photoCol = keys.indexOf(PHOTO_COLUMN);
  if (photoCol !== -1) {
    rows.forEach((row, i) => {
      const url = row[PHOTO_COLUMN];
      if (typeof url !== "string" || !url) return;
      const ref = XLSX.utils.encode_cell({ r: i + 1, c: photoCol });
      ws[ref] = { t: "s", v: "View photo", l: { Target: url, Tooltip: "Opens the photo (admin sign-in required)" } };
    });
  }
  return ws;
}

/**
 * @param origin Site origin for the admin-only photo links (/admin/photos/<id>),
 *   taken from the export request so links point at the deployment in use.
 */
export async function buildRegistrationsWorkbook(origin: string): Promise<Buffer> {
  const photoLink = (r: { id: string; profile_photo_path: string | null }) =>
    r.profile_photo_path ? `${origin}/admin/photos/${r.id}` : "";

  const supabase = createAdminClient();

  const [{ data: registrations }, { data: history }] = await Promise.all([
    supabase.from("registrations").select("*").order("created_at", { ascending: true }),
    supabase
      .from("registration_status_history")
      .select("registration_id, new_status, note, created_at")
      .eq("new_status", "REJECTED")
      .order("created_at", { ascending: false }),
  ]);

  const all = registrations ?? [];

  // Most recent rejection entry per registration (history is newest-first).
  const rejection = new Map<string, { note: string | null; created_at: string }>();
  for (const h of history ?? []) if (!rejection.has(h.registration_id)) rejection.set(h.registration_id, h);

  const fullRow = (r: (typeof all)[number]) => ({
    "Registration ID": r.registration_id,
    Status: STATUS_LABELS[r.status] ?? r.status,
    "Registered On": formatDate(r.created_at),
    "Full Name": r.full_name,
    [PHOTO_COLUMN]: photoLink(r),
    "GITAM Student": r.is_gitam_student == null ? "" : r.is_gitam_student ? "Yes" : "No",
    Age: r.age,
    Gender: r.gender,
    Email: r.email,
    Phone: r.phone,
    Institution: r.institution,
    State: r.state,
    City: r.city,
    "1st Committee": committeeName(r.committee_preference),
    "2nd Committee": committeeName(r.committee_preference_2),
    "Country Preference": r.country_preference ?? "",
    Package: packageName(r.package_id),
    "Amount (₹)": r.payment_amount ?? "",
    "UTR / Reference": r.payment_reference ?? "",
    "Payment Submitted": formatDate(r.payment_submitted_at),
    "Verified On": formatDate(r.verified_at),
    "MUN Experience": r.mun_experience,
    "MUN Experience Detail": r.mun_experience_detail ?? "",
  });

  const confirmed = all.filter((r) => r.status === "PAYMENT_CONFIRMED");
  const awaiting = all.filter((r) => r.status === "PENDING_VERIFICATION" || r.status === "UNDER_VERIFICATION");
  const failed = all.filter((r) => r.status === "REJECTED");

  // Contact-first layout so the team can work down the list and follow up.
  const failedRows = failed.map((r) => {
    const rej = rejection.get(r.id);
    return {
      "Registration ID": r.registration_id,
      "Full Name": r.full_name,
      [PHOTO_COLUMN]: photoLink(r),
      Phone: r.phone,
      Email: r.email,
      Institution: r.institution,
      City: r.city,
      State: r.state,
      "GITAM Student": r.is_gitam_student == null ? "" : r.is_gitam_student ? "Yes" : "No",
      "1st Committee": committeeName(r.committee_preference),
      Package: packageName(r.package_id),
      "Amount (₹)": r.payment_amount ?? "",
      "UTR / Reference": r.payment_reference ?? "",
      "Payment Submitted": formatDate(r.payment_submitted_at),
      "Rejected On": formatDate(rej?.created_at ?? null),
      "Rejection Reason": rej?.note ?? "",
    };
  });

  // Summary figures count confirmed payments only.
  const committeeSummary = committees.map((c) => ({
    Committee: c.shortName,
    "Confirmed (1st preference)": confirmed.filter((r) => r.committee_preference === c.id).length,
  }));
  const packageSummary = registrationPackages.map((p) => {
    const count = confirmed.filter((r) => r.package_id === p.id).length;
    return { Package: p.name, "Price (₹)": p.price, Confirmed: count, "Revenue (₹)": count * p.price };
  });
  const statusSummary = Object.entries(STATUS_LABELS).map(([status, label]) => ({
    Status: label,
    Count: all.filter((r) => r.status === status).length,
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet(confirmed.map(fullRow), "No confirmed registrations yet."), "Confirmed Registrations");
  XLSX.utils.book_append_sheet(workbook, sheet(failedRows, "No failed payments."), "Failed Payments");
  XLSX.utils.book_append_sheet(workbook, sheet(awaiting.map(fullRow), "Nothing awaiting verification."), "Awaiting Verification");
  XLSX.utils.book_append_sheet(workbook, sheet(all.map(fullRow), "No registrations yet."), "All Submissions");
  XLSX.utils.book_append_sheet(workbook, sheet(committeeSummary, ""), "Committee Summary");
  XLSX.utils.book_append_sheet(workbook, sheet(packageSummary, ""), "Package Summary");
  XLSX.utils.book_append_sheet(workbook, sheet(statusSummary, ""), "Status Summary");

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
