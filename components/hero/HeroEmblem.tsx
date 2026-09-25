/**
 * The hero's Model UN motif: a gold line-art globe with slowly turning
 * meridians inside a laurel wreath (the emblem shape every MUN uses, drawn
 * fresh rather than copying the UN's), with a curve of country placards below
 * that rise one after another, as delegates do when voting or asking to speak.
 * Pure SVG + CSS keyframes ("Hero emblem" in globals.css): no WebGL, no JS,
 * scales to any width, and holds still under prefers-reduced-motion.
 */

const CX = 300;
const CY = 250;
const R = 132;

const MERIDIANS = 6;
const MERIDIAN_PERIOD_S = 16;
const LATITUDES = [-88, -46, 0, 46, 88];

// Laurel: leaves along an arc up each side of the globe, from the base to the
// upper flank. SVG angles (y points down): 75° is below-right, -35° upper-right.
const LEAF_COUNT = 11;
function laurel(side: 1 | -1) {
  const leaves: { x: number; y: number; rot: number; delay: number; outer: boolean }[] = [];
  for (let i = 0; i < LEAF_COUNT; i++) {
    const deg = 75 - (i / (LEAF_COUNT - 1)) * 110;
    const a = (deg * Math.PI) / 180;
    // Direction of travel up the branch (decreasing angle), in degrees.
    const tangent = (Math.atan2(-Math.cos(a), Math.sin(a)) * 180) / Math.PI;
    for (const outer of [true, false]) {
      const r = R + 30 + (outer ? 11 : -9);
      const dx = r * Math.cos(a);
      const rot = tangent + (outer ? -32 : 32);
      leaves.push({
        x: CX + side * dx,
        y: CY + r * Math.sin(a),
        rot: side === 1 ? rot : 180 - rot,
        delay: 200 + i * 70 + (outer ? 0 : 35),
        outer,
      });
    }
  }
  return leaves;
}
const LEAVES = [...laurel(1), ...laurel(-1)];

const PLACARDS = [
  { name: "India", stripes: ["#ff9933", "#f3ecdc", "#138808"] },
  { name: "France", stripes: ["#0055a4", "#f3ecdc", "#ef4135"] },
  { name: "Brazil", stripes: ["#009c3b", "#ffdf00", "#009c3b"] },
  { name: "Japan", stripes: ["#f3ecdc", "#bc002d", "#f3ecdc"] },
  { name: "Kenya", stripes: ["#1c1a15", "#bb0000", "#006600"] },
];
const PLACARD_STEP_S = 1.4;

function placardTransform(i: number) {
  // Evenly spaced along a gentle arc under the wreath, outer ones tilted out.
  const k = i - (PLACARDS.length - 1) / 2;
  return { x: CX + k * 114, y: CY + R + 104 - k * k * 7, rot: k * 5 };
}

export function HeroEmblem({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 560" className={className} fill="none" aria-hidden>
      <defs>
        <radialGradient id="emblem-glow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#d4af6a" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#d4af6a" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#d4af6a" stopOpacity="0" />
        </radialGradient>
        <clipPath id="globe-clip">
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
      </defs>

      <circle cx={CX} cy={CY} r={R + 110} fill="url(#emblem-glow)" className="emblem-breathe" />

      {/* Orbit rings */}
      <circle cx={CX} cy={CY} r={R + 62} className="stroke-gold emblem-orbit" strokeWidth="0.8" strokeDasharray="2 9" opacity="0.55" />
      <circle cx={CX} cy={CY} r={R + 12} className="stroke-gold" strokeWidth="1" opacity="0.35" />

      {/* Globe */}
      <g className="emblem-draw">
        <circle cx={CX} cy={CY} r={R} className="stroke-gold" strokeWidth="1.6" />
        <g clipPath="url(#globe-clip)">
          {LATITUDES.map((y) => {
            const rx = Math.sqrt(R * R - y * y);
            return <ellipse key={y} cx={CX} cy={CY + y} rx={rx} ry={rx * 0.16} className="stroke-gold" strokeWidth="0.9" opacity="0.7" />;
          })}
          {Array.from({ length: MERIDIANS }).map((_, i) => (
            <ellipse
              key={i}
              cx={CX}
              cy={CY}
              rx={R}
              ry={R}
              className="stroke-gold emblem-meridian"
              strokeWidth="0.9"
              opacity="0.75"
              style={{ animationDelay: `${(-i / MERIDIANS) * MERIDIAN_PERIOD_S}s`, animationDuration: `${MERIDIAN_PERIOD_S}s` }}
            />
          ))}
          <line x1={CX} y1={CY - R} x2={CX} y2={CY + R} className="stroke-gold" strokeWidth="1" opacity="0.8" />
        </g>
      </g>

      {/* Laurel wreath, leaves unfurling from the base */}
      {/* Placement lives on the wrapper so the grow-in animation on the leaf
          itself can't disturb it. */}
      {LEAVES.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot})`}>
          <ellipse
            rx="15"
            ry="5.5"
            className={l.outer ? "fill-gold emblem-leaf" : "fill-gold-bright emblem-leaf"}
            opacity={l.outer ? 0.9 : 0.7}
            style={{ animationDelay: `${l.delay}ms` }}
          />
        </g>
      ))}
      {/* Wreath stems */}
      <path
        d={`M ${CX - 30} ${CY + R + 36} Q ${CX} ${CY + R + 48} ${CX + 30} ${CY + R + 36}`}
        className="stroke-gold"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Country placards, raised one after another */}
      {PLACARDS.map((p, i) => {
        const { x, y, rot } = placardTransform(i);
        return (
          <g key={p.name} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <g className="emblem-placard" style={{ animationDelay: `${i * PLACARD_STEP_S}s`, animationDuration: `${PLACARDS.length * PLACARD_STEP_S}s` }}>
              {/* Stick */}
              <rect x="-2" y="18" width="4" height="46" rx="1.5" className="fill-gold" opacity="0.8" />
              <rect x="-50" y="-20" width="100" height="40" rx="3" fill="#f3ecdc" />
              {p.stripes.map((c, s) => (
                <rect key={s} x={-50 + s * 4} y="-20" width="4" height="40" fill={c} />
              ))}
              <text
                x="6"
                y="5"
                textAnchor="middle"
                fontFamily="var(--font-display), Georgia, serif"
                fontSize="15"
                fill="#1c1a15"
              >
                {p.name}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
