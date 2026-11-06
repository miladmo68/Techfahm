import type { Metadata } from "next";
import { PageHero } from "@/components/sections/home-sections";
import { ContactForm } from "@/components/sections/contact-form";
import Link from "next/link";
import { site } from "@/content/site";
import { locations } from "@/content/locations";
import { JsonLd, breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Contact Us: Book a Free IT Consultation",
  description:
    "Contact Techfahm for managed IT services in Toronto, Hamilton and Waterloo. Call +1 (905) 277-5653, email info@techfahm.com or book a free consultation.",
  path: "/contact/",
});

const nextSteps = [
  { title: "We get back to you", body: "We read your message and reply by email or phone to set up a time." },
  { title: "Free consultation", body: "A conversation about your business, your current setup and what keeps going wrong." },
  { title: "Clear proposal", body: "We assess your systems and send a plan with what we'd fix, manage and what it costs." },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Contact" }]}
        title={["Book a free", "consultation."]}
        lead="Tell us about your business and your current setup. We'll get back to you with next steps, no obligation."
      />
      <section className="section bg-paper">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <aside className="space-y-10 text-center lg:col-span-5 lg:pl-6 lg:text-left">
            <div className="rounded-[1.5rem] bg-ink p-6 text-left text-white sm:p-8">
              <h2 className="font-sans text-base font-semibold">What happens next</h2>
              <ol className="mt-5 space-y-5">
                {nextSteps.map((s, i) => (
                  <li key={s.title} className="grid grid-cols-[2rem_1fr] gap-3">
                    <span className="grid size-8 place-items-center rounded-full border border-white/15 font-display text-sm">{i + 1}</span>
                    <div>
                      <p className="font-medium">{s.title}</p>
                      <p className="mt-1 text-sm text-white/65">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h2 className="muted font-sans text-sm font-medium">Call us</h2>
              <a href={site.phoneHref} className="t-h3 mt-2 block hover:text-signal">{site.phone}</a>
            </div>
            <div>
              <h2 className="muted font-sans text-sm font-medium">Email</h2>
              <a href={`mailto:${site.email}`} className="t-h3 mt-2 block break-all hover:text-signal">{site.email}</a>
            </div>
            <div>
              <h2 className="muted font-sans text-sm font-medium">Service areas</h2>
              <ul className="mt-3 inline-block space-y-2 text-left text-lg lg:block">
                {locations.map((l) => (
                  <li key={l.slug} className="flex items-center gap-3">
                    <span aria-hidden className="size-2 rounded-full bg-signal" />
                    <Link href={`/${l.slug}/`} className="hover:text-signal">{l.region}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
      <JsonLd data={breadcrumbLd([{ name: "Contact", path: "/contact/" }])} />
    </>
  );
}
