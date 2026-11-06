import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "Managed IT services for Ontario businesses | Techfahm";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: "Managed IT services for Ontario businesses", kicker: "Techfahm", image: "hero" });
}
