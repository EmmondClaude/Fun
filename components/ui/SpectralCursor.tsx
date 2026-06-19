"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * A soft spectral light that trails the pointer with weight (spring lag, never a
 * snap) — the page feeling aware of the visitor. Screen-blended so it only ever
 * adds light to the void. Suppressed under reduced-motion and on coarse/touch
 * pointers, where there is no cursor to honour.
 */
export function SpectralCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (reduced || window.matchMedia("(pointer: coarse)").matches) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 mix-blend-screen blur-2xl"
      style={{
        x: sx,
        y: sy,
        background:
          "radial-gradient(circle, rgba(34,230,255,0.5) 0%, rgba(139,92,246,0.28) 45%, rgba(255,46,151,0.12) 70%, transparent 100%)",
      }}
    />
  );
}
