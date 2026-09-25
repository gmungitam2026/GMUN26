/**
 * Pure CSS keyframe animation (see `--animate-reveal` in globals.css)
 * rather than Framer Motion's `whileInView`. `whileInView` was confirmed
 * live to never fire — content stuck permanently at its invisible initial
 * state — for anything already inside the viewport on a hard page load
 * (the same failure mode found and fixed on the hero). Since Reveal wraps
 * content on nearly every page, some of it inevitably above the fold, a
 * plain CSS animation removes that whole class of bug: it runs the moment
 * the browser paints the element, with no JS/IntersectionObserver timing
 * involved.
 *
 * Where the browser supports scroll-driven animations, `reveal-scroll`
 * (globals.css) swaps the on-load animation for one tied to the element's
 * own scroll position, so content eases in as it enters the viewport — still
 * with no JS, and anything already on screen is already fully shown.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  return (
    <Tag className={className ? `animate-reveal reveal-scroll ${className}` : "animate-reveal reveal-scroll"} style={{ animationDelay: `${delay * 1000}ms` }}>
      {children}
    </Tag>
  );
}
