import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { AssemblyHallReveal } from "@/components/sections/AssemblyHallReveal";

export function AssemblyChamber() {
  return (
    <section className="grain overflow-hidden border-t border-line bg-ink py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="The Chamber" title="Every seat fills as the session begins." />
        </Reveal>
      </Container>
      <div className="mt-14 px-6 md:px-10 lg:px-16">
        <AssemblyHallReveal />
      </div>
    </section>
  );
}
