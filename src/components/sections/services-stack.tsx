"use client";

import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Photo } from "@/components/ui/photo";
import { RevealLines, TextLink } from "@/components/ui/motion";
import { services, type Service } from "@/content/services";

/**
 * Services as a stack of sticky panels: each new panel slides over the
 * previous one, which scales back and dims. On small screens the panels
 * simply follow each other.
 */
export function ServicesStack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="services" className="section bg-paper">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <RevealLines className="t-h2 md:col-span-7" lines={["Everything your IT needs,", "handled by one team."]} />
          <div className="md:col-span-5">
            <p className="muted t-lead">
              Pick a single service or hand us the whole stack. Either way, you get people who know your setup and
              answer for it.
            </p>
            <TextLink href="/services/" className="mt-4 text-signal">
              Compare all services
            </TextLink>
          </div>
        </div>

        <div ref={ref} className="mt-12 md:mt-20">
          {services.map((s, i) => (
            <Panel key={s.slug} s={s} i={i} total={services.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Panel({ s, i, total, progress }: { s: Service; i: number; total: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const still = reduce || !desktop;
  const start = i / total;
  const scale = useTransform(progress, [start, 1], still ? [1, 1] : [1, 1 - (total - i) * 0.025]);
  const dim = useTransform(progress, [start, start + 1 / total], still ? [0, 0] : [0, i === total - 1 ? 0 : 0.35]);

  return (
    <div className="mb-5 md:sticky md:mb-0 md:h-[78vh] md:pb-10" style={{ top: `calc(var(--header-h) + 1.5rem + ${i * 14}px)` }}>
      <m.article
        style={{ scale }}
        className="on-dark relative grid h-full origin-top overflow-hidden rounded-[1.75rem] bg-ink text-white shadow-[0_30px_80px_-40px_rgb(10_22_40/0.6)] md:grid-cols-2 md:rounded-[2.25rem]"
      >
        <div className="relative aspect-[16/10] md:order-2 md:aspect-auto">
          <Photo
            name={s.image}
            alt={s.imageAlt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent md:bg-gradient-to-r md:from-ink md:via-ink/20" />
        </div>
        <div className="relative flex flex-col justify-between gap-8 p-6 sm:p-8 md:p-12">
          <div className="flex items-center justify-between text-sm text-white/50">
            <span>
              Service {i + 1} of {total}
            </span>
          </div>
          <div>
            <h3 className="t-h2 text-white">{s.title}</h3>
            <p className="muted mt-4 max-w-md text-[1.05rem]">{s.short}</p>
            <ul className="mt-6 hidden space-y-2 text-[0.95rem] text-white/80 sm:block">
              {s.includes.slice(0, 3).map((x) => (
                <li key={x} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-signal" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href={`/services/${s.slug}/`}
            className="inline-flex w-fit items-center gap-3 rounded-full bg-white/10 py-2 pl-5 pr-2 text-sm font-medium backdrop-blur transition-colors hover:bg-signal"
          >
            Explore {s.title.toLowerCase()}
            <span className="grid size-8 place-items-center rounded-full bg-white text-ink">
              <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </div>
        <m.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-ink" />
      </m.article>
    </div>
  );
}
