import "server-only";
import * as XLSX from "xlsx";
import { createAdminClient } from "@/lib/supabase/admin";
import { committees } from "@/config/committees";

interface ExportRow {
  "Registration ID": string;
  "Registration Date": string;
  "Full Name": string;
  Email: string;
  Phone: string;
  College: string;
  Course: string;
  Year: string;
  City: string;
  "Participant Type": string;
  Committee: string;
  "Country Preference": string;
  "MUN Experience": string;
  Accommodation: string;
  "T-Shirt Size": string;
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
    return {
      "Registration ID": r.registration_id,
      "Registration Date": new Date(r.created_at).toISOString(),
      "Full Name": r.full_name,
      Email: r.email,
      Phone: r.phone,
      College: r.college,
      Course: r.course,
      Year: r.year,
      City: r.city,
      "Participant Type": r.participant_type,
      Committee: committee?.shortName ?? r.committee_preference,
      "Country Preference": r.country_preference ?? "",
      "MUN Experience": r.mun_experience,
      Accommodation: r.accommodation ? "Yes" : "No",
      "T-Shirt Size": r.tshirt_size ?? "",
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
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(paymentSummary), "Payment Summary");

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
