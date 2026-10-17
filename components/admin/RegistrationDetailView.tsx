"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { committees } from "@/config/committees";
import { registrationPackages } from "@/config/pricing";
import { Button } from "@/components/ui/Button";
import { addRegistrationNote, updateRegistrationStatus } from "@/lib/admin/actions";
import { EditRegistrationForm } from "./EditRegistrationForm";

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="border-b border-line py-3">
      <p className="text-[11px] uppercase tracking-[0.08em] text-ivory-faint">{label}</p>
      <p className="mt-1 text-ivory">{value || "-"}</p>
    </div>
  );
}

interface RegistrationRow {
  id: string;
  full_name: string;
  is_gitam_student: boolean | null;
  gitam_registration_number?: string | null;
  gitam_campus?: string | null;
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
  payment_screenshot_path?: string | null;
  status: string;
}

type AuditRow = { id: string; old_status: string | null; new_status: string; note: string | null; created_at: string; admin_profiles?: { name?: string } | null };
type NoteRow = { id: string; note: string; created_at: string; admin_profiles?: { name?: string } | null };

export function RegistrationDetailView({
  registration,
  history,
  notes,
  proofUrl,
}: {
  registration: RegistrationRow;
  history: AuditRow[];
  notes: NoteRow[];
  proofUrl?: string | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(registration.status);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const committeeName = (id: string | null) => (id ? committees.find((c) => c.id === id)?.shortName ?? id : null);
  const pkg = registrationPackages.find((p) => p.id === registration.package_id);

  if (editing) {
    return <EditRegistrationForm registration={registration} onCancel={() => setEditing(false)} />;
  }

  async function changeStatus(status: string) {
    setLoadingAction(status);
    setError(null);
    const result = await updateRegistrationStatus(registration.id, status, note);
    setLoadingAction(null);
    if (!result.ok) {
      setError(result.error ?? "Could not update status.");
    } else {
      setCurrentStatus(status);
      setNote("");
      router.refresh();
    }
  }

  async function saveNote() {
    setLoadingAction("NOTE");
    setError(null);
    const result = await addRegistrationNote(registration.id, note);
    setLoadingAction(null);
    if (!result.ok) {
      setError(result.error ?? "Could not save note.");
    } else {
      setNote("");
      router.refresh();
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button type="button" variant="secondary" onClick={() => setEditing(true)}>
          Edit Details
        </Button>
      </div>

      <div className="mb-8 border border-gold/40 p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Verification</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {proofUrl && (
            <a
              href={proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 border border-line-strong px-6 text-[13px] font-medium uppercase tracking-[0.14em] text-ivory hover:border-gold hover:text-gold"
            >
              View Payment Proof ↗
            </a>
          )}
          {(currentStatus === "PENDING_VERIFICATION" || currentStatus === "UNDER_VERIFICATION") && (
            <Button
              type="button"
              disabled={Boolean(loadingAction)}
              onClick={() => changeStatus("PAYMENT_CONFIRMED")}
            >
              {loadingAction === "PAYMENT_CONFIRMED" ? "Confirming..." : "Confirm Payment"}
            </Button>
          )}
          {currentStatus === "PENDING_VERIFICATION" && (
            <Button
              type="button"
              variant="secondary"
              disabled={Boolean(loadingAction)}
              onClick={() => changeStatus("UNDER_VERIFICATION")}
            >
              {loadingAction === "UNDER_VERIFICATION" ? "Updating..." : "Under Verification"}
            </Button>
          )}
          {(currentStatus === "PENDING_VERIFICATION" || currentStatus === "UNDER_VERIFICATION") && (
            <Button
              type="button"
              variant="secondary"
              disabled={Boolean(loadingAction)}
              onClick={() => changeStatus("REJECTED")}
            >
              {loadingAction === "REJECTED" ? "Rejecting..." : "Reject"}
            </Button>
          )}
          {currentStatus === "PAYMENT_CONFIRMED" && (
            <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-success">
              ✓ Payment Confirmed
            </span>
          )}
          {currentStatus === "REJECTED" && (
            <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-danger">
              ✕ Payment Rejected
            </span>
          )}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Reason (sent to delegate on reject/cancel) or internal note"
          rows={3}
          className="mt-4 w-full resize-none border border-line bg-transparent p-3 text-sm text-ivory placeholder:text-ivory-faint focus-visible:border-gold"
        />
        <div className="mt-3 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            disabled={Boolean(loadingAction) || !note.trim()}
            onClick={saveNote}
          >
            {loadingAction === "NOTE" ? "Saving..." : "Add Internal Note"}
          </Button>
        </div>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      </div>

      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Participant</p>
          <Field label="Name (as per Govt. ID)" value={registration.full_name} />
          <Field label="GITAM Student" value={registration.is_gitam_student == null ? null : registration.is_gitam_student ? "Yes" : "No"} />
          {registration.is_gitam_student && (
            <>
              <Field label="Registration Number" value={registration.gitam_registration_number} />
              <Field label="Campus" value={registration.gitam_campus} />
            </>
          )}
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
          <Field label="1st Committee Preference" value={committeeName(registration.committee_preference)} />
          <Field label="2nd Committee Preference" value={committeeName(registration.committee_preference_2)} />
          <Field label="Country Preference" value={registration.country_preference} />
          <Field label="Package" value={pkg?.name ?? registration.package_id} />
          <Field label="Prior MUN Experience" value={registration.mun_experience} />
          <Field label="Experience Description" value={registration.mun_experience_detail} />
        </div>
      </div>

      <div className="mt-12 grid gap-10 border-t border-line pt-8 md:grid-cols-2">
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Verification History</p>
          <div className="space-y-4">
            {history.map((item) => <div key={item.id} className="border-b border-line pb-3 text-sm"><p className="text-ivory">{item.new_status}</p><p className="mt-1 text-xs text-ivory-faint">{new Date(item.created_at).toLocaleString("en-IN")} · {item.admin_profiles?.name ?? "Participant submission"}</p>{item.note && <p className="mt-2 text-ivory-dim">{item.note}</p>}</div>)}
          </div>
        </div>
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Internal Notes</p>
          <div className="space-y-4">{notes.map((item) => <div key={item.id} className="border-b border-line pb-3 text-sm"><p className="text-ivory-dim">{item.note}</p><p className="mt-1 text-xs text-ivory-faint">{new Date(item.created_at).toLocaleString("en-IN")} · {item.admin_profiles?.name ?? "Admin"}</p></div>)}</div>
        </div>
      </div>
    </div>
  );
}
