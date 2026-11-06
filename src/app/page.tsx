import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { PartnersStrip } from "@/components/sections/partners-strip";
import { ServicesStack } from "@/components/sections/services-stack";
import { Cta, Faq, Industries, Process, Statement, WhyUs } from "@/components/sections/home-sections";
import { faq } from "@/content/faq";
import { JsonLd, faqLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Managed IT Services in Toronto, Hamilton & Waterloo",
    description:
      "Techfahm is a Toronto managed IT services provider: network management, IT support, cloud, cybersecurity, backup and IT consulting for Ontario businesses. Free consultation.",
    path: "/",
  }),
  title: { absolute: "Managed IT Services in Toronto, Hamilton & Waterloo | Techfahm" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <PartnersStrip />
      <ServicesStack />
      <Statement />
      <WhyUs />
      <Process />
      <Industries />
      <Faq items={faq} />
      <Cta />
      <JsonLd data={faqLd(faq)} />
    </>
  );
}
