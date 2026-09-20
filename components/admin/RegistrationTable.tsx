import Link from "next/link";
import { committees } from "@/config/committees";
import { cn } from "@/lib/utils/cn";

interface RegistrationRow {
  id: string;
  registration_id: string;
  full_name: string;
  email: string;
  phone: string;
  committee_preference: string;
  status: string;
  created_at: string;
}

export function RegistrationTable({ registrations }: { registrations: RegistrationRow[] }) {
  if (registrations.length === 0) {
    return <p className="py-10 text-sm text-ivory-faint">No registrations match these filters.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[11px] uppercase tracking-[0.08em] text-ivory-faint">
            <th className="py-3 pr-4 font-normal">Registration ID</th>
            <th className="py-3 pr-4 font-normal">Name</th>
            <th className="py-3 pr-4 font-normal">Committee</th>
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
              <td className="py-3 pr-4 text-ivory">{r.full_name}</td>
              <td className="py-3 pr-4 text-ivory-dim">
                {committees.find((c) => c.id === r.committee_preference)?.shortName ?? r.committee_preference}
              </td>
              <td className="py-3 pr-4 text-ivory-dim">
                <div>{r.email}</div>
                <div className="text-xs text-ivory-faint">{r.phone}</div>
              </td>
              <td className="py-3 pr-4">
                <span
                  className={cn(
                    "px-2 py-0.5 text-[11px] uppercase tracking-[0.06em]",
                    r.status === "PAID" && "bg-gold/15 text-gold",
                    r.status === "PENDING" && "bg-ivory-faint/15 text-ivory-dim",
                    r.status === "CANCELLED" && "bg-red-400/10 text-red-300"
                  )}
                >
                  {r.status}
                </span>
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
