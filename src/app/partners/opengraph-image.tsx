import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "Microsoft, Cisco, Fortinet & Acronis through one partner | Techfahm";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: "Microsoft, Cisco, Fortinet & Acronis through one partner", kicker: "Technology partners", image: "company" });
}
