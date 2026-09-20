import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/dal";
import { buildRegistrationsCsv } from "@/lib/excel/csv";

export async function GET(request: NextRequest) {
  await verifyAdminSession(); // redirects to /admin/login if not an authorized admin

  const params = request.nextUrl.searchParams;
  const csv = await buildRegistrationsCsv({
    query: params.get("q") ?? undefined,
    committee: params.get("committee") ?? undefined,
    paymentStatus: params.get("status") ?? undefined,
    packageId: params.get("package") ?? undefined,
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="GMUN_Registrations_${Date.now()}.csv"`,
    },
  });
}
