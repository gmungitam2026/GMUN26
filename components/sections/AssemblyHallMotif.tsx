/**
 * Illustrated line-art assembly hall — tiered delegate rows facing a
 * central podium, in the same hairline gold/ivory style as the hero motif.
 * Pure static SVG (no animation, no JS) so it carries zero rendering risk.
 */
export function AssemblyHallMotif({ className = "" }: { className?: string }) {
  const rows = [0, 1, 2, 3, 4, 5];

  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox="0 0 1200 560"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Tiered semicircular desk rows */}
      {rows.map((i) => {
        const ry = 120 + i * 58;
        const rx = 220 + i * 82;
        return (
          <path
            key={i}
            d={`M ${600 - rx} 470 A ${rx} ${ry} 0 0 1 ${600 + rx} 470`}
            stroke="#b7924e"
            strokeWidth="0.7"
            opacity={0.5 + i * 0.05}
          />
        );
      })}

      {/* Delegate placard ticks along the outermost two rows */}
      {Array.from({ length: 28 }).map((_, i) => {
        const angle = Math.PI - (i / 27) * Math.PI;
        const rx = 220 + 5 * 82;
        const ry = 120 + 5 * 58;
        const x = 600 + rx * Math.cos(angle);
        const y = 470 - ry * Math.sin(angle) * 0.62;
        return <rect key={i} x={x - 3} y={y - 5} width="6" height="8" stroke="#efe9dc" strokeWidth="0.5" opacity="0.4" />;
      })}

      {/* Central podium */}
      <rect x="560" y="440" width="80" height="34" stroke="#b7924e" strokeWidth="0.9" />
      <line x1="600" y1="440" x2="600" y2="392" stroke="#efe9dc" strokeWidth="0.5" opacity="0.5" />
      <circle cx="600" cy="386" r="6" stroke="#efe9dc" strokeWidth="0.5" opacity="0.5" />

      {/* Flags flanking the podium */}
      <line x1="500" y1="474" x2="500" y2="378" stroke="#efe9dc" strokeWidth="0.5" opacity="0.4" />
      <path d="M 500 378 L 536 388 L 500 398 Z" stroke="#b7924e" strokeWidth="0.6" opacity="0.55" />
      <line x1="700" y1="474" x2="700" y2="378" stroke="#efe9dc" strokeWidth="0.5" opacity="0.4" />
      <path d="M 700 378 L 664 388 L 700 398 Z" stroke="#b7924e" strokeWidth="0.6" opacity="0.55" />
    </svg>
  );
}
