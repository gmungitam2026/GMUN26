import "server-only";
import type { EmailMessage, EmailProvider } from "./types";
import { contact } from "@/config/contact";

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
      body: JSON.stringify({
        from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        // Replies go to the team inbox rather than the no-reply sending address.
        reply_to: process.env.EMAIL_REPLY_TO || contact.email,
      }),
    });

    if (!res.ok) {
      const details = await res.text();
      throw new Error(`Resend rejected the email (${res.status}): ${details}`);
    }

    return { sent: true };
  },
};
