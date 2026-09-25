import Link from "next/link";
import Image from "next/image";
import type { Committee } from "@/types";
import { committeePhotos } from "@/config/photos";

export function CommitteeCard({ committee }: { committee: Committee }) {
  const photo = committeePhotos[committee.id];

  return (
    <Link
      href={`/committees/${committee.id}`}
      className="group relative flex h-full flex-col border border-line transition-colors hover:border-gold"
    >
      {photo && (
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden />
          <p className="absolute bottom-4 left-5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/85">
            {committee.type}
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between p-7">
        <div>
          {!photo && (
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
