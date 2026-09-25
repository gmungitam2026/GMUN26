import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { committees } from "@/config/committees";
import { registrationPackages } from "@/config/pricing";

interface RegistrationRow {
  id: string;
  registration_id: string;
  full_name: string;
  email: string;
  phone: string;
  committee_preference: string;
  package_id: string;
  gender: string;
  status: string;
  created_at: string;
  photoUrl: string | null;
}

export function RegistrationTable({ registrations }: { registrations: RegistrationRow[] }) {
  if (registrations.length === 0) {
    return <p className="py-10 text-sm text-ivory-faint">No registrations match these filters.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[11px] uppercase tracking-[0.08em] text-ivory-faint">
            <th className="py-3 pr-4 font-normal">Registration ID</th>
            <th className="py-3 pr-4 font-normal">Name</th>
            <th className="py-3 pr-4 font-normal">Gender</th>
            <th className="py-3 pr-4 font-normal">Committee</th>
            <th className="py-3 pr-4 font-normal">Package</th>
            <th className="py-3 pr-4 font-normal">Contact</th>
            <th className="py-3 pr-4 font-normal">Status</th>
            <th className="py-3 pr-4 font-normal">Registered</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((r) => (
            <tr key={r.id} className="border-b border-line hover:bg-surface-raised">
              <td className="py-3 pr-4">
                <Link href={`/admin/registrations/${r.id}`} className="text-gold hover:underline">
                  {r.registration_id}
                </Link>
              </td>
              <td className="py-3 pr-4 text-ivory">
                <span className="flex items-center gap-3">
                  <span className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-line bg-surface-raised">
                    {r.photoUrl && (
                      // eslint-disable-next-line @next/next/no-img-element -- short-lived signed URL from private storage
                      <img src={r.photoUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                    )}
                  </span>
                  {r.full_name}
                </span>
              </td>
              <td className="py-3 pr-4 text-ivory-dim">{r.gender}</td>
              <td className="py-3 pr-4 text-ivory-dim">
                {committees.find((c) => c.id === r.committee_preference)?.shortName ?? r.committee_preference}
              </td>
              <td className="py-3 pr-4 text-ivory-dim">
                {registrationPackages.find((p) => p.id === r.package_id)?.name ?? r.package_id}
              </td>
              <td className="py-3 pr-4 text-ivory-dim">
                <div>{r.email}</div>
                <div className="text-xs text-ivory-faint">{r.phone}</div>
              </td>
              <td className="py-3 pr-4">
                <StatusBadge status={r.status} className="whitespace-nowrap" />
              </td>
              <td className="py-3 pr-4 text-ivory-faint">
                {new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
