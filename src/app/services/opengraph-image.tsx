import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "Managed IT services, planned around you | Techfahm";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: "Managed IT services, planned around you", kicker: "Services", image: "network" });
}
