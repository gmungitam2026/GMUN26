"use client";

import { useState, useTransition } from "react";
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
import { createRegistration } from "@/lib/registration/actions";
import { ProgressIndicator } from "./ProgressIndicator";
import { StepDetails } from "./StepDetails";
import { StepPreferences } from "./StepPreferences";
import { StepReview } from "./StepReview";
import { StepPayment } from "./StepPayment";
import { Button } from "@/components/ui/Button";

const emptyDetails: DetailsInput = {
  fullName: "",
  age: NaN,
  gender: "Prefer not to say",
  phone: "",
  email: "",
  institution: "",
  state: "" as DetailsInput["state"],
  city: "",
};

function buildEmptyPreferences(initialCommittee?: string): PreferencesInput {
  const committeePreference = committees.some((c) => c.id === initialCommittee) ? initialCommittee! : "";
  return {
    hasMunExperience: false,
    munExperienceDetail: "",
    committeePreference,
    packageId: registrationPackages[0].id,
  };
}

type PaymentIntent = {
  registrationDbId: string;
  registrationId: string;
  orderId: string;
  checkout: Record<string, string>;
};

export function RegistrationWizard({ initialCommittee }: { initialCommittee?: string }) {
  const router = useRouter();
  const minPrice = Math.min(...registrationPackages.map((p) => p.price));

  const [step, setStep] = useState(1);
  const [details, setDetails] = useState<DetailsInput>(emptyDetails);
  const [preferences, setPreferences] = useState<PreferencesInput>(() => buildEmptyPreferences(initialCommittee));
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [detailsErrors, setDetailsErrors] = useState<Partial<Record<keyof DetailsInput, string>>>({});
  const [preferencesErrors, setPreferencesErrors] = useState<Partial<Record<keyof PreferencesInput, string>>>({});
  const [termsError, setTermsError] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const [pending, startTransition] = useTransition();

  function updateDetails<K extends keyof DetailsInput>(key: K, value: DetailsInput[K]) {
    setDetails((d) => ({ ...d, [key]: value }));
  }
  function updatePreferences<K extends keyof PreferencesInput>(key: K, value: PreferencesInput[K]) {
    setPreferences((p) => ({ ...p, [key]: value }));
  }

  function goNextFromDetails() {
    const result = detailsSchema.safeParse(details);
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

    startTransition(async () => {
      const result = await createRegistration({
        ...details,
        ...preferences,
        termsAccepted: true,
      });

      if (!result.ok) {
        setSubmitError(result.error);
        return;
      }

      setIntent({
        registrationDbId: result.registrationDbId,
        registrationId: result.registrationId,
        orderId: result.orderId,
        checkout: result.checkout,
      });
      setStep(4);
    });
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
          <StepDetails data={details} errors={detailsErrors} onChange={updateDetails} />
        )}
        {step === 2 && (
          <StepPreferences data={preferences} errors={preferencesErrors} onChange={updatePreferences} />
        )}
        {step === 3 && (
          <StepReview
            data={{ ...details, ...preferences }}
            termsAccepted={termsAccepted}
            onTermsChange={(c) => {
              setTermsAccepted(c);
              if (c) setTermsError(undefined);
            }}
            termsError={termsError}
          />
        )}
        {step === 4 && intent && (
          <StepPayment
            registrationDbId={intent.registrationDbId}
            orderId={intent.orderId}
            checkout={intent.checkout}
            amount={selectedPackage.price}
            onPaid={() => router.push(`/confirmation/${intent.registrationId}`)}
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
            <Button type="button" disabled={pending} onClick={submitRegistration}>
              {pending ? "Submitting…" : "Continue to Payment"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
