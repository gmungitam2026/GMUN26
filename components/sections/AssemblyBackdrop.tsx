"use client";

import { useSyncExternalStore } from "react";

const ROW_COUNT = 9;

// Rounded to 2 decimals: Math.cos/Math.sin can differ in their last bit
// between Node's and the browser's V8 build, which otherwise serializes to
// a different string server vs client and trips a hydration mismatch.
function round(n: number) {
  return Math.round(n * 100) / 100;
}

interface Seat {
  x: number;
  y: number;
  /** Degrees to rotate the chair glyph so it faces the podium. */
  rot: number;
}

function buildRowSeats(rowIndex: number): Seat[] {
  const rx = 170 + rowIndex * 62;
  const ry = 90 + rowIndex * 40;
  const count = 10 + rowIndex * 3;
  const seats: Seat[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const angle = Math.PI - t * Math.PI;
    const angleDeg = (angle * 180) / Math.PI;
    seats.push({
      x: round(600 + rx * Math.cos(angle)),
      y: round(500 - ry * Math.sin(angle) * 0.6),
      rot: round(90 - angleDeg),
    });
  }
  return seats;
}

const rows = Array.from({ length: ROW_COUNT }, (_, i) => buildRowSeats(i));
const seatsInOrder = rows.flat();
const TOTAL_SEATS = seatsInOrder.length;

// Cached at module scope and only recomputed from the scroll/resize
// listener — never fresh inside getSnapshot, which is the mistake that
// broke TimelineBar's clock (useSyncExternalStore calls getSnapshot
// several times per render, and a value that's fresh every call reads as
// a constantly-changing store and loops).
let cachedProgress = 0;
const progressListeners = new Set<() => void>();
let rafId: number | null = null;
let bound = false;

function computeProgress() {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / scrollable));
}

function scheduleUpdate() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    cachedProgress = computeProgress();
    progressListeners.forEach((listener) => listener());
  });
}

function subscribeScrollProgress(callback: () => void) {
  progressListeners.add(callback);
  if (!bound) {
    bound = true;
    cachedProgress = computeProgress();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
  }
  return () => {
    progressListeners.delete(callback);
    if (progressListeners.size === 0 && bound) {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      bound = false;
    }
  };
}

function getProgressSnapshot() {
  return cachedProgress;
}

function getProgressServerSnapshot() {
  return 0;
}

function useScrollProgress() {
  return useSyncExternalStore(subscribeScrollProgress, getProgressSnapshot, getProgressServerSnapshot);
}

/** A small chair glyph — seat + backrest — facing +y by default. */
function Chair({ seat, lit }: { seat: Seat; lit: boolean }) {
  return (
    <g transform={`translate(${seat.x} ${seat.y}) rotate(${seat.rot})`}>
      <rect
        x="-3.2"
        y="-4.6"
        width="6.4"
        height="2.4"
        rx="0.6"
        className="transition-all duration-500 ease-out"
        style={{ fill: lit ? "#d4af6a" : "#3a352a", opacity: lit ? 0.55 : 0.14 }}
      />
      <rect
        x="-3.2"
        y="-1.8"
        width="6.4"
        height="3.2"
        rx="0.6"
        className="transition-all duration-500 ease-out"
        style={{ fill: lit ? "#d4af6a" : "#3a352a", opacity: lit ? 0.5 : 0.12 }}
      />
    </g>
  );
}

/**
 * A fixed, full-page assembly hall behind all content. As the page scrolls
 * from the hero down through the rest of it, seats light up gold one at a
 * time in sequence, tied directly to scroll progress rather than a
 * one-time viewport trigger. Screen-blended like the starfield so it reads
 * over every section's own background without those sections needing to
 * go transparent, and hidden in the light theme (see globals.css).
 */
export function AssemblyBackdrop() {
  const progress = useScrollProgress();
  const litCount = Math.round(progress * TOTAL_SEATS);

  return (
    <div
      aria-hidden
      className="assembly-backdrop pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[75vh] w-full"
      style={{ mixBlendMode: "screen" }}
    >
      <svg viewBox="0 0 1200 560" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
        {seatsInOrder.map((seat, i) => (
          <Chair key={i} seat={seat} lit={i < litCount} />
        ))}

        {/* Rear dais panel */}
        <rect x="530" y="470" width="140" height="70" stroke="#b7924e" strokeWidth="0.8" fill="none" opacity="0.3" />
        <line x1="565" y1="470" x2="565" y2="540" stroke="#b7924e" strokeWidth="0.4" opacity="0.2" />
        <line x1="600" y1="470" x2="600" y2="540" stroke="#b7924e" strokeWidth="0.4" opacity="0.2" />
        <line x1="635" y1="470" x2="635" y2="540" stroke="#b7924e" strokeWidth="0.4" opacity="0.2" />
        {/* Lectern */}
        <path d="M 585 540 L 615 540 L 622 558 L 578 558 Z" stroke="#b7924e" strokeWidth="0.9" fill="none" opacity="0.35" />
      </svg>
    </div>
  );
}
