const labels = [
  { text: "Diplomacy", className: "top-[8%] left-[2%]", delay: "0s" },
  { text: "Crisis Simulation", className: "bottom-[28%] right-[-2%]", delay: "1.6s" },
  { text: "Global Impact", className: "bottom-[4%] left-[14%]", delay: "3.1s" },
];

/** Static, pure-CSS badges around the globe — no JS, no viewport-triggered animation. */
export function OrbitingLabels() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {labels.map((label) => (
        <span
          key={label.text}
          className={`animate-float absolute border border-line-strong bg-ink/70 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ivory-dim backdrop-blur-sm ${label.className}`}
          style={{ animationDelay: label.delay }}
        >
          {label.text}
        </span>
      ))}
    </div>
  );
}
