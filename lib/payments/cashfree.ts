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
 * Cashfree adapter, implemented against the Cashfree Payment Gateway Orders
 * API so the interface is production-ready — but it is only reachable if
 * PAYMENT_PROVIDER=cashfree is set, and no credentials are committed
 * anywhere in this repo. Verify endpoint paths, the API version header, and
 * webhook payload shape against Cashfree's current docs before going live.
 */

const CASHFREE_API = process.env.CASHFREE_ENV === "production"
  ? "https://api.cashfree.com/pg"
  : "https://sandbox.cashfree.com/pg";

function headers() {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  if (!appId || !secretKey) {
    throw new Error("Cashfree is not configured. Set CASHFREE_APP_ID and CASHFREE_SECRET_KEY.");
  }
  return {
    "x-client-id": appId,
    "x-client-secret": secretKey,
    "x-api-version": "2023-08-01",
    "Content-Type": "application/json",
  };
}

export const cashfreeProvider: PaymentProvider = {
  name: "cashfree",

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const res = await fetch(`${CASHFREE_API}/orders`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        order_id: `${input.registrationId}-${Date.now()}`,
        order_amount: input.amount,
        order_currency: input.currency,
        customer_details: {
          customer_id: input.registrationDbId,
          customer_name: input.customerName,
          customer_email: input.customerEmail,
          customer_phone: input.customerPhone,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Cashfree order creation failed: ${res.status} ${await res.text()}`);
    }

    const order = (await res.json()) as { order_id: string; payment_session_id: string };

    return {
      orderId: order.order_id,
      checkout: { mode: "cashfree", orderId: order.order_id, paymentSessionId: order.payment_session_id },
    };
  },

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    const res = await fetch(`${CASHFREE_API}/orders/${input.orderId}/payments`, {
      headers: headers(),
    });
    if (!res.ok) return { verified: false, status: "FAILED" };

    const payments = (await res.json()) as { payment_status: string; cf_payment_id: string; payment_method?: string }[];
    const successful = payments.find((p) => p.payment_status === "SUCCESS");

    return {
      verified: Boolean(successful),
      status: successful ? "PAID" : "FAILED",
      paymentId: successful?.cf_payment_id,
      method: successful?.payment_method,
      providerReference: input.orderId,
    };
  },

  async handleWebhook(input: WebhookInput): Promise<WebhookResult> {
    const secret = process.env.CASHFREE_WEBHOOK_SECRET;
    if (!secret) throw new Error("CASHFREE_WEBHOOK_SECRET is not set.");

    const expected = crypto.createHmac("sha256", secret).update(input.rawBody).digest("base64");
    if (expected !== input.signatureHeader) {
      throw new Error("Invalid Cashfree webhook signature.");
    }

    const payload = JSON.parse(input.rawBody) as {
      type: string;
      data: { order: { order_id: string }; payment: { cf_payment_id: string; payment_status: string; payment_method?: string } };
    };

    const status: PaymentStatus = payload.data.payment.payment_status === "SUCCESS" ? "PAID" : "FAILED";

    return {
      orderId: payload.data.order.order_id,
      status,
      paymentId: payload.data.payment.cf_payment_id,
      method: payload.data.payment.payment_method,
      providerReference: payload.data.payment.cf_payment_id,
    };
  },

  async refundPayment(input: RefundInput): Promise<{ refunded: boolean }> {
    const res = await fetch(`${CASHFREE_API}/orders/${input.orderId}/refunds`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        refund_amount: input.amount,
        refund_id: `refund-${input.paymentId}-${Date.now()}`,
      }),
    });
    return { refunded: res.ok };
  },

  async getPaymentStatus(orderId: string): Promise<PaymentStatus> {
    const res = await fetch(`${CASHFREE_API}/orders/${orderId}`, { headers: headers() });
    if (!res.ok) return "FAILED";
    const order = (await res.json()) as { order_status: string };
    if (order.order_status === "PAID") return "PAID";
    if (order.order_status === "ACTIVE") return "PENDING";
    return "FAILED";
  },
};
