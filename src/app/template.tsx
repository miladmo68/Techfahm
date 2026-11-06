"use client";

import { m } from "motion/react";
import { useEffect } from "react";
import { EASE } from "@/lib/utils";

// The first page view animates with CSS (fast first paint);
// only later client-side navigations use this transition.
let navigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const animate = navigated;
  useEffect(() => {
    navigated = true;
  }, []);
  return (
    <m.div
      initial={animate ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      {children}
    </m.div>
  );
}
