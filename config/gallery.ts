export interface GalleryCategory {
  id: string;
  label: string;
  images: { src: string; alt: string }[];
}

export const galleryCategories: GalleryCategory[] = [
  {
    id: "opening-ceremony",
    label: "Opening Ceremony",
    images: [
      { src: "/gallery/gmun-01.jpg", alt: "Ceremonial lamp lighting at the GMUN opening ceremony" },
      { src: "/gallery/gmun-04.jpg", alt: "Organisers and delegates at the opening of a committee session" },
    ],
  },
  {
    id: "committee-sessions",
    label: "Committee Sessions",
    images: [
      { src: "/gallery/gmun-02.jpg", alt: "A delegate addressing committee with a microphone" },
      { src: "/gallery/gmun-03.jpg", alt: "Delegates seated at committee desks with placards" },
      { src: "/gallery/gmun-07.jpg", alt: "Delegates raising placards during a committee session" },
    ],
  },
  { id: "delegates", label: "Delegates", images: [
      { src: "/gallery/gmun-05.jpg", alt: "A group of delegates at GMUN" },
      { src: "/gallery/gmun-06.jpg", alt: "Delegates in conversation between sessions" },
    ],
  },
  { id: "crisis-room", label: "Crisis Room", images: [] },
  { id: "executive-board", label: "Executive Board", images: [] },
  { id: "awards-night", label: "Awards Night", images: [] },
  { id: "closing-ceremony", label: "Closing Ceremony", images: [] },
  { id: "campus-life", label: "Campus Life", images: [] },
];
