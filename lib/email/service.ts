import "server-only";
import type { EmailMessage, EmailProvider } from "./types";

/**
 * No transactional email provider is configured yet. This keeps the
 * confirmation flow's architecture ready for one (Resend, SMTP, etc. — see
 * EMAIL_PROVIDER in .env.example) without ever faking a "sent" email when
 * nothing is actually wired up.
 */
const noopProvider: EmailProvider = {
  name: "noop",
  async send(message: EmailMessage) {
    console.warn(
      `[email] No EMAIL_PROVIDER configured — skipping send to ${message.to} ("${message.subject}").`
    );
    return { sent: false };
  },
};

export async function getEmailProvider(): Promise<EmailProvider> {
  const selected = process.env.EMAIL_PROVIDER;

  switch (selected) {
    case "resend": {
      const { resendProvider } = await import("./resend");
      return resendProvider;
    }
    default:
      return noopProvider;
  }
}

export async function sendEmail(message: EmailMessage) {
  const provider = await getEmailProvider();
  return provider.send(message);
}
