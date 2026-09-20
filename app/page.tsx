import { Hero } from "@/components/hero/Hero";
import { TimelineBar } from "@/components/sections/TimelineBar";
import { MissionVision } from "@/components/sections/MissionVision";
import { Gallery } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <TimelineBar />
      <MissionVision />
      <Gallery />
      <Testimonials />
    </>
  );
}
