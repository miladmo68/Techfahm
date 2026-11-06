import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cta, PageHero } from "@/components/sections/home-sections";
import { Benefits, Checklist, IntroBlock, RelatedServices } from "@/components/sections/detail";
import { getService, services } from "@/content/services";
import { JsonLd, breadcrumbLd, pageMeta, serviceLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return pageMeta({ title: s.metaTitle, description: s.metaDescription, path: `/services/${s.slug}/`, image: s.image });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  if (!s) notFound();
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/services/" }, { label: s.title }]}
        title={[s.title]}
        lead={s.short}
        image={s.image}
        imageAlt={s.imageAlt}
      />
      <IntroBlock
        heading={["How we handle", s.title.toLowerCase()]}
        paragraphs={s.intro}
        aside={<Checklist title="What's included" items={s.includes} />}
      />
      <Benefits heading={[`What ${s.title.toLowerCase()}`, "does for your business"]} items={s.benefits} />
      <RelatedServices slugs={s.related} />
      <Cta title={["Ready to talk about", `${s.title.toLowerCase()}?`]} />
      <JsonLd
        data={[
          serviceLd(s),
          breadcrumbLd([
            { name: "Services", path: "/services/" },
            { name: s.title, path: `/services/${s.slug}/` },
          ]),
        ]}
      />
    </>
  );
}
