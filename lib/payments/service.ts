import "server-only";
import type { PaymentProvider } from "./types";
import { mockProvider } from "./mock";

/**
 * The single place the rest of the app asks for "the active payment
 * provider." No payment gateway is finalized for GMUN 5.0 yet, so this
 * defaults to the mock provider regardless of environment — a real provider
 * only activates if PAYMENT_PROVIDER is explicitly set, which happens once
 * the organizers select and configure one.
 */
export async function getPaymentProvider(): Promise<PaymentProvider> {
  const selected = process.env.PAYMENT_PROVIDER;

  switch (selected) {
    case "razorpay": {
      const { razorpayProvider } = await import("./razorpay");
      return razorpayProvider;
    }
    case "cashfree": {
      const { cashfreeProvider } = await import("./cashfree");
      return cashfreeProvider;
    }
    case "payment-link": {
      const { paymentLinkProvider } = await import("./payment-links");
      return paymentLinkProvider;
    }
    default:
      return mockProvider;
  }
}
