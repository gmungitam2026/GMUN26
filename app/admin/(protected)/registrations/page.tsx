import Link from "next/link";
import { listRegistrations } from "@/lib/admin/queries";
import { FilterBar } from "@/components/admin/FilterBar";
import { RegistrationTable } from "@/components/admin/RegistrationTable";
import { ExportButton } from "@/components/admin/ExportButton";

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; committee?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const { registrations, total, pageSize } = await listRegistrations({
    query: params.q,
    committee: params.committee,
    paymentStatus: params.status,
    page,
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ivory">Registrations</h1>
        <ExportButton />
      </div>

      <div className="mt-8">
        <FilterBar />
      </div>

      <div className="mt-6">
        <RegistrationTable registrations={registrations} />
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center gap-4 text-sm">
          {page > 1 && (
            <Link href={`?${buildQuery(params, page - 1)}`} className="text-ivory-dim hover:text-gold">
              ← Previous
            </Link>
          )}
          <span className="text-ivory-faint">
            Page {page} of {totalPages} · {total} total
          </span>
          {page < totalPages && (
            <Link href={`?${buildQuery(params, page + 1)}`} className="text-ivory-dim hover:text-gold">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function buildQuery(params: Record<string, string | undefined>, page: number) {
  const usp = new URLSearchParams();
  if (params.q) usp.set("q", params.q);
  if (params.committee) usp.set("committee", params.committee);
  if (params.status) usp.set("status", params.status);
  usp.set("page", String(page));
  return usp.toString();
}
