"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/** Small cursor follower for mouse users. Grows over links and buttons. Hidden on touch. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest("a, button, [role=button], summary, input, textarea, label"));
    };
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
    };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <m.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        animate={{ width: hover ? 44 : 10, height: hover ? 44 : 10, scale: down ? 0.8 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
    </m.div>
  );
}
