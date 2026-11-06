"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { ParallaxFrame, Reveal, RevealLines, ScrubText, TextLink, ZoomIn } from "@/components/ui/motion";
import { Photo } from "@/components/ui/photo";
import { industries } from "@/content/industries";
import { site } from "@/content/site";
import { EASE, cn } from "@/lib/utils";

/* ───────── Scroll statement ───────── */
export function Statement() {
  return (
    <section className="section on-dark relative overflow-hidden">
      <div className="container-x">
        <ScrubText
          className="t-h2 mx-auto max-w-[22ch] text-center font-display !leading-[1.12] text-white sm:mx-0 sm:text-left"
          text="Most IT problems are small when they start. We find them early, fix them quietly, and keep the rest of your week free for actual work."
        />
        <div className="mt-14 grid gap-10 border-t border-white/10 pt-10 text-center sm:grid-cols-3 sm:gap-8 sm:pt-8 sm:text-left">
          {[
            { k: "6", v: "core IT services under one roof" },
            { k: "3", v: "Ontario regions served" },
            { k: "4", v: "technology partners, including Microsoft and Cisco" },
          ].map((s) => (
            <Reveal key={s.v}>
              <p className="font-display text-5xl font-semibold tracking-tight text-white md:text-6xl">{s.k}</p>
              <p className="muted mx-auto mt-2 max-w-[16rem] sm:mx-0">{s.v}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Why Techfahm ───────── */
const pillars = [
  {
    title: "Experience",
    body: "Our team has designed, installed and run IT systems for businesses across Ontario, including healthcare providers, manufacturers and distributors.",
  },
  {
    title: "Commitment",
    body: "We stay with you after setup. Monitoring, updates and support continue, with the same people who know your systems.",
  },
  {
    title: "Personalization",
    body: "No one-size-fits-all packages. We study how your business works and build IT around your goals and budget.",
  },
];

export function WhyUs() {
  return (
    <section className="section bg-paper">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-28">
            <RevealLines className="t-h2 text-center lg:text-left" lines={["A partner that knows", "your systems by name."]} />
            <p className="muted t-lead mx-auto mt-6 max-w-lg text-center lg:mx-0 lg:text-left">
              You work with a team that learns your setup, not a call centre reading from a script.
            </p>
            <ParallaxFrame className="mt-10 aspect-[4/3] rounded-[1.75rem]">
              <Photo name="hero" alt="A business owner smiling while working with Techfahm" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            </ParallaxFrame>
          </div>
        </div>
        <ol className="lg:col-span-6 lg:pt-40">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <li className="border-t border-ink/10 py-10 text-center first:border-t-0 lg:py-14 lg:text-left lg:first:border-t">
                <span aria-hidden className="mx-auto mb-5 block h-0.5 w-8 bg-signal lg:hidden" />
                <h3 className="t-h3 text-ink">{p.title}</h3>
                <p className="muted mx-auto mt-3 max-w-md text-[1.05rem] lg:mx-0">{p.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────── How getting started works (a real sequence) ───────── */
const steps = [
  { title: "Free consultation", body: "A conversation about your business, your current setup and what keeps going wrong." },
  { title: "Assessment", body: "We review your network, devices, software, security and backups, and document what we find." },
  { title: "Tailored plan", body: "You get a clear proposal: what we'll fix first, what we'll manage, and what it costs." },
  { title: "Ongoing management", body: "We monitor, maintain and support your systems, and check in as your needs change." },
];

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1]);

  return (
    <section className="section bg-mist">
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="text-center md:col-span-5 md:text-left">
          <RevealLines className="t-h2" lines={["Getting started", "takes four steps."]} />
          <p className="muted t-lead mx-auto mt-6 max-w-md md:mx-0">Nothing changes in your systems until you&apos;ve seen and approved the plan.</p>
        </div>
        <ol ref={ref} className="relative md:col-span-7">
          <div aria-hidden className="absolute bottom-3 left-[1.15rem] top-3 w-px bg-ink/10" />
          <m.div aria-hidden style={{ scaleY }} className="absolute bottom-3 left-[1.15rem] top-3 w-px origin-top bg-signal" />
          {steps.map((s, i) => (
            <li key={s.title} className="relative grid grid-cols-[2.3rem_1fr] gap-5 pb-12 last:pb-0">
              <span className="relative z-10 grid size-[2.3rem] place-items-center rounded-full border border-ink/15 bg-mist font-display text-sm font-semibold">
                {i + 1}
              </span>
              <Reveal>
                <h3 className="t-h3 pt-1">{s.title}</h3>
                <p className="muted mt-2 max-w-md">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────── Industries ───────── */
export function Industries() {
  return (
    <section className="section bg-paper">
      <div className="container-x">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:items-end md:text-left">
          <RevealLines className="t-h2" lines={["Built for sectors where", "downtime isn't an option."]} />
          <TextLink href="/industry/" className="text-signal">
            All industries
          </TextLink>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {industries.map((ind, i) => (
            <Reveal key={ind.slug} delay={i * 0.08}>
              <Link
                href={`/industry/${ind.slug}/`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-ink text-white sm:aspect-[5/4] md:aspect-[4/5] lg:aspect-[5/4]"
              >
                <ZoomIn>
                  <Photo
                    name={ind.image}
                    alt={ind.imageAlt}
                    fill
                    sizes="(min-width:768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.06]"
                  />
                </ZoomIn>
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <h3 className="t-h2 text-white">{ind.title}</h3>
                  <p className="mt-3 max-w-sm text-white/75">{ind.short}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                    <span className="h-px w-8 bg-signal transition-[width] duration-500 ease-out-expo group-hover:w-14" />
                    Learn more
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ ───────── */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section className="section bg-paper">
      <div className="container-x grid gap-10 md:grid-cols-12">
        <div className="text-center md:col-span-5 md:text-left">
          <RevealLines className="t-h2" lines={["Questions we", "hear most often."]} />
          <p className="muted mx-auto mt-6 max-w-sm md:mx-0">
            Something else on your mind? Call{" "}
            <a className="text-ink underline decoration-signal underline-offset-4" href={site.phoneHref}>
              {site.phone}
            </a>
            .
          </p>
        </div>
        <Accordion.Root type="single" collapsible className="md:col-span-7">
          {items.map((f) => (
            <Accordion.Item key={f.q} value={f.q} className="border-b border-ink/10">
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-left text-[1.1rem] font-medium md:text-xl">
                  {f.q}
                  <span aria-hidden className="relative grid size-9 shrink-0 place-items-center rounded-full border border-ink/15 transition-colors group-data-[state=open]:border-signal group-data-[state=open]:bg-signal group-data-[state=open]:text-white">
                    <span className="absolute h-px w-3.5 bg-current" />
                    <span className="absolute h-3.5 w-px bg-current transition-transform duration-300 group-data-[state=open]:rotate-90" />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[accordion-up_0.3s_ease] data-[state=open]:animate-[accordion-down_0.35s_cubic-bezier(0.22,1,0.36,1)]">
                <p className="muted max-w-xl pb-6 text-[1.02rem]">{f.a}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}

/* ───────── Final CTA ───────── */
export function Cta({ title = ["Let's make IT the part", "of your business you", "never think about."] }: { title?: string[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const radius = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [120, 0]);
  const inset = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["4%", "0%"]);

  return (
    <section ref={ref} className="bg-paper">
      <m.div
        style={{ borderTopLeftRadius: radius, borderTopRightRadius: radius, marginInline: inset }}
        className="on-dark grain relative overflow-hidden"
      >
        <div aria-hidden className="absolute inset-x-0 -bottom-1/2 mx-auto aspect-square w-[120%] max-w-[1400px] rounded-full bg-[radial-gradient(circle,rgb(228_28_56/0.28),transparent_60%)]" />
        <div className="container-x relative py-24 text-center md:py-36">
          <RevealLines className="t-h1 mx-auto max-w-4xl text-white" lines={title} />
          <Reveal delay={0.2}>
            <p className="muted t-lead mx-auto mt-6 max-w-xl">
              Book a free consultation. We&apos;ll look at your current setup and tell you honestly what we&apos;d change.
            </p>
            <div className="mx-auto mt-10 flex max-w-sm flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center">
              <Magnetic className="flex sm:inline-flex">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/contact/">Book a free consultation</Link>
                </Button>
              </Magnetic>
              <Button asChild size="lg" variant="outline" className="w-full text-white sm:w-auto">
                <a href={site.phoneHref}>Call {site.phone}</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </m.div>
    </section>
  );
}

/* ───────── Shared inner-page hero ───────── */
export function PageHero({
  crumbs,
  title,
  lead,
  image,
  imageAlt,
}: {
  crumbs: { label: string; href?: string }[];
  title: string[];
  lead: string;
  image?: string;
  imageAlt?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <section className="on-dark grain relative overflow-hidden pb-14 pt-[calc(var(--header-h)+3rem)] md:pb-20 md:pt-[calc(var(--header-h)+5rem)]">
      <div aria-hidden className="grid-lines absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div aria-hidden className="absolute -right-1/4 -top-1/3 aspect-square w-[70vw] rounded-full bg-[radial-gradient(circle,rgb(228_28_56/0.16),transparent_60%)]" />
      <div className="container-x relative">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center justify-center gap-2 text-sm text-white/55 lg:justify-start">
            <li>
              <Link href="/" className="hover:text-white">Home</Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                <span aria-hidden>/</span>
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">{c.label}</Link>
                ) : (
                  <span aria-current="page" className="text-white/85">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className={cn("mt-8 grid gap-10", image && "lg:grid-cols-12 lg:items-end")}>
          <div className={cn("text-center lg:text-left", image && "lg:col-span-7")}>
            <RevealLines as="h1" immediate className="t-h1 text-white" lines={title} />
            <m.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
              className="t-lead muted mx-auto mt-6 max-w-2xl lg:mx-0"
            >
              {lead}
            </m.p>
          </div>
          {image && (
            <m.div
              initial={reduce ? false : { clipPath: "inset(20% 0% 0% 0% round 28px)", opacity: 0 }}
              animate={{ clipPath: "inset(0% 0% 0% 0% round 28px)", opacity: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
              className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] lg:col-span-5"
            >
              <Photo name={image} alt={imageAlt ?? ""} fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            </m.div>
          )}
        </div>
      </div>
    </section>
  );
}
