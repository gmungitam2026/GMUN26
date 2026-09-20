import "server-only";
import * as XLSX from "xlsx";
import { createAdminClient } from "@/lib/supabase/admin";
import { committees } from "@/config/committees";
import { registrationPackages } from "@/config/pricing";

interface ExportRow {
  "Registration ID": string;
  "Registration Date": string;
  "Full Name": string;
  Age: number | string;
  Gender: string;
  Email: string;
  Phone: string;
  Institution: string;
  State: string;
  City: string;
  Committee: string;
  Package: string;
  "MUN Experience": string;
  "MUN Experience Detail": string;
  Amount: number | string;
  "Payment Status": string;
  "Payment Provider": string;
  "Order ID": string;
  "Payment ID": string;
  "Payment Date": string;
}

export async function buildRegistrationsWorkbook(): Promise<Buffer> {
  const supabase = createAdminClient();

  const { data: registrations } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: true });

  const { data: payments } = await supabase.from("payments").select("*");

  const paymentByRegistration = new Map((payments ?? []).map((p) => [p.registration_id, p]));

  const rows: ExportRow[] = (registrations ?? []).map((r) => {
    const payment = paymentByRegistration.get(r.id);
    const committee = committees.find((c) => c.id === r.committee_preference);
    const pkg = registrationPackages.find((p) => p.id === r.package_id);
    return {
      "Registration ID": r.registration_id,
      "Registration Date": new Date(r.created_at).toISOString(),
      "Full Name": r.full_name,
      Age: r.age,
      Gender: r.gender,
      Email: r.email,
      Phone: r.phone,
      Institution: r.institution,
      State: r.state,
      City: r.city,
      Committee: committee?.shortName ?? r.committee_preference,
      Package: pkg?.name ?? r.package_id,
      "MUN Experience": r.mun_experience,
      "MUN Experience Detail": r.mun_experience_detail ?? "",
      Amount: payment?.amount ?? "",
      "Payment Status": payment?.status ?? r.status,
      "Payment Provider": payment?.provider ?? "",
      "Order ID": payment?.order_id ?? "",
      "Payment ID": payment?.payment_id ?? "",
      "Payment Date": payment?.updated_at ? new Date(payment.updated_at).toISOString() : "",
    };
  });

  const paid = rows.filter((r) => r["Payment Status"] === "PAID");
  const pending = rows.filter((r) => r["Payment Status"] === "PENDING");

  const committeeSummary = committees.map((c) => ({
    Committee: c.shortName,
    Registrations: rows.filter((r) => r.Committee === c.shortName).length,
  }));

  const packageSummary = registrationPackages.map((p) => ({
    Package: p.name,
    Price: p.price,
    Registrations: rows.filter((r) => r.Package === p.name).length,
  }));

  const paymentSummary = [
    { Status: "PAID", Count: rows.filter((r) => r["Payment Status"] === "PAID").length },
    { Status: "PENDING", Count: rows.filter((r) => r["Payment Status"] === "PENDING").length },
    { Status: "FAILED", Count: rows.filter((r) => r["Payment Status"] === "FAILED").length },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), "All Registrations");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(paid), "Paid Registrations");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(pending), "Pending Payments");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(committeeSummary), "Committee Summary");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(packageSummary), "Package Summary");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(paymentSummary), "Payment Summary");

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
