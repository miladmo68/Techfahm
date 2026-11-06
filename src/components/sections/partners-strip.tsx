import { siCisco, siFortinet } from "simple-icons";
import { cn } from "@/lib/utils";

function Microsoft({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 23 23" className="size-6" aria-hidden>
        <path fill="currentColor" d="M1 1h10v10H1zM12 1h10v10H12zM1 12h10v10H1zM12 12h10v10H12z" />
      </svg>
      <span className="font-sans text-[1.35rem] font-semibold tracking-tight">Microsoft</span>
    </span>
  );
}
function Icon({ path, label, className }: { path: string; label: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" role={label ? "img" : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true} className={cn("h-9 w-auto", className)}>
      <path fill="currentColor" d={path} />
    </svg>
  );
}
function Acronis() {
  return <span className="font-sans text-[1.5rem] font-bold tracking-[-0.02em]">Acronis</span>;
}

export const partnerLogos = [
  { name: "Microsoft", node: <Microsoft /> },
  { name: "Cisco", node: <Icon path={siCisco.path} label="Cisco" className="h-14" /> },
  {
    name: "Fortinet",
    node: (
      <span className="flex items-center gap-2.5">
        <Icon path={siFortinet.path} label="" className="h-6" />
        <span className="font-sans text-[1.35rem] font-semibold tracking-tight">Fortinet</span>
      </span>
    ),
  },
  { name: "Acronis", node: <Acronis /> },
];

/** Infinite marquee of technology partners. */
export function PartnersStrip() {
  const row = [...partnerLogos, ...partnerLogos, ...partnerLogos];
  return (
    <section aria-label="Technology partners" className="border-b border-ink/5 bg-paper py-10 md:py-14">
      <div className="container-x mb-6 flex flex-col gap-1 md:mb-8 md:flex-row md:items-baseline md:justify-between">
        <p className="font-medium text-ink">We work with the platforms you already rely on</p>
        <p className="muted text-sm">Technology partners</p>
      </div>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <ul className="flex w-max animate-marquee items-center gap-16 text-ink/60 group-hover:[animation-play-state:paused] md:gap-24">
          {[...row, ...row].map((p, i) => (
            <li key={i} aria-hidden={i >= partnerLogos.length} className="shrink-0 transition-colors hover:text-ink">
              {p.node}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
