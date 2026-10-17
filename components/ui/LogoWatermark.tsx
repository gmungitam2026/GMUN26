"use client";

import Image from "next/image";
import { useScrollProgress } from "@/lib/hooks/useScrollProgress";

/**
 * The GMUN logo as a large, faded, full-page background — fixed and
 * centered behind all content. It starts almost invisible and fills in
 * color from the bottom up as the page scrolls, reaching a soft (still
 * faded, never opaque) full color by the bottom of the page.
 * mix-blend-mode: screen means the logo's black background contributes
 * nothing and only the gold linework glows through, so it reads over every
 * section without those sections needing to change.
 */
export function LogoWatermark() {
  return (
    <div
      aria-hidden
      className="logo-watermark pointer-events-none fixed inset-0 z-10 flex items-center justify-center opacity-[0.05]"
    >
      <div className="relative h-[85vmin] w-[85vmin] max-h-[800px] max-w-[800px] overflow-hidden">
        <Image
          src="/logos/gmun-club-logo.jpg"
          alt=""
          fill
          sizes="800px"
          priority
          className="object-contain"
          style={{ clipPath: "inset(0 0 20% 0)" }}
        />
      </div>
    </div>
  );
}
