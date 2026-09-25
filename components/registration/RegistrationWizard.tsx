"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { site } from "@/config/site";
import { registrationPackages } from "@/config/pricing";
import { committees } from "@/config/committees";
import {
  detailsSchema,
  preferencesSchemaValidated,
  type DetailsInput,
  type PreferencesInput,
} from "@/lib/validation/registration";
import { ProgressIndicator } from "./ProgressIndicator";
import { StepDetails } from "./StepDetails";
import { StepPreferences } from "./StepPreferences";
import { StepReview } from "./StepReview";
import { StepPayment } from "./StepPayment";
import { Button } from "@/components/ui/Button";
import { shrinkProfilePhoto, validateImageFile } from "@/lib/registration/photo";

const emptyDetails: DetailsInput = {
  fullName: "",
  gitamStudent: "" as DetailsInput["gitamStudent"],
  age: NaN,
  gender: "Prefer not to say",
  phone: "",
  email: "",
  institution: "",
  state: "" as DetailsInput["state"],
  city: "",
};

function buildEmptyPreferences(initialCommittee?: string): PreferencesInput {
  // /register?committee=<id> (from a committee page) pre-selects the 1st preference.
  const committeePreference = committees.some((c) => c.id === initialCommittee) ? initialCommittee! : "";
  return {
    committeePreference,
    committeePreference2: "",
    countryPreference: "",
    hasMunExperience: false,
    munExperienceDetail: "",
    packageId: registrationPackages[0].id,
  };
}

export function RegistrationWizard({ initialCommittee }: { initialCommittee?: string }) {
  const router = useRouter();
  const minPrice = Math.min(...registrationPackages.map((p) => p.price));

  const [step, setStep] = useState(1);

  // Each step starts at the top of the page, not at the previous step's scroll
  // position. Skipped on first render so arriving on /register isn't affected.
  const renderedStep = useRef(step);
  useEffect(() => {
    if (renderedStep.current === step) return;
    renderedStep.current = step;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);
  const [details, setDetails] = useState<DetailsInput>(emptyDetails);
  const [preferences, setPreferences] = useState<PreferencesInput>(() => buildEmptyPreferences(initialCommittee));
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | undefined>();
  const [photoProcessing, setPhotoProcessing] = useState(false);

  const [detailsErrors, setDetailsErrors] = useState<Partial<Record<keyof DetailsInput, string>>>({});
  const [preferencesErrors, setPreferencesErrors] = useState<Partial<Record<keyof PreferencesInput, string>>>({});
  const [termsError, setTermsError] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateDetails<K extends keyof DetailsInput>(key: K, value: DetailsInput[K]) {
    setDetails((d) => ({ ...d, [key]: value }));
  }
  function updatePreferences<K extends keyof PreferencesInput>(key: K, value: PreferencesInput[K]) {
    setPreferences((p) => ({ ...p, [key]: value }));
  }

  async function selectProfilePhoto(file: File | null) {
    if (!file) return;
    const error = validateImageFile(file, "profile photo");
    if (error) {
      setPhotoError(error);
      return;
    }
    setPhotoError(undefined);
    setPhotoProcessing(true);
    setProfilePhoto(await shrinkProfilePhoto(file));
    setPhotoProcessing(false);
  }

  function goNextFromDetails() {
    const result = detailsSchema.safeParse(details);
    const missingPhoto = !profilePhoto;
    if (missingPhoto) setPhotoError("Upload a profile photo to continue.");
    if (!result.success) {
      const errs: typeof detailsErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof DetailsInput;
        if (!errs[key]) errs[key] = issue.message;
      }
      setDetailsErrors(errs);
      return;
    }
    setDetailsErrors({});
    if (missingPhoto) return;
    setStep(2);
  }

  function goNextFromPreferences() {
    const result = preferencesSchemaValidated.safeParse(preferences);
    if (!result.success) {
      const errs: typeof preferencesErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof PreferencesInput;
        if (!errs[key]) errs[key] = issue.message;
      }
      setPreferencesErrors(errs);
      return;
    }
    setPreferencesErrors({});
    setStep(3);
  }

  function submitRegistration() {
    if (!termsAccepted) {
      setTermsError("Please accept the Terms and Conditions to continue.");
      return;
    }
    setTermsError(undefined);
    setSubmitError(null);
    setStep(4);
  }

  const selectedPackage = registrationPackages.find((p) => p.id === preferences.packageId) ?? registrationPackages[0];

  return (
    <div>
      <div className="border-b border-line pb-8">
        <p className="font-display text-2xl text-ivory">{site.name}</p>
        <p className="mt-1 text-sm text-ivory-dim">
          {site.dates.display} · {site.venue.name}, {site.venue.line2} · Registration from ₹{minPrice}
        </p>
      </div>

      <div className="mt-8">
        <ProgressIndicator current={step} />
      </div>

      <div className="mt-10">
        {step === 1 && (
          <StepDetails
            data={details}
            errors={detailsErrors}
            onChange={updateDetails}
            photo={{ file: profilePhoto, error: photoError, processing: photoProcessing, onSelect: selectProfilePhoto }}
          />
        )}
        {step === 2 && (
          <StepPreferences data={preferences} errors={preferencesErrors} onChange={updatePreferences} />
        )}
        {step === 3 && (
          <StepReview
            data={{ ...details, ...preferences }}
            profilePhoto={profilePhoto}
            termsAccepted={termsAccepted}
            onTermsChange={(c) => {
              setTermsAccepted(c);
              if (c) setTermsError(undefined);
            }}
            termsError={termsError}
          />
        )}
        {step === 4 && (
          <StepPayment
            amount={selectedPackage.price}
            registrationData={{ ...details, ...preferences, termsAccepted: true }}
            profilePhoto={profilePhoto!}
            onSubmitted={(registrationId) => router.push(`/confirmation/${registrationId}`)}
            onError={setSubmitError}
          />
        )}
      </div>

      {submitError && (
        <p role="alert" className="mt-6 border border-danger/40 bg-danger/5 p-4 text-sm text-danger">
          {submitError}
        </p>
      )}

      {step < 4 && (
        <div className="mt-10 flex justify-between border-t border-line pt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className={step === 1 ? "invisible" : ""}
          >
            Back
          </Button>
          {step === 1 && (
            <Button type="button" onClick={goNextFromDetails}>
              Continue
            </Button>
          )}
          {step === 2 && (
            <Button type="button" onClick={goNextFromPreferences}>
              Continue
            </Button>
          )}
          {step === 3 && (
            <Button type="button" onClick={submitRegistration}>
              Continue to Payment
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
