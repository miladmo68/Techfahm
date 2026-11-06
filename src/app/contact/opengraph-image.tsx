import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "Book a free IT consultation | Techfahm";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: "Book a free IT consultation", kicker: "Contact", image: "consulting" });
}
