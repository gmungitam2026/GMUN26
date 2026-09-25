export interface GalleryImage {
  src: string;
  alt: string;
  /** Intrinsic pixel size, so the carousel can show each photo uncropped. */
  width: number;
  height: number;
}

export interface GalleryCategory {
  id: string;
  label: string;
  images: GalleryImage[];
}

export const galleryCategories: GalleryCategory[] = [
  {
    id: "opening-ceremony",
    label: "Opening Ceremony",
    images: [
      { src: "/gallery/gmun-01.jpg", alt: "Ceremonial lamp lighting at the GMUN opening ceremony", width: 1920, height: 1080 },
      { src: "/gallery/gmun-04.jpg", alt: "Organisers and delegates at the opening of a committee session", width: 1920, height: 1080 },
    ],
  },
  {
    id: "committee-sessions",
    label: "Committee Sessions",
    images: [
      { src: "/gallery/gmun-02.jpg", alt: "A delegate addressing committee with a microphone", width: 1920, height: 1080 },
      { src: "/gallery/gmun-03.jpg", alt: "Delegates seated at committee desks with placards", width: 1920, height: 1080 },
      { src: "/gallery/gmun-07.jpg", alt: "Delegates raising placards during a committee session", width: 1920, height: 1280 },
    ],
  },
  { id: "delegates", label: "Delegates", images: [
      { src: "/gallery/gmun-05.jpg", alt: "A group of delegates at GMUN", width: 1920, height: 1280 },
      { src: "/gallery/gmun-06.jpg", alt: "Delegates in conversation between sessions", width: 1920, height: 1280 },
    ],
  },
  { id: "crisis-room", label: "Crisis Room", images: [] },
  { id: "executive-board", label: "Executive Board", images: [] },
  { id: "awards-night", label: "Awards Night", images: [] },
  { id: "closing-ceremony", label: "Closing Ceremony", images: [] },
  { id: "campus-life", label: "Campus Life", images: [] },
];
