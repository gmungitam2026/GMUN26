import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PaymentProvider } from "@/lib/payments/types";

async function resolveProvider(name: string): Promise<PaymentProvider | null> {
  switch (name) {
    case "razorpay":
      return (await import("@/lib/payments/razorpay")).razorpayProvider;
    case "cashfree":
      return (await import("@/lib/payments/cashfree")).cashfreeProvider;
    case "payment-link":
      return (await import("@/lib/payments/payment-links")).paymentLinkProvider;
    default:
      return null;
  }
}

const signatureHeaderByProvider: Record<string, string> = {
  razorpay: "x-razorpay-signature",
  "payment-link": "x-razorpay-signature",
  cashfree: "x-webhook-signature",
};

/**
 * Webhook receiver for the real payment providers. The frontend is never
 * the source of truth for payment success — this route verifies the
 * provider's signature server-side and updates the database directly.
 * Updates are idempotent (setting the same status twice is harmless), so a
 * duplicate webhook delivery is safe to process again.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider: providerName } = await params;
  const provider = await resolveProvider(providerName);

  if (!provider) {
    return NextResponse.json({ error: "Unknown payment provider." }, { status: 404 });
  }

  const rawBody = await request.text();
  const signatureHeader = request.headers.get(signatureHeaderByProvider[providerName] ?? "");

  let result;
  try {
    result = await provider.handleWebhook({ rawBody, signatureHeader });
  } catch (err) {
    console.error(`Webhook verification failed for ${providerName}:`, err);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: payment } = await supabase
    .from("payments")
    .update({
      status: result.status,
      payment_id: result.paymentId ?? null,
      method: result.method ?? null,
      provider_reference: result.providerReference ?? null,
    })
    .eq("order_id", result.orderId)
    .select("registration_id")
    .maybeSingle();

  if (payment && result.status === "PAID") {
    await supabase.from("registrations").update({ status: "PAID" }).eq("id", payment.registration_id);
  }

  return NextResponse.json({ received: true });
}
