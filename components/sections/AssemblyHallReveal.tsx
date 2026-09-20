"use client";

import { useEffect, useRef, useState } from "react";

const ROW_COUNT = 7;

// Rounded to 2 decimals: Math.cos/Math.sin can differ in their last bit
// between Node's and the browser's V8 build, which otherwise serializes
// to a different string server vs client and trips a hydration mismatch.
function round(n: number) {
  return Math.round(n * 100) / 100;
}

function buildRowSeats(rowIndex: number) {
  const rx = 200 + rowIndex * 68;
  const ry = 100 + rowIndex * 44;
  const count = 14 + rowIndex * 4;
  const seats: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const angle = Math.PI - t * Math.PI;
    seats.push({
      x: round(600 + rx * Math.cos(angle)),
      y: round(486 - ry * Math.sin(angle) * 0.62),
    });
  }
  return seats;
}

const rows = Array.from({ length: ROW_COUNT }, (_, i) => buildRowSeats(i));

/**
 * Triggered by a plain IntersectionObserver (not Framer Motion whileInView)
 * — this section starts off-screen and is revealed by a real user scroll,
 * unlike the hero content that broke on hard loads. setState happens inside
 * the observer's callback, not synchronously in the effect body, so it
 * doesn't hit the react-hooks/set-state-in-effect rule either. Once
 * revealed each row's seats fade/light up in sequence via a staggered CSS
 * transition-delay — no animation library involved.
 */
export function AssemblyHallReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto aspect-[1200/560] w-full max-w-5xl">
      <svg viewBox="0 0 1200 560" className="h-full w-full" aria-hidden>
        {rows.map((seats, rowIndex) => (
          <g key={rowIndex}>
            {seats.map((seat, i) => (
              <circle
                key={i}
                cx={seat.x}
                cy={seat.y}
                r="4"
                className="transition-all duration-700 ease-out"
                style={{
                  fill: revealed ? "#d4af6a" : "#3a352a",
                  opacity: revealed ? 0.9 : 0.22,
                  transitionDelay: revealed ? `${rowIndex * 130}ms` : "0ms",
                }}
              />
            ))}
          </g>
        ))}

        <rect
          x="560"
          y="440"
          width="80"
          height="34"
          stroke="#b7924e"
          strokeWidth="0.9"
          fill="none"
          className="transition-opacity duration-700 ease-out"
          style={{ opacity: revealed ? 1 : 0.3, transitionDelay: revealed ? `${ROW_COUNT * 130}ms` : "0ms" }}
        />
      </svg>
    </div>
  );
}
