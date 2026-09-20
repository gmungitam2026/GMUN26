// Deterministic pseudo-random (not Math.random()) so server and client
// render the exact same star positions — no hydration mismatch risk.
function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function buildStarsSvg() {
  const size = 600;
  const stars: string[] = [];
  for (let i = 0; i < 70; i++) {
    const x = Math.round(seeded(i * 3.1) * size);
    const y = Math.round(seeded(i * 7.7 + 1) * size);
    const r = 0.5 + seeded(i * 5.3 + 2) * 1.1;
    const o = (0.25 + seeded(i * 9.1 + 3) * 0.55).toFixed(2);
    stars.push(`<circle cx="${x}" cy="${y}" r="${r.toFixed(2)}" fill="%23efe9dc" fill-opacity="${o}"/>`);
  }
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${stars.join("")}</svg>`;
}

const starsDataUri = `url("data:image/svg+xml,${buildStarsSvg()}")`;

/**
 * A fixed, full-viewport starfield behind all page content. Pure CSS
 * (tiled SVG background-image + a slow background-position drift) — no
 * client JS, no IntersectionObserver, nothing that can get stuck. Hidden
 * in the light theme via CSS only (see globals.css) rather than a second
 * variant, so there's no per-theme branching logic to get wrong.
 */
export function Starfield() {
  return (
    <div
      aria-hidden
      className="starfield animate-drift pointer-events-none fixed inset-0 z-40"
      style={{
        backgroundImage: starsDataUri,
        backgroundRepeat: "repeat",
        mixBlendMode: "screen",
      }}
    />
  );
}
