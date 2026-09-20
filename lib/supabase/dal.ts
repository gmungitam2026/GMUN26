import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./server";

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: "ADMIN" | "SUPER_ADMIN";
}

/**
 * Verifies the current request belongs to a signed-in Supabase user who also
 * has a row in `admin_profiles`. Not every authenticated Supabase user is an
 * admin — this is the explicit authorization check the platform requires.
 * Memoized per-request with React's `cache` so repeated calls in a render
 * pass don't repeat the database round trip.
 */
export const verifyAdminSession = cache(async (): Promise<AdminSession> => {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirect("/admin/login?error=not_configured");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("id, name, email, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/admin/login?error=not_authorized");
  }

  return {
    userId: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
  };
});
