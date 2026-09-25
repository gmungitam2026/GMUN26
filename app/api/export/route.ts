import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/dal";
import { buildRegistrationsWorkbook } from "@/lib/excel/export";

export async function GET(request: Request) {
  await verifyAdminSession(); // redirects to /admin/login if not an authorized admin

  const buffer = await buildRegistrationsWorkbook(new URL(request.url).origin);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="MUN_Registrations_2026.xlsx"`,
    },
  });
}
