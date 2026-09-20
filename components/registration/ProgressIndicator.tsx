import { cn } from "@/lib/utils/cn";

const steps = ["Details", "Preferences", "Review", "Payment", "Confirmed"];

export function ProgressIndicator({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap gap-x-6 gap-y-3 border-b border-line pb-6">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const state = stepNum === current ? "current" : stepNum < current ? "done" : "upcoming";
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "font-display text-sm",
                state === "current" && "text-gold",
                state === "done" && "text-ivory",
                state === "upcoming" && "text-ivory-faint"
              )}
            >
              {String(stepNum).padStart(2, "0")}
            </span>
            <span
              className={cn(
                "text-[11px] uppercase tracking-[0.14em]",
                state === "current" ? "text-ivory" : "text-ivory-faint"
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
