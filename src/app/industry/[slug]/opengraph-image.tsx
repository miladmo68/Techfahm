import { industries, getIndustry } from "@/content/industries";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "Techfahm";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return industries.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const s = getIndustry((await params).slug)!;
  return ogImage({ title: s.headline, kicker: "Industry", image: s.image });
}
