export function ExportButton() {
  return (
    <a
      href="/api/export"
      className="inline-flex h-10 items-center justify-center border border-gold px-5 text-[13px] font-medium uppercase tracking-[0.1em] text-gold transition-colors hover:bg-gold-fill hover:text-ink"
    >
      Export to Excel
    </a>
  );
}
