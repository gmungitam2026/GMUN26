"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Shown as soon as the payment step opens: payments are verified by hand
 * against the package amount, so a different amount can't be matched.
 * A native <dialog> (top layer, focus handling, inert background). It can
 * only be dismissed with the button, not Escape, so it is actually read.
 */
export function PaymentAmountNotice({ amount }: { amount: number }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialog.current;
    if (el && !el.open) el.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="pay-exact-title"
      onCancel={(e) => e.preventDefault()}
      className="m-auto w-[min(92vw,440px)] border border-gold bg-surface p-0 text-ivory backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      <div className="p-7 sm:p-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Before you pay</p>
        <h2 id="pay-exact-title" className="mt-3 font-display text-3xl">
          Pay exactly <span className="text-gold">₹{amount}</span>
        </h2>
        <p className="mt-2 font-display text-lg text-ivory">Nothing more, nothing less.</p>
        <p className="mt-4 text-sm leading-relaxed text-ivory-dim">
          This is the amount for the package you selected. Each payment is verified by hand against that amount, so
          if you pay a different amount, it can&apos;t be matched and your registration may be rejected.
        </p>
        <Button type="button" className="mt-7 w-full" onClick={() => dialog.current?.close()}>
          I&apos;ll pay exactly ₹{amount}
        </Button>
      </div>
    </dialog>
  );
}
