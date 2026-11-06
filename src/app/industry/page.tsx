import type { Metadata } from "next";
import { Cta, Industries, PageHero } from "@/components/sections/home-sections";
import { JsonLd, breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Industries We Serve: Healthcare, Manufacturing & Distribution",
  description:
    "Techfahm delivers managed IT for Ontario healthcare providers, manufacturers and distributors, with compliance, security and supply-chain systems built in.",
  path: "/industry/",
});

export default function IndustryPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Industries" }]}
        title={["IT shaped around", "how your sector works."]}
        lead="Healthcare and manufacturing have their own rules, platforms and pressures. We build IT that respects them."
      />
      <Industries />
      <Cta />
      <JsonLd data={breadcrumbLd([{ name: "Industries", path: "/industry/" }])} />
    </>
  );
}
