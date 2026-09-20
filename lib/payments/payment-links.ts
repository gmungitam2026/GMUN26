import "server-only";
import crypto from "node:crypto";
import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
  PaymentStatus,
  RefundInput,
  VerifyPaymentInput,
  VerifyPaymentResult,
  WebhookInput,
  WebhookResult,
} from "./types";

/**
 * Hosted Payment Link fallback, implemented via Razorpay's Payment Links
 * API (reuses RAZORPAY_KEY_ID/SECRET/WEBHOOK_SECRET). Useful as a simpler
 * collection method than a direct checkout, per the technical documentation
 * — but for reconciliation at scale, a direct order-based checkout
 * (`razorpay` / `cashfree` providers) is generally cleaner. Only reachable
 * if PAYMENT_PROVIDER=payment-link is set; verify against current Razorpay
 * docs before going live.
 */

const RAZORPAY_API = "https://api.razorpay.com/v1";

function authHeader() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Payment Links provider requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }
  return "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
}

export const paymentLinkProvider: PaymentProvider = {
  name: "payment-link",

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const res = await fetch(`${RAZORPAY_API}/payment_links`, {
      method: "POST",
      headers: { Authorization: authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: input.amount * 100,
        currency: input.currency,
        reference_id: input.registrationId,
        customer: {
          name: input.customerName,
          email: input.customerEmail,
          contact: input.customerPhone,
        },
        notify: { sms: false, email: false },
        notes: { registrationId: input.registrationId },
      }),
    });

    if (!res.ok) {
      throw new Error(`Payment link creation failed: ${res.status} ${await res.text()}`);
    }

    const link = (await res.json()) as { id: string; short_url: string };

    return {
      orderId: link.id,
      checkout: { mode: "payment-link", orderId: link.id, url: link.short_url },
    };
  },

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    const res = await fetch(`${RAZORPAY_API}/payment_links/${input.orderId}`, {
      headers: { Authorization: authHeader() },
    });
    if (!res.ok) return { verified: false, status: "FAILED" };

    const link = (await res.json()) as { status: string; payments?: { payment_id: string; status: string }[] };
    const paid = link.status === "paid";
    const payment = link.payments?.find((p) => p.status === "captured");

    return {
      verified: paid,
      status: paid ? "PAID" : "PENDING",
      paymentId: payment?.payment_id,
      providerReference: input.orderId,
    };
  },

  async handleWebhook(input: WebhookInput): Promise<WebhookResult> {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) throw new Error("RAZORPAY_WEBHOOK_SECRET is not set.");

    const expected = crypto.createHmac("sha256", secret).update(input.rawBody).digest("hex");
    if (expected !== input.signatureHeader) {
      throw new Error("Invalid webhook signature.");
    }

    const payload = JSON.parse(input.rawBody) as {
      event: string;
      payload: {
        payment_link: { entity: { id: string } };
        payment: { entity: { id: string; method?: string } };
      };
    };

    const status: PaymentStatus = payload.event === "payment_link.paid" ? "PAID" : "FAILED";

    return {
      orderId: payload.payload.payment_link.entity.id,
      status,
      paymentId: payload.payload.payment.entity.id,
      method: payload.payload.payment.entity.method,
      providerReference: payload.payload.payment.entity.id,
    };
  },

  async refundPayment(input: RefundInput): Promise<{ refunded: boolean }> {
    const res = await fetch(`${RAZORPAY_API}/payments/${input.paymentId}/refund`, {
      method: "POST",
      headers: { Authorization: authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(input.amount ? { amount: input.amount * 100 } : {}),
    });
    return { refunded: res.ok };
  },

  async getPaymentStatus(orderId: string): Promise<PaymentStatus> {
    const res = await fetch(`${RAZORPAY_API}/payment_links/${orderId}`, {
      headers: { Authorization: authHeader() },
    });
    if (!res.ok) return "FAILED";
    const link = (await res.json()) as { status: string };
    if (link.status === "paid") return "PAID";
    if (link.status === "cancelled" || link.status === "expired") return "CANCELLED";
    return "PENDING";
  },
};
