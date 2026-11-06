import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "IT for healthcare, manufacturing & distribution | Techfahm";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: "IT for healthcare, manufacturing & distribution", kicker: "Industries", image: "manufacturing" });
}
