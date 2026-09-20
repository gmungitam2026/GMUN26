import "server-only";
import type { EmailMessage, EmailProvider } from "./types";

/**
 * Resend adapter — only reachable if EMAIL_PROVIDER=resend and RESEND_API_KEY
 * is set. Uses Resend's plain HTTP API directly (no SDK dependency) so it
 * stays lightweight until email is actually turned on.
 */
export const resendProvider: EmailProvider = {
  name: "resend",
  async send(message: EmailMessage) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !from) {
      throw new Error("Resend is not configured. Set RESEND_API_KEY and EMAIL_FROM.");
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: message.to, subject: message.subject, html: message.html }),
    });

    return { sent: res.ok };
  },
};
