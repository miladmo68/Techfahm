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

/** Full-colour brand marks, as shown on the original techfahm.com partners page */
export const partnerLogosColor = [
  {
    name: "Microsoft",
    node: (
      <span className="flex items-center gap-3">
        <svg viewBox="0 0 23 23" className="size-8" aria-hidden>
          <path fill="#f25022" d="M1 1h10v10H1z" />
          <path fill="#7fba00" d="M12 1h10v10H12z" />
          <path fill="#00a4ef" d="M1 12h10v10H1z" />
          <path fill="#ffb900" d="M12 12h10v10H12z" />
        </svg>
        <span className="font-sans text-[1.6rem] font-semibold tracking-tight text-[#737373]">Microsoft</span>
      </span>
    ),
  },
  { name: "Cisco", node: <span className="text-[#049fd9]"><Icon path={siCisco.path} label="Cisco" className="h-16" /></span> },
  {
    name: "Fortinet",
    node: (
      <span className="flex items-center gap-3 text-[#ee3124]">
        <Icon path={siFortinet.path} label="" className="h-7" />
        <span className="font-sans text-[1.6rem] font-bold tracking-tight">FORTINET</span>
      </span>
    ),
  },
  { name: "Acronis", node: <span className="font-sans text-[1.75rem] font-bold tracking-[-0.02em] text-[#0b5ea8]">Acronis</span> },
];

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
      <div className="container-x mb-6 flex flex-col items-center gap-1 text-center md:mb-8 md:flex-row md:items-baseline md:justify-between md:text-left">
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
