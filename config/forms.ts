export interface DelegateFormSection {
  heading?: string;
  paragraphs: string[];
}

export interface DelegateForm {
  id: string;
  title: string;
  summary: string;
  sourceNote: string;
  sections: DelegateFormSection[];
}

/**
 * Content here is drawn directly from the GMUN 5.0 Terms & Conditions
 * (config/terms.ts) — the Code of Conduct and Media Consent / Limitation of
 * Liability clauses — presented as standalone documents delegates can view,
 * and print/save as PDF, rather than only buried inside the full Terms
 * page. No new legal language is invented here.
 */
export const delegateForms: DelegateForm[] = [
  {
    id: "code-of-conduct",
    title: "Code of Conduct",
    summary: "The standards of professionalism, respect, and integrity expected of every participant.",
    sourceNote: "Reproduced from §6 of the GMUN 5.0 Terms & Conditions.",
    sections: [
      {
        paragraphs: [
          "6.1. All Participants are expected to conduct themselves with decorum, professionalism, and mutual respect throughout the Conference, including in committee sessions, social events, and informal interactions.",
          "6.2. Any Participant found engaging in the following conduct will be denied further participation in the Conference with immediate effect, with no refund of fees already paid:",
        ],
      },
      {
        paragraphs: [
          "• Harassment, discrimination, or intimidation of any kind (including based on gender, religion, caste, nationality, or disability)",
          "• Plagiarism of position papers or research material",
          "• Possession or use of alcohol, tobacco, or any banned substances on Conference premises",
          "• Damage to venue property or equipment",
          "• Any conduct that violates GITAM's institutional code of conduct",
        ],
      },
      {
        paragraphs: [
          "6.3. Any Participant facing or witnessing misconduct may report the matter confidentially to the Grievance Point of Contact designated at gmun@gitam.in. GMUN will investigate all complaints in a fair and timely manner.",
          "6.4. The decision of the Secretariat/Organising Committee on matters of conduct and disciplinary action, including denial of further participation under Section 6.2, shall be final and binding, and does not entitle the Participant to a refund.",
        ],
      },
    ],
  },
  {
    id: "liability-media-consent",
    title: "Liability & Media Consent",
    summary: "Confirms participation is at your own risk, and consent to photography/recording during the Conference.",
    sourceNote: "Reproduced from §8 and §10 of the GMUN 5.0 Terms & Conditions.",
    sections: [
      {
        heading: "Photography, Recording, and Media Consent",
        paragraphs: [
          "8.1. By registering for the Conference, Participants consent to being photographed and/or filmed during Conference sessions and events for GMUN's promotional, archival, and press purposes.",
          "8.2. Such photographs and recordings may be used on GMUN's website, social media handles, and official publications without further consent or compensation, unless the Participant notifies GMUN in writing prior to the Conference requesting exclusion.",
        ],
      },
      {
        heading: "Limitation of Liability",
        paragraphs: [
          "10.1. GMUN, its organisers, and GITAM (Deemed to be University) shall not be liable for any loss, theft, or damage to personal belongings, or for any personal injury sustained by any Participant, before, during, or after the Conference.",
          "10.2. Participants are responsible for their own travel, accommodation (unless otherwise stated), and personal belongings during the Conference.",
          "10.3. GMUN strongly recommends that outstation Participants arrange appropriate travel and health insurance for the duration of their travel and stay.",
        ],
      },
      {
        heading: "Note for Participants Under 18",
        paragraphs: [
          "GMUN 5.0 is open to students aged 12–23. Participants under 18 may be required to have this form countersigned by a parent or guardian before the Conference. Final confirmation of this requirement, and any accompanying process, will be announced by the Organising team closer to the event.",
        ],
      },
    ],
  },
];
