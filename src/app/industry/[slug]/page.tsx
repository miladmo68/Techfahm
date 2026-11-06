import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cta, PageHero } from "@/components/sections/home-sections";
import { RelatedServices, WidePhoto } from "@/components/sections/detail";
import { Reveal, RevealLines } from "@/components/ui/motion";
import { getIndustry, industries } from "@/content/industries";
import { JsonLd, breadcrumbLd, pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getIndustry((await params).slug);
  if (!s) return {};
  return pageMeta({ title: s.metaTitle, description: s.metaDescription, path: `/industry/${s.slug}/` });
}

export default async function IndustryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const ind = getIndustry((await params).slug);
  if (!ind) notFound();
  return (
    <>
      <PageHero
        crumbs={[{ label: "Industries", href: "/industry/" }, { label: ind.title }]}
        title={[ind.headline]}
        lead={ind.short}
        image={ind.image}
        imageAlt={ind.imageAlt}
      />

      <section className="section bg-paper">
        <div className="container-x">
          <Reveal className="prose-x t-lead text-ink/80">
            {ind.intro.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </Reveal>

          <div className="mt-16 divide-y divide-ink/10 border-y border-ink/10">
            {ind.sections.map((sec) => (
              <div key={sec.title} className="grid gap-6 py-12 md:grid-cols-12 md:gap-10">
                <RevealLines as="h2" className="t-h3 md:col-span-4" lines={[sec.title]} />
                <Reveal className="md:col-span-8">
                  <p className="muted max-w-2xl text-[1.06rem]">{sec.body}</p>
                  {sec.points && (
                    <ul className="mt-6 grid gap-3 sm:grid-cols-1">
                      {sec.points.map((pt) => (
                        <li key={pt} className="flex gap-3 text-[1.02rem]">
                          <span aria-hidden className="mt-3 h-px w-5 shrink-0 bg-signal" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </Reveal>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-[1.75rem] bg-ink p-8 text-white sm:p-10">
            <h2 className="font-sans text-base font-medium text-white/60">Platforms we work with</h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {ind.platforms.map((p) => (
                <li key={p} className="rounded-full border border-white/15 px-5 py-2.5 text-[1.02rem]">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <WidePhoto name={ind.slug === "health" ? "technician" : "datacenter"} alt="IT infrastructure managed by Techfahm" />
      <RelatedServices slugs={ind.related} title="Services that matter most here" />
      <Cta />
      <JsonLd
        data={breadcrumbLd([
          { name: "Industries", path: "/industry/" },
          { name: ind.title, path: `/industry/${ind.slug}/` },
        ])}
      />
    </>
  );
}
