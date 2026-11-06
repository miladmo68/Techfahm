import type { Metadata } from "next";
import { site } from "@/content/site";

export function pageMeta({
  title,
  description,
  path,
  image = "share",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = `${site.url}${path}`;
  const ogImage = `/images/${image}-1200.webp`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: site.shortName,
      locale: "en_CA",
      type: "website",
      images: [{ url: ogImage, width: 1200, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage], site: "@techfahm" },
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const orgId = `${site.url}/#organization`;

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": orgId,
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  logo: `${site.url}/images/logo.png`,
  image: `${site.url}/images/hero-1200.webp`,
  email: site.email,
  telephone: "+1-905-277-5653",
  description: site.description,
  areaServed: [
    { "@type": "AdministrativeArea", name: "Greater Toronto Area, Ontario" },
    { "@type": "AdministrativeArea", name: "Hamilton & Niagara, Ontario" },
    { "@type": "AdministrativeArea", name: "Waterloo Region, Ontario" },
  ],
  address: { "@type": "PostalAddress", addressRegion: "ON", addressCountry: "CA" },
  sameAs: Object.values(site.social),
  knowsAbout: [
    "Managed IT services",
    "Network management",
    "Cybersecurity",
    "Cloud computing",
    "Backup and disaster recovery",
    "IT consulting",
    "Healthcare IT compliance",
  ],
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.shortName,
  publisher: { "@id": orgId },
  inLanguage: "en-CA",
};

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
}

export function serviceLd(s: { title: string; metaDescription: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    serviceType: s.title,
    description: s.metaDescription,
    url: `${site.url}/services/${s.slug}/`,
    provider: { "@id": orgId },
    areaServed: site.regions.map((r) => ({ "@type": "AdministrativeArea", name: r })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
