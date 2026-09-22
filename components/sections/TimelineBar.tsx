"use client";

import { useSyncExternalStore } from "react";
import { timelineMilestones } from "@/config/conference";
import { Container } from "@/components/ui/Container";

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

export function TimelineBar() {
  const now = useCountdown();
  const next = now ? getNextMilestone(now) : timelineMilestones.find((m) => m.date);

  let diff = 0;
  if (now && next?.date) {
    diff = Math.max(0, new Date(next.date).getTime() - now.getTime());
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return (
    <section className="border-y border-line bg-surface py-8 md:py-10">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="shrink-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">
              {next ? `Counting down to ${next.label}` : "GMUN 5.0 has concluded"}
            </p>
            <div className="mt-3 flex items-baseline gap-4 sm:gap-6" suppressHydrationWarning>
              {[
                { label: "Days", value: days },
                { label: "Hours", value: hours },
                { label: "Min", value: minutes },
                { label: "Sec", value: seconds },
              ].map((unit) => (
                <div key={unit.label} className="flex items-baseline gap-1.5">
                  <span className="font-display text-4xl text-ivory tabular-nums sm:text-5xl lg:text-6xl">
                    {now ? pad(unit.value) : "--"}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.08em] text-ivory-faint">{unit.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
