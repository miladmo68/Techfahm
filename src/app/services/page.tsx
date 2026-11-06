import type { Metadata } from "next";
import Link from "next/link";
import { Cta, PageHero } from "@/components/sections/home-sections";
import { Photo } from "@/components/ui/photo";
import { Reveal } from "@/components/ui/motion";
import { services } from "@/content/services";
import { JsonLd, breadcrumbLd, pageMeta, serviceLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Managed IT Services: Network, Cloud, Cybersecurity & Support",
  description:
    "Explore Techfahm's managed IT services for Toronto, Hamilton and Waterloo businesses: network management, IT support, cloud, cybersecurity, backup and IT consulting.",
  path: "/services/",
  image: "network",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services" }]}
        title={["Managed IT services,", "planned around you."]}
        lead="Every service is designed to make your IT more effective, more productive and more cost-efficient. Use one, or let us run all of it."
      />
      <section className="section bg-paper">
        <ul className="container-x divide-y divide-ink/10">
          {services.map((s, i) => (
            <li key={s.slug}>
              <Reveal>
                <Link href={`/services/${s.slug}/`} className="group grid items-center gap-6 py-8 md:grid-cols-12 md:gap-10 md:py-10">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] md:col-span-4">
                    <Photo
                      name={s.image}
                      alt={s.imageAlt}
                      fill
                      sizes="(min-width:768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
                    />
                  </div>
                  <div className="md:col-span-7">
                    <p className="muted text-sm">Service {i + 1}</p>
                    <h2 className="t-h2 mt-2 transition-colors group-hover:text-signal">{s.title}</h2>
                    <p className="muted mt-3 max-w-xl text-[1.05rem]">{s.short}</p>
                  </div>
                  <span
                    aria-hidden
                    className="hidden size-14 place-items-center justify-self-end rounded-full border border-ink/15 transition-all duration-500 ease-out-expo group-hover:border-signal group-hover:bg-signal group-hover:text-white md:col-span-1 md:grid"
                  >
                    <svg viewBox="0 0 16 16" className="size-4">
                      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
      <Cta />
      <JsonLd data={[breadcrumbLd([{ name: "Services", path: "/services/" }]), ...services.map(serviceLd)]} />
    </>
  );
}
