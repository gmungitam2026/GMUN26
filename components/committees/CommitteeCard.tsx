import Link from "next/link";
import type { Committee } from "@/types";

export function CommitteeCard({ committee }: { committee: Committee }) {
  return (
    <Link
      href={`/committees/${committee.id}`}
      className="group relative flex min-h-[280px] flex-col justify-between border border-line p-7 transition-colors hover:border-gold"
    >
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ivory-faint">
          {committee.type}
        </p>
        <h3 className="mt-4 font-display text-2xl text-ivory group-hover:text-gold">
          {committee.shortName}
        </h3>
        <p className="mt-1 text-sm text-ivory-dim">{committee.name}</p>
      </div>

      <div>
        <p className="line-clamp-2 text-xs leading-relaxed text-ivory-faint">{committee.agenda}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-gold opacity-0 transition-opacity group-hover:opacity-100">
          Explore Committee <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
