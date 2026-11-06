import { locations, getLocation } from "@/content/locations";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "Techfahm";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return locations.map((s) => ({ location: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ location: string }> }) {
  const s = getLocation((await params).location)!;
  return ogImage({ title: `Managed IT services in ${s.city}`, kicker: s.region, image: s.image });
}
