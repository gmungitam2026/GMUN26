"use client";

import Image from "next/image";
import { useScrollProgress } from "@/lib/hooks/useScrollProgress";

/**
 * A faded club-logo watermark fixed in the top-left corner. It starts
 * almost invisible and fills in color from the bottom up as the page
 * scrolls, reaching a soft (still faded, never opaque) full color by the
 * bottom of the page. mix-blend-mode: screen means the logo's black
 * background contributes nothing and only the gold linework glows through,
 * so it reads over every section without needing those sections to change.
 */
export function LogoWatermark() {
  const progress = useScrollProgress();
  const revealFromTop = (1 - progress) * 100;

  return (
    <div
      aria-hidden
      className="logo-watermark pointer-events-none fixed top-24 left-6 z-30 h-28 w-28 sm:h-36 sm:w-36"
      style={{ mixBlendMode: "screen" }}
    >
      <Image
        src="/logos/gmun-club-logo.jpg"
        alt=""
        fill
        sizes="144px"
        className="object-contain grayscale"
        style={{ opacity: 0.12 }}
      />
      <Image
        src="/logos/gmun-club-logo.jpg"
        alt=""
        fill
        sizes="144px"
        className="object-contain transition-[clip-path] duration-300 ease-out"
        style={{ opacity: 0.32, clipPath: `inset(${revealFromTop}% 0 0 0)` }}
      />
    </div>
  );
}
