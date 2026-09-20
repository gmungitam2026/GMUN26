"use client";

import { useState } from "react";
import { committees } from "@/config/committees";
import { registrationPackages } from "@/config/pricing";
import { Button } from "@/components/ui/Button";
import { EditRegistrationForm } from "./EditRegistrationForm";

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="border-b border-line py-3">
      <p className="text-[11px] uppercase tracking-[0.08em] text-ivory-faint">{label}</p>
      <p className="mt-1 text-ivory">{value || "—"}</p>
    </div>
  );
}

interface RegistrationRow {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  institution: string;
  state: string;
  city: string;
  committee_preference: string;
  package_id: string;
  mun_experience: string;
  mun_experience_detail: string | null;
}

export function RegistrationDetailView({ registration }: { registration: RegistrationRow }) {
  const [editing, setEditing] = useState(false);
  const committee = committees.find((c) => c.id === registration.committee_preference);
  const pkg = registrationPackages.find((p) => p.id === registration.package_id);

  if (editing) {
    return <EditRegistrationForm registration={registration} onCancel={() => setEditing(false)} />;
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button type="button" variant="secondary" onClick={() => setEditing(true)}>
          Edit Details
        </Button>
      </div>

      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Participant</p>
          <Field label="Name (as per Govt. ID)" value={registration.full_name} />
          <Field label="Age" value={registration.age} />
          <Field label="Gender" value={registration.gender} />
          <Field label="Email" value={registration.email} />
          <Field label="Mobile" value={registration.phone} />
          <Field label="Institution" value={registration.institution} />
          <Field label="State" value={registration.state} />
          <Field label="City" value={registration.city} />
        </div>

        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">MUN</p>
          <Field label="Committee" value={committee?.shortName ?? registration.committee_preference} />
          <Field label="Package" value={pkg?.name ?? registration.package_id} />
          <Field label="Prior MUN Experience" value={registration.mun_experience} />
          <Field label="Experience Description" value={registration.mun_experience_detail} />
        </div>
      </div>
    </div>
  );
}
