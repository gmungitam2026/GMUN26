"use client";

import { useSyncExternalStore } from "react";
import { timelineMilestones } from "@/config/conference";

function getNextMilestone(now: Date) {
  return timelineMilestones.find((m) => m.date && new Date(m.date).getTime() > now.getTime());
}

// Snapshot is cached at module scope and only updated from the interval
// tick, never computed fresh inside getSnapshot — useSyncExternalStore
// calls getSnapshot multiple times per render to check for changes, and a
// live Date.now() there differs on almost every call, which reads as a
// constantly-changing store and causes a render loop ("Maximum update
// depth exceeded").
let cachedNowMs = Date.now();
const clockListeners = new Set<() => void>();
let clockIntervalId: ReturnType<typeof setInterval> | null = null;

function subscribeToClock(callback: () => void) {
  clockListeners.add(callback);
  if (!clockIntervalId) {
    clockIntervalId = setInterval(() => {
      cachedNowMs = Date.now();
      clockListeners.forEach((listener) => listener());
    }, 1000);
  }
  return () => {
    clockListeners.delete(callback);
    if (clockListeners.size === 0 && clockIntervalId) {
      clearInterval(clockIntervalId);
      clockIntervalId = null;
    }
  };
}

function getClockSnapshot() {
  return cachedNowMs;
}

function getServerClockSnapshot() {
  return 0;
}

/** Ticks every second on the client; renders a stable placeholder during SSR/hydration. */
function useCountdown() {
  const nowMs = useSyncExternalStore(subscribeToClock, getClockSnapshot, getServerClockSnapshot);
  return nowMs ? new Date(nowMs) : null;
}

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

export function HeroCountdown() {
  const now = useCountdown();
  const next = now ? getNextMilestone(now) : timelineMilestones.find((m) => m.date);

  let diff = 0;
  if (now && next?.date) {
    diff = Math.max(0, new Date(next.date).getTime() - now.getTime());
  }
  const units = [
    { label: "Days", value: Math.floor(diff / 86400000) },
    { label: "Hours", value: Math.floor((diff % 86400000) / 3600000) },
    { label: "Min", value: Math.floor((diff % 3600000) / 60000) },
    { label: "Sec", value: Math.floor((diff % 60000) / 1000) },
  ];

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">
        {next ? `Counting down to ${next.label}` : "GMUN 5.0 has concluded"}
      </p>
      <div className="mt-3 flex items-stretch gap-2 sm:gap-3" suppressHydrationWarning>
        {units.map((unit) => (
          <div
            key={unit.label}
            className="flex min-w-[64px] flex-col items-center border border-line-strong bg-ink/60 px-3 py-2.5 backdrop-blur-sm sm:min-w-[76px]"
          >
            <span className="font-display text-3xl leading-none text-ivory tabular-nums sm:text-4xl">
              {now ? pad(unit.value) : "--"}
            </span>
            <span className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-ivory-faint">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
