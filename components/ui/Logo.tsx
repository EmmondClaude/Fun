"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// The five-sided prism — the quiet Blaque mark.
const PRISM = "50,9 89,38 74,89 26,89 11,38";

/**
 * The wordmark: a slowly turning prism that catches light (continuous rotation +
 * a breathing glow halo) beside "Refracta", across which a spectral sheen sweeps.
 * The sheen is CSS (so it freezes under reduced-motion via the global rule); the
 * prism's loops are gated by the reduced flag.
 */
export function Logo() {
  const reduced = useReducedMotion();

  return (
    <span className="flex items-center gap-2.5">
      <span className="relative h-[18px] w-[18px]">
        {/* breathing glow halo */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-spectrum blur-[6px]"
          style={{ opacity: 0.4 }}
          animate={
            reduced
              ? undefined
              : { opacity: [0.3, 0.7, 0.3], scale: [0.85, 1.2, 0.85] }
          }
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* turning prism mark */}
        <motion.svg
          viewBox="0 0 100 100"
          className="relative h-full w-full"
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient id="logo-spectrum" x1="0" y1="50" x2="100" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#22E6FF" />
              <stop offset="0.22" stopColor="#7FF0FF" />
              <stop offset="0.52" stopColor="#8B5CF6" />
              <stop offset="0.8" stopColor="#FF2E97" />
              <stop offset="1" stopColor="#C70E6E" />
            </linearGradient>
          </defs>
          <polygon points={PRISM} fill="url(#logo-spectrum)" />
          <polygon
            points={PRISM}
            fill="#07060B"
            opacity="0.55"
            transform="translate(50 52) scale(0.5) translate(-50 -52)"
          />
        </motion.svg>
      </span>

      <span className="logo-wordmark text-[0.7rem] uppercase tracking-[0.4em]">
        Refracta
      </span>
    </span>
  );
}
