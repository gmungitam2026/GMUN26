"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { aboutVizag } from "@/config/about";

const ADVANCE_MS = 6000;

/**
 * About → Visakhapatnam. A parallax cover photo, then a landmark explorer:
 * a large crossfading photo beside a numbered list. It advances on its own —
 * driven by the active item's progress bar finishing its CSS animation, so
 * there are no timers to leak — and pauses while hovered or focused. Under
 * prefers-reduced-motion the bar never animates, so nothing auto-advances.
 */
export function VizagExplorer() {
  const { landmarks, heroImage } = aboutVizag;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = () => setActive((i) => (i + 1) % landmarks.length);

  return (
    <div>
      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden border border-line sm:aspect-[16/8]">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          sizes="(min-width: 1024px) 900px, 100vw"
          className="photo-parallax object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold-bright">{aboutVizag.eyebrow}</p>
          <h2 className="mt-3 max-w-lg font-display text-3xl text-white md:text-5xl">{aboutVizag.heading}</h2>
        </div>
      </div>

      <div className="mt-10 max-w-2xl space-y-4 text-[15px] leading-relaxed text-ivory-dim">
        {aboutVizag.intro.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* Landmark explorer */}
      <h3 className="mt-16 mb-6 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">
        {aboutVizag.landmarksHeading}
      </h3>

      <div
        className="grid gap-6 md:grid-cols-[1.35fr_1fr] md:gap-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="relative aspect-[4/3] overflow-hidden border border-line bg-surface">
          {landmarks.map((l, i) => (
            <div
              key={l.name}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                i === active ? "opacity-100" : "opacity-0"
              )}
              aria-hidden={i !== active}
            >
              <Image
                src={l.image.src}
                alt={l.image.alt}
                fill
                sizes="(min-width: 1024px) 560px, (min-width: 768px) 55vw, 100vw"
                className={cn(
                  "object-cover transition-transform ease-out",
                  // Slow push-in on the photo that's showing.
                  i === active ? "scale-100 duration-[6500ms]" : "scale-110 duration-700"
                )}
              />
            </div>
          ))}
          <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/60 to-transparent p-5" aria-hidden>
            <p className="font-display text-sm text-white/80 tabular-nums">
              {String(active + 1).padStart(2, "0")} <span className="text-white/40">/ {String(landmarks.length).padStart(2, "0")}</span>
            </p>
          </div>
        </div>

        <ol className="border-t border-line">
          {landmarks.map((l, i) => {
            const isActive = i === active;
            return (
              <li key={l.name} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex w-full items-baseline gap-4 py-4 text-left"
                >
                  <span className={cn("font-display text-sm tabular-nums transition-colors", isActive ? "text-gold" : "text-ivory-faint")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "font-display text-lg transition-colors md:text-xl",
                      isActive ? "text-ivory" : "text-ivory-dim group-hover:text-ivory"
                    )}
                  >
                    {l.name}
                  </span>
                </button>

                {/* Description expands for the active landmark */}
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-500 ease-out",
                    isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-4 pl-9 text-sm leading-relaxed text-ivory-dim">{l.body}</p>
                  </div>
                </div>

                <div className="h-px w-full overflow-hidden bg-transparent" aria-hidden>
                  {isActive && (
                    <div
                      key={active}
                      className="vizag-progress h-full bg-gold"
                      style={{
                        animationDuration: `${ADVANCE_MS}ms`,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                      onAnimationEnd={next}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
