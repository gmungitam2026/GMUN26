"use client";

import { cn } from "@/lib/utils/cn";

const inputClasses =
  "h-12 w-full border border-line bg-transparent px-4 text-[15px] text-ivory placeholder:text-ivory-faint focus-visible:border-gold";

export function Field({
  label,
  htmlFor,
  error,
  optional,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-[13px] uppercase tracking-[0.08em] text-ivory-dim">
        <span>{label}</span>
        {optional && <span className="text-[11px] normal-case text-ivory-faint">Optional</span>}
      </label>
      {children}
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClasses, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} rows={props.rows ?? 3} className={cn(inputClasses, "h-auto py-3 resize-none", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(inputClasses, "appearance-none", props.className)}
    />
  );
}

/**
 * A row of mutually exclusive buttons (e.g. Yes / No). The group carries the
 * question as its accessible name; each button is named by its own label.
 */
export function ChoiceButtons<T extends string | boolean>({
  idPrefix,
  label,
  options,
  value,
  onChange,
}: {
  idPrefix: string;
  label: string;
  options: { label: string; value: T }[];
  value: T | "" | null | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" id={idPrefix} aria-label={label} className="flex gap-3">
      {options.map((opt) => (
        <button
          key={opt.label}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={cn(
            "h-11 flex-1 border text-sm uppercase tracking-[0.08em] transition-colors sm:flex-none sm:px-10",
            value === opt.value ? "border-gold bg-gold-fill text-ink" : "border-line text-ivory-dim hover:border-line-strong"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function CheckboxField({
  id,
  checked,
  onChange,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ivory-dim">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-[#b7924e]"
      />
      <span>{children}</span>
    </label>
  );
}
