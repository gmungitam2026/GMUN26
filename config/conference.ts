import { site } from "@/config/site";

export interface ConferenceSession {
  title: string;
  description: string;
  time: string;
}

export interface ConferenceDay {
  label: string;
  heading: string;
  sessions: ConferenceSession[];
}

export const format =
  "Our MUN follows the UNA-USA (United Nations Association of the United States of America) format, providing delegates with an authentic and structured Model United Nations experience.";

export const conferenceDays: ConferenceDay[] = [
  {
    label: "Day 1",
    heading: "Inauguration & Committee Sessions",
    sessions: [
      {
        title: "Opening Ceremony",
        description: "Formal inauguration of the conference, welcome address, introduction to the conference, and briefing for delegates.",
        time: "Timing to be announced",
      },
      {
        title: "Session 1",
        description: "Committees begin their proceedings with roll call, agenda setting, opening statements, and moderated discussions.",
        time: "Timing to be announced",
      },
      {
        title: "Lunch",
        description: "Lunch break for delegates, organisers, and guests.",
        time: "Timing to be announced",
      },
      {
        title: "Session 2",
        description: "Continuation of committee proceedings with focused debate, negotiation, and discussion on the respective agendas.",
        time: "Timing to be announced",
      },
      {
        title: "Socials Night",
        description: "An informal evening for delegates to interact, network, and engage in cultural and social activities.",
        time: "Timing to be announced",
      },
    ],
  },
  {
    label: "Day 2",
    heading: "Deliberations, Resolutions & Award Ceremony",
    sessions: [
      {
        title: "Session 3",
        description: "Committees resume proceedings with further debate, negotiations, and development of solutions to the issues under discussion.",
        time: "Timing to be announced",
      },
      {
        title: "Session 4",
        description: "Final committee session focusing on drafting, presenting, and voting on resolutions, followed by concluding committee proceedings.",
        time: "Timing to be announced",
      },
      {
        title: "Closing Ceremony & Awards",
        description: "Formal conclusion of the conference, recognition of outstanding delegates, presentation of awards, acknowledgements, and closing remarks.",
        time: "Timing to be announced",
      },
    ],
  },
];

export const venueAndAccommodation = {
  venue: {
    heading: "Venue",
    body: "GITAM Deemed to be University, Gandhi Nagar, Rushikonda, Visakhapatnam, Andhra Pradesh.",
  },
  accommodation: {
    heading: "Accommodation",
    body: "Accommodation details will be announced. Participants should not assume accommodation is included in the registration fee unless explicitly stated.",
  },
};

export const travel = {
  heading: "Travel & Transportation",
  intro:
    "GITAM's Visakhapatnam campus is located in Gandhi Nagar, Rushikonda, Visakhapatnam, Andhra Pradesh.",
  items: [
    { label: "Nearest Airport", value: "To be announced" },
    { label: "Nearest Railway Station", value: "To be announced" },
    { label: "City Transport", value: "To be announced" },
    { label: "Parking", value: "Information regarding parking and vehicle access will be communicated to registered participants before the conference." },
  ],
};

export interface TimelineMilestone {
  id: string;
  label: string;
  /** ISO date, or null where the client hasn't finalized a date yet (TBA). */
  date: string | null;
  /** True for a milestone considered "reached" the moment the site goes live, independent of a specific date (e.g. registrations opening). */
  alwaysComplete?: boolean;
}

export const timelineMilestones: TimelineMilestone[] = [
  { id: "reg-open", label: "Registrations Open", date: null, alwaysComplete: true },
  { id: "reg-deadline", label: "Registration Deadline", date: null },
  { id: "day1", label: "Day 1 — Opening Ceremony", date: site.dates.start },
  { id: "day2", label: "Day 2 — Closing Ceremony", date: site.dates.end },
];
