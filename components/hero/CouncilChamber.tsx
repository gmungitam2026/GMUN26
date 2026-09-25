/**
 * A top-down council chamber: a horseshoe of delegate desks around the
 * chair's dais, with the floor passing from delegate to delegate. Each seat
 * takes its turn "speaking" — its desk lights up, sound ripples out from the
 * microphone and a line of address runs to the chair — then yields to the
 * next. Pure SVG + CSS keyframes (see `.chamber-*` in globals.css): no
 * WebGL, no JS timers, and it pauses under prefers-reduced-motion.
 */

const SEATS = 12;
const STEP_S = 2; // seconds each delegate holds the floor
const CX = 300;
const CY = 300;
const R = 190;
// Horseshoe opens toward the viewer (bottom); the chair sits at the top.
const ARC_START = 125;
const ARC_END = 415;

const CHAIR = { x: CX, y: CY - R - 6 };

function seatPosition(i: number) {
  // Skip the top-centre slot — that's the chair's dais.
  const t = (i + (i >= SEATS / 2 ? 1 : 0)) / SEATS;
  const deg = ARC_START + t * (ARC_END - ARC_START);
  const rad = (deg * Math.PI) / 180;
  return {
    x: CX + R * Math.cos(rad),
    y: CY + R * Math.sin(rad),
    // Desks face the centre of the floor.
    rotate: deg + 90,
  };
}

const seats = Array.from({ length: SEATS }, (_, i) => ({
  ...seatPosition(i),
  delay: `${i * STEP_S}s`,
}));

export function CouncilChamber() {
  return (
    <svg
      viewBox="0 0 600 600"
      className="h-full w-full overflow-visible"
      fill="none"
      aria-hidden
      style={{ ["--chamber-cycle" as string]: `${SEATS * STEP_S}s` }}
    >
      {/* Floor medallion */}
      <g className="stroke-gold" strokeWidth="0.8">
        <circle cx={CX} cy={CY} r="120" opacity="0.35" />
        <circle cx={CX} cy={CY} r="96" opacity="0.2" strokeDasharray="2 6" className="chamber-spin" />
        <circle cx={CX} cy={CY} r="62" opacity="0.3" />
        <circle cx={CX} cy={CY} r={R + 34} opacity="0.12" />
      </g>

      {/* Lines of address from each seat to the chair */}
      {seats.map((s, i) => (
        <line
          key={`addr-${i}`}
          x1={s.x}
          y1={s.y}
          x2={CHAIR.x}
          y2={CHAIR.y + 18}
          className="chamber-address stroke-gold"
          strokeWidth="1"
          strokeDasharray="4 6"
          style={{ animationDelay: s.delay }}
        />
      ))}

      {/* Delegate seats */}
      {seats.map((s, i) => (
        <g key={`seat-${i}`} transform={`translate(${s.x} ${s.y}) rotate(${s.rotate})`}>
          {/* Microphone ripples */}
          {[0, 0.6, 1.2].map((offset) => (
            <circle
              key={offset}
              r="14"
              cy="-6"
              className="chamber-ripple stroke-gold-bright"
              strokeWidth="1.2"
              style={{ animationDelay: `calc(${s.delay} + ${offset}s)` }}
            />
          ))}
          {/* Delegate */}
          <circle cy="16" r="7" className="fill-ivory-faint" opacity="0.55" />
          {/* Desk */}
          <rect
            x="-20"
            y="-2"
            width="40"
            height="10"
            rx="2"
            className="chamber-desk fill-surface-raised stroke-line-strong"
            strokeWidth="1"
            style={{ animationDelay: s.delay }}
          />
          {/* Placard */}
          <rect
            x="-7"
            y="-7"
            width="14"
            height="5"
            rx="1"
            className="chamber-placard fill-ivory-faint"
            style={{ animationDelay: s.delay }}
          />
        </g>
      ))}

      {/* Chair's dais */}
      <g transform={`translate(${CHAIR.x} ${CHAIR.y})`}>
        <rect x="-46" y="-6" width="92" height="16" rx="3" className="fill-surface-raised stroke-gold" strokeWidth="1.2" />
        {[-22, 0, 22].map((x) => (
          <circle key={x} cx={x} cy="-16" r="7" className="fill-gold" opacity={x === 0 ? 0.9 : 0.5} />
        ))}
        {/* Gavel strike */}
        <g transform="translate(40 -4)">
          {/* Separate group: a CSS transform would replace the translate above. */}
          <g className="chamber-gavel">
            <rect x="-2" y="-14" width="3" height="14" rx="1" className="fill-gold-bright" />
            <rect x="-7" y="-18" width="13" height="6" rx="1.5" className="fill-gold-bright" />
          </g>
        </g>
      </g>

      {/* Well of the chamber — rostrum at the open end */}
      <g transform={`translate(${CX} ${CY + 70})`}>
        <rect x="-18" y="-6" width="36" height="12" rx="2" className="fill-surface-raised stroke-line-strong" strokeWidth="1" />
        <circle r="3" cy="-12" className="fill-gold" opacity="0.7" />
      </g>
    </svg>
  );
}
