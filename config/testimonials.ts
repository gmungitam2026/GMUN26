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
