"use client";

import { AnimatePresence, m, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { RevealLines } from "@/components/ui/motion";
import { site } from "@/content/site";
import { EASE, cn } from "@/lib/utils";
import { NetworkMap, REGION_POS, type AlertState } from "./network-map";

const REGION_NAMES = ["Waterloo Region", "Hamilton & Niagara", "Greater Toronto Area"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [alert, setAlert] = useState<AlertState>({ region: 0, stage: "ok" });
  const onAlert = useCallback((s: AlertState) => setAlert(s), []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mapY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 140]);
  const mapOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <section ref={ref} className="on-dark grain relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_70%_40%,black_20%,transparent_75%)]" />
      <div
        aria-hidden
        className="absolute -right-[20%] top-[-10%] -z-10 aspect-square w-[90vw] max-w-[1100px] rounded-full bg-[radial-gradient(circle,rgb(227_38_47/0.18),transparent_60%)]"
      />

      {/* Map */}
      <m.div
        style={{ y: mapY, opacity: mapOpacity }}
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
        className="absolute inset-x-0 top-[calc(var(--header-h)+0.5rem)] h-[46svh] md:h-[54svh] lg:inset-y-0 lg:left-[44%] lg:right-0 lg:top-0 lg:h-auto"
      >
        <div className="relative h-full w-full">
          <NetworkMap onAlert={onAlert} className="absolute inset-0 h-full w-full" />
          {REGION_POS.map((p, i) => (
            <span
              key={i}
              className={cn(
                "absolute -translate-x-1/2 translate-y-5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.72rem] font-medium backdrop-blur transition-colors duration-500 sm:text-xs",
                alert.stage !== "ok" && alert.region === i ? "bg-signal/20 text-white" : "bg-white/5 text-white/70",
              )}
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
            >
              {REGION_NAMES[i]}
            </span>
          ))}
        </div>
      </m.div>

      {/* Copy */}
      <div className="container-x relative mt-auto pb-10 pt-[54svh] md:pt-[60svh] lg:my-auto lg:pb-0 lg:pt-[var(--header-h)]">
        <div className="max-w-[40rem] lg:max-w-[52rem]">
          <RevealLines
            as="h1"
            immediate
            delay={0.15}
            className="t-hero text-white"
            lines={["IT that keeps", "your business", "running."]}
          />
          <m.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
            className="t-lead muted mt-6 max-w-[34rem]"
          >
            Techfahm is a managed IT partner for businesses across the GTA, Hamilton and Waterloo. We monitor, secure
            and support your systems, so your team can focus on its work.
          </m.p>
          <m.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Button asChild size="lg">
                <Link href="/contact/">Book a free consultation</Link>
              </Button>
            </Magnetic>
            <Button asChild size="lg" variant="outline" className="text-white">
              <Link href="/services/">See our services</Link>
            </Button>
          </m.div>
        </div>
      </div>

      {/* Status panel (illustrative) */}
      <m.aside
        aria-label="Illustration of network monitoring"
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 1.1 }}
        className="absolute bottom-8 right-[var(--gutter)] hidden w-[19rem] rounded-2xl border border-white/10 bg-deep/70 p-4 backdrop-blur-xl lg:block"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Network status</span>
          <span className="font-mono text-xs text-white/50">live view</span>
        </div>
        <ul className="mt-3 space-y-2 text-sm">
          {REGION_NAMES.slice()
            .reverse()
            .map((name) => {
              const i = REGION_NAMES.indexOf(name);
              const st = alert.region === i ? alert.stage : "ok";
              return (
                <li key={name} className="flex items-center justify-between">
                  <span className="text-white/80">{name}</span>
                  <span className="flex items-center gap-2 text-xs">
                    <span
                      className={cn(
                        "size-2 rounded-full transition-colors",
                        st === "ok" ? "bg-pulse" : st === "alert" ? "bg-signal" : "bg-amber-400",
                      )}
                    />
                    <AnimatePresence mode="wait">
                      <m.span
                        key={st}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.25 }}
                        className="w-20 text-right text-white/60"
                      >
                        {st === "ok" ? "Healthy" : st === "alert" ? "Issue found" : "Resolving"}
                      </m.span>
                    </AnimatePresence>
                  </span>
                </li>
              );
            })}
        </ul>
        <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-white/45">
          An illustration of how we watch client networks and act on issues early.
        </p>
      </m.aside>

      <p className="sr-only">Serving {site.regions.join(", ")}.</p>
    </section>
  );
}
