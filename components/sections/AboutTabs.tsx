"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import {
  aboutGmun,
  aboutGitam,
  aboutVizag,
  whatIsMun,
  whyParticipate,
} from "@/config/about";

const tabs = [
  { id: "gmun", label: "About GMUN" },
  { id: "gitam", label: "About GITAM Deemed to be University" },
  { id: "vizag", label: "About Visakhapatnam" },
  { id: "mun", label: "What is Model UN?" },
  { id: "why", label: "Why Participate in Model UN?" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function AboutTabs() {
  const [active, setActive] = useState<TabId>("gmun");

  return (
    <div className="grid gap-12 lg:grid-cols-[280px_1fr] lg:gap-20">
      <nav aria-label="About sections" className="lg:sticky lg:top-28 lg:self-start">
        <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-line lg:pb-0">
          {tabs.map((tab) => (
            <li key={tab.id} className="shrink-0 lg:border-b lg:border-line">
              <button
                type="button"
                onClick={() => setActive(tab.id)}
                aria-current={active === tab.id ? "true" : undefined}
                className={cn(
                  "whitespace-nowrap border border-line px-4 py-3 text-left text-[13px] uppercase tracking-[0.08em] text-ivory-dim transition-colors lg:w-full lg:border-none lg:px-0 lg:py-4 lg:text-sm lg:normal-case lg:tracking-normal",
                  active === tab.id ? "border-gold text-gold lg:text-gold" : "hover:text-ivory"
                )}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {active === "gmun" && <GmunPanel />}
            {active === "gitam" && <GitamPanel />}
            {active === "vizag" && <VizagPanel />}
            {active === "mun" && <MunPanel />}
            {active === "why" && <WhyPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function GmunPanel() {
  return (
    <div>
      <h2 className="font-display text-3xl text-ivory md:text-4xl">About GMUN</h2>
      <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ivory-dim">{aboutGmun.body}</p>

      <h3 className="mt-14 mb-6 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">
        Why GMUN Matters
      </h3>
      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {aboutGmun.whyItMatters.map((item) => (
          <div key={item.title} className="border-t border-line pt-4">
            <p className="font-display text-lg text-ivory">{item.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-ivory-dim">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GitamPanel() {
  return (
    <div>
      <h2 className="font-display text-3xl text-ivory md:text-4xl">About GITAM Deemed to be University</h2>
      <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ivory-dim">{aboutGitam.body}</p>

      <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-8 sm:grid-cols-5">
        {aboutGitam.stats.map((s) => (
          <div key={s.label}>
            <p className="font-display text-3xl text-gold">{s.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.1em] text-ivory-faint">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function VizagPanel() {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">{aboutVizag.eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl text-ivory md:text-4xl">{aboutVizag.heading}</h2>
      <div className="mt-6 max-w-2xl space-y-4 text-[15px] leading-relaxed text-ivory-dim">
        {aboutVizag.intro.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <h3 className="mt-14 mb-6 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">
        {aboutVizag.landmarksHeading}
      </h3>
      <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
        {aboutVizag.landmarks.map((l) => (
          <div key={l.name} className="border-t border-line pt-4">
            <p className="font-display text-lg text-ivory">{l.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-ivory-dim">{l.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MunPanel() {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">{whatIsMun.eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl text-ivory md:text-4xl">What is Model UN?</h2>
      <div className="mt-6 max-w-2xl space-y-4 text-[15px] leading-relaxed text-ivory-dim">
        {whatIsMun.body.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-14 flex flex-wrap items-center gap-x-3 gap-y-4 border-t border-line pt-8">
        {whatIsMun.process.map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <span className="font-display text-lg text-ivory">{step}</span>
            {i < whatIsMun.process.length - 1 && <span className="text-gold">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function WhyPanel() {
  return (
    <div>
      <h2 className="font-display text-3xl text-ivory md:text-4xl">Why Participate in Model UN?</h2>
      <div className="mt-10 space-y-8">
        {whyParticipate.points.map((p) => (
          <div key={p.title} className="border-t border-line pt-4">
            <p className="font-display text-lg text-ivory">{p.title}</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ivory-dim">{p.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-xs uppercase tracking-[0.1em] text-ivory-faint">
        {whyParticipate.certificateNote}
      </p>
    </div>
  );
}
