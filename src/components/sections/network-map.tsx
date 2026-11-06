"use client";

import { useEffect, useRef } from "react";

/**
 * Animated network map: office nodes across three Ontario regions,
 * data packets travelling along links, and an occasional alert that
 * gets resolved. Pure canvas, pauses off-screen, static under reduced motion.
 */
type Node = { x: number; y: number; r: number; region: number; phase: number; hub?: boolean };
type Link = { a: number; b: number };
type Packet = { link: number; t: number; speed: number; dir: 1 | -1 };

export type AlertState = { region: number; stage: "alert" | "resolving" | "ok" };

// Region centres in a 0..1 space (roughly west → east: Waterloo, Hamilton, GTA)
const REGIONS = [
  { x: 0.2, y: 0.4, spread: 0.11, count: 9 }, // Waterloo Region
  { x: 0.42, y: 0.74, spread: 0.11, count: 9 }, // Hamilton & Niagara
  { x: 0.72, y: 0.38, spread: 0.17, count: 16 }, // Greater Toronto Area
];

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function build() {
  const rand = rng(7);
  const nodes: Node[] = [];
  REGIONS.forEach((reg, ri) => {
    nodes.push({ x: reg.x, y: reg.y, r: 4.5, region: ri, phase: rand() * 6, hub: true });
    for (let i = 0; i < reg.count; i++) {
      const a = rand() * Math.PI * 2;
      const d = Math.sqrt(rand()) * reg.spread;
      nodes.push({ x: reg.x + Math.cos(a) * d * 1.25, y: reg.y + Math.sin(a) * d, r: 1.6 + rand() * 1.6, region: ri, phase: rand() * 6 });
    }
  });
  const links: Link[] = [];
  const hubs = nodes.map((n, i) => (n.hub ? i : -1)).filter((i) => i >= 0);
  nodes.forEach((n, i) => {
    if (n.hub) return;
    links.push({ a: hubs[n.region], b: i });
    // connect to one nearby neighbour in same region
    let best = -1;
    let bd = 1e9;
    nodes.forEach((m, j) => {
      if (j === i || m.hub || m.region !== n.region) return;
      const d = (m.x - n.x) ** 2 + (m.y - n.y) ** 2;
      if (d < bd) {
        bd = d;
        best = j;
      }
    });
    if (best > i) links.push({ a: i, b: best });
  });
  // backbone between hubs
  links.push({ a: hubs[0], b: hubs[2] }, { a: hubs[1], b: hubs[2] }, { a: hubs[0], b: hubs[1] });
  return { nodes, links, hubs };
}

export function NetworkMap({ onAlert, className }: { onAlert?: (s: AlertState) => void; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cb = useRef(onAlert);
  useEffect(() => {
    cb.current = onAlert;
  }, [onAlert]);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { nodes, links, hubs } = build();
    const backbone = new Set(links.slice(-3).map((_, i) => links.length - 3 + i));
    const packets: Packet[] = [];
    const rand = rng(42);
    for (let i = 0; i < 26; i++) packets.push({ link: Math.floor(rand() * links.length), t: rand(), speed: 0.12 + rand() * 0.25, dir: rand() > 0.5 ? 1 : -1 });

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    const pointer = { x: -9999, y: -9999 };
    // Touch screens have no hover, so a soft spotlight drifts across the map instead
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let lastTouch = 0;

    // alert cycle
    let alertNode = -1;
    let alertStage: AlertState["stage"] = "ok";
    let alertTimer = 2.6;

    const P = (n: Node) => ({ x: n.x * w, y: n.y * h });

    function resize() {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw(0, 0);
    }

    function draw(time: number, dt: number) {
      ctx.clearRect(0, 0, w, h);
      if (!finePointer && time - lastTouch > 1800) {
        const t = time * 0.00022;
        pointer.x = w * (0.5 + 0.38 * Math.sin(t * 1.3));
        pointer.y = h * (0.52 + 0.3 * Math.sin(t * 2.1 + 1));
      }
      if (!finePointer && pointer.x > -1000) {
        const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 130);
        g.addColorStop(0, "rgba(228,28,56,0.14)");
        g.addColorStop(1, "rgba(228,28,56,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      const scale = Math.min(w, h) / 600;

      // links
      links.forEach((l, i) => {
        const a = P(nodes[l.a]);
        const b = P(nodes[l.b]);
        ctx.beginPath();
        if (backbone.has(i)) {
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2 - h * 0.08;
          ctx.moveTo(a.x, a.y);
          ctx.quadraticCurveTo(mx, my, b.x, b.y);
          ctx.strokeStyle = "rgba(169,182,204,0.28)";
          ctx.setLineDash([3, 6]);
          ctx.lineWidth = 1;
        } else {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = "rgba(169,182,204,0.14)";
          ctx.setLineDash([]);
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // packets
      packets.forEach((p) => {
        p.t += p.speed * dt * p.dir;
        if (p.t > 1 || p.t < 0) {
          p.link = Math.floor(Math.random() * links.length);
          p.t = p.dir === 1 ? 0 : 1;
        }
        const l = links[p.link];
        const a = P(nodes[l.a]);
        const b = P(nodes[l.b]);
        let x: number;
        let y: number;
        if (backbone.has(p.link)) {
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2 - h * 0.08;
          const t = p.t;
          x = (1 - t) ** 2 * a.x + 2 * (1 - t) * t * mx + t * t * b.x;
          y = (1 - t) ** 2 * a.y + 2 * (1 - t) * t * my + t * t * b.y;
        } else {
          x = a.x + (b.x - a.x) * p.t;
          y = a.y + (b.y - a.y) * p.t;
        }
        ctx.beginPath();
        ctx.arc(x, y, 1.6 * Math.max(scale, 0.8), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fill();
      });

      // nodes
      nodes.forEach((n, i) => {
        const { x, y } = P(n);
        const dist = Math.hypot(pointer.x - x, pointer.y - y);
        const near = Math.max(0, 1 - dist / (finePointer ? 160 : 120));
        const isAlert = i === alertNode && alertStage !== "ok";
        const pulse = (Math.sin(time * 0.0018 + n.phase) + 1) / 2;
        const r = n.r * Math.max(scale, 0.85) * (1 + near * 0.8);

        if (n.hub || isAlert) {
          const ringR = r * (2.4 + pulse * 2.2);
          ctx.beginPath();
          ctx.arc(x, y, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = isAlert
            ? `rgba(228,28,56,${0.65 - pulse * 0.45})`
            : `rgba(61,220,151,${0.45 - pulse * 0.35})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = isAlert
          ? alertStage === "resolving"
            ? "#f5a524"
            : "#e41c38"
          : n.hub
            ? "#3ddc97"
            : `rgba(${220 + near * 35},${230 + near * 25},255,${0.55 + near * 0.45})`;
        ctx.fill();
      });
    }

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      alertTimer -= dt;
      if (alertTimer <= 0) {
        if (alertStage === "ok") {
          const candidates = nodes.map((n, i) => (!n.hub ? i : -1)).filter((i) => i >= 0);
          alertNode = candidates[Math.floor(Math.random() * candidates.length)];
          alertStage = "alert";
          alertTimer = 1.8;
        } else if (alertStage === "alert") {
          alertStage = "resolving";
          alertTimer = 1.6;
        } else {
          alertStage = "ok";
          alertTimer = 4.5;
        }
        cb.current?.({ region: alertNode >= 0 ? nodes[alertNode].region : 0, stage: alertStage });
      }
      draw(now, dt);
      if (visible) raf = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce) {
        last = performance.now();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      if (e.pointerType !== "mouse") lastTouch = performance.now();
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    if (!reduce) raf = requestAnimationFrame(tick);
    void hubs;

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}

export const REGION_POS = REGIONS.map((r) => ({ x: r.x, y: r.y }));
