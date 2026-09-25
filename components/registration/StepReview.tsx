import Link from "next/link";
import { committees } from "@/config/committees";
import { registrationPackages } from "@/config/pricing";
import { consentSummary } from "@/config/terms";
import { CheckboxField } from "./fields";
import type { DetailsInput, PreferencesInput } from "@/lib/validation/registration";
import { useFilePreview } from "./ProfilePhotoField";

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-6 border-b border-line py-3 text-sm">
      <span className="text-ivory-faint">{label}</span>
      <span className="text-right text-ivory">{value}</span>
    </div>
  );
}

export function StepReview({
  data,
  profilePhoto,
  termsAccepted,
  onTermsChange,
  termsError,
}: {
  data: DetailsInput & PreferencesInput;
  profilePhoto: File | null;
  termsAccepted: boolean;
  onTermsChange: (checked: boolean) => void;
  termsError?: string;
}) {
  const committeeName = (id: string) => committees.find((c) => c.id === id)?.shortName ?? id;
  const pkg = registrationPackages.find((p) => p.id === data.packageId);
  const photoPreview = useFilePreview(profilePhoto);

  return (
    <div>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Participant</p>
          {photoPreview && (
            // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
            <img src={photoPreview} alt="Your profile photo" className="mb-3 h-20 w-20 rounded-full border border-line-strong object-cover" />
          )}
          <Row label="Name" value={data.fullName} />
          <Row label="GITAM Student" value={data.gitamStudent} />
          <Row label="Age" value={String(data.age)} />
          <Row label="Gender" value={data.gender} />
          <Row label="Mobile" value={data.phone} />
          <Row label="Email" value={data.email} />
          <Row label="Institution" value={data.institution} />
          <Row label="State" value={data.state} />
          <Row label="City" value={data.city} />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">MUN Preferences</p>
          <Row label="1st Committee" value={committeeName(data.committeePreference)} />
          <Row label="2nd Committee" value={committeeName(data.committeePreference2)} />
          <Row label="Country Preference" value={data.countryPreference} />
          <Row label="Prior MUN Experience" value={data.hasMunExperience ? "Yes" : "No"} />
          {data.hasMunExperience && data.munExperienceDetail && (
            <p className="border-b border-line py-3 text-sm leading-relaxed text-ivory-dim">
              {data.munExperienceDetail}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 flex items-baseline justify-between border-y border-line py-6">
        <div>
          <p className="font-display text-xl text-ivory">{pkg?.name}</p>
          <p className="mt-1 text-xs text-ivory-faint">{pkg?.includes.join(" · ")}</p>
        </div>
        <p className="font-display text-3xl text-gold">₹{pkg?.price}</p>
      </div>

      <div className="mt-8 space-y-3 text-sm leading-relaxed text-ivory-dim">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Before you continue</p>
        <ul className="list-disc space-y-1.5 pl-5">
          {consentSummary.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border border-line p-5">
        <CheckboxField id="termsAccepted" checked={termsAccepted} onChange={onTermsChange}>
          I have read, understood, and agree to the{" "}
          <Link href="/terms" target="_blank" className="text-gold underline underline-offset-2">
            Terms and Conditions
          </Link>{" "}
          of GMUN 5.0.
        </CheckboxField>
        {termsError && <p className="mt-2 text-xs text-danger">{termsError}</p>}
      </div>
    </div>
  );
}
