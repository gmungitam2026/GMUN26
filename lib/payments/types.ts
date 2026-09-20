export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED";

export interface CreatePaymentInput {
  /** Human-facing registration ID, e.g. MUN26-0001 */
  registrationId: string;
  /** Internal registrations.id (uuid) */
  registrationDbId: string;
  amount: number;
  currency: "INR";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface CreatePaymentResult {
  orderId: string;
  /** Provider-specific payload the client needs to open checkout (order id
   * + public key for Razorpay, a payment session id for Cashfree, or a
   * redirect URL for Payment Links / the mock provider). */
  checkout: Record<string, string>;
}

export interface VerifyPaymentInput {
  orderId: string;
  paymentId?: string;
  signature?: string;
}

export interface VerifyPaymentResult {
  verified: boolean;
  status: PaymentStatus;
  paymentId?: string;
  method?: string;
  providerReference?: string;
}

export interface WebhookInput {
  rawBody: string;
  signatureHeader: string | null;
}

export interface WebhookResult {
  orderId: string;
  status: PaymentStatus;
  paymentId?: string;
  method?: string;
  providerReference?: string;
}

export interface RefundInput {
  orderId: string;
  paymentId: string;
  amount?: number;
}

/**
 * Every payment provider (mock, Razorpay, Cashfree, a hosted Payment Link)
 * implements this same interface. Registration/payment code in the app
 * depends only on this interface, never on a concrete provider, so the
 * active provider can change via the `PAYMENT_PROVIDER` env var without
 * touching registration logic.
 */
export interface PaymentProvider {
  readonly name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>;
  handleWebhook(input: WebhookInput): Promise<WebhookResult>;
  refundPayment(input: RefundInput): Promise<{ refunded: boolean }>;
  getPaymentStatus(orderId: string): Promise<PaymentStatus>;
}
