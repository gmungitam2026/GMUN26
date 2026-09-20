export interface PrivacySection {
  title: string;
  paragraphs: string[];
}

/**
 * Built from the Privacy & Data Protection clause (§12) and related
 * statements in the GMUN 5.0 client requirements document. No clauses are
 * invented beyond what that document states.
 */
export const privacySections: PrivacySection[] = [
  {
    title: "Information We Collect",
    paragraphs: [
      "During registration, GMUN collects personal information including name, contact details (email and phone), institutional affiliation, and payment information.",
    ],
  },
  {
    title: "How We Use Your Information",
    paragraphs: [
      "Personal information collected during registration is used solely for Conference administration, communication with participants, and certification purposes.",
    ],
  },
  {
    title: "Payment Processing",
    paragraphs: [
      "Payments are processed through third-party payment gateway(s) specified on the registration page. GMUN does not store card details; payment processing is handled by the payment provider under its own security and data-handling practices.",
    ],
  },
  {
    title: "Data Sharing",
    paragraphs: [
      "GMUN will not sell or share Participant data with third parties for marketing purposes without consent, except where required for payment processing or as mandated by law.",
    ],
  },
  {
    title: "Photography and Media",
    paragraphs: [
      "By registering for the Conference, participants consent to being photographed and/or filmed during Conference sessions and events for GMUN's promotional, archival, and press purposes. Such material may be used on GMUN's website, social media handles, and official publications, unless the participant notifies GMUN in writing prior to the Conference requesting exclusion.",
    ],
  },
  {
    title: "Contact",
    paragraphs: [
      "For any privacy-related queries, or to request exclusion from promotional photography/recording, contact GMUN at gmun@gitam.in.",
    ],
  },
];
