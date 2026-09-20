export interface GalleryCategory {
  id: string;
  label: string;
  /** Populate with real image paths once GMUN supplies event photography. */
  images: { src: string; alt: string }[];
}

/**
 * No real GMUN event photography has been supplied yet. Categories are kept
 * here, ready to receive images, without fabricating placeholder photos.
 */
export const galleryCategories: GalleryCategory[] = [
  { id: "opening-ceremony", label: "Opening Ceremony", images: [] },
  { id: "committee-sessions", label: "Committee Sessions", images: [] },
  { id: "delegates", label: "Delegates", images: [] },
  { id: "crisis-room", label: "Crisis Room", images: [] },
  { id: "executive-board", label: "Executive Board", images: [] },
  { id: "awards-night", label: "Awards Night", images: [] },
  { id: "closing-ceremony", label: "Closing Ceremony", images: [] },
  { id: "campus-life", label: "Campus Life", images: [] },
];
