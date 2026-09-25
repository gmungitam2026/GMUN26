export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

/**
 * No real delegate/chair testimonials have been supplied yet. This stays
 * empty rather than shipping fabricated quotes; the Testimonials section
 * renders a "coming soon" state whenever this list is empty.
 */
export const testimonials: Testimonial[] = [];

export interface Highlight {
  title: string;
  body: string;
}

/**
 * GMUN's own reasons to register, in its own voice (not attributed to any
 * person). Shown in the scrolling Testimonials section until real delegate
 * quotes are added above; every claim here is stated elsewhere on the site.
 */
export const highlights: Highlight[] = [
  {
    title: "Convenient",
    body: "Register, pay and upload everything online in a few minutes. The conference runs on GITAM's Visakhapatnam campus, easy to reach from anywhere in the city.",
  },
  {
    title: "Professional",
    body: "Structured committee sessions, clear rules of procedure and an organising team that runs both days to schedule.",
  },
  {
    title: "A trusted name in Vizag",
    body: "GMUN is the only Model UN organisation in Andhra Pradesh to have hosted four MUN conferences.",
  },
  {
    title: "Seven committees",
    body: "From UNHRC and UNGA-DISEC to FIFA and the Indian Film Industry: a committee for every kind of delegate.",
  },
  {
    title: "Real skills",
    body: "Public speaking, negotiation, research and policy writing, built by doing them in committee.",
  },
  {
    title: "Great value",
    body: "Two days of conference from ₹600, with lunch and accommodation packages available.",
  },
  {
    title: "Open to everyone",
    body: "First-timers and seasoned delegates alike: there's a place for you at GMUN.",
  },
];
