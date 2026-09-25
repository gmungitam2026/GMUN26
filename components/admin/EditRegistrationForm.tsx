"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminEditSchema, type DetailsInput, type PreferencesInput } from "@/lib/validation/registration";
import { updateRegistration } from "@/lib/admin/actions";
import { StepDetails } from "@/components/registration/StepDetails";
import { StepPreferences } from "@/components/registration/StepPreferences";
import { Button } from "@/components/ui/Button";

interface RegistrationRow {
  id: string;
  full_name: string;
  is_gitam_student: boolean | null;
  age: number;
  gender: string;
  email: string;
  phone: string;
  institution: string;
  state: string;
  city: string;
  committee_preference: string;
  committee_preference_2: string | null;
  country_preference: string | null;
  package_id: string;
  mun_experience: string;
  mun_experience_detail: string | null;
}

export function EditRegistrationForm({
  registration,
  onCancel,
}: {
  registration: RegistrationRow;
  onCancel: () => void;
}) {
  const router = useRouter();
  const [details, setDetails] = useState<DetailsInput>({
    fullName: registration.full_name,
    // Registrations made before these questions existed have nulls here;
    // the admin must fill them in to save.
    gitamStudent: (registration.is_gitam_student == null ? "" : registration.is_gitam_student ? "Yes" : "No") as DetailsInput["gitamStudent"],
    age: registration.age,
    gender: registration.gender as DetailsInput["gender"],
    phone: registration.phone,
    email: registration.email,
    institution: registration.institution,
    state: registration.state as DetailsInput["state"],
    city: registration.city,
  });
  const [preferences, setPreferences] = useState<PreferencesInput>({
    committeePreference: registration.committee_preference,
    committeePreference2: registration.committee_preference_2 ?? "",
    countryPreference: registration.country_preference ?? "",
    hasMunExperience: registration.mun_experience === "Yes",
    munExperienceDetail: registration.mun_experience_detail ?? "",
    packageId: registration.package_id,
  });
  const [detailsErrors, setDetailsErrors] = useState<Partial<Record<keyof DetailsInput, string>>>({});
  const [preferencesErrors, setPreferencesErrors] = useState<Partial<Record<keyof PreferencesInput, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function updateDetails<K extends keyof DetailsInput>(key: K, value: DetailsInput[K]) {
    setDetails((d) => ({ ...d, [key]: value }));
  }
  function updatePreferences<K extends keyof PreferencesInput>(key: K, value: PreferencesInput[K]) {
    setPreferences((p) => ({ ...p, [key]: value }));
  }

  function handleSave() {
    setFormError(null);
    const combined = { ...details, ...preferences };
    const result = adminEditSchema.safeParse(combined);
    if (!result.success) {
      const dErrs: typeof detailsErrors = {};
      const pErrs: typeof preferencesErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (key in details) dErrs[key as keyof DetailsInput] = issue.message;
        else pErrs[key as keyof PreferencesInput] = issue.message;
      }
      setDetailsErrors(dErrs);
      setPreferencesErrors(pErrs);
      return;
    }
    setDetailsErrors({});
    setPreferencesErrors({});

    startTransition(async () => {
      const res = await updateRegistration(registration.id, result.data);
      if (!res.ok) {
        setFormError(res.error ?? "Could not save changes.");
        return;
      }
      router.refresh();
      onCancel();
    });
  }

  return (
    <div className="border border-gold p-6">
      <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Editing Registration</p>

      <div className="space-y-10">
        <StepDetails data={details} errors={detailsErrors} onChange={updateDetails} />
        <StepPreferences data={preferences} errors={preferencesErrors} onChange={updatePreferences} />
      </div>

      {formError && (
        <p role="alert" className="mt-6 border border-danger/40 bg-danger/5 p-3 text-sm text-danger">
          {formError}
        </p>
      )}

      <div className="mt-8 flex gap-4 border-t border-line pt-6">
        <Button type="button" disabled={pending} onClick={handleSave}>
          {pending ? "Saving…" : "Save Changes"}
        </Button>
        <Button type="button" variant="secondary" disabled={pending} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
