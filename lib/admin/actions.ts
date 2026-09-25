"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdminSession } from "@/lib/supabase/dal";
import { adminEditSchema, type AdminEditInput } from "@/lib/validation/registration";
import { sendEmail } from "@/lib/email/service";
import { statusChangeEmail } from "@/lib/email/templates";

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
      is_gitam_student: data.gitamStudent === "Yes",
      age: data.age,
      gender: data.gender,
      email: data.email.toLowerCase(),
      phone: data.phone,
      institution: data.institution,
      state: data.state,
      city: data.city,
      committee_preference: data.committeePreference,
      committee_preference_2: data.committeePreference2,
      country_preference: data.countryPreference,
      package_id: data.packageId,
      mun_experience: data.hasMunExperience ? "Yes" : "No",
      mun_experience_detail: data.hasMunExperience ? data.munExperienceDetail || null : null,
    })
    .eq("id", registrationDbId);

  if (error) {
    const duplicate = error.code === "23505";
    const field = error.message.includes("registrations_email_key")
      ? "email address"
      : error.message.includes("registrations_phone_key")
        ? "mobile number"
        : "email or mobile number";
    return {
      ok: false,
      error: duplicate ? `Another registration already uses this ${field}.` : "Could not save changes. Please try again.",
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

const allowedTransitions: Record<string, string[]> = {
  PENDING_VERIFICATION: ["PAYMENT_CONFIRMED", "UNDER_VERIFICATION", "REJECTED", "CANCELLED"],
  UNDER_VERIFICATION: ["PAYMENT_CONFIRMED", "REJECTED", "CANCELLED"],
  PAYMENT_CONFIRMED: ["CANCELLED"],
  REJECTED: ["CANCELLED"],
  CANCELLED: [],
};

export async function updateRegistrationStatus(
  registrationDbId: string,
  nextStatus: string,
  note: string
): Promise<UpdateRegistrationResult> {
  const session = await verifyAdminSession();
  if (!allowedTransitions[nextStatus] && !Object.keys(allowedTransitions).includes(nextStatus)) {
    return { ok: false, error: "Invalid registration status." };
  }

  const supabase = createAdminClient();
  const { data: current, error: readError } = await supabase
    .from("registrations")
    .select("status, registration_id, full_name, email, committee_preference, committee_preference_2, country_preference, package_id, payment_amount, payment_reference")
    .eq("id", registrationDbId)
    .maybeSingle();
  if (readError || !current) return { ok: false, error: "Registration was not found." };
  if (!allowedTransitions[current.status]?.includes(nextStatus)) {
    return { ok: false, error: `Cannot change ${current.status} to ${nextStatus}.` };
  }

  const now = new Date().toISOString();
  const update = {
    status: nextStatus,
    updated_at: now,
    verified_at: nextStatus === "PAYMENT_CONFIRMED" ? now : null,
    verified_by: nextStatus === "PAYMENT_CONFIRMED" ? session.userId : null,
  };
  const { error: updateError } = await supabase.from("registrations").update(update).eq("id", registrationDbId);
  if (updateError) return { ok: false, error: "Could not update registration status." };

  const { error: historyError } = await supabase.from("registration_status_history").insert({
    registration_id: registrationDbId,
    old_status: current.status,
    new_status: nextStatus,
    changed_by: session.userId,
    note: note.trim() || null,
  });
  if (historyError) return { ok: false, error: "Status changed, but history could not be recorded." };

  const email = statusChangeEmail(current, nextStatus, note);
  if (email) {
    try {
      await sendEmail(email);
    } catch (error) {
      console.error("Registration status email failed:", error);
    }
  }

  revalidatePath(`/admin/registrations/${registrationDbId}`);
  revalidatePath("/admin/registrations");
  revalidatePath("/admin");
  return { ok: true };
}

export async function addRegistrationNote(
  registrationDbId: string,
  note: string
): Promise<UpdateRegistrationResult> {
  const session = await verifyAdminSession();
  const trimmed = note.trim();
  if (!trimmed || trimmed.length > 2000) return { ok: false, error: "Enter a note of 1 to 2,000 characters." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("registration_notes").insert({
    registration_id: registrationDbId,
    author_id: session.userId,
    note: trimmed,
  });
  if (error) return { ok: false, error: "Could not save the internal note." };
  revalidatePath(`/admin/registrations/${registrationDbId}`);
  return { ok: true };
}

export async function getPaymentProofUrl(registrationDbId: string): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  await verifyAdminSession();
  const supabase = createAdminClient();
  const { data: registration } = await supabase
    .from("registrations")
    .select("payment_screenshot_path")
    .eq("id", registrationDbId)
    .maybeSingle();
  if (!registration?.payment_screenshot_path) return { ok: false, error: "No payment proof is attached." };

  const { data, error } = await supabase.storage
    .from("payment-proofs")
    .createSignedUrl(registration.payment_screenshot_path, 300);
  if (error || !data?.signedUrl) return { ok: false, error: "Could not open the payment proof." };
  return { ok: true, url: data.signedUrl };
}
