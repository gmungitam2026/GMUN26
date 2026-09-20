import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-gold">
          {align !== "center" && <span className="h-px w-8 bg-gold" aria-hidden />}
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl leading-[1.08] font-medium text-ivory md:text-5xl">
        {title}
      </h2>
    </div>
  );
}
