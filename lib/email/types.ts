export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  /** Plain-text alternative; improves deliverability and accessibility. */
  text?: string;
}

export interface EmailProvider {
  readonly name: string;
  send(message: EmailMessage): Promise<{ sent: boolean }>;
}

export type EmailTemplate =
  | "registration-initiated"
  | "payment-successful"
  | "registration-confirmed"
  | "payment-failed"
  | "admin-notification";
