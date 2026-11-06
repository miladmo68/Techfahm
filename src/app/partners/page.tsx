import type { Metadata } from "next";
import { Cta, PageHero } from "@/components/sections/home-sections";
import { WidePhoto } from "@/components/sections/detail";
import { partnerLogosColor } from "@/components/sections/partners-strip";
import { Reveal, RevealLines } from "@/components/ui/motion";
import { JsonLd, breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Technology Partners: Microsoft, Cisco, Fortinet & Acronis",
  description:
    "Techfahm works with Microsoft, Cisco, Fortinet and Acronis to give Ontario businesses enterprise-grade IT, security and backup tailored to their goals.",
  path: "/partners/",
});

const notes: Record<string, string> = {
  Microsoft: "Productivity, collaboration and cloud tools your team uses every day.",
  Cisco: "Networking hardware and infrastructure built for reliability.",
  Fortinet: "Firewalls and network security that protect your perimeter.",
  Acronis: "Backup and cyber protection for business data.",
};

export default function PartnersPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Partners" }]}
        title={["The right technology,", "through one partner."]}
        lead="We work with leading technology companies so you get access to high-quality IT products, whether you're a startup, a growing business or an enterprise."
        image="company"
        imageAlt="People working on their computers in an office"
      />
      <section className="section bg-paper">
        <div className="container-x">
          <RevealLines className="t-h2 mx-auto max-w-3xl text-center md:mx-0 md:text-left" lines={["Direct access to our", "partner network."]} />
          <p className="muted t-lead mx-auto mt-6 max-w-2xl text-center md:mx-0 md:text-left">
            We choose and configure the products that fit your goals, then manage them for you, so you get custom IT
            solutions instead of off-the-shelf bundles.
          </p>
          <ul className="mt-14 grid gap-5 sm:grid-cols-2">
            {partnerLogosColor.map((p, i) => (
              <li key={p.name}>
                <Reveal delay={i * 0.06} className="h-full">
                <div className="flex h-full flex-col items-center justify-between gap-8 rounded-[1.5rem] border border-ink/10 bg-white p-8 text-center sm:items-start sm:gap-10 sm:text-left">
                  <div className="flex h-16 items-center">{p.node}</div>
                  <p className="muted">{notes[p.name]}</p>
                </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <WidePhoto name="server-room" alt="Server racks in a data centre" />
      <Cta />
      <JsonLd data={breadcrumbLd([{ name: "Partners", path: "/partners/" }])} />
    </>
  );
}
