import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { site } from "@/content/site";
import { locations } from "@/content/locations";

const social = [
  { label: "LinkedIn", href: site.social.linkedin, d: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.98c0-1.19-.02-2.72-1.66-2.72-1.66 0-1.91 1.3-1.91 2.63V21h-4V9.75Z" },
  { label: "X (Twitter)", href: site.social.x, d: "M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.84-6.32L5.45 21H2.38l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.17h1.7L7.42 4.74H5.6l11.07 14.43Z" },
  { label: "Facebook", href: site.social.facebook, d: "M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.46A21 21 0 0 0 14.27 4.3c-2.3 0-3.87 1.4-3.87 3.98v2.22H7.8v3h2.6V21h3.1Z" },
];

export function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 pb-10 pt-14 md:grid-cols-12 md:gap-12 md:pb-12 md:pt-16">
        <div className="col-span-2 md:col-span-4">
          <Logo tone="light" />
          <p className="muted mt-5 max-w-xs text-[0.95rem]">
            Managed IT services for businesses across{" "}
            {locations.map((l, i) => (
              <span key={l.slug}>
                <Link href={`/${l.slug}/`} className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-signal">
                  {l.region === "Greater Toronto Area" ? "the Greater Toronto Area" : l.region === "Waterloo Region" ? "the Waterloo Region" : l.region}
                </Link>
                {i === locations.length - 2 ? " and " : i < locations.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
          <div className="mt-6 space-y-1.5 text-[0.95rem]">
            <a className="block hover:text-signal" href={site.phoneHref}>{site.phone}</a>
            <a className="block hover:text-signal" href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <ul className="mt-6 flex gap-2">
            {social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Techfahm on ${s.label}`}
                  className="grid size-11 place-items-center rounded-full border border-white/15 transition-colors hover:border-signal hover:bg-signal"
                >
                  <svg viewBox="0 0 24 24" className="size-[18px] fill-current" aria-hidden><path d={s.d} /></svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterCol title="Services" className="col-span-2 md:col-span-3" links={services.map((s) => ({ label: s.title, href: `/services/${s.slug}/` }))} />
        <FooterCol
          title="Industries"
          className="md:col-span-2"
          links={industries.map((s) => ({ label: s.title, href: `/industry/${s.slug}/` }))}
        />
        <FooterCol
          title="Company"
          className="md:col-span-3"
          links={[
            { label: "All services", href: "/services/" },
            { label: "Partners", href: "/partners/" },
            { label: "Our team", href: "/our-team/" },
            { label: "Contact", href: "/contact/" },
          ]}
        />
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-1.5 py-5 text-sm text-white/55 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Techfahm Systems Inc. All rights reserved.</p>
          <p>
            Designed &amp; developed by{" "}
            <a
              href="https://milink.ca"
              target="_blank"
              rel="noopener"
              className="font-medium text-white/80 underline decoration-signal/70 underline-offset-4 transition-colors hover:text-white"
            >
              Milink
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links, className }: { title: string; links: { label: string; href: string }[]; className?: string }) {
  return (
    <div className={className}>
      <h2 className="font-sans text-sm font-medium text-white/50">{title}</h2>
      <ul className="mt-3 space-y-0.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-block py-1.5 text-[0.95rem] transition-colors hover:text-signal">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
