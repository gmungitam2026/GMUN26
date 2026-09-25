import "server-only";
import { site } from "@/config/site";
import { contact } from "@/config/contact";
import { committees } from "@/config/committees";
import { registrationPackages } from "@/config/pricing";
import type { EmailMessage } from "./types";

/**
 * Delegate-facing emails. Layout is table-based with inline styles (what email
 * clients reliably render), in the site's ink / ivory / gold palette, and every
 * message also has a plain-text version. All delegate-entered text is escaped.
 */

export interface RegistrationEmailData {
  registration_id: string;
  full_name: string;
  email: string;
  committee_preference?: string | null;
  committee_preference_2?: string | null;
  country_preference?: string | null;
  package_id?: string | null;
  payment_amount?: number | null;
  payment_reference?: string | null;
}

const C = { ink: "#0a0906", surface: "#131210", ivory: "#efe9dc", dim: "#b8b1a2", faint: "#928c7d", gold: "#b7924e", line: "#2a2722" };

function esc(value: string) {
  return value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);
}

const committeeName = (id?: string | null) => (id ? committees.find((c) => c.id === id)?.shortName ?? id : null);
const packageName = (id?: string | null) => (id ? registrationPackages.find((p) => p.id === id)?.name ?? id : null);
const firstName = (fullName: string) => fullName.trim().split(/\s+/)[0] || fullName;

function detailRows(r: RegistrationEmailData) {
  const rows: [string, string | null][] = [
    ["Registration ID", r.registration_id],
    ["1st committee", committeeName(r.committee_preference)],
    ["2nd committee", committeeName(r.committee_preference_2)],
    ["Country preference", r.country_preference ?? null],
    ["Package", packageName(r.package_id)],
    ["Amount", r.payment_amount ? `₹${r.payment_amount}` : null],
    ["UTR / reference", r.payment_reference ?? null],
  ];
  return rows.filter((row): row is [string, string] => Boolean(row[1]));
}

function contactLines() {
  return [
    `Email: ${contact.email}`,
    ...contact.team.map((m) => `${m.name} (${m.role}): +91 ${m.phone}`),
  ];
}

function layout(opts: {
  preheader: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  callout?: { label: string; text: string };
  details?: [string, string][];
  showContact?: boolean;
}) {
  const p = (text: string) =>
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${C.dim};">${text}</p>`;

  const details = opts.details?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;border-top:1px solid ${C.line};">
        ${opts.details
          .map(
            ([k, v]) => `<tr>
              <td style="padding:10px 0;border-bottom:1px solid ${C.line};font-size:13px;color:${C.faint};">${esc(k)}</td>
              <td style="padding:10px 0;border-bottom:1px solid ${C.line};font-size:13px;color:${C.ivory};text-align:right;">${esc(v)}</td>
            </tr>`
          )
          .join("")}
      </table>`
    : "";

  const callout = opts.callout
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
        <tr><td style="border-left:2px solid ${C.gold};padding:12px 16px;background:${C.ink};">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.gold};">${esc(opts.callout.label)}</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:${C.ivory};">${esc(opts.callout.text)}</p>
        </td></tr>
      </table>`
    : "";

  const contactBlock = opts.showContact
    ? `<p style="margin:8px 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.gold};">Contact the organising team</p>
       <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:${C.dim};">
         <a href="mailto:${contact.email}" style="color:${C.ivory};">${contact.email}</a><br />
         ${contact.team.map((m) => `${esc(m.name)}, ${esc(m.role)}: <a href="tel:+91${m.phone}" style="color:${C.ivory};">+91 ${m.phone}</a>`).join("<br />")}
       </p>`
    : "";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /><meta name="color-scheme" content="dark" /></head>
<body style="margin:0;padding:0;background:${C.ink};">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ink};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.surface};border:1px solid ${C.line};font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;">
        <tr><td style="padding:28px 32px 0;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:${C.ivory};">GMUN <span style="color:${C.gold};">5.0</span></p>
          <p style="margin:4px 0 0;font-size:12px;color:${C.faint};">${esc(site.dates.display)} · ${esc(site.venue.name)}</p>
        </td></tr>
        <tr><td style="padding:28px 32px 8px;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.gold};">${esc(opts.eyebrow)}</p>
          <h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:26px;line-height:1.25;color:${C.ivory};">${esc(opts.heading)}</h1>
          ${opts.paragraphs.map(p).join("")}
          ${callout}
          ${details}
          ${contactBlock}
        </td></tr>
        <tr><td style="padding:20px 32px 28px;border-top:1px solid ${C.line};">
          <p style="margin:0;font-size:12px;line-height:1.6;color:${C.faint};">GMUN Organising Team · ${esc(site.institution)}<br />
          You can reply to this email to reach the team.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function unescape(html: string) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&(amp|lt|gt|quot|#39);/g, (_, e: string) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" })[e]!);
}

function plainText(opts: {
  heading: string;
  paragraphs: string[];
  callout?: { label: string; text: string };
  details?: [string, string][];
  showContact?: boolean;
}) {
  return [
    `GMUN 5.0 · ${site.dates.display}`,
    "",
    opts.heading,
    "",
    ...opts.paragraphs.flatMap((t) => [unescape(t), ""]),
    ...(opts.callout ? [`${opts.callout.label}: ${opts.callout.text}`, ""] : []),
    ...(opts.details?.map(([k, v]) => `${k}: ${v}`) ?? []),
    ...(opts.showContact ? ["", "Contact the organising team:", ...contactLines()] : []),
    "",
    "GMUN Organising Team",
  ].join("\n");
}

function build(
  r: RegistrationEmailData,
  subject: string,
  content: Parameters<typeof layout>[0]
): EmailMessage {
  return { to: r.email, subject, html: layout(content), text: plainText(content) };
}

/** Sent as soon as a registration is submitted. */
export function registrationReceivedEmail(r: RegistrationEmailData): EmailMessage {
  return build(r, `We've received your GMUN 5.0 registration (${r.registration_id})`, {
    preheader: "Your registration is in. Our team is now verifying your payment.",
    eyebrow: "Registration received",
    heading: `Thanks, ${firstName(r.full_name)}. You're almost in.`,
    paragraphs: [
      "We've received your registration and payment details. The organising team will now verify your payment manually. This usually takes a day or two.",
      "You'll get another email as soon as it's confirmed. There's nothing more you need to do right now.",
    ],
    details: detailRows(r),
    showContact: true,
  });
}

/** Payment verified: the delegate is confirmed. */
export function registrationConfirmedEmail(r: RegistrationEmailData): EmailMessage {
  return build(r, `You're in! GMUN 5.0 registration confirmed (${r.registration_id})`, {
    preheader: `Your payment is verified. See you on ${site.dates.display}.`,
    eyebrow: "Registration confirmed",
    heading: `You're in, ${firstName(r.full_name)}!`,
    paragraphs: [
      "Your payment has been verified and your place at GMUN 5.0 is confirmed. Welcome aboard.",
      `Committee and country allocations, study guides and the conference schedule will be shared closer to the event. The conference is on <strong style="color:${C.ivory};">${esc(site.dates.display)}</strong> at ${esc(site.venue.full)}.`,
      "Please keep your Registration ID handy. You'll need it at check-in.",
    ],
    details: detailRows(r),
    showContact: true,
  });
}

/** Payment proof is being looked at more closely. */
export function registrationUnderVerificationEmail(r: RegistrationEmailData): EmailMessage {
  return build(r, `Your GMUN 5.0 payment is under verification (${r.registration_id})`, {
    preheader: "We're taking a closer look at your payment.",
    eyebrow: "Under verification",
    heading: "We're taking a closer look at your payment",
    paragraphs: [
      "Our team is verifying your payment proof and may get in touch if we need anything else. You don't need to do anything unless we contact you.",
    ],
    details: detailRows(r),
    showContact: true,
  });
}

/** Payment could not be verified. Includes the admin's reason when given. */
export function registrationRejectedEmail(r: RegistrationEmailData, reason?: string | null): EmailMessage {
  return build(r, `Action needed: we couldn't verify your GMUN 5.0 payment (${r.registration_id})`, {
    preheader: "Please contact the organising team to sort out your registration.",
    eyebrow: "Payment not verified",
    heading: "We couldn't verify your payment",
    paragraphs: [
      `Hi ${esc(firstName(r.full_name))}, unfortunately we weren't able to verify the payment for your registration, so it hasn't been confirmed yet.`,
      "Please contact the organising team with your Registration ID and your payment receipt, and we'll help you sort it out. If a payment was deducted from your account, don't worry: we'll look into it.",
    ],
    callout: reason?.trim() ? { label: "Note from the team", text: reason.trim() } : undefined,
    details: detailRows(r),
    showContact: true,
  });
}

/** Registration cancelled by the team. */
export function registrationCancelledEmail(r: RegistrationEmailData, reason?: string | null): EmailMessage {
  return build(r, `Your GMUN 5.0 registration has been cancelled (${r.registration_id})`, {
    preheader: "Your registration has been cancelled.",
    eyebrow: "Registration cancelled",
    heading: "Your registration has been cancelled",
    paragraphs: [
      `Hi ${esc(firstName(r.full_name))}, your GMUN 5.0 registration has been cancelled. If you think this is a mistake or you have questions, please contact the organising team.`,
    ],
    callout: reason?.trim() ? { label: "Note from the team", text: reason.trim() } : undefined,
    details: [["Registration ID", r.registration_id]],
    showContact: true,
  });
}

/** The email for a status change made in the admin portal, if that status has one. */
export function statusChangeEmail(r: RegistrationEmailData, status: string, note?: string | null): EmailMessage | null {
  switch (status) {
    case "PAYMENT_CONFIRMED":
      return registrationConfirmedEmail(r);
    case "UNDER_VERIFICATION":
      return registrationUnderVerificationEmail(r);
    case "REJECTED":
      return registrationRejectedEmail(r, note);
    case "CANCELLED":
      return registrationCancelledEmail(r, note);
    default:
      return null;
  }
}
