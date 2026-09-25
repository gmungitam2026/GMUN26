import Link from "next/link";
import { site } from "@/config/site";
import { contact } from "@/config/contact";
import { Container } from "@/components/ui/Container";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="7.5" y1="10" x2="7.5" y2="17" />
      <circle cx="7.5" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      <path d="M11.5 17v-4.2c0-1.4 1-2.3 2.2-2.3s2.1.9 2.1 2.3V17" />
    </svg>
  );
}

// Opens a pre-filled Gmail draft (web, or the Gmail app on phones) to the MUN inbox.
const partnerGmailUrl =
  "https://mail.google.com/mail/?view=cm&fs=1" +
  `&to=${encodeURIComponent(contact.partner.email)}` +
  `&su=${encodeURIComponent(contact.partner.subject)}` +
  `&body=${encodeURIComponent(contact.partner.message)}`;

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="py-20">
        <div className="grid gap-14 md:grid-cols-3 md:gap-10">
          <div>
            <h3 className="mb-5 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Contact Us</h3>
            <a href={`mailto:${contact.email}`} className="text-ivory hover:text-gold">
              {contact.email}
            </a>
            <div className="mt-6 space-y-4">
              {contact.team.map((p) => (
                <div key={p.name}>
                  <p className="text-ivory">{p.name}</p>
                  <p className="text-sm text-ivory-faint">{p.role}</p>
                  <a href={`tel:+91${p.phone}`} className="text-sm text-ivory-dim hover:text-gold">
                    {p.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">
              {contact.partner.heading}
            </h3>
            <p className="text-sm leading-relaxed text-ivory-dim">{contact.partner.body}</p>
            <a
              href={partnerGmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block border-b border-gold pb-0.5 text-[13px] font-medium uppercase tracking-[0.1em] text-gold"
            >
              Partner With Us
            </a>
          </div>

          <div>
            <h3 className="mb-5 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Follow Us</h3>
            <div className="flex gap-4">
              {contact.social.instagram ? (
                <a
                  href={contact.social.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="GMUN on Instagram"
                  className="flex h-10 w-10 items-center justify-center border border-line-strong text-ivory-dim transition-colors hover:border-gold hover:text-gold"
                >
                  <InstagramIcon />
                </a>
              ) : (
                <span
                  aria-hidden
                  className="flex h-10 w-10 items-center justify-center border border-line text-ivory-faint"
                >
                  <InstagramIcon />
                </span>
              )}
              {contact.social.linkedin ? (
                <a
                  href={contact.social.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="GMUN on LinkedIn"
                  className="flex h-10 w-10 items-center justify-center border border-line-strong text-ivory-dim transition-colors hover:border-gold hover:text-gold"
                >
                  <LinkedInIcon />
                </a>
              ) : (
                <span
                  aria-hidden
                  className="flex h-10 w-10 items-center justify-center border border-line text-ivory-faint"
                >
                  <LinkedInIcon />
                </span>
              )}
            </div>
            {!(contact.social.instagram || contact.social.linkedin) && (
              <p className="mt-4 text-xs text-ivory-faint">Social links to be announced.</p>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-xs text-ivory-faint md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.organizer}, {site.institution}.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-gold">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="hover:text-gold">
              Privacy Policy
            </Link>
            <Link href="/credits" className="hover:text-gold">
              Photo Credits
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
