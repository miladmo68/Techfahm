import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cta, Faq, PageHero } from "@/components/sections/home-sections";
import { IntroBlock } from "@/components/sections/detail";
import { Photo } from "@/components/ui/photo";
import { Reveal, RevealLines, ZoomIn } from "@/components/ui/motion";
import { getLocation, locations, regionName } from "@/content/locations";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { JsonLd, breadcrumbLd, faqLd, orgId, pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return locations.map((l) => ({ location: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }): Promise<Metadata> {
  const l = getLocation((await params).location);
  if (!l) return {};
  return pageMeta({ title: l.metaTitle, description: l.metaDescription, path: `/${l.slug}/` });
}

export default async function LocationPage({ params }: { params: Promise<{ location: string }> }) {
  const l = getLocation((await params).location);
  if (!l) notFound();
  const path = `/${l.slug}/`;

  return (
    <>
      <PageHero crumbs={[{ label: `IT services in ${l.city}` }]} title={l.headline} lead={l.lead} image={l.image} imageAlt={`Business IT in ${l.region}`} />

      <IntroBlock
        heading={[`Your IT partner in`, regionName(l)]}
        paragraphs={l.intro}
        aside={
          <Reveal className="rounded-[1.5rem] border border-ink/10 bg-white p-6 sm:p-8 lg:sticky lg:top-28">
            <h2 className="font-sans text-base font-semibold">Areas we serve in {regionName(l)}</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {l.places.map((p) => (
                <li key={p} className="rounded-full bg-mist px-4 py-2 text-[0.95rem]">{p}</li>
              ))}
            </ul>
            <p className="muted mt-5 text-sm">
              Call <a className="text-ink underline decoration-signal underline-offset-4" href={site.phoneHref}>{site.phone}</a> to talk to us.
            </p>
          </Reveal>
        }
      />

      <section className="section bg-mist">
        <div className="container-x">
          <RevealLines className="t-h2 mx-auto max-w-3xl text-center md:mx-0 md:text-left" lines={[`IT services for ${l.city}`, "businesses"]} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}/`}
                className="group overflow-hidden rounded-[1.5rem] bg-white transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgb(10_22_40/0.45)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <ZoomIn>
                    <Photo
                      name={s.image}
                      alt={s.imageAlt}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
                    />
                  </ZoomIn>
                </div>
                <div className="p-6">
                  <h3 className="t-h3 group-hover:text-signal">
                    {s.title} <span className="sr-only">in {l.city}</span>
                  </h3>
                  <p className="muted mt-2 text-[0.97rem]">{s.short}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper pt-[var(--section-y)]">
        <div className="container-x">
          <h2 className="muted text-center font-sans text-sm font-medium md:text-left">Other service areas</h2>
          <ul className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
            {locations
              .filter((o) => o.slug !== l.slug)
              .map((o) => (
                <li key={o.slug}>
                  <Link href={`/${o.slug}/`} className="inline-block rounded-full border border-ink/15 px-5 py-2.5 transition-colors hover:border-signal hover:text-signal">
                    Managed IT services in {o.city}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>

      <Faq items={l.faq} />
      <Cta title={[`Ready for better IT`, `in ${l.city}?`]} />

      <JsonLd
        data={[
          breadcrumbLd([{ name: `Managed IT services in ${l.city}`, path }]),
          faqLd(l.faq),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Managed IT services in ${l.city}`,
            serviceType: "Managed IT services",
            url: `${site.url}${path}`,
            description: l.metaDescription,
            provider: { "@id": orgId },
            areaServed: [
              { "@type": "AdministrativeArea", name: `${l.region}, Ontario` },
              ...l.places.map((p) => ({ "@type": "City", name: `${p}, ON` })),
            ],
          },
        ]}
      />
    </>
  );
}
