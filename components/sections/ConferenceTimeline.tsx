"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { conferenceDays, format } from "@/config/conference";
import { cn } from "@/lib/utils/cn";

export function ConferenceTimeline() {
  const [activeDay, setActiveDay] = useState(0);
  const day = conferenceDays[activeDay];

  return (
    <div>
      <p className="max-w-2xl text-[15px] leading-relaxed text-ivory-dim">{format}</p>

      <div className="mt-10 flex gap-2 border-b border-line">
        {conferenceDays.map((d, i) => (
          <button
            key={d.label}
            type="button"
            onClick={() => setActiveDay(i)}
            className={cn(
              "border-b-2 px-1 pb-4 text-left transition-colors",
              i === activeDay ? "border-gold" : "border-transparent"
            )}
          >
            <p
              className={cn(
                "font-display text-2xl",
                i === activeDay ? "text-gold" : "text-ivory-faint"
              )}
            >
              {d.label}
            </p>
            <p
              className={cn(
                "mt-1 max-w-[220px] text-xs uppercase tracking-[0.08em]",
                i === activeDay ? "text-ivory-dim" : "text-ivory-faint"
              )}
            >
              {d.heading}
            </p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.ol
          key={day.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-4 border-l border-line pl-8"
        >
          {day.sessions.map((s) => (
            <li key={s.title} className="relative py-7 first:pt-8">
              <span
                className="absolute top-9 -left-[calc(2rem+3.5px)] h-[7px] w-[7px] rounded-full bg-gold"
                aria-hidden
              />
              <p className="text-[11px] uppercase tracking-[0.14em] text-ivory-faint">{s.time}</p>
              <p className="mt-2 font-display text-xl text-ivory">{s.title}</p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ivory-dim">{s.description}</p>
            </li>
          ))}
        </motion.ol>
      </AnimatePresence>
    </div>
  );
}
