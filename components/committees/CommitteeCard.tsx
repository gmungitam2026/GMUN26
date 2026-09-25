import Link from "next/link";
import Image from "next/image";
import type { Committee } from "@/types";
import { committeeLogos } from "@/config/photos";

export function CommitteeCard({ committee }: { committee: Committee }) {
  const logo = committeeLogos[committee.id];

  return (
    <Link
      href={`/committees/${committee.id}`}
      className="group relative flex h-full flex-col border border-line transition-colors hover:border-gold"
    >
      {logo && (
        // Gold-on-black emblem; the panel is always black so it blends in both themes.
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-black">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,106,0.18),transparent_60%)] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden
          />
          <Image
            src={logo}
            alt={`${committee.shortName} emblem`}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            // screen blend drops the logo's own black square so it sits directly on the glow
            className="object-contain p-5 mix-blend-screen transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <p className="absolute bottom-4 left-5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">
            {committee.type}
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between p-7">
        <div>
          {!logo && (
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-ivory-faint">
              {committee.type}
            </p>
          )}
          <h3 className="font-display text-2xl text-ivory group-hover:text-gold">{committee.shortName}</h3>
          <p className="mt-1 text-sm text-ivory-dim">{committee.name}</p>
        </div>

        <div className="mt-6">
          <p className="line-clamp-2 text-xs leading-relaxed text-ivory-faint">{committee.agenda}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-gold opacity-0 transition-opacity group-hover:opacity-100">
            Explore Committee <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
