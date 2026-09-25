"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { VizagExplorer } from "@/components/sections/VizagExplorer";
import { Photo } from "@/components/ui/Photo";
import { gmunPhotos, gitamCampusPhoto, unGeneralAssemblyPhoto } from "@/config/photos";
import {
  aboutGmun,
  aboutGitam,
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
      <nav aria-label="About sections" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
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

      <div className="min-h-[420px] min-w-0">
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

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:grid-rows-2">
        <Photo photo={gmunPhotos.p4} className="col-span-2 aspect-[16/10] md:row-span-2 md:aspect-auto" parallax={false} sizes="(min-width: 1024px) 600px, 100vw" />
        <Photo photo={gmunPhotos.p7} className="aspect-[4/3]" parallax={false} sizes="(min-width: 1024px) 300px, 50vw" />
        <Photo photo={gmunPhotos.p2} className="aspect-[4/3]" parallax={false} sizes="(min-width: 1024px) 300px, 50vw" />
      </div>

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
      <div className="mt-6 grid gap-8 xl:grid-cols-[1fr_300px] xl:gap-10">
        <p className="text-[15px] leading-relaxed text-ivory-dim">{aboutGitam.body}</p>
        <Photo photo={gitamCampusPhoto} className="aspect-[4/3] xl:aspect-[3/4] xl:self-start" sizes="(min-width: 1280px) 300px, 100vw" />
      </div>

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
  return <VizagExplorer />;
}

function MunPanel() {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">{whatIsMun.eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl text-ivory md:text-4xl">What is Model UN?</h2>
      <Photo photo={unGeneralAssemblyPhoto} className="mt-8 aspect-[16/9]" sizes="(min-width: 1024px) 900px, 100vw" />
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
      <Photo photo={gmunPhotos.p6} className="mt-8 aspect-[16/8]" sizes="(min-width: 1024px) 900px, 100vw" />
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
