import { Hero } from "@/components/hero/Hero";
import { MissionVision } from "@/components/sections/MissionVision";
import { LogoWatermark } from "@/components/ui/LogoWatermark";
import { Gallery } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <LogoWatermark />
      <Hero />
      <MissionVision />
      <Gallery />
      <Testimonials />
      {/* Deliberately empty — lets the fully filled-in logo watermark read
          clearly once scroll progress reaches the end of the page. */}
      <section aria-hidden className="min-h-screen border-t border-line" />
    </>
  );
}
