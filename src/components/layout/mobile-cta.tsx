"use client";

import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { EASE } from "@/lib/utils";

/**
 * Mobile-only bar with the two actions people want most: call or book.
 * Shows after the hero, hides while a CTA section or the footer is on screen,
 * and never shows on the contact page.
 */
export function MobileCta() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [past, setPast] = useState(false);
  const [covered, setCovered] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setPast(v > 480));

  useEffect(() => {
    const targets = document.querySelectorAll("[data-hide-mobile-cta]");
    if (!targets.length) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setCovered(visible.size > 0);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  const show = past && !covered && !pathname.startsWith("/contact");

  return (
    <AnimatePresence>
      {show && (
        <m.div
          initial={{ y: "120%" }}
          animate={{ y: "0%" }}
          exit={{ y: "120%" }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fixed inset-x-3 z-40 lg:hidden"
          style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex gap-2 rounded-full border border-white/10 bg-ink/90 p-1.5 shadow-[0_20px_50px_-15px_rgb(10_22_40/0.7)] backdrop-blur-xl">
            <a
              href={site.phoneHref}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-medium text-white transition-colors active:bg-white/10"
              aria-label={`Call Techfahm at ${site.phone}`}
            >
              <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden>
                <path
                  d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z"
                  fill="currentColor"
                />
              </svg>
              Call us
            </a>
            <Link
              href="/contact/"
              className="flex h-12 flex-[1.4] items-center justify-center rounded-full bg-signal text-sm font-medium text-white transition-transform active:scale-[0.97]"
            >
              Book free consultation
            </Link>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
