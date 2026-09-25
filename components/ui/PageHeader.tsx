import Image from "next/image";
import type { Photo } from "@/config/photos";
import { Container } from "@/components/ui/Container";
import { PhotoCredit } from "@/components/ui/PhotoCredit";

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
  children,
}: {
  photo: Photo;
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative isolate flex min-h-[62svh] items-end overflow-hidden pt-36 pb-14 md:min-h-[68svh] md:pb-20">
      <div className="photo-parallax absolute inset-0 -z-10">
        <Image src={photo.src} alt={photo.alt} fill priority sizes="100vw" className="object-cover" />
      </div>
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/30"
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent" aria-hidden />

      <Container className="w-full">
        <p className="animate-reveal text-[11px] font-medium uppercase tracking-[0.28em] text-gold" style={{ animationDelay: "80ms" }}>
          {eyebrow}
        </p>
        <h1
          className="animate-reveal mt-4 max-w-3xl font-display text-4xl text-ivory md:text-6xl"
          style={{ animationDelay: "160ms" }}
        >
          {title}
        </h1>
        {children && (
          <div className="animate-reveal mt-6 max-w-xl text-[15px] leading-relaxed text-ivory-dim" style={{ animationDelay: "240ms" }}>
            {children}
          </div>
        )}
      </Container>

      {photo.credit && <PhotoCredit credit={photo.credit} className="top-24 right-0" />}
    </header>
  );
}
