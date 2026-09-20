"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";

const easeOut = [0.16, 1, 0.3, 1] as const;

/**
 * Neither a plain mount-triggered `animate` nor `whileInView` reliably
 * fired for this above-the-fold content on a hard load of this statically
 * prerendered page (confirmed live: elements stuck at their invisible
 * `initial` state until something like a window resize forced Framer
 * Motion's internal IntersectionObserver to re-evaluate — a timing race,
 * not a config error). Driving the transition off plain React state set
 * in an effect sidesteps Framer Motion's own mount/viewport heuristics
 * entirely, so there's no race left to hit.
 */
function subscribeNoop() {
  return () => {};
}
function getRevealedClient() {
  return true;
}
function getRevealedServer() {
  return false;
}

/** True once this has rendered on the client — never on the server/first hydration pass. */
function useRevealed() {
  return useSyncExternalStore(subscribeNoop, getRevealedClient, getRevealedServer);
}

function fadeUp(revealed: boolean, delay: number) {
  return {
    initial: { opacity: 0, y: 22 },
    animate: revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    transition: { duration: 0.9, delay, ease: easeOut },
  };
}

export function Hero() {
  const revealed = useRevealed();

  return (
    <section className="grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink pt-20">
      <HeroMotif />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-20 md:px-10 lg:px-16 lg:pb-28">
        <motion.p
          {...fadeUp(revealed, 0.15)}
          className="mb-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-gold"
        >
          <span className="h-px w-10 bg-gold" aria-hidden />
          {site.tagline}
        </motion.p>

        <motion.h1
          {...fadeUp(revealed, 0.24)}
          className="max-w-4xl font-display text-[13vw] leading-[0.98] font-medium text-ivory sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Welcome to <span className="italic text-gold">GMUN 5.0</span>
        </motion.h1>

        <motion.p
          {...fadeUp(revealed, 0.33)}
          className="mt-8 max-w-xl text-base leading-relaxed text-ivory-dim md:text-lg"
        >
          Andhra Pradesh&apos;s one of the largest Model United Nations conferences returns,
          a gathering of delegates for diplomacy, debate, leadership, and diverse
          perspectives on the issues shaping our world.
        </motion.p>

        <motion.div
          {...fadeUp(revealed, 0.42)}
          className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-3 border-t border-line pt-6 text-sm text-ivory-dim"
        >
          <span className="font-display text-lg text-ivory">{site.dates.display}</span>
          <span className="hidden h-4 w-px bg-line-strong sm:block" aria-hidden />
          <span>{site.venue.name}, {site.venue.line2}</span>
        </motion.div>

        <motion.div {...fadeUp(revealed, 0.51)} className="mt-10 flex flex-wrap items-center gap-4">
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
