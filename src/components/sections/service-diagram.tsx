"use client";

import { m, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * One small animated diagram per service, drawn in the same visual language
 * as the hero network map (navy, thin lines, green = healthy, red = issue).
 * Loops only while on screen; static under reduced motion.
 */
const C = {
  line: "rgba(169,182,204,0.28)",
  dim: "rgba(169,182,204,0.6)",
  text: "rgba(255,255,255,0.72)",
  white: "#ffffff",
  green: "#3ddc97",
  red: "#e41c38",
  amber: "#f5a524",
};

function Frame({ children, caption }: { children: (play: boolean) => ReactNode; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const play = inView && !reduce;
  return (
    <figure ref={ref} className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-deep/60">
      <div aria-hidden className="grid-lines absolute inset-0 opacity-60" />
      <svg viewBox="0 0 400 260" className="relative block h-auto w-full" role="img" aria-label={caption}>
        {children(play)}
      </svg>
      <figcaption className="relative border-t border-white/10 px-5 py-3 text-sm text-white/60">{caption}</figcaption>
    </figure>
  );
}

const loop = (duration: number, delay = 0) => ({ duration, delay, repeat: Infinity, ease: "linear" as const });

/* Network management: hub + devices, packets, uptime bars */
function Network() {
  const devices = [
    [70, 60],
    [70, 200],
    [200, 34],
    [330, 60],
    [330, 200],
    [200, 226],
  ];
  return (
    <Frame caption="We watch every device and link, and see problems early.">
      {(play) => (
        <>
          {devices.map(([x, y], i) => (
            <g key={i}>
              <line x1={200} y1={130} x2={x} y2={y} stroke={C.line} />
              {play && (
                <m.circle
                  r={2.6}
                  fill={C.white}
                  initial={{ cx: 200, cy: 130, opacity: 0 }}
                  animate={{ cx: [200, x], cy: [130, y], opacity: [0, 1, 1, 0] }}
                  transition={loop(2.2, i * 0.35)}
                />
              )}
              <circle cx={x} cy={y} r={7} fill="#10213f" stroke={i === 4 ? C.amber : C.dim} />
              <circle cx={x} cy={y} r={2.5} fill={i === 4 ? C.amber : C.green} />
            </g>
          ))}
          <m.circle
            cx={200}
            cy={130}
            r={26}
            fill="none"
            stroke={C.green}
            strokeOpacity={0.5}
            animate={play ? { r: [22, 34], strokeOpacity: [0.5, 0] } : undefined}
            transition={loop(2)}
          />
          <rect x={182} y={114} width={36} height={32} rx={8} fill="#10213f" stroke={C.green} />
          <path d="M190 124h20M190 130h20M190 136h20" stroke={C.green} strokeWidth={1.5} />
          {Array.from({ length: 12 }).map((_, i) => (
            <m.rect
              key={i}
              x={276 + i * 9}
              width={5}
              rx={1.5}
              fill={i === 8 ? C.amber : C.green}
              fillOpacity={0.75}
              initial={{ y: 250 - 14, height: 14 }}
              animate={play ? { height: [10, 18 + ((i * 7) % 12), 10], y: [240, 232 - ((i * 7) % 12), 240] } : undefined}
              transition={{ duration: 2.4, delay: i * 0.12, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <text x={276} y={226} fontSize={10} fill={C.text}>
            Uptime
          </text>
        </>
      )}
    </Frame>
  );
}

/* Managed IT support: tickets move New → In progress → Resolved */
function Support() {
  const cols = [
    { x: 30, label: "New" },
    { x: 150, label: "In progress" },
    { x: 270, label: "Resolved" },
  ];
  return (
    <Frame caption="Requests are picked up, worked on and closed by one team.">
      {(play) => (
        <>
          {cols.map((c) => (
            <g key={c.label}>
              <rect x={c.x} y={34} width={100} height={196} rx={12} fill="rgba(255,255,255,0.03)" stroke={C.line} />
              <text x={c.x + 12} y={56} fontSize={11} fill={C.text}>
                {c.label}
              </text>
            </g>
          ))}
          {[0, 1, 2].map((i) => (
            <m.g
              key={i}
              initial={{ x: 0, opacity: 1 }}
              animate={play ? { x: [0, 0, 120, 120, 240, 240], opacity: [0, 1, 1, 1, 1, 0] } : undefined}
              transition={{ duration: 6, delay: i * 2, repeat: Infinity, ease: [0.22, 1, 0.36, 1], times: [0, 0.08, 0.35, 0.55, 0.8, 1] }}
            >
              <rect x={40} y={72 + i * 50} width={80} height={36} rx={8} fill="#10213f" stroke={C.dim} />
              <rect x={50} y={82 + i * 50} width={40} height={4} rx={2} fill={C.white} fillOpacity={0.7} />
              <rect x={50} y={92 + i * 50} width={56} height={4} rx={2} fill={C.white} fillOpacity={0.3} />
              <circle cx={110} cy={84 + i * 50} r={3} fill={i === 1 ? C.amber : C.red} />
            </m.g>
          ))}
          <circle cx={360} cy={56} r={6} fill={C.green} fillOpacity={0.2} />
          <path d="M357 56l2 2 4-4" stroke={C.green} strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </>
      )}
    </Frame>
  );
}

/* Cloud computing: devices sync with the cloud */
function Cloud() {
  const devices = [
    { x: 70, label: "Office" },
    { x: 200, label: "Laptop" },
    { x: 330, label: "Phone" },
  ];
  return (
    <Frame caption="Files, apps and data stay in sync on every device.">
      {(play) => (
        <>
          <path
            d="M150 92a34 34 0 0 1 62-22 28 28 0 0 1 50 14 24 24 0 0 1-4 48H152a26 26 0 0 1-2-40Z"
            fill="#10213f"
            stroke={C.dim}
          />
          <m.path
            d="M150 92a34 34 0 0 1 62-22 28 28 0 0 1 50 14 24 24 0 0 1-4 48H152a26 26 0 0 1-2-40Z"
            fill="none"
            stroke={C.green}
            strokeWidth={1.5}
            initial={{ pathLength: 1 }}
            animate={play ? { pathLength: [0, 1], opacity: [1, 0] } : undefined}
            transition={loop(3)}
          />
          {devices.map((d, i) => (
            <g key={d.label}>
              <line x1={d.x} y1={190} x2={205} y2={132} stroke={C.line} strokeDasharray="3 5" />
              {play && (
                <>
                  <m.circle
                    r={2.6}
                    fill={C.white}
                    animate={{ cx: [d.x, 205], cy: [190, 132], opacity: [0, 1, 0] }}
                    transition={loop(1.8, i * 0.6)}
                  />
                  <m.circle
                    r={2.6}
                    fill={C.green}
                    animate={{ cx: [205, d.x], cy: [132, 190], opacity: [0, 1, 0] }}
                    transition={loop(1.8, 0.9 + i * 0.6)}
                  />
                </>
              )}
              <rect x={d.x - 26} y={190} width={52} height={34} rx={7} fill="#10213f" stroke={C.dim} />
              <text x={d.x} y={244} fontSize={10} fill={C.text} textAnchor="middle">
                {d.label}
              </text>
            </g>
          ))}
        </>
      )}
    </Frame>
  );
}

/* Cybersecurity: layered rings stop incoming threats */
function Security() {
  const threats = [
    [20, 40],
    [380, 70],
    [30, 230],
    [370, 220],
  ];
  return (
    <Frame caption="Layered protection stops threats before they reach your data.">
      {(play) => (
        <>
          {[96, 70, 46].map((r, i) => (
            <m.circle
              key={r}
              cx={200}
              cy={130}
              r={r}
              fill="none"
              stroke={i === 0 ? C.dim : C.line}
              strokeDasharray={i === 0 ? "6 8" : "2 6"}
              animate={play ? { rotate: i % 2 ? -360 : 360 } : undefined}
              transition={loop(30 - i * 6)}
            />
          ))}
          <rect x={186} y={124} width={28} height={24} rx={5} fill="#10213f" stroke={C.green} />
          <path d="M192 124v-6a8 8 0 0 1 16 0v6" fill="none" stroke={C.green} strokeWidth={1.6} />
          {threats.map(([x, y], i) => {
            const dx = x - 200;
            const dy = y - 130;
            const len = Math.hypot(dx, dy);
            const ex = 200 + (dx / len) * 98;
            const ey = 130 + (dy / len) * 98;
            return (
              <g key={i}>
                {play && (
                  <>
                    <m.circle
                      r={3.5}
                      fill={C.red}
                      animate={{ cx: [x, ex], cy: [y, ey], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 2.2, delay: i * 0.8, repeat: Infinity, ease: "easeIn", times: [0, 0.2, 0.92, 1] }}
                    />
                    <m.circle
                      cx={ex}
                      cy={ey}
                      fill="none"
                      stroke={C.red}
                      animate={{ r: [2, 14], strokeOpacity: [0.8, 0] }}
                      transition={{ duration: 0.6, delay: 2 + i * 0.8, repeat: Infinity, repeatDelay: 1.6 }}
                    />
                  </>
                )}
              </g>
            );
          })}
        </>
      )}
    </Frame>
  );
}

/* Backup & disaster recovery: snapshots on a timeline, then a restore */
function Backup() {
  const snaps = [60, 115, 170, 225, 280, 335];
  return (
    <Frame caption="Regular snapshots, and a tested path back when something breaks.">
      {(play) => (
        <>
          <line x1={40} y1={120} x2={360} y2={120} stroke={C.line} />
          {snaps.map((x, i) => (
            <g key={x}>
              <m.circle
                cx={x}
                cy={120}
                r={6}
                fill="#10213f"
                stroke={C.green}
                initial={{ opacity: 1 }}
                animate={play ? { opacity: [0.2, 1, 1] } : undefined}
                transition={{ duration: 6, delay: i * 0.5, repeat: Infinity, times: [0, 0.08, 1] }}
              />
              <circle cx={x} cy={120} r={2.2} fill={C.green} />
              <text x={x} y={146} fontSize={9} fill={C.text} textAnchor="middle">
                {`${String(i * 4).padStart(2, "0")}:00`}
              </text>
            </g>
          ))}
          <m.path
            d="M335 96 C 300 50, 210 50, 170 96"
            fill="none"
            stroke={C.green}
            strokeWidth={1.6}
            strokeDasharray="4 5"
            initial={{ pathLength: 1 }}
            animate={play ? { pathLength: [0, 1, 1], opacity: [0, 1, 0] } : undefined}
            transition={{ duration: 6, delay: 3, repeat: Infinity, times: [0, 0.3, 1] }}
          />
          <m.g animate={play ? { opacity: [0, 1, 1, 0] } : undefined} transition={{ duration: 6, delay: 3, repeat: Infinity, times: [0, 0.1, 0.8, 1] }}>
            <rect x={140} y={186} width={120} height={34} rx={17} fill="rgba(61,220,151,0.12)" stroke={C.green} strokeOpacity={0.5} />
            <text x={200} y={207} fontSize={11} fill={C.green} textAnchor="middle">
              Restored
            </text>
          </m.g>
          <m.circle
            cx={335}
            cy={120}
            r={10}
            fill="none"
            stroke={C.red}
            animate={play ? { r: [6, 18], strokeOpacity: [0.9, 0] } : undefined}
            transition={{ duration: 1.2, delay: 2.4, repeat: Infinity, repeatDelay: 4.8 }}
          />
        </>
      )}
    </Frame>
  );
}

/* IT consulting: roadmap milestones light up in order */
function Consulting() {
  const steps = [
    { x: 50, y: 190, label: "Assess" },
    { x: 150, y: 140, label: "Plan" },
    { x: 250, y: 160, label: "Implement" },
    { x: 350, y: 80, label: "Grow" },
  ];
  const d = "M50 190 C 90 190, 110 140, 150 140 S 210 160, 250 160 S 320 80, 350 80";
  return (
    <Frame caption="A roadmap that lines technology up with where the business is going.">
      {(play) => (
        <>
          <path d={d} fill="none" stroke={C.line} strokeWidth={2} />
          <m.path
            d={d}
            fill="none"
            stroke={C.green}
            strokeWidth={2}
            initial={{ pathLength: 1 }}
            animate={play ? { pathLength: [0, 1, 1] } : undefined}
            transition={{ duration: 5, repeat: Infinity, times: [0, 0.75, 1], ease: "easeInOut" }}
          />
          {steps.map((s, i) => (
            <g key={s.label}>
              <m.circle
                cx={s.x}
                cy={s.y}
                r={9}
                fill="#10213f"
                stroke={C.green}
                initial={{ strokeOpacity: 1 }}
                animate={play ? { strokeOpacity: [0.25, 0.25, 1, 1] } : undefined}
                transition={{ duration: 5, repeat: Infinity, times: [0, (i * 0.75) / 3 - 0.01 < 0 ? 0 : (i * 0.75) / 3 - 0.01, (i * 0.75) / 3 + 0.01, 1] }}
              />
              <circle cx={s.x} cy={s.y} r={3} fill={C.green} />
              <text x={s.x} y={s.y - 18} fontSize={11} fill={C.text} textAnchor="middle">
                {s.label}
              </text>
            </g>
          ))}
        </>
      )}
    </Frame>
  );
}

const map: Record<string, () => ReactNode> = {
  "network-management": Network,
  "managed-it-support": Support,
  "cloud-computing": Cloud,
  cybersecurity: Security,
  "backup-and-disaster-recovery": Backup,
  "it-consulting": Consulting,
};

export function ServiceDiagram({ slug }: { slug: string }) {
  const D = map[slug];
  return D ? <D /> : null;
}
