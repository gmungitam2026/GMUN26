import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { delegateForms } from "@/config/forms";
import { Container } from "@/components/ui/Container";
import { PrintButton } from "@/components/ui/PrintButton";

export function generateStaticParams() {
  return delegateForms.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: PageProps<"/forms/[id]">): Promise<Metadata> {
  const { id } = await params;
  const form = delegateForms.find((f) => f.id === id);
  if (!form) return {};
  return { title: form.title, description: form.summary };
}

export default async function FormDetailPage({ params }: PageProps<"/forms/[id]">) {
  const { id } = await params;
  const form = delegateForms.find((f) => f.id === id);
  if (!form) notFound();

  return (
    <div className="pt-36 pb-24 md:pt-44 md:pb-32">
      <Container className="max-w-3xl">
        <div className="print:hidden">
          <Link href="/forms" className="text-[11px] uppercase tracking-[0.14em] text-ivory-faint hover:text-gold">
            ← All Forms
          </Link>
        </div>

        <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.28em] text-gold">
          GMUN 5.0 · Delegate Document
        </p>
        <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">{form.title}</h1>
        <p className="mt-3 text-sm text-ivory-faint">{form.sourceNote}</p>

        <div className="mt-10 space-y-10">
          {form.sections.map((section, i) => (
            <div key={i} className="border-t border-line pt-8">
              {section.heading && <h2 className="font-display text-xl text-ivory">{section.heading}</h2>}
              <div className={section.heading ? "mt-4 space-y-3" : "space-y-3"}>
                {section.paragraphs.map((p, j) => (
                  <p key={j} className="text-sm leading-relaxed text-ivory-dim">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-line pt-8 print:hidden">
          <PrintButton />
        </div>
      </Container>
    </div>
  );
}
