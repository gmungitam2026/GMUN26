"use client";

import { useState, useTransition } from "react";
import { simulateMockPayment, finalizeRegistrationPayment } from "@/lib/registration/actions";
import { Button } from "@/components/ui/Button";

export function StepPayment({
  registrationDbId,
  orderId,
  checkout,
  amount,
  onPaid,
}: {
  registrationDbId: string;
  orderId: string;
  checkout: Record<string, string>;
  amount: number;
  onPaid: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function settle(outcome: "success" | "failure") {
    setError(null);
    startTransition(async () => {
      if (checkout.mode === "mock") {
        await simulateMockPayment(orderId, outcome);
      }
      const result = await finalizeRegistrationPayment(registrationDbId, orderId);
      if (result.ok && result.status === "PAID") {
        onPaid();
      } else {
        setError(
          result.status === "PENDING"
            ? "Your payment is currently being verified. Please check again shortly."
            : "Your payment could not be completed. No successful payment has been recorded."
        );
      }
    });
  }

  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-line pb-6">
        <p className="font-display text-xl text-ivory">Amount Payable</p>
        <p className="font-display text-3xl text-gold">₹{amount}</p>
      </div>

      {checkout.mode === "mock" ? (
        <div className="mt-8 border border-line p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">
            Development Payment Simulator
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory-dim">
            No live payment gateway is connected yet. This panel simulates a payment outcome so the
            registration flow can be tested end-to-end — it is never shown once a real provider is
            configured.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button type="button" disabled={pending} onClick={() => settle("success")} variant="primary">
              Simulate Successful Payment
            </Button>
            <Button type="button" disabled={pending} onClick={() => settle("failure")} variant="secondary">
              Simulate Failed Payment
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 border border-line p-6">
          <p className="text-sm text-ivory-dim">
            Redirecting to secure checkout ({checkout.mode})…
          </p>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-6 border border-red-400/40 bg-red-400/5 p-4 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
