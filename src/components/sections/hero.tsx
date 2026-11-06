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
        className="absolute -right-[20%] top-[-10%] -z-10 aspect-square w-[90vw] max-w-[1100px] rounded-full bg-[radial-gradient(circle,rgb(228_28_56/0.18),transparent_60%)]"
      />

      {/* Map */}
      <m.div
        style={{ y: mapY, opacity: mapOpacity }}
        className="absolute inset-x-0 top-[calc(var(--header-h)+0.5rem)] h-[46svh] md:h-[54svh] max-lg:[@media(max-height:740px)]:h-[34svh] lg:inset-y-0 lg:left-[44%] lg:right-0 lg:top-0 lg:h-auto"
      >
        <div className="tf-fade-scale relative h-full w-full" style={{ "--d": "0.2s" } as React.CSSProperties}>
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
      <div className="container-x relative mt-auto pb-10 pt-[50svh] text-center md:pt-[58svh] max-lg:[@media(max-height:740px)]:pt-[38svh] lg:my-auto lg:pb-0 lg:pt-[var(--header-h)] lg:text-left">
        {/* Mobile / tablet version of the status panel */}
        <MobileStatus alert={alert} />
        <div className="mx-auto max-w-[40rem] lg:mx-0 lg:max-w-[52rem]">
          <RevealLines
            as="h1"
            immediate
            delay={0.15}
            className="t-hero text-white"
            lines={["IT that keeps", "your business", "running."]}
          />
          <p className="tf-fade-up t-lead muted mx-auto mt-6 max-w-[34rem] lg:mx-0" style={{ "--d": "0.55s" } as React.CSSProperties}>
            Techfahm is a managed IT partner for businesses across the GTA, Hamilton and Waterloo. We monitor, secure
            and support your systems, so your team can focus on its work.
          </p>
          <div style={{ "--d": "0.7s" } as React.CSSProperties} className="tf-fade-up mx-auto mt-8 flex max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center lg:justify-start">
            <Magnetic className="flex sm:inline-flex">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/contact/">Book a free consultation</Link>
              </Button>
            </Magnetic>
            <Button asChild size="lg" variant="outline" className="w-full text-white sm:w-auto">
              <Link href="/services/">See our services</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Status panel (illustrative) */}
      <aside aria-label="Illustration of network monitoring" style={{ "--d": "1.1s" } as React.CSSProperties} className="tf-fade-up absolute bottom-8 right-[var(--gutter)] hidden w-[19rem] rounded-2xl border border-white/10 bg-deep/70 p-4 backdrop-blur-xl lg:block">
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
      </aside>

      <p className="sr-only">Serving {site.regions.join(", ")}.</p>
    </section>
  );
}

function MobileStatus({ alert }: { alert: AlertState }) {
  const st = alert.stage;
  const label =
    st === "ok" ? "All regions healthy" : st === "alert" ? `Issue found · ${REGION_NAMES[alert.region]}` : `Resolving · ${REGION_NAMES[alert.region]}`;
  return (
    <div className="mb-6 flex justify-center lg:hidden" aria-hidden>
      <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-deep/70 py-2 pl-3 pr-4 text-xs backdrop-blur-xl sm:text-sm">
        <span className="relative flex size-2">
          <span
            className={cn(
              "absolute inset-0 animate-ping rounded-full opacity-60",
              st === "ok" ? "bg-pulse" : st === "alert" ? "bg-signal" : "bg-amber-400",
            )}
          />
          <span className={cn("relative size-2 rounded-full", st === "ok" ? "bg-pulse" : st === "alert" ? "bg-signal" : "bg-amber-400")} />
        </span>
        <span className="font-medium text-white/85">Network status</span>
        <span className="h-3 w-px bg-white/15" />
        <AnimatePresence mode="wait">
          <m.span
            key={label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="text-white/60"
          >
            {label}
          </m.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
