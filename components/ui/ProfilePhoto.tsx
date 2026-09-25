import Image from "next/image";
import { cn } from "@/lib/utils/cn";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/**
 * Portrait for a team member. Until a real photo is supplied it shows a
 * placeholder: the person's initials over a faint silhouette.
 */
export function ProfilePhoto({
  name,
  src,
  className,
}: {
  name: string;
  src?: string | null;
  className?: string;
}) {
  return (
    <div className={cn("group relative aspect-[4/5] overflow-hidden border border-line bg-surface-raised", className)}>
      {src ? (
        <Image
          src={src}
          alt={`Portrait of ${name}`}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0" role="img" aria-label={`Photo of ${name} coming soon`}>
          <div className="absolute inset-0 bg-gradient-to-b from-gold/15 via-transparent to-transparent" aria-hidden />
          {/* Silhouette */}
          <svg viewBox="0 0 100 125" className="absolute inset-x-0 bottom-0 w-full text-ivory/[0.07]" fill="currentColor" aria-hidden>
            <circle cx="50" cy="48" r="20" />
            <path d="M8 125c0-26 19-44 42-44s42 18 42 44z" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-6xl text-gold/80" aria-hidden>
            {initials(name)}
          </span>
          <span className="absolute bottom-4 left-0 w-full text-center text-[10px] uppercase tracking-[0.2em] text-ivory-faint" aria-hidden>
            Photo coming soon
          </span>
        </div>
      )}
    </div>
  );
}
