"use client";

import Image from "next/image";
import { useScrollProgress } from "@/lib/hooks/useScrollProgress";

/**
 * The club logo as a large, faded, full-page background — fixed and
 * centered behind all content. It starts almost invisible and fills in
 * color from the bottom up as the page scrolls, reaching a soft (still
 * faded, never opaque) full color by the bottom of the page.
 * mix-blend-mode: screen means the logo's black background contributes
 * nothing and only the gold linework glows through, so it reads over every
 * section without those sections needing to change.
 */
export function LogoWatermark() {
  const progress = useScrollProgress();
  const revealFromTop = (1 - progress) * 100;

  return (
    <div
      aria-hidden
      className="logo-watermark pointer-events-none fixed inset-0 z-30 flex items-center justify-center"
      style={{ mixBlendMode: "screen" }}
    >
      <div className="relative h-[85vmin] w-[85vmin] max-h-[900px] max-w-[900px]">
        <Image
          src="/logos/gmun-club-logo.jpg"
          alt=""
          fill
          sizes="900px"
          className="object-contain grayscale"
          style={{ opacity: 0.06 }}
        />
        <Image
          src="/logos/gmun-club-logo.jpg"
          alt=""
          fill
          sizes="900px"
          className="object-contain transition-[clip-path] duration-300 ease-out"
          style={{ opacity: 0.18, clipPath: `inset(${revealFromTop}% 0 0 0)` }}
        />
      </div>
    </div>
  );
}
