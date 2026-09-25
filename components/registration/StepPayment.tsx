"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { createRegistration, requestRegistrationUploads } from "@/lib/registration/actions";
import { createClient } from "@/lib/supabase/client";
import { ACCEPTED_IMAGE_TYPES, validateImageFile } from "@/lib/registration/photo";
import { PaymentAmountNotice } from "./PaymentAmountNotice";
import { Button } from "@/components/ui/Button";
import { eventSettings } from "@/config/event";
import type { RegistrationInput } from "@/lib/validation/registration";

export function StepPayment({
  amount,
  registrationData,
  profilePhoto,
  onSubmitted,
  onError,
}: {
  amount: number;
  registrationData: RegistrationInput;
  profilePhoto: File;
  onSubmitted: (registrationId: string) => void;
  onError: (message: string | null) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [proof, setProof] = useState<File | null>(null);
  const [utr, setUtr] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<"uploading" | "saving" | null>(null);
  const [upiCopied, setUpiCopied] = useState(false);

  async function copyUpiId() {
    try {
      await navigator.clipboard.writeText(eventSettings.upiId);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context); the ID is visible to copy by hand.
    }
  }

  // Shown in this step's own error box only (the wizard's box would duplicate it).
  function fail(message: string) {
    setError(message);
  }

  function selectProof(file: File | null) {
    setError(null);
    if (!file) return setProof(null);
    const problem = validateImageFile(file, "payment screenshot");
    if (problem) {
      setProof(null);
      return setError(problem);
    }
    setProof(file);
  }

  function submit() {
    setError(null);
    onError(null);
    if (!utr.trim()) return setError("Enter the UTR / payment reference from your payment receipt.");
    if (!proof) return setError("Upload your payment screenshot before submitting.");
    if (!confirmed) return setError("Confirm that you completed the payment to continue.");
    startTransition(async () => {
      try {
        // 1. Upload both images straight to storage via one-time signed URLs.
        setStage("uploading");
        const targets = await requestRegistrationUploads(profilePhoto.type, proof.type);
        if (!targets.ok) return fail(targets.error);
        const storage = createClient().storage;
        const [photoUpload, proofUpload] = await Promise.all([
          storage.from("profile-photos").uploadToSignedUrl(targets.photo.path, targets.photo.token, profilePhoto, { contentType: profilePhoto.type }),
          storage.from("payment-proofs").uploadToSignedUrl(targets.proof.path, targets.proof.token, proof, { contentType: proof.type }),
        ]);
        if (photoUpload.error || proofUpload.error) return fail("Your photos could not be uploaded. Check your connection and try again.");

        // 2. Save the registration; the server re-checks both uploads.
        setStage("saving");
        const result = await createRegistration(registrationData, { photoPath: targets.photo.path, proofPath: targets.proof.path }, utr);
        if (result.ok) onSubmitted(result.registrationId);
        else fail(result.error);
      } catch (submissionError) {
        console.error("Registration submission failed:", submissionError);
        fail("We could not submit your registration. Please try again.");
      } finally {
        setStage(null);
      }
    });
  }

  return (
    <div>
      <PaymentAmountNotice amount={amount} />

      <div className="flex items-baseline justify-between border-b border-line pb-6">
        <p className="font-display text-xl text-ivory">Amount Payable</p>
        <p className="font-display text-3xl text-gold">₹{amount}</p>
      </div>

      <div className="mt-8 grid gap-8 border border-line p-6 md:grid-cols-[240px_1fr]">
        <div className="mx-auto w-full max-w-[260px]">
          <Image
            src={eventSettings.paymentQrPath}
            alt={`GMUN UPI QR code. Pay ₹${amount} to UPI ID ${eventSettings.upiId}`}
            width={839}
            height={1009}
            className="w-full border border-line"
            priority
          />
          {/* On a phone you can't scan your own screen: save the image and use "scan from gallery" in any UPI app. */}
          <a
            href={eventSettings.paymentQrPath}
            download="GMUN-UPI-QR.jpg"
            className="mt-3 block text-center text-[11px] uppercase tracking-[0.12em] text-gold hover:underline"
          >
            Save QR image
          </a>
        </div>
        <div className="space-y-5 text-sm leading-relaxed text-ivory-dim">
          <p>
            Scan the official GMUN QR code with any UPI app (PhonePe, Google Pay, Paytm…) and pay{" "}
            <strong className="text-ivory">exactly ₹{amount}</strong>. The payment will be manually verified by the organising team.
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              UPI ID: <span className="text-ivory">{eventSettings.upiId}</span>
            </span>
            <button type="button" onClick={copyUpiId} className="text-[11px] uppercase tracking-[0.12em] text-gold hover:underline">
              {upiCopied ? "Copied" : "Copy"}
            </button>
          </p>
          <label className="block text-xs uppercase tracking-[0.08em] text-ivory-dim">
            UTR / payment reference
            <input value={utr} onChange={(e) => setUtr(e.target.value)} className="mt-2 h-12 w-full border border-line bg-transparent px-4 text-sm text-ivory" placeholder="Enter the UTR from your payment receipt" />
          </label>
          <label className="block text-xs uppercase tracking-[0.08em] text-ivory-dim">
            Payment screenshot
            <input type="file" accept={ACCEPTED_IMAGE_TYPES.join(",")} onChange={(e) => selectProof(e.target.files?.[0] ?? null)} className="mt-2 block w-full text-sm text-ivory-dim file:mr-4 file:border-0 file:bg-gold-fill file:px-4 file:py-2 file:text-ink" />
          </label>
          <p className="text-xs text-ivory-faint">{proof ? `Selected: ${proof.name}` : "JPG, PNG or WebP · under 5 MB"}</p>
          <label className="flex items-start gap-3 text-sm text-ivory-dim">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1 accent-[#b7924e]" />
            I confirm that I have completed the payment.
          </label>
          <Button type="button" disabled={pending} onClick={submit}>
            {stage === "uploading" ? "Uploading photos…" : pending ? "Submitting…" : "Submit Registration"}
          </Button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-6 border border-danger/40 bg-danger/5 p-4 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
