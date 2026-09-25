export function AdminStatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="border border-line p-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ivory-faint">{label}</p>
      <p className="mt-3 font-display text-3xl text-ivory">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-ivory-faint">{hint}</p>}
    </div>
  );
}

export function AdminBreakdownList({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="border border-line p-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ivory-faint">{title}</p>
      <div className="mt-5 space-y-3">
        {items.length === 0 && <p className="text-sm text-ivory-faint">No data yet.</p>}
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ivory-dim">{item.label}</span>
              <span className="text-ivory">{item.count}</span>
            </div>
            <div className="mt-1.5 h-1 w-full bg-surface-raised">
              <div className="h-1 bg-gold" style={{ width: `${(item.count / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
