"use client";

import { useSearchParams } from "next/navigation";

/** Exports exactly the rows matching the table's current filters. */
export function CsvExportButton() {
  const searchParams = useSearchParams();

  return (
    <a
      href={`/api/export/csv?${searchParams.toString()}`}
      className="inline-flex h-10 items-center justify-center border border-line-strong px-5 text-[13px] font-medium uppercase tracking-[0.1em] text-ivory transition-colors hover:border-gold hover:text-gold"
    >
      Export Filtered (CSV)
    </a>
  );
}
