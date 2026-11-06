import Link from "next/link";
import { Photo } from "@/components/ui/photo";
import { Reveal, RevealLines, ParallaxFrame } from "@/components/ui/motion";
import { services } from "@/content/services";

export function IntroBlock({ heading, paragraphs, aside }: { heading: string[]; paragraphs: string[]; aside?: React.ReactNode }) {
  return (
    <section className="section bg-paper">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RevealLines className="t-h2" lines={heading} />
          <Reveal className="prose-x muted t-lead mt-8">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </Reveal>
        </div>
        {aside && <div className="lg:col-span-5 lg:pt-4">{aside}</div>}
      </div>
    </section>
  );
}

export function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <Reveal className="rounded-[1.5rem] border border-ink/10 bg-white p-6 sm:p-8 lg:sticky lg:top-28">
      <h2 className="font-sans text-base font-semibold">{title}</h2>
      <ul className="mt-5 space-y-4">
        {items.map((x) => (
          <li key={x} className="flex gap-3.5 text-[1.02rem]">
            <svg viewBox="0 0 20 20" className="mt-1 size-[18px] shrink-0 text-signal" aria-hidden>
              <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {x}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function Benefits({ heading, items }: { heading: string[]; items: { title: string; body: string }[] }) {
  return (
    <section className="section on-dark relative overflow-hidden">
      <div className="container-x">
        <RevealLines className="t-h2 max-w-3xl text-white" lines={heading} />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[1.75rem] bg-white/10 md:grid-cols-3">
          {items.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08} className="bg-ink p-7 sm:p-9">
              <span aria-hidden className="block h-0.5 w-10 bg-signal" />
              <h3 className="t-h3 mt-8 text-white">{b.title}</h3>
              <p className="muted mt-3">{b.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RelatedServices({ slugs, title = "Related services" }: { slugs: string[]; title?: string }) {
  const list = services.filter((s) => slugs.includes(s.slug));
  return (
    <section className="section bg-mist">
      <div className="container-x">
        <h2 className="t-h2">{title}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}/`}
              className="group overflow-hidden rounded-[1.5rem] bg-white transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgb(10_22_40/0.45)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Photo
                  name={s.image}
                  alt={s.imageAlt}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="t-h3 group-hover:text-signal">{s.title}</h3>
                <p className="muted mt-2 text-[0.97rem]">{s.short}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WidePhoto({ name, alt }: { name: string; alt: string }) {
  return (
    <section className="bg-paper pb-[var(--section-y)]">
      <div className="container-x">
        <ParallaxFrame className="aspect-[4/3] rounded-[1.75rem] sm:aspect-[21/9]">
          <Photo name={name} alt={alt} fill sizes="100vw" className="object-cover" />
        </ParallaxFrame>
      </div>
    </section>
  );
}
