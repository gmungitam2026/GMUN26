"use client";

import { useState, useTransition } from "react";
import { createRegistration, requestRegistrationUploads } from "@/lib/registration/actions";
import { createClient } from "@/lib/supabase/client";
import { ACCEPTED_IMAGE_TYPES, validateImageFile } from "@/lib/registration/photo";
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
      <div className="flex items-baseline justify-between border-b border-line pb-6">
        <p className="font-display text-xl text-ivory">Amount Payable</p>
        <p className="font-display text-3xl text-gold">₹{amount}</p>
      </div>

      <div className="mt-8 grid gap-8 border border-line p-6 md:grid-cols-[220px_1fr]">
        <div className="flex aspect-square items-center justify-center border border-line bg-white p-4 text-center text-xs text-black">
          QR PLACEHOLDER
          <br />
          {eventSettings.upiId}
        </div>
        <div className="space-y-5 text-sm leading-relaxed text-ivory-dim">
          <p>Scan the official MUN QR code and pay exactly ₹{amount}. The payment will be manually verified by the organising team.</p>
          <p>UPI ID: <span className="text-ivory">{eventSettings.upiId}</span></p>
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
