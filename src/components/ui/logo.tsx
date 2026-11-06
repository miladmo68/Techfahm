import Image from "next/image";
import { logo } from "@/lib/images";
import { cn } from "@/lib/utils";
import { asset } from "@/lib/base-path";

/**
 * Real Techfahm logo (downloaded by `npm run images`).
 * `tone="light"` turns it white for dark backgrounds.
 * Falls back to a text wordmark until the logo has been downloaded.
 */
export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  if (logo?.source === "real" && logo.width && logo.height) {
    return (
      <Image
        src={asset("/images/logo.png")}
        alt="Techfahm"
        width={logo.width}
        height={logo.height}
        unoptimized
        priority
        className={cn("h-7 w-auto md:h-8", tone === "light" && "brightness-0 invert", className)}
      />
    );
  }
  return (
    <span
      className={cn(
        "font-display text-[1.45rem] font-bold tracking-[-0.04em]",
        tone === "light" ? "text-white" : "text-ink",
        className,
      )}
    >
      techfahm<span className="text-signal">.</span>
    </span>
  );
}
