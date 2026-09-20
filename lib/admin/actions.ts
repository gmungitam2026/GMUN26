"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdminSession } from "@/lib/supabase/dal";
import { adminEditSchema, type AdminEditInput } from "@/lib/validation/registration";

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export interface UpdateRegistrationResult {
  ok: boolean;
  error?: string;
}

/**
 * Lets an authorized admin correct a registrant's details (typos, a wrong
 * committee pick, etc). Re-checks admin authorization itself rather than
 * relying solely on the page having already gated access — a Server Action
 * is its own public-facing endpoint.
 */
export async function updateRegistration(
  registrationDbId: string,
  input: AdminEditInput
): Promise<UpdateRegistrationResult> {
  await verifyAdminSession();

  const parsed = adminEditSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }
  const data = parsed.data;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("registrations")
    .update({
      full_name: data.fullName,
      age: data.age,
      gender: data.gender,
      email: data.email.toLowerCase(),
      phone: data.phone,
      institution: data.institution,
      state: data.state,
      city: data.city,
      committee_preference: data.committeePreference,
      package_id: data.packageId,
      mun_experience: data.hasMunExperience ? "Yes" : "No",
      mun_experience_detail: data.hasMunExperience ? data.munExperienceDetail || null : null,
    })
    .eq("id", registrationDbId);

  if (error) {
    const duplicate = error.code === "23505";
    return {
      ok: false,
      error: duplicate ? "Another registration already uses this email or phone number." : "Could not save changes. Please try again.",
    };
  }

  revalidatePath(`/admin/registrations/${registrationDbId}`);
  revalidatePath("/admin/registrations");
  return { ok: true };
}

export async function setRegistrationOpen(open: boolean): Promise<UpdateRegistrationResult> {
  await verifyAdminSession();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("platform_settings")
    .update({ registration_open: open })
    .eq("id", true);

  if (error) {
    return { ok: false, error: "Could not update registration status. Please try again." };
  }

  revalidatePath("/register");
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { ok: true };
}
