"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const EXPO = [0.16, 1, 0.3, 1] as const;
const PRISM = "50,9 89,38 74,89 26,89 11,38";

/**
 * The opening. A void resolves to a single point of light; the prism mark draws
 * itself stroke-first, then fills; the spectrum line opens; the wordmark rises;
 * and the whole curtain lifts to hand off to the hero. Pure Motion (entrance
 * lane), played once on load.
 *
 * Reduced-motion skips it entirely — straight to content, no flash. Scroll is
 * locked for the ~2.5s it plays so the reveal lands on the top of the page.
 */
export function IntroTransition() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (reduced) {
      setShow(false);
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const t = window.setTimeout(() => setShow(false), 2500);
    return () => window.clearTimeout(t);
  }, [mounted, reduced]);

  useEffect(() => {
    if (!show) document.documentElement.style.overflow = "";
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-dark-void-1"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.05, ease: EXPO }}
        >
          {/* the void breathing from a soft center */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[62vmin] w-[62vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(34,230,255,0.18), rgba(139,92,246,0.10) 45%, transparent 72%)",
            }}
            initial={{ opacity: 0, scale: 0.35 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: EXPO, delay: 0.1 }}
          />

          {/* the prism, drawing itself */}
          <svg viewBox="0 0 100 100" className="relative h-28 w-28">
            <defs>
              <linearGradient
                id="intro-spectrum"
                x1="0"
                y1="50"
                x2="100"
                y2="50"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#22E6FF" />
                <stop offset="0.22" stopColor="#7FF0FF" />
                <stop offset="0.52" stopColor="#8B5CF6" />
                <stop offset="0.8" stopColor="#FF2E97" />
                <stop offset="1" stopColor="#C70E6E" />
              </linearGradient>
            </defs>
            <motion.polygon
              points={PRISM}
              fill="none"
              stroke="url(#intro-spectrum)"
              strokeWidth={1.4}
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 1.3, ease: EXPO, delay: 0.35 },
                opacity: { duration: 0.3, delay: 0.35 },
              }}
            />
            <motion.polygon
              points={PRISM}
              fill="url(#intro-spectrum)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.16 }}
              transition={{ duration: 1, delay: 1.25, ease: EXPO }}
            />
          </svg>

          {/* the spectrum, opening */}
          <motion.div
            className="mt-9 h-px w-56 origin-center bg-spectrum"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: EXPO }}
          />

          {/* the wordmark, rising */}
          <div className="mt-7 overflow-hidden">
            <motion.span
              className="block font-display text-2xl font-light tracking-[0.12em] text-dark-ink"
              initial={{ y: "115%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 1.45, ease: EXPO }}
            >
              Refracta
            </motion.span>
          </div>
          <motion.span
            className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.42em] text-dark-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.85, ease: EXPO }}
          >
            By Blaque Lyon
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
