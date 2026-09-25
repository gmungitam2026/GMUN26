"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getRegistrationPackageById } from "@/config/pricing";
import { sendEmail } from "@/lib/email/service";
import { registrationSchema, type RegistrationInput } from "@/lib/validation/registration";

const MAX_PROOF_BYTES = 5 * 1024 * 1024;
const ALLOWED_PROOF_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const REGISTRATION_CLOSE = "2026-10-23T23:59:59+05:30";
const MAX_REGISTRATIONS = 500;
/** Unique indexes from supabase/migrations/0006 and 0008, mapped to a message for the delegate. */
const UNIQUE_INDEX_ERRORS: Record<string, string> = {
  registrations_payment_reference_key: "This UTR / payment reference has already been used for another registration.",
  registrations_email_key: "A registration with this email address already exists.",
  registrations_phone_key: "A registration with this mobile number already exists.",
};
const DUPLICATE_UTR_ERROR = UNIQUE_INDEX_ERRORS.registrations_payment_reference_key;

/** UTRs are compared without spaces and case-insensitively. */
function normalizeUtr(utr: string) {
  return utr.replace(/\s+/g, "").toUpperCase();
}

export interface CreateRegistrationResult {
  ok: true;
  registrationId: string;
  amount: number;
}

export interface CreateRegistrationError {
  ok: false;
  error: string;
}

export async function createRegistration(
  input: RegistrationInput,
  paymentProof: File,
  utr: string
): Promise<CreateRegistrationResult | CreateRegistrationError> {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid registration details." };
  const data = parsed.data;
  const pkg = getRegistrationPackageById(data.packageId);

  if (!pkg) return { ok: false, error: "Selected package is no longer available. Please choose another." };
  if (new Date() > new Date(REGISTRATION_CLOSE)) return { ok: false, error: "Registrations are now closed." };
  if (!paymentProof || !ALLOWED_PROOF_TYPES.has(paymentProof.type) || paymentProof.size > MAX_PROOF_BYTES) {
    return { ok: false, error: "Upload a JPG, PNG, or WebP payment screenshot under 5 MB." };
  }
  const normalizedUtr = normalizeUtr(utr);
  if (!/^[A-Z0-9/-]{6,80}$/.test(normalizedUtr)) {
    return { ok: false, error: "Enter a valid UTR or payment reference number (letters and digits only)." };
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return { ok: false, error: "Registration storage is not configured yet." };
  }

  // Rejected registrations don't hold a seat.
  const { count } = await supabase
    .from("registrations")
    .select("id", { count: "exact", head: true })
    .neq("status", "REJECTED");
  if ((count ?? 0) >= MAX_REGISTRATIONS) return { ok: false, error: "Registrations are full for this event." };

  const normalizedEmail = data.email.toLowerCase();
  // Email and phone are unique across all registrations, whatever their
  // status. (Fetches up to two rows: email and phone may match different ones.)
  const { data: duplicates } = await supabase
    .from("registrations")
    .select("email, phone")
    .or(`email.eq.${normalizedEmail},phone.eq.${data.phone}`)
    .limit(2);
  if (duplicates?.some((d) => d.email === normalizedEmail)) return { ok: false, error: UNIQUE_INDEX_ERRORS.registrations_email_key };
  if (duplicates?.length) return { ok: false, error: UNIQUE_INDEX_ERRORS.registrations_phone_key };

  // Checked here for a friendly message before uploading; the unique index
  // still enforces it if two submissions race.
  const { data: utrInUse } = await supabase
    .from("registrations")
    .select("id")
    .ilike("payment_reference", normalizedUtr)
    .limit(1)
    .maybeSingle();
  if (utrInUse) return { ok: false, error: DUPLICATE_UTR_ERROR };

  const extension = paymentProof.type === "image/png" ? "png" : paymentProof.type === "image/webp" ? "webp" : "jpg";
  const proofPath = `2026/${crypto.randomUUID()}/payment-proof.${extension}`;
  const upload = await supabase.storage.from("payment-proofs").upload(proofPath, paymentProof, {
    contentType: paymentProof.type,
    upsert: false,
  });
  if (upload.error) return { ok: false, error: "Could not securely upload the payment proof. Please try again." };

  const { data: registration, error: insertError } = await supabase
    .from("registrations")
    .insert({
      full_name: data.fullName,
      is_gitam_student: data.gitamStudent === "Yes",
      age: data.age,
      gender: data.gender,
      email: normalizedEmail,
      phone: data.phone,
      institution: data.institution,
      state: data.state,
      city: data.city,
      committee_preference: data.committeePreference,
      committee_preference_2: data.committeePreference2,
      country_preference: data.countryPreference,
      mun_experience: data.hasMunExperience ? "Yes" : "No",
      mun_experience_detail: data.hasMunExperience ? data.munExperienceDetail || null : null,
      package_id: pkg.id,
      payment_amount: pkg.price,
      payment_screenshot_path: proofPath,
      payment_reference: normalizedUtr,
      payment_submitted_at: new Date().toISOString(),
      status: "PENDING_VERIFICATION",
    })
    .select("id, registration_id")
    .single();

  if (insertError || !registration) {
    await supabase.storage.from("payment-proofs").remove([proofPath]);
    if (insertError?.code === "23505") {
      const index = Object.keys(UNIQUE_INDEX_ERRORS).find((name) => insertError.message.includes(name));
      return { ok: false, error: index ? UNIQUE_INDEX_ERRORS[index] : "A registration with these details already exists." };
    }
    return { ok: false, error: "Could not create your registration. Please try again." };
  }

  await supabase.from("registration_status_history").insert({
    registration_id: registration.id,
    old_status: null,
    new_status: "PENDING_VERIFICATION",
    note: "Submitted by participant.",
  });

  try {
    await sendEmail({
      to: normalizedEmail,
      subject: `GMUN 5.0 · Registration submitted (${registration.registration_id})`,
      html: `<p>Hi ${data.fullName},</p><p>Your registration <strong>${registration.registration_id}</strong> has been submitted and is awaiting manual payment verification.</p>`,
    });
  } catch (error) {
    console.error("Registration email failed:", error);
  }

  return { ok: true, registrationId: registration.registration_id, amount: pkg.price };
}
