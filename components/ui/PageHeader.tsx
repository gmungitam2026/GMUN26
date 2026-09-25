import Image from "next/image";
import type { Photo } from "@/config/photos";
import { Container } from "@/components/ui/Container";

/**
 * Full-bleed photo header for inner pages. The photo drifts with scroll
 * (where supported) and sits under a gradient that fades into the page
 * background, so the heading stays readable and the header has no hard
 * bottom edge. Content is revealed with the same on-paint CSS animation as
 * the home hero, so it can never get stuck invisible.
 */
export function PageHeader({
  photo,
  eyebrow,
  title,
  logo,
  children,
}: {
  photo: Photo;
  eyebrow: string;
  title: React.ReactNode;
  /** Optional emblem (e.g. a committee logo) shown beside the title; above it on phones. */
  logo?: { src: string; alt: string };
  children?: React.ReactNode;
}) {
  return (
    <header className="relative isolate flex min-h-[62svh] items-end overflow-hidden pt-36 pb-14 md:min-h-[68svh] md:pb-20">
      <div className="photo-parallax absolute inset-0 -z-10">
        <Image src={photo.src} alt={photo.alt} fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/30" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent" aria-hidden />

      <Container className="flex w-full flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
        {logo && (
          <div
            className="animate-reveal relative h-24 w-24 shrink-0 overflow-hidden border border-gold/40 bg-black shadow-[0_0_40px_rgba(212,175,106,0.18)] sm:h-36 sm:w-36"
            style={{ animationDelay: "40ms" }}
          >
            <Image src={logo.src} alt={logo.alt} fill sizes="144px" className="object-contain p-2" />
          </div>
        )}
        <div className="min-w-0">
          <p
            className="animate-reveal text-[11px] font-medium uppercase tracking-[0.28em] text-gold"
            style={{ animationDelay: "80ms" }}
          >
            {eyebrow}
          </p>
          <h1
            className="animate-reveal mt-4 max-w-3xl font-display text-4xl text-ivory md:text-6xl"
            style={{ animationDelay: "160ms" }}
          >
            {title}
          </h1>
          {children && (
            <div
              className="animate-reveal mt-6 max-w-xl text-[15px] leading-relaxed text-ivory-dim"
              style={{ animationDelay: "240ms" }}
            >
              {children}
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
