import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number) => ({ url: `${site.url}${path}`, lastModified: now, priority });
  return [
    page("/", 1),
    page("/services/", 0.9),
    ...services.map((s) => page(`/services/${s.slug}/`, 0.85)),
    page("/industry/", 0.7),
    ...industries.map((s) => page(`/industry/${s.slug}/`, 0.75)),
    page("/partners/", 0.5),
    page("/our-team/", 0.5),
    page("/contact/", 0.8),
  ];
}
