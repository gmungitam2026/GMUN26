import { cn } from "@/lib/utils/cn";

const styles: Record<string, string> = {
  PAYMENT_CONFIRMED: "bg-success/15 text-success",
  PENDING_VERIFICATION: "bg-ivory-faint/15 text-ivory-dim",
  UNDER_VERIFICATION: "bg-info/15 text-info",
  REJECTED: "bg-danger/10 text-danger",
  CANCELLED: "bg-ivory-faint/10 text-ivory-faint line-through",
};

/** Colour-coded registration status: green confirmed, blue under review, red rejected. */
export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn("px-2 py-0.5 text-[11px] uppercase tracking-[0.06em]", styles[status], className)}>
      {status.replaceAll("_", " ")}
    </span>
  );
}
