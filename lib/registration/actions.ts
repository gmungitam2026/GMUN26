"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getRegistrationPackageById } from "@/config/pricing";
import { sendEmail } from "@/lib/email/service";
import { registrationReceivedEmail } from "@/lib/email/templates";
import { registrationSchema, type RegistrationInput } from "@/lib/validation/registration";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const IMAGE_EXTENSIONS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
/** Storage buckets for each registration upload (see migration 0009). */
const UPLOADS = {
  photo: { bucket: "profile-photos", file: "profile-photo", label: "profile photo" },
  proof: { bucket: "payment-proofs", file: "payment-proof", label: "payment screenshot" },
} as const;
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

export interface RegistrationUploadTarget {
  path: string;
  token: string;
}

/**
 * Step one of submitting: issue one-time signed upload URLs so the browser can
 * upload the profile photo and payment screenshot straight to Supabase Storage
 * (a Server Action body is capped at 1 MB). Both files share a fresh random
 * folder; createRegistration then verifies what actually arrived.
 */
export async function requestRegistrationUploads(
  photoType: string,
  proofType: string
): Promise<{ ok: true; photo: RegistrationUploadTarget; proof: RegistrationUploadTarget } | CreateRegistrationError> {
  if (new Date() > new Date(REGISTRATION_CLOSE)) return { ok: false, error: "Registrations are now closed." };
  const photoExt = IMAGE_EXTENSIONS[photoType];
  const proofExt = IMAGE_EXTENSIONS[proofType];
  if (!photoExt) return { ok: false, error: "Your profile photo must be a JPG, PNG, or WebP image." };
  if (!proofExt) return { ok: false, error: "Your payment screenshot must be a JPG, PNG, or WebP image." };

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return { ok: false, error: "Registration storage is not configured yet." };
  }

  const folder = `2026/${crypto.randomUUID()}`;
  const [photo, proof] = await Promise.all([
    supabase.storage.from(UPLOADS.photo.bucket).createSignedUploadUrl(`${folder}/${UPLOADS.photo.file}.${photoExt}`),
    supabase.storage.from(UPLOADS.proof.bucket).createSignedUploadUrl(`${folder}/${UPLOADS.proof.file}.${proofExt}`),
  ]);
  if (photo.error || proof.error) return { ok: false, error: "Could not prepare the upload. Please try again." };

  return {
    ok: true,
    photo: { path: photo.data.path, token: photo.data.token },
    proof: { path: proof.data.path, token: proof.data.token },
  };
}

// Paths issued by requestRegistrationUploads: 2026/<uuid>/<file>.<ext>
const UPLOAD_PATH = /^2026\/([0-9a-f-]{36})\/(profile-photo|payment-proof)\.(jpg|png|webp)$/;

/**
 * Step two: save the registration. The uploaded files are checked (present,
 * an allowed image type, under 5 MB) and are deleted again if the
 * registration is not saved, so failed attempts don't leave files behind.
 */
export async function createRegistration(
  input: RegistrationInput,
  uploads: { photoPath: string; proofPath: string },
  utr: string
): Promise<CreateRegistrationResult | CreateRegistrationError> {
  const photoMatch = UPLOAD_PATH.exec(uploads.photoPath);
  const proofMatch = UPLOAD_PATH.exec(uploads.proofPath);
  if (
    !photoMatch ||
    !proofMatch ||
    photoMatch[2] !== UPLOADS.photo.file ||
    proofMatch[2] !== UPLOADS.proof.file ||
    photoMatch[1] !== proofMatch[1]
  ) {
    return { ok: false, error: "Upload your profile photo and payment screenshot again." };
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return { ok: false, error: "Registration storage is not configured yet." };
  }

  const result = await saveRegistration(supabase, input, uploads, utr);
  if (!result.ok) {
    // Only clean up files that no saved registration points at.
    const { data: inUse } = await supabase
      .from("registrations")
      .select("id")
      .or(`profile_photo_path.eq.${uploads.photoPath},payment_screenshot_path.eq.${uploads.proofPath}`)
      .limit(1);
    if (!inUse?.length) {
      await Promise.all([
        supabase.storage.from(UPLOADS.photo.bucket).remove([uploads.photoPath]),
        supabase.storage.from(UPLOADS.proof.bucket).remove([uploads.proofPath]),
      ]);
    }
  }
  return result;
}

async function checkUpload(
  supabase: ReturnType<typeof createAdminClient>,
  kind: keyof typeof UPLOADS,
  path: string
): Promise<string | null> {
  const { bucket, label } = UPLOADS[kind];
  const { data: info, error } = await supabase.storage.from(bucket).info(path);
  if (error || !info) return `Your ${label} did not upload. Please try again.`;
  if ((info.size ?? 0) > MAX_UPLOAD_BYTES) return `Your ${label} must be under 5 MB.`;
  if (!info.contentType || !IMAGE_EXTENSIONS[info.contentType]) return `Your ${label} must be a JPG, PNG, or WebP image.`;
  return null;
}

async function saveRegistration(
  supabase: ReturnType<typeof createAdminClient>,
  input: RegistrationInput,
  uploads: { photoPath: string; proofPath: string },
  utr: string
): Promise<CreateRegistrationResult | CreateRegistrationError> {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid registration details." };
  const data = parsed.data;
  const pkg = getRegistrationPackageById(data.packageId);

  if (!pkg) return { ok: false, error: "Selected package is no longer available. Please choose another." };
  if (new Date() > new Date(REGISTRATION_CLOSE)) return { ok: false, error: "Registrations are now closed." };
  const normalizedUtr = normalizeUtr(utr);
  if (!/^[A-Z0-9/-]{6,80}$/.test(normalizedUtr)) {
    return { ok: false, error: "Enter a valid UTR or payment reference number (letters and digits only)." };
  }

  const uploadError =
    (await checkUpload(supabase, "photo", uploads.photoPath)) ?? (await checkUpload(supabase, "proof", uploads.proofPath));
  if (uploadError) return { ok: false, error: uploadError };

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

  // Checked here for a friendly message; the unique index still enforces it
  // if two submissions race.
  const { data: utrInUse } = await supabase
    .from("registrations")
    .select("id")
    .ilike("payment_reference", normalizedUtr)
    .limit(1)
    .maybeSingle();
  if (utrInUse) return { ok: false, error: DUPLICATE_UTR_ERROR };

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
      payment_screenshot_path: uploads.proofPath,
      profile_photo_path: uploads.photoPath,
      payment_reference: normalizedUtr,
      payment_submitted_at: new Date().toISOString(),
      status: "PENDING_VERIFICATION",
    })
    .select("id, registration_id")
    .single();

  if (insertError || !registration) {
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
    await sendEmail(
      registrationReceivedEmail({
        registration_id: registration.registration_id,
        full_name: data.fullName,
        email: normalizedEmail,
        committee_preference: data.committeePreference,
        committee_preference_2: data.committeePreference2,
        country_preference: data.countryPreference,
        package_id: pkg.id,
        payment_amount: pkg.price,
        payment_reference: normalizedUtr,
      })
    );
  } catch (error) {
    console.error("Registration email failed:", error);
  }

  return { ok: true, registrationId: registration.registration_id, amount: pkg.price };
}
