import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/dal";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Permanent, admin-only link to a delegate's profile photo — used in the
 * Excel / CSV exports. Checks the admin session on every visit, then
 * redirects to a fresh short-lived signed URL for the private file, so a
 * forwarded spreadsheet never exposes photos to anyone outside the team.
 */
export async function GET(_request: Request, { params }: RouteContext<"/admin/photos/[id]">) {
  await verifyAdminSession(); // redirects to /admin/login if not an authorized admin

  const { id } = await params;
  const supabase = createAdminClient();
  const { data: registration } = await supabase
    .from("registrations")
    .select("profile_photo_path")
    .eq("id", id)
    .maybeSingle();

  if (!registration?.profile_photo_path) {
    return new NextResponse("No profile photo on file for this registration.", { status: 404 });
  }

  const { data, error } = await supabase.storage
    .from("profile-photos")
    .createSignedUrl(registration.profile_photo_path, 300);
  if (error || !data?.signedUrl) {
    return new NextResponse("Could not open the profile photo.", { status: 502 });
  }

  return NextResponse.redirect(data.signedUrl);
}
