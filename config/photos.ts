/**
 * Every photo used outside the home gallery, in one place. GMUN's own
 * photos need no credit; photos from Wikimedia Commons carry the author and
 * licence their terms require, listed on the /credits page.
 */

export type PhotoCreditInfo = { author: string; license: string; url: string };

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit?: PhotoCreditInfo;
};

// GMUN's own conference photography
export const gmunPhotos = {
  p1: { src: "/gallery/gmun-01.jpg", width: 1920, height: 1080, alt: "Ceremonial lamp lighting at the GMUN opening ceremony" },
  p2: { src: "/gallery/gmun-02.jpg", width: 1920, height: 1080, alt: "A delegate addressing committee with a microphone" },
  p3: { src: "/gallery/gmun-03.jpg", width: 1920, height: 1080, alt: "Delegates seated at committee desks with placards" },
  p4: { src: "/gallery/gmun-04.jpg", width: 1920, height: 1080, alt: "A full committee room in session at GITAM" },
  p5: { src: "/gallery/gmun-05.jpg", width: 1920, height: 1280, alt: "A committee of GMUN delegates smiling at their desks" },
  p6: { src: "/gallery/gmun-06.jpg", width: 1920, height: 1280, alt: "Delegates in animated discussion between sessions" },
  p7: { src: "/gallery/gmun-07.jpg", width: 1920, height: 1280, alt: "Delegates raising their placards during a committee session" },
} satisfies Record<string, Photo>;

export const gitamCampusPhoto: Photo = {
    src: "/photos/gitam-campus.jpg",
    width: 1920,
    height: 2560,
    alt: "The Knowledge Resource Centre framed by trees on the GITAM Visakhapatnam campus",
    credit: { author: "SHUBHAM KR SONI", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:GITAM_(Deemed_to_be_University),_Visakhapatnam_Campus.jpg" },
  };

export const unGeneralAssemblyPhoto: Photo = {
    src: "/photos/un-general-assembly.jpg",
    width: 1920,
    height: 1280,
    alt: "The United Nations General Assembly Hall in New York during a session",
    credit: { author: "Basil D Soufi", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:United_Nations_General_Assembly_Hall_(3).jpg" },
  };

/** Keyed by committee id (config/committees.ts). */
export const committeePhotos: Record<string, Photo> = {
  "unea": {
      src: "/photos/committee-unea.jpg",
      width: 1920,
      height: 1280,
      alt: "The wide reservoir at Nagarjuna Sagar dam",
      credit: { author: "Trusharm512", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Nagarjuna_Sagar_Dam1.jpg" },
    },
  "unhrc": {
      src: "/photos/committee-unhrc.jpg",
      width: 1920,
      height: 1280,
      alt: "The Human Rights and Alliance of Civilizations Room in Geneva, under its painted ceiling",
      credit: { author: "Ludovic Courtès", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:UN_Geneva_Human_Rights_and_Alliance_of_Civilizations_Room.jpg" },
    },
  "media-info": {
      src: "/photos/committee-media.jpg",
      width: 1920,
      height: 1266,
      alt: "A cluster of news microphones at a press conference",
      credit: { author: "Tony Webster", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:News_Microphones_at_Press_Conference.jpg" },
    },
  "disec": {
      src: "/photos/committee-disec.jpg",
      width: 1920,
      height: 1280,
      alt: "The Knotted Gun, a sculpture of a revolver with its barrel tied in a knot",
      credit: { author: "IAEA Imagebank", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:The_Knotted_Gun_(01613290)_(50393423136).jpg" },
    },
  "mcu": {
      src: "/photos/committee-mcu.jpg",
      width: 1920,
      height: 1440,
      alt: "A darkened cinema auditorium with rows of seats",
      credit: { author: "JIP", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Auditorium_at_Gilda_on_an_afternoon_in_January_2025.jpg" },
    },
  "ifi": {
      src: "/photos/committee-ifi.jpg",
      width: 1920,
      height: 2560,
      alt: "A vintage film camera and clapperboard",
      credit: { author: "SunOfErat", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Filmmuseum_Berlin_-_Cinemeccanica,_Gangs_of_New_York_Clapperboard.jpg" },
    },
  "fifa": {
      src: "/photos/committee-fifa.jpg",
      width: 1920,
      height: 1440,
      alt: "A floodlit football match at Salt Lake Stadium, Kolkata",
      credit: { author: "Patrick Maletz", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Salt_Lake_Stadium_(_Yuba_Bharati_Krirangan_)_Kolkata_India_-_FC_Bayern_Munich_Mohun_Bagan_Oliver_Kahn_15.jpg" },
    },
};

/** Committee emblems (gold on black, 800×800), keyed by committee id. */
export const committeeLogos: Record<string, string> = {
  unea: "/committees/unea.jpg",
  unhrc: "/committees/unhrc.jpg",
  "media-info": "/committees/media-info.jpg",
  disec: "/committees/disec.jpg",
  mcu: "/committees/mcu.jpg",
  ifi: "/committees/ifi.jpg",
  fifa: "/committees/fifa.jpg",
};
