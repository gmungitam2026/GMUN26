import Image from "next/image";
import { site } from "@/config/site";

/**
 * First-visit intro: Visakhapatnam's sea rises over the screen, the emblem
 * surfaces, then the water washes up and away to reveal the site. Rendered in
 * the initial HTML (so the page never flashes underneath) but hidden by
 * default. The inline script right after it switches it on for every full page
 * load (first visit and each refresh; in-app navigation doesn't replay it),
 * never under prefers-reduced-motion; any click, tap or key skips it. The skip
 * listeners are removed as soon as the intro ends, so a later click can't
 * bring the (invisible) overlay back under the pointer.
 * Styles: "Site intro" in globals.css.
 *
 * The on/off state lives on this element, not on <html>: React 19 owns the
 * <html> element after hydration and strips attributes it didn't set.
 */
const introScript = `(function(){var el=document.getElementById("site-intro");if(!el)return;try{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;el.setAttribute("data-state","play");var done=function(){el.removeAttribute("data-state");document.removeEventListener("pointerdown",skip,true);document.removeEventListener("keydown",skip,true)};var skip=function(){el.setAttribute("data-state","skip");setTimeout(done,500)};document.addEventListener("pointerdown",skip,true);document.addEventListener("keydown",skip,true);setTimeout(done,3400)}catch(e){}})();`;

// Wave crest lines drawn in a 2880×200 box: one period is 720 units, repeated
// across the width so shifting the layer by -50% loops seamlessly.
function crest(amplitude: number, baseline: number) {
  let d = `M0,${baseline}`;
  for (let x = 0; x < 2880; x += 720) {
    d += ` C${x + 180},${baseline - amplitude} ${x + 360},${baseline - amplitude} ${x + 360},${baseline}`;
    d += ` S${x + 540},${baseline + amplitude} ${x + 720},${baseline}`;
  }
  return d;
}
const wavePath = (amplitude: number, baseline: number) => `${crest(amplitude, baseline)} L2880,200 L0,200 Z`;

const layers = [
  { fill: "#0a2130", amplitude: 58, baseline: 110, speed: "7.5s", delay: "0ms" },
  { fill: "#0c2c3f", amplitude: 48, baseline: 115, speed: "5.8s", delay: "110ms" },
  { fill: "#0f3a51", amplitude: 40, baseline: 120, speed: "4.4s", delay: "220ms" },
];

export function SiteIntro() {
  return (
    <>
      <div id="site-intro" className="site-intro" aria-hidden suppressHydrationWarning>
        <div className="site-intro-sea">
          {layers.map((l, i) => (
            <div key={i} className="site-intro-layer" style={{ animationDelay: l.delay }}>
              <svg
                viewBox="0 0 2880 200"
                preserveAspectRatio="none"
                className="site-intro-wave"
                style={{ animationDuration: l.speed }}
              >
                <path d={wavePath(l.amplitude, l.baseline)} fill={l.fill} />
                <path
                  d={crest(l.amplitude, l.baseline)}
                  fill="none"
                  stroke="#d4af6a"
                  strokeOpacity={0.35 + i * 0.2}
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="site-intro-depth" style={{ background: l.fill }} />
            </div>
          ))}
        </div>

        <div className="site-intro-mark">
          <Image src="/logos/gmun-club-logo.jpg" alt="" width={120} height={141} priority className="site-intro-logo" />
          <p className="font-display text-3xl text-ivory md:text-4xl">
            GMUN <span className="text-gold">5.0</span>
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.32em] text-gold">Visakhapatnam · {site.dates.display}</p>
        </div>

        {/* Wavy trailing edge as the sea washes up off the screen */}
        <svg viewBox="0 0 2880 200" preserveAspectRatio="none" className="site-intro-edge">
          <path d={wavePath(60, 110)} transform="scale(1,-1) translate(0,-200)" fill="#0f3a51" />
        </svg>
      </div>
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
    </>
  );
}
