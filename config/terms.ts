export interface TermsSection {
  number: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export const termsIntro =
  'By accessing this website and/or registering as a delegate, faculty advisor, observer, or partner for GMUN 5.0 ("the Conference"), you agree to be bound by the following Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not proceed with registration or use of this website.';

/**
 * Verbatim from the GMUN 5.0 client requirements document. The two bracketed
 * fields the source doc flags for finalisation — [Insert Dates] and
 * [Insert Venue] in §1 — are filled in with the dates/venue confirmed
 * elsewhere in that same document (24–25 October 2026; GITAM Deemed to be
 * University, Rushikonda, Visakhapatnam), not invented. Section numbering
 * (through §15, then §17, with no §16) matches the source document as given.
 */
export const termsSections: TermsSection[] = [
  {
    number: "1",
    title: "Definitions",
    bullets: [
      '"GMUN" refers to the GITAM Model United Nations, the organising body of the Conference, operating under GITAM (Deemed to be University), Visakhapatnam.',
      '"Conference" refers to GMUN 5.0, scheduled to be held on 24–25 October 2026 at GITAM Deemed to be University, Gandhi Nagar, Rushikonda, Visakhapatnam, Andhra Pradesh.',
      '"Delegate" refers to any individual registered to represent a country, entity, or role within a committee at the Conference.',
      '"Participant" includes Delegates, Executive Board members, faculty advisors, observers, volunteers, and press corps registrants.',
      '"Website" refers to the official GMUN 5.0 website through which registration, information, and communication are conducted.',
    ],
  },
  {
    number: "2",
    title: "Eligibility",
    paragraphs: [
      "2.1. The Conference is open to students in the age category 12 to 22. Specific eligibility criteria for individual committees (including the press-house UNGA committee and the DISEC arms trade committee) will be published on the committee pages.",
      "2.2. GMUN reserves the right to verify the eligibility of any applicant and to deny or revoke registration where eligibility criteria are not met.",
    ],
  },
  {
    number: "3",
    title: "Registration",
    paragraphs: [
      "3.1. Registration is completed only upon submission of the registration form on this Website and receipt of the applicable registration fee.",
      "3.2. GMUN reserves the right to allocate committees, portfolios, and countries at its sole discretion, based on preferences submitted, order of registration, experience, and committee capacity. Portfolio allotment is not guaranteed and, once confirmed, may not be contested.",
      "3.3. If a Delegate's preferred committee reaches full capacity, GMUN will allot the Delegate to their next preference (or the nearest available committee/portfolio). Such reallocation is final and does not entitle the Delegate to a refund, cancellation, or withdrawal of registration.",
      "3.4. Registrations are non-transferable to another individual without prior written approval from the Organising Committee.",
      "3.5. GMUN reserves the right to close registrations before the stated deadline if capacity is reached.",
    ],
  },
  {
    number: "4",
    title: "Registration Fees and Payment",
    paragraphs: [
      "4.1. The registration fee for the Conference is ₹600 only, inclusive/exclusive of delegate kit, refreshments, certificates, etc.",
      "4.2. Payment must be made through the payment method(s) specified on the Website. Registration is considered provisional until payment is confirmed.",
      "4.3. GMUN is not responsible for payment failures, delays, or losses arising from third-party payment gateways, banking errors, or incorrect payment details submitted by the Participant.",
      "4.4. All fees, once paid, are subject to the Cancellation and Refund Policy set out in Section 5.",
    ],
  },
  {
    number: "5",
    title: "Cancellation, Withdrawal, and Refund Policy",
    paragraphs: [
      "5.1. All registration fees, once paid, are strictly non-refundable under any circumstances, including but not limited to voluntary withdrawal, cancellation by the Participant, non-attendance, or denial of participation under Section 6.",
      "5.2. No refund will be issued where a Delegate's committee is reallotted under Section 3.3, as this does not constitute a withdrawal or cancellation on GMUN's part.",
      "5.3. No refund will be issued if a chosen committee is discontinued, merged, or removed for any reason (including insufficient registrations, logistical constraints, or Force Majeure under Section 11), as the corresponding costs are already committed by GMUN to vendors, venue, and materials and are not recoverable.",
      "5.4. In the event GMUN cancels the Conference in its entirety, GMUN will, at its sole discretion, either offer participation in a rescheduled edition or determine refund eligibility on a case-by-case basis after accounting for costs already incurred.",
    ],
  },
  {
    number: "6",
    title: "Code of Conduct",
    paragraphs: [
      "6.1. All Participants are expected to conduct themselves with decorum, professionalism, and mutual respect throughout the Conference, including in committee sessions, social events, and informal interactions.",
      "6.2. Any Participant found engaging in the following conduct will be denied further participation in the Conference with immediate effect, with no refund of fees already paid:",
    ],
    bullets: [
      "Harassment, discrimination, or intimidation of any kind (including based on gender, religion, caste, nationality, or disability)",
      "Plagiarism of position papers or research material",
      "Possession or use of alcohol, tobacco, or any banned substances on Conference premises",
      "Damage to venue property or equipment",
      "Any conduct that violates GITAM's institutional code of conduct",
    ],
  },
  {
    number: "6 (cont.)",
    title: "",
    paragraphs: [
      "6.3. Any Participant facing or witnessing misconduct may report the matter confidentially to the Grievance Point of Contact designated at gmun@gitam.in. GMUN will investigate all complaints in a fair and timely manner.",
      "6.4. The decision of the Secretariat/Organising Committee on matters of conduct and disciplinary action — including denial of further participation under Section 6.2 — shall be final and binding, and does not entitle the Participant to a refund.",
    ],
  },
  {
    number: "7",
    title: "Committee and Procedural Rules",
    paragraphs: [
      "7.1. All Delegates are expected to adhere to the Rules of Procedure circulated before the Conference and to prepare adequately for their assigned committee and portfolio.",
      "7.2. The rulings of the Executive Board (Chairs, Vice-Chairs, and Rapporteurs) on matters of procedure are final for the duration of committee sessions.",
      "7.3. Attendance at all committee sessions is mandatory unless the Secretariat grants prior exemption. Non-attendance may affect award eligibility and, in cases of prolonged absence, participation certification.",
    ],
  },
  {
    number: "8",
    title: "Photography, Recording, and Media Consent",
    paragraphs: [
      "8.1. By registering for the Conference, Participants consent to being photographed and/or filmed during Conference sessions and events for GMUN's promotional, archival, and press purposes.",
      "8.2. Such photographs and recordings may be used on GMUN's website, social media handles, and official publications without further consent or compensation, unless the Participant notifies GMUN in writing prior to the Conference requesting exclusion.",
    ],
  },
  {
    number: "9",
    title: "Intellectual Property",
    paragraphs: [
      "9.1. All content on this Website, including the GMUN name, logo, committee backgrounds, and study guides, is the intellectual property of GMUN/GITAM and may not be reproduced, distributed, or used for commercial purposes without prior written permission.",
      "9.2. Position papers and other materials submitted by Delegates remain their intellectual property but may be used by GMUN internally for evaluation and award purposes.",
    ],
  },
  {
    number: "10",
    title: "Limitation of Liability",
    paragraphs: [
      "10.1. GMUN, its organisers, and GITAM (Deemed to be University) shall not be liable for any loss, theft, or damage to personal belongings, or for any personal injury sustained by any Participant, before, during, or after the Conference.",
      "10.2. Participants are responsible for their own travel, accommodation (unless otherwise stated), and personal belongings during the Conference.",
      "10.3. GMUN strongly recommends that outstation Participants arrange appropriate travel and health insurance for the duration of their travel and stay.",
    ],
  },
  {
    number: "11",
    title: "Force Majeure",
    paragraphs: [
      "GMUN shall not be held liable for any failure or delay in performance of its obligations under these Terms arising from causes beyond its reasonable control, including but not limited to natural disasters, epidemics/pandemics, government restrictions, strikes, or other events of Force Majeure. In such cases, Section 5.4 shall govern refunds.",
    ],
  },
  {
    number: "12",
    title: "Privacy and Data Protection",
    paragraphs: [
      "12.1. Personal information collected during registration (name, contact details, institutional affiliation, payment information) will be used solely for Conference administration, communication, and certification purposes.",
      "12.2. GMUN will not sell or share Participant data with third parties for marketing purposes without consent, except where required for payment processing or as mandated by law.",
      "12.3. For further details, please refer to the Privacy Policy published on this Website.",
    ],
  },
  {
    number: "13",
    title: "Amendments to These Terms",
    paragraphs: [
      "GMUN reserves the right to amend, update, or modify these Terms at any time without prior notice. Continued use of the Website or participation in the Conference following any such changes constitutes acceptance of the revised Terms. Participants are encouraged to review this page periodically.",
    ],
  },
  {
    number: "14",
    title: "Governing Law and Jurisdiction",
    paragraphs: [
      "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms or the Conference shall be subject to the exclusive jurisdiction of the courts at Visakhapatnam, Andhra Pradesh.",
    ],
  },
  {
    number: "15",
    title: "Severability",
    paragraphs: [
      "If any provision of these Terms is found to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect.",
    ],
  },
  {
    number: "17",
    title: "Contact Us",
    paragraphs: [
      "For any queries regarding these Terms, registration, or the Conference, please contact:",
      "GITAM Model United Nations (GMUN), GITAM (Deemed to be University), Visakhapatnam, Andhra Pradesh, India.",
      "Email: gmun@gitam.in",
    ],
  },
];

export const consentSummary = {
  intro: "Before you submit your registration, please note:",
  bullets: [
    "Registration fees are strictly non-refundable, including in case of withdrawal, cancellation, or non-attendance.",
    "If your preferred committee is full, you will be allotted your next preference. This does not entitle you to a refund.",
    "If your allotted committee is discontinued for any reason, your registration fee will not be refunded.",
    "GMUN is not liable for the loss, theft, or damage of personal belongings during the Conference.",
    "Any participant found to be engaging in misconduct will be denied further participation and will receive no refund of fees.",
  ],
  checkbox: "I have read, understood, and agree to the Terms and Conditions of GMUN 5.0.",
};
