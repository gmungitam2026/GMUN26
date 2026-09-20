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
 * Razorpay adapter, implemented against the Orders API so the interface is
 * production-ready — but it is only reachable if PAYMENT_PROVIDER=razorpay
 * is set, and no credentials are committed anywhere in this repo. Verify
 * endpoint paths and payload shapes against Razorpay's current docs before
 * going live; API details can shift between doc versions.
 */

const RAZORPAY_API = "https://api.razorpay.com/v1";

function authHeader() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }
  return "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
}

export const razorpayProvider: PaymentProvider = {
  name: "razorpay",

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const res = await fetch(`${RAZORPAY_API}/orders`, {
      method: "POST",
      headers: { Authorization: authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: input.amount * 100, // paise
        currency: input.currency,
        receipt: input.registrationId,
        notes: { registrationId: input.registrationId },
      }),
    });

    if (!res.ok) {
      throw new Error(`Razorpay order creation failed: ${res.status} ${await res.text()}`);
    }

    const order = (await res.json()) as { id: string };

    return {
      orderId: order.id,
      checkout: {
        mode: "razorpay",
        orderId: order.id,
        keyId: process.env.RAZORPAY_KEY_ID ?? "",
        amount: String(input.amount * 100),
        currency: input.currency,
      },
    };
  },

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    if (!input.paymentId || !input.signature) {
      return { verified: false, status: "FAILED" };
    }
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error("RAZORPAY_KEY_SECRET is not set.");

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${input.orderId}|${input.paymentId}`)
      .digest("hex");

    const verified = expected === input.signature;
    return {
      verified,
      status: verified ? "PAID" : "FAILED",
      paymentId: input.paymentId,
      providerReference: input.orderId,
    };
  },

  async handleWebhook(input: WebhookInput): Promise<WebhookResult> {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) throw new Error("RAZORPAY_WEBHOOK_SECRET is not set.");

    const expected = crypto.createHmac("sha256", secret).update(input.rawBody).digest("hex");
    if (expected !== input.signatureHeader) {
      throw new Error("Invalid Razorpay webhook signature.");
    }

    const payload = JSON.parse(input.rawBody) as {
      event: string;
      payload: { payment: { entity: { order_id: string; id: string; method?: string } } };
    };
    const entity = payload.payload.payment.entity;
    const status: PaymentStatus = payload.event === "payment.captured" ? "PAID" : "FAILED";

    return {
      orderId: entity.order_id,
      status,
      paymentId: entity.id,
      method: entity.method,
      providerReference: entity.id,
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
    const res = await fetch(`${RAZORPAY_API}/orders/${orderId}`, {
      headers: { Authorization: authHeader() },
    });
    if (!res.ok) return "FAILED";
    const order = (await res.json()) as { status: string };
    if (order.status === "paid") return "PAID";
    if (order.status === "attempted") return "PENDING";
    return "PENDING";
  },
};
