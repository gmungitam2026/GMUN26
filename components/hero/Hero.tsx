import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { HeroCountdown } from "@/components/hero/HeroCountdown";
import { PoweredByMDC } from "@/components/ui/PoweredByMDC";

/**
 * Pure CSS keyframe animation (see `--animate-reveal` in globals.css)
 * instead of Framer Motion. This content is above the fold on a statically
 * prerendered page, and every Framer Motion trigger tried here — plain
 * mount-triggered `animate`, `whileInView`, and a React-state-driven
 * `animate` via `useSyncExternalStore` — was confirmed live (via computed
 * styles on the production deployment, not just a screenshot) to leave the
 * content permanently stuck at its invisible initial state on a hard page
 * load. A CSS animation runs the moment the browser paints the element,
 * with no dependency on React hydration or any JS timing at all, so there
 * is no race left to lose.
 */
function revealStyle(delayMs: number) {
  return { animationDelay: `${delayMs}ms` };
}

export function Hero() {
  return (
    <section className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink pt-24 pb-16 sm:pt-28 lg:pb-20">
      <HeroMotif />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center px-6 text-center md:px-10 lg:px-16">
        <p
          style={revealStyle(100)}
          className="animate-reveal mb-5 flex items-center justify-center gap-3 text-[10px] font-medium uppercase tracking-[0.24em] text-gold sm:mb-6 sm:text-[11px] sm:tracking-[0.32em]"
        >
          <span className="hidden h-px w-10 bg-gold sm:block" aria-hidden />
          {site.tagline}
          <span className="hidden h-px w-10 bg-gold sm:block" aria-hidden />
        </p>

        <h1
          style={revealStyle(180)}
          className="animate-reveal max-w-4xl font-display text-[12vw] leading-[0.98] font-medium text-ivory sm:text-6xl md:text-7xl xl:text-8xl"
        >
          Welcome to <span className="italic text-gold">GMUN</span>
        </h1>

        <p
          style={revealStyle(260)}
          className="animate-reveal mt-6 max-w-xl text-[15px] leading-relaxed text-ivory-dim sm:mt-8 md:text-lg"
        >
          Andhra Pradesh&apos;s one of the largest Model United Nations conferences returns, a gathering of delegates
          for diplomacy, debate, leadership, and diverse perspectives on the issues shaping our world.
        </p>

        <div
          style={revealStyle(340)}
          className="animate-reveal mt-10 flex w-full max-w-2xl flex-col items-center gap-5 border-t border-line pt-8"
        >
          <HeroCountdown />
          <div className="flex flex-col gap-1 text-sm text-ivory-dim">
            <span className="font-display text-lg text-ivory">{site.dates.display}</span>
            <span>
              {site.venue.name}, {site.venue.line2}
            </span>
          </div>
        </div>

        <div style={revealStyle(420)} className="animate-reveal mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="/register" variant="primary" size="lg">
            Register Now
          </Button>
          <Button href="/about" variant="secondary" size="lg">
            Explore GMUN
          </Button>
        </div>

        <div style={revealStyle(500)} className="animate-reveal mt-10">
          <PoweredByMDC variant="badge" />
        </div>
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
        <ellipse key={i} cx="700" cy="450" rx={140 + i * 110} ry={90 + i * 70} stroke="#b7924e" strokeWidth="0.6" />
      ))}
      <line x1="0" y1="450" x2="1400" y2="450" stroke="#efe9dc" strokeWidth="0.4" />
      <line x1="700" y1="0" x2="700" y2="900" stroke="#efe9dc" strokeWidth="0.4" />
    </svg>
  );
}
