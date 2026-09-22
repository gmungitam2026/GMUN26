"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getRegistrationPackageById } from "@/config/pricing";
import { sendEmail } from "@/lib/email/service";
import { registrationSchema, type RegistrationInput } from "@/lib/validation/registration";

const MAX_PROOF_BYTES = 5 * 1024 * 1024;
const ALLOWED_PROOF_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const REGISTRATION_CLOSE = "2026-10-23T23:59:59+05:30";
const MAX_REGISTRATIONS = 500;

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
  if (!/^\S{6,80}$/.test(utr.trim())) return { ok: false, error: "Enter a valid UTR or payment reference number." };

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return { ok: false, error: "Registration storage is not configured yet." };
  }

  const { count } = await supabase.from("registrations").select("id", { count: "exact", head: true });
  if ((count ?? 0) >= MAX_REGISTRATIONS) return { ok: false, error: "Registrations are full for this event." };

  const normalizedEmail = data.email.toLowerCase();
  const { data: duplicate } = await supabase
    .from("registrations")
    .select("id")
    .or(`email.eq.${normalizedEmail},phone.eq.${data.phone}`)
    .neq("status", "CANCELLED")
    .maybeSingle();
  if (duplicate) return { ok: false, error: "A registration with this email or phone number already exists." };

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
      age: data.age,
      gender: data.gender,
      email: normalizedEmail,
      phone: data.phone,
      institution: data.institution,
      state: data.state,
      city: data.city,
      committee_preference: data.committeePreference,
      mun_experience: data.hasMunExperience ? "Yes" : "No",
      mun_experience_detail: data.hasMunExperience ? data.munExperienceDetail || null : null,
      package_id: pkg.id,
      payment_amount: pkg.price,
      payment_screenshot_path: proofPath,
      payment_reference: utr.trim(),
      payment_submitted_at: new Date().toISOString(),
      status: "PENDING_VERIFICATION",
    })
    .select("id, registration_id")
    .single();

  if (insertError || !registration) {
    await supabase.storage.from("payment-proofs").remove([proofPath]);
    return { ok: false, error: insertError?.code === "23505" ? "A registration with this email or phone number already exists." : "Could not create your registration. Please try again." };
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
