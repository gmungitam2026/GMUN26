"use client";

import { motion } from "framer-motion";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";

const easeOut = [0.16, 1, 0.3, 1] as const;

/**
 * Uses `whileInView` (IntersectionObserver-driven) rather than a plain
 * mount-triggered `animate`. On a hard/fresh load of this statically
 * prerendered page, a plain `initial`→`animate` transition was confirmed
 * (via computed styles on the live deployment) to never fire — elements
 * stayed stuck at their invisible `initial` state — even though it worked
 * fine on a client-side navigation to the same page. `whileInView` is the
 * exact mechanism every other animated section already uses reliably
 * (via the Reveal component), so the hero now uses the same one instead
 * of a separate, apparently-unreliable code path.
 */
function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.9, delay, ease: easeOut },
  };
}

export function Hero() {
  return (
    <section className="grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink pt-20">
      <HeroMotif />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-20 md:px-10 lg:px-16 lg:pb-28">
        <motion.p
          {...fadeUp(0.15)}
          className="mb-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-gold"
        >
          <span className="h-px w-10 bg-gold" aria-hidden />
          {site.tagline}
        </motion.p>

        <motion.h1
          {...fadeUp(0.24)}
          className="max-w-4xl font-display text-[13vw] leading-[0.98] font-medium text-ivory sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Welcome to <span className="italic text-gold">GMUN 5.0</span>
        </motion.h1>

        <motion.p {...fadeUp(0.33)} className="mt-8 max-w-xl text-base leading-relaxed text-ivory-dim md:text-lg">
          Andhra Pradesh&apos;s one of the largest Model United Nations conferences returns,
          a gathering of delegates for diplomacy, debate, leadership, and diverse
          perspectives on the issues shaping our world.
        </motion.p>

        <motion.div
          {...fadeUp(0.42)}
          className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-3 border-t border-line pt-6 text-sm text-ivory-dim"
        >
          <span className="font-display text-lg text-ivory">{site.dates.display}</span>
          <span className="hidden h-4 w-px bg-line-strong sm:block" aria-hidden />
          <span>{site.venue.name}, {site.venue.line2}</span>
        </motion.div>

        <motion.div {...fadeUp(0.51)} className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/register" variant="primary" size="lg">
            Register Now
          </Button>
          <Button href="/about" variant="secondary" size="lg">
            Explore GMUN
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function HeroMotif() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
      viewBox="0 0 1400 900"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <ellipse
          key={i}
          cx="700"
          cy="450"
          rx={140 + i * 110}
          ry={90 + i * 70}
          stroke="#b7924e"
          strokeWidth="0.6"
        />
      ))}
      <line x1="0" y1="450" x2="1400" y2="450" stroke="#efe9dc" strokeWidth="0.4" />
      <line x1="700" y1="0" x2="700" y2="900" stroke="#efe9dc" strokeWidth="0.4" />
    </svg>
  );
}
