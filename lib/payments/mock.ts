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

interface MockOrder {
  registrationId: string;
  amount: number;
  status: PaymentStatus;
  paymentId: string | null;
}

// Module-scoped, in-memory — this provider exists purely for local
// development / demoing the registration flow with no real payment
// gateway configured. It is never a production payment integration.
const orders = new Map<string, MockOrder>();

export function simulateMockOutcome(orderId: string, outcome: "success" | "failure") {
  const order = orders.get(orderId);
  if (!order) return;
  order.status = outcome === "success" ? "PAID" : "FAILED";
  order.paymentId = outcome === "success" ? `mock_pay_${crypto.randomUUID().slice(0, 8)}` : null;
}

export const mockProvider: PaymentProvider = {
  name: "mock",

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const orderId = `mock_order_${crypto.randomUUID()}`;
    orders.set(orderId, { registrationId: input.registrationDbId, amount: input.amount, status: "PENDING", paymentId: null });
    return {
      orderId,
      checkout: { mode: "mock", orderId },
    };
  },

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    const order = orders.get(input.orderId);
    if (!order) return { verified: false, status: "FAILED" };
    return {
      verified: order.status === "PAID",
      status: order.status,
      paymentId: order.paymentId ?? undefined,
      method: order.status === "PAID" ? "mock" : undefined,
      providerReference: input.orderId,
    };
  },

  async handleWebhook(input: WebhookInput): Promise<WebhookResult> {
    const payload = JSON.parse(input.rawBody) as { orderId: string; status: PaymentStatus };
    return { orderId: payload.orderId, status: payload.status };
  },

  async refundPayment(input: RefundInput): Promise<{ refunded: boolean }> {
    void input;
    return { refunded: false };
  },

  async getPaymentStatus(orderId: string): Promise<PaymentStatus> {
    return orders.get(orderId)?.status ?? "FAILED";
  },
};
