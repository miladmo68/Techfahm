import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { locations } from "@/content/locations";
import { site } from "@/content/site";

export const dynamic = "force-static";

const img = (name: string) => `${site.url}/images/${name}-1200.webp`;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const page = (
    path: string,
    priority: number,
    images: string[] = [],
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  ) => ({ url: `${site.url}${path}`, lastModified, changeFrequency, priority, images: images.map(img) });

  return [
    page("/", 1, ["hero", "company"], "weekly"),
    page("/services/", 0.9, services.map((s) => s.image)),
    ...services.map((s) => page(`/services/${s.slug}/`, 0.9, [s.image])),
    ...locations.map((l) => page(`/${l.slug}/`, 0.85, [l.image])),
    page("/industry/", 0.7, industries.map((s) => s.image)),
    ...industries.map((s) => page(`/industry/${s.slug}/`, 0.8, [s.image])),
    page("/contact/", 0.8),
    page("/partners/", 0.5, ["company"], "yearly"),
    page("/our-team/", 0.5, ["team"], "yearly"),
  ];
}
