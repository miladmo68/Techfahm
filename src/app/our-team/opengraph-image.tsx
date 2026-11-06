import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "IT experts who care how your business does | Techfahm";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: "IT experts who care how your business does", kicker: "Our team", image: "team" });
}
