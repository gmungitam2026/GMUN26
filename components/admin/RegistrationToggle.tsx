"use client";

import { useState, useTransition } from "react";
import { setRegistrationOpen } from "@/lib/admin/actions";
import { cn } from "@/lib/utils/cn";

export function RegistrationToggle({ initialOpen }: { initialOpen: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    const next = !open;
    setError(null);
    startTransition(async () => {
      const result = await setRegistrationOpen(next);
      if (result.ok) {
        setOpen(next);
      } else {
        setError(result.error ?? "Could not update.");
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={open}
        className={cn(
          "flex h-11 w-full max-w-xs items-center justify-between border px-4 text-sm transition-colors disabled:opacity-50",
          open ? "border-gold text-gold" : "border-line-strong text-ivory-dim"
        )}
      >
        <span>{open ? "Registration is Open" : "Registration is Closed"}</span>
        <span
          className={cn(
            "relative h-5 w-9 shrink-0 rounded-full transition-colors",
            open ? "bg-gold-fill" : "bg-surface-raised"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-ink transition-transform",
              open ? "translate-x-[18px]" : "translate-x-0.5"
            )}
          />
        </span>
      </button>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      <p className="mt-2 max-w-xs text-xs text-ivory-faint">
        When closed, the public registration form is replaced with a &ldquo;registrations are
        closed&rdquo; message.
      </p>
    </div>
  );
}
