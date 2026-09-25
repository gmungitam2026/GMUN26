import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { aboutVizag } from "@/config/about";
import { committees } from "@/config/committees";
import { committeePhotos, gitamCampusPhoto, unGeneralAssemblyPhoto, type Photo } from "@/config/photos";

export const metadata: Metadata = {
  title: "Photo Credits",
  description: "Credits and licences for the photographs used on the GMUN 5.0 website.",
};

/**
 * Attribution for every openly licensed photo on the site. CC BY and CC BY-SA
 * require crediting the author and licence; rather than overlaying that on the
 * photos themselves, it is collected here and linked from the footer.
 */
function creditedPhotos(): { usedFor: string; photo: Photo }[] {
  return [
    { usedFor: "About · Visakhapatnam", photo: aboutVizag.heroImage },
    ...aboutVizag.landmarks.map((l) => ({ usedFor: l.name, photo: l.image })),
    { usedFor: "About · GITAM campus", photo: gitamCampusPhoto },
    { usedFor: "About · What is Model UN?", photo: unGeneralAssemblyPhoto },
    ...committees
      .filter((c) => committeePhotos[c.id])
      .map((c) => ({ usedFor: `Committee · ${c.shortName}`, photo: committeePhotos[c.id] })),
  ].filter((item) => item.photo.credit);
}

export default function CreditsPage() {
  const items = creditedPhotos();

  return (
    <div className="pt-36 pb-24 md:pt-44 md:pb-32">
      <Container className="max-w-4xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">Credits</p>
        <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">Photo Credits</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory-dim">
          Conference photographs are GMUN&apos;s own. The photographs below are used under open licences from
          Wikimedia Commons; each links to its original page with the full licence terms.
        </p>

        <ul className="mt-14 border-t border-line">
          {items.map(({ usedFor, photo }) => (
            <li key={photo.src} className="flex items-center gap-5 border-b border-line py-5">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden border border-line">
                <Image src={photo.src} alt="" fill sizes="96px" className="object-cover" />
              </div>
              <div className="min-w-0 text-sm">
                <p className="text-[11px] uppercase tracking-[0.12em] text-gold">{usedFor}</p>
                <p className="mt-1 text-ivory">{photo.alt}</p>
                <p className="mt-1 text-ivory-faint">
                  Photo by {photo.credit!.author} ·{" "}
                  <a href={photo.credit!.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-gold">
                    {photo.credit!.license}, via Wikimedia Commons
                  </a>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
