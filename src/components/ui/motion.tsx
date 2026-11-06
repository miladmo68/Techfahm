"use client";

import { m, useInView, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { useRef, type ReactNode, type ComponentProps } from "react";
import { EASE, cn } from "@/lib/utils";

/** Masked line-by-line headline reveal. Pass lines as an array to control breaks. */
export function RevealLines({
  lines,
  as: Tag = "h2",
  className,
  delay = 0,
  immediate = false,
}: {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();
  const show = immediate || inView;
  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <m.span
            className="block"
            initial={reduce ? false : { y: "105%" }}
            animate={show ? { y: "0%" } : undefined}
            transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.09 }}
          >
            {line}
          </m.span>
        </span>
      ))}
    </Tag>
  );
}

/** Generic in-view reveal — used sparingly for supporting content. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </m.div>
  );
}

/** Image container that reveals with a clip-path wipe and drifts on scroll. */
export function ParallaxFrame({
  children,
  className,
  strength = 60,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-strength, strength]);
  return (
    <m.div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      initial={reduce ? false : { clipPath: "inset(12% 8% 12% 8% round 28px)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.2, ease: EASE }}
    >
      <m.div style={{ y }} className="absolute inset-[-12%_0]">
        {children}
      </m.div>
    </m.div>
  );
}

/** Words that fill in as the section scrolls past. */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, range, reduce ? [1, 1] : [0.16, 1]);
  return (
    <m.span style={{ opacity }} className="inline-block whitespace-pre">
      {children}{" "}
    </m.span>
  );
}

/** Thin progress bar at the top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return <m.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-signal" />;
}

/** Arrow link with an underline that draws in on hover/focus. */
export function TextLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link {...props} className={cn("group inline-flex items-center gap-2 font-medium", className)}>
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]">
        {children}
      </span>
      <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
        <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

/** Image wrapper that settles from a slight zoom when it scrolls into view (touch-friendly). */
export function ZoomIn({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={cn("absolute inset-0", className)}
      initial={reduce ? false : { scale: 1.18 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      {children}
    </m.div>
  );
}
