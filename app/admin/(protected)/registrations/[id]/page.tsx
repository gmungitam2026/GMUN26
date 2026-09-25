import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegistrationDetail } from "@/lib/admin/queries";
import { RegistrationDetailView } from "@/components/admin/RegistrationDetailView";

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="border-b border-line py-3">
      <p className="text-[11px] uppercase tracking-[0.08em] text-ivory-faint">{label}</p>
      <p className="mt-1 text-ivory">{value || "—"}</p>
    </div>
  );
}

export default async function AdminRegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getRegistrationDetail(id);
  if (!detail) notFound();

  const { registration: r, photoUrl, history, notes } = detail;

  return (
    <div>
      <Link href="/admin/registrations" className="text-[11px] uppercase tracking-[0.08em] text-ivory-faint hover:text-gold">
        ← All Registrations
      </Link>

      <div className="mt-4 flex items-baseline gap-4">
        <h1 className="font-display text-2xl text-ivory">{r.registration_id}</h1>
        <span className="text-sm text-ivory-faint">{r.status}</span>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <RegistrationDetailView registration={r} history={history} notes={notes} />

        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Profile Photo</p>
          {photoUrl ? (
            <a href={photoUrl} target="_blank" rel="noopener noreferrer" className="group block" title="Open full size">
              {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed URL from private storage */}
              <img
                src={photoUrl}
                alt={`Profile photo of ${r.full_name}`}
                className="aspect-[4/5] w-full max-w-[260px] border border-line object-cover transition-opacity group-hover:opacity-90"
              />
              <span className="mt-2 block text-[11px] uppercase tracking-[0.08em] text-ivory-faint group-hover:text-gold">Open full size ↗</span>
            </a>
          ) : (
            <p className="border-b border-line py-3 text-sm text-ivory-faint">No photo on file.</p>
          )}

          <p className="mt-8 mb-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Payment</p>
          <Field label="Amount" value={r.payment_amount ? `₹${r.payment_amount}` : null} />
          <Field label="UTR / Reference" value={r.payment_reference} />
          <Field label="Proof Submitted" value={r.payment_submitted_at ? new Date(r.payment_submitted_at).toLocaleString("en-IN") : null} />

          <p className="mt-6 mb-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Audit</p>
          <Field label="Created At" value={new Date(r.created_at).toLocaleString("en-IN")} />
          <Field label="Updated At" value={new Date(r.updated_at).toLocaleString("en-IN")} />
        </div>
      </div>
    </div>
  );
}
