import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth callback for Supabase Auth (Google). Exchanges the auth code for a
 * session, then hands off to the admin layout's own authorization check
 * (admin_profiles lookup) — this route only establishes the Supabase
 * session, it does not itself decide who counts as an admin.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next") ?? "/admin";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/admin";

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch {
      // Falls through to the failure redirect below.
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=oauth_failed`);
}
