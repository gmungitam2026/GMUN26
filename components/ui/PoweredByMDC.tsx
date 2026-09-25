import Image from "next/image";
import { poweredBy } from "@/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * "Powered by MDC" credit. MDC (Meta Developer Communities, GITAM) built this
 * site for GMUN; the credit is present but deliberately quiet so it never
 * competes with GMUN's own branding.
 *
 * - `badge`: bordered pill for the home hero, under the calls to action.
 * - `strip`: footer band with the logo, full name and a link to MDC's site.
 * - `inline`: one small line with the letter mark, for tight spots.
 */
export function PoweredByMDC({
  variant = "inline",
  className,
}: {
  variant?: "badge" | "strip" | "inline";
  className?: string;
}) {
  if (variant === "badge") {
    return (
      <a
        href={poweredBy.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group inline-flex items-center gap-3 rounded-full border border-line-strong bg-ink/60 py-2 pr-5 pl-4 backdrop-blur-sm transition-colors hover:border-gold",
          className
        )}
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-ivory-faint">Powered by</span>
        <Image
          src={poweredBy.mark}
          alt={poweredBy.name}
          width={480}
          height={178}
          className="mdc-logo h-4 w-auto opacity-90 transition-opacity group-hover:opacity-100"
        />
        <span className="hidden h-3 w-px bg-line-strong sm:block" aria-hidden />
        <span className="hidden text-xs text-ivory-dim transition-colors group-hover:text-ivory sm:inline">
          {poweredBy.fullName}
        </span>
        <span className="text-gold transition-transform group-hover:translate-x-0.5" aria-hidden>
          ↗
        </span>
      </a>
    );
  }

  if (variant === "strip") {
    return (
      <a
        href={poweredBy.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group flex flex-col items-start gap-4 border-y border-line py-6 sm:flex-row sm:items-center sm:justify-between",
          className
        )}
      >
        <span className="flex items-center gap-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-ivory-faint">Powered by</span>
          <Image
            src={poweredBy.logo}
            alt={`${poweredBy.name}: ${poweredBy.fullName}`}
            width={480}
            height={234}
            className="mdc-logo h-10 w-auto opacity-80 transition-opacity group-hover:opacity-100"
          />
        </span>
        <span className="flex items-center gap-3 text-xs text-ivory-faint">
          <span>
            Designed &amp; built by {poweredBy.fullName}, {poweredBy.place}
          </span>
          <span className="text-gold transition-transform group-hover:translate-x-0.5" aria-hidden>
            ↗
          </span>
          <span className="sr-only">(opens MDC&apos;s website)</span>
        </span>
      </a>
    );
  }

  return (
    <a
      href={poweredBy.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-ivory-faint transition-colors hover:text-ivory-dim",
        className
      )}
    >
      Powered by
      <Image
        src={poweredBy.mark}
        alt={poweredBy.name}
        width={480}
        height={178}
        className="mdc-logo h-3 w-auto opacity-70 transition-opacity group-hover:opacity-100"
      />
    </a>
  );
}
