import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegistrationDetail } from "@/lib/admin/queries";
import { committees } from "@/config/committees";

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

  const { registration: r, payments } = detail;
  const committee = committees.find((c) => c.id === r.committee_preference);

  return (
    <div>
      <Link href="/admin/registrations" className="text-[11px] uppercase tracking-[0.08em] text-ivory-faint hover:text-gold">
        ← All Registrations
      </Link>

      <div className="mt-4 flex items-baseline gap-4">
        <h1 className="font-display text-2xl text-ivory">{r.registration_id}</h1>
        <span className="text-sm text-ivory-faint">{r.status}</span>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Participant</p>
          <Field label="Full Name" value={r.full_name} />
          <Field label="Email" value={r.email} />
          <Field label="Phone" value={r.phone} />
          <Field label="College" value={r.college} />
          <Field label="Course" value={r.course} />
          <Field label="Year" value={r.year} />
          <Field label="City" value={r.city} />
        </div>

        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">MUN</p>
          <Field label="Participant Type" value={r.participant_type} />
          <Field label="Committee" value={committee?.shortName ?? r.committee_preference} />
          <Field label="Country Preference" value={r.country_preference} />
          <Field label="Experience" value={r.mun_experience} />
          <Field label="MUNs Attended" value={r.muns_attended} />
          <Field label="Accommodation" value={r.accommodation ? "Requested" : "Not requested"} />
          <Field label="T-Shirt Size" value={r.tshirt_size} />
          <Field label="Food Preference" value={r.food_preference} />
          <Field label="Emergency Contact" value={r.emergency_contact_name && `${r.emergency_contact_name} · ${r.emergency_contact_phone ?? ""}`} />
          <Field label="Special Requirements" value={r.special_requirements} />
        </div>

        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Payments</p>
          {payments.length === 0 && <p className="py-3 text-sm text-ivory-faint">No payment records yet.</p>}
          {payments.map((p) => (
            <div key={p.id} className="mb-4 border border-line p-4">
              <Field label="Provider" value={p.provider} />
              <Field label="Order ID" value={p.order_id} />
              <Field label="Payment ID" value={p.payment_id} />
              <Field label="Amount" value={`₹${p.amount}`} />
              <Field label="Status" value={p.status} />
              <Field label="Method" value={p.method} />
              <Field label="Payment Date" value={p.updated_at ? new Date(p.updated_at).toLocaleString("en-IN") : null} />
            </div>
          ))}

          <p className="mt-6 mb-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Audit</p>
          <Field label="Created At" value={new Date(r.created_at).toLocaleString("en-IN")} />
          <Field label="Updated At" value={new Date(r.updated_at).toLocaleString("en-IN")} />
        </div>
      </div>
    </div>
  );
}
