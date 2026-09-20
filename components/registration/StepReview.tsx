import Link from "next/link";
import { committees } from "@/config/committees";
import { consentSummary } from "@/config/terms";
import { CheckboxField } from "./fields";
import type { DetailsInput, PreferencesInput } from "@/lib/validation/registration";

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
  amount,
  termsAccepted,
  onTermsChange,
  termsError,
}: {
  data: DetailsInput & PreferencesInput;
  amount: number;
  termsAccepted: boolean;
  onTermsChange: (checked: boolean) => void;
  termsError?: string;
}) {
  const committee = committees.find((c) => c.id === data.committeePreference);

  return (
    <div>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Participant</p>
          <Row label="Name" value={data.fullName} />
          <Row label="Email" value={data.email} />
          <Row label="Phone" value={data.phone} />
          <Row label="College" value={data.college} />
          <Row label="Course / Year" value={`${data.course} · ${data.year}`} />
          <Row label="City" value={data.city} />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">MUN Preferences</p>
          <Row label="Participant Type" value={data.participantType} />
          <Row label="Committee" value={committee?.shortName ?? data.committeePreference} />
          <Row label="Country Preference" value={data.countryPreference || "No preference"} />
          <Row label="Experience" value={data.munExperience} />
          <Row label="MUNs Attended" value={String(data.munsAttended)} />
        </div>
      </div>

      <div className="mt-10 flex items-baseline justify-between border-y border-line py-6">
        <p className="font-display text-xl text-ivory">Registration Fee</p>
        <p className="font-display text-3xl text-gold">₹{amount}</p>
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
        {termsError && <p className="mt-2 text-xs text-red-400">{termsError}</p>}
      </div>
    </div>
  );
}
