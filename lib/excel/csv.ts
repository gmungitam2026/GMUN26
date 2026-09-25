import "server-only";
import * as XLSX from "xlsx";
import { committees } from "@/config/committees";
import { registrationPackages } from "@/config/pricing";
import { listRegistrationsForExport, type RegistrationListFilters } from "@/lib/admin/queries";

/** @param origin Site origin for the admin-only photo links (/admin/photos/<id>). */
export async function buildRegistrationsCsv(filters: Omit<RegistrationListFilters, "page" | "pageSize">, origin: string) {
  const registrations = await listRegistrationsForExport(filters);

  const rows = registrations.map((r) => ({
    "Registration ID": r.registration_id,
    "Registration Date": new Date(r.created_at).toISOString(),
    "Full Name": r.full_name,
    "Profile Photo": r.profile_photo_path ? `${origin}/admin/photos/${r.id}` : "",
    "GITAM Student": r.is_gitam_student == null ? "" : r.is_gitam_student ? "Yes" : "No",
    Age: r.age,
    Gender: r.gender,
    Email: r.email,
    Phone: r.phone,
    Institution: r.institution,
    State: r.state,
    City: r.city,
    "1st Committee": committees.find((c) => c.id === r.committee_preference)?.shortName ?? r.committee_preference,
    "2nd Committee": committees.find((c) => c.id === r.committee_preference_2)?.shortName ?? r.committee_preference_2 ?? "",
    "Country Preference": r.country_preference ?? "",
    Package: registrationPackages.find((p) => p.id === r.package_id)?.name ?? r.package_id,
    "MUN Experience": r.mun_experience,
    "MUN Experience Detail": r.mun_experience_detail ?? "",
    Status: r.status,
  }));

  const sheet = XLSX.utils.json_to_sheet(rows);
  return XLSX.utils.sheet_to_csv(sheet);
}
