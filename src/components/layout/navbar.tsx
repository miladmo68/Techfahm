"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { site } from "@/content/site";
import { EASE, cn } from "@/lib/utils";

const menus = {
  Services: { href: "/services/", items: services.map((s) => ({ label: s.title, href: `/services/${s.slug}/`, desc: s.short })) },
  Industries: {
    href: "/industry/",
    items: industries.map((s) => ({ label: s.title, href: `/industry/${s.slug}/`, desc: s.short })),
  },
} as const;

const plain = [
  { label: "Partners", href: "/partners/" },
  { label: "Our team", href: "/our-team/" },
  { label: "Contact", href: "/contact/" },
];

/** Every page opens with a dark hero, so the bar starts light-on-dark until you scroll. */

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState<null | keyof typeof menus>(null);
  const [mobile, setMobile] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(v > 24);
    setHidden(v > 420 && v > prev && !mobile && !open);
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobile(false);
    setOpen(null);
  }, [pathname]);

  const onDark = !scrolled;

  return (
    <>
      <m.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE }}
        onMouseLeave={() => setOpen(null)}
      >
        <div
          className={cn(
            "transition-[background-color,box-shadow,backdrop-filter] duration-500",
            open
              ? "bg-white/95 shadow-[0_30px_60px_-30px_rgb(10_22_40/0.35)] backdrop-blur-xl"
              : scrolled
                ? "bg-white/80 shadow-[0_1px_0_rgb(10_22_40/0.08)] backdrop-blur-xl backdrop-saturate-150"
                : "bg-transparent",
          )}
        >
          <nav aria-label="Main" className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
            <Link href="/" aria-label="Techfahm home" className="relative z-10 shrink-0">
              <Logo eager tone={onDark && !open ? "light" : "dark"} />
            </Link>

            <ul className={cn("hidden items-center gap-1 lg:flex", onDark && !open ? "text-white" : "text-ink")}>
              {(Object.keys(menus) as (keyof typeof menus)[]).map((k) => (
                <li key={k} onMouseEnter={() => setOpen(k)}>
                  <button
                    type="button"
                    aria-expanded={open === k}
                    onClick={() => setOpen(open === k ? null : k)}
                    className={cn(
                      "flex h-10 items-center gap-1.5 rounded-full px-4 text-[0.95rem] font-medium transition-colors",
                      pathname.startsWith(menus[k].href) && "text-signal",
                    )}
                  >
                    {k}
                    <svg aria-hidden viewBox="0 0 12 12" className={cn("size-2.5 transition-transform duration-300", open === k && "rotate-180")}>
                      <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              ))}
              {plain.map((l) => (
                <li key={l.href} onMouseEnter={() => setOpen(null)}>
                  <Link
                    href={l.href}
                    className={cn(
                      "flex h-10 items-center rounded-full px-4 text-[0.95rem] font-medium transition-colors hover:text-signal",
                      pathname.startsWith(l.href) && "text-signal",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <Magnetic>
                  <Button asChild size="sm">
                    <Link href="/contact/">Free consultation</Link>
                  </Button>
                </Magnetic>
              </div>
              <button
                type="button"
                onClick={() => setMobile(true)}
                aria-label="Open menu"
                className={cn(
                  "grid size-11 place-items-center rounded-full lg:hidden",
                  onDark ? "bg-white/10 text-white" : "bg-ink/5 text-ink",
                )}
              >
                <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                  <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </nav>

          {/* Desktop mega menu */}
          <AnimatePresence>
            {open && (
              <m.div
                key={open}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="hidden overflow-hidden lg:block"
              >
                <div className="container-x grid grid-cols-[1fr_2.2fr] gap-10 pb-10 pt-4">
                  <div>
                    <p className="font-display text-3xl font-semibold tracking-tight text-ink">{open}</p>
                    <p className="muted mt-3 max-w-xs text-sm">
                      {open === "Services"
                        ? "Six services, one partner accountable for all of it."
                        : "IT shaped around how your sector actually works."}
                    </p>
                    <Link href={menus[open].href} className="mt-5 inline-block text-sm font-medium text-signal">
                      View all {open.toLowerCase()}
                    </Link>
                  </div>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {menus[open].items.map((it, i) => (
                      <m.li
                        key={it.href}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: EASE, delay: 0.05 + i * 0.03 }}
                      >
                        <Link href={it.href} className="group block rounded-2xl p-4 transition-colors hover:bg-mist">
                          <span className="block font-medium text-ink group-hover:text-signal">{it.label}</span>
                          <span className="muted mt-1 line-clamp-2 block text-sm leading-snug">{it.desc}</span>
                        </Link>
                      </m.li>
                    ))}
                  </ul>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </m.header>

      <MobileMenu open={mobile} onOpenChange={setMobile} />
    </>
  );
}

function MobileMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [sub, setSub] = useState<null | keyof typeof menus>(null);
  const links: { label: string; href: string; sub?: keyof typeof menus }[] = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/", sub: "Services" as const },
    { label: "Industries", href: "/industry/", sub: "Industries" as const },
    ...plain,
  ];
  return (
    <Dialog.Root open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setSub(null); }}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Content forceMount aria-describedby={undefined} className="fixed inset-0 z-[60] outline-none">
              <m.div
                className="on-dark grain absolute inset-0 flex flex-col overflow-y-auto"
                initial={{ clipPath: "circle(0% at calc(100% - 44px) 34px)" }}
                animate={{ clipPath: "circle(150% at calc(100% - 44px) 34px)" }}
                exit={{ clipPath: "circle(0% at calc(100% - 44px) 34px)" }}
                transition={{ duration: 0.7, ease: EASE }}
                style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <div className="container-x flex h-[var(--header-h)] shrink-0 items-center justify-between">
                  <Link href="/" onClick={() => onOpenChange(false)} aria-label="Techfahm home">
                    <Logo tone="light" />
                  </Link>
                  <Dialog.Close aria-label="Close menu" className="grid size-11 place-items-center rounded-full bg-white/10">
                    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </Dialog.Close>
                </div>

                <nav aria-label="Mobile" className="container-x flex-1 pt-6">
                  <ul>
                    {links.map((l, i) => (
                      <m.li
                        key={l.href}
                        className="border-b border-white/10"
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE, delay: 0.18 + i * 0.05 }}
                      >
                        {l.sub ? (
                          <>
                            <button
                              type="button"
                              aria-expanded={sub === l.sub}
                              onClick={() => setSub(sub === l.sub ? null : l.sub!)}
                              className="flex w-full items-center justify-between py-4 text-left font-display text-[2rem] font-semibold tracking-tight"
                            >
                              {l.label}
                              <span aria-hidden className={cn("text-2xl text-signal transition-transform duration-300", sub === l.sub && "rotate-45")}>+</span>
                            </button>
                            <AnimatePresence initial={false}>
                              {sub === l.sub && (
                                <m.ul
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.4, ease: EASE }}
                                  className="overflow-hidden"
                                >
                                  <li>
                                    <Link href={l.href} onClick={() => onOpenChange(false)} className="block py-2.5 text-base text-signal">
                                      All {l.label.toLowerCase()}
                                    </Link>
                                  </li>
                                  {menus[l.sub].items.map((it) => (
                                    <li key={it.href}>
                                      <Link href={it.href} onClick={() => onOpenChange(false)} className="block py-2.5 text-base text-white/80">
                                        {it.label}
                                      </Link>
                                    </li>
                                  ))}
                                  <li className="h-3" />
                                </m.ul>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <Link
                            href={l.href}
                            onClick={() => onOpenChange(false)}
                            className="block py-4 font-display text-[2rem] font-semibold tracking-tight"
                          >
                            {l.label}
                          </Link>
                        )}
                      </m.li>
                    ))}
                  </ul>
                </nav>

                <m.div
                  className="container-x shrink-0 space-y-4 py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.6 }}
                >
                  <Button asChild size="lg" className="w-full">
                    <Link href="/contact/" onClick={() => onOpenChange(false)}>
                      Book a free consultation
                    </Link>
                  </Button>
                  <div className="flex flex-wrap justify-between gap-3 text-sm text-white/70">
                    <a href={site.phoneHref}>{site.phone}</a>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </div>
                </m.div>
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
