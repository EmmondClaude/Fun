"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Minimal fixed header. Type is rare and deliberate: a small mono wordmark and
 * one spectrum dot — the only chrome. Fades in once, never competes with the
 * hero. Entrance only (Motion lane).
 */
export function SiteHeader() {
  const reduced = useReducedMotion();

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 sm:px-10"
      initial={reduced ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="flex items-center gap-2.5 text-[0.7rem] uppercase tracking-[0.4em] text-dark-ink">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-spectrum shadow-[0_0_12px_rgba(34,230,255,0.6)]"
        />
        Afterdark
      </span>
      <a
        href="#enter"
        className="text-[0.7rem] uppercase tracking-[0.4em] text-dark-muted transition-colors duration-500 ease-expo hover:text-dark-cyan focus-visible:text-dark-cyan"
      >
        Enter
      </a>
    </motion.header>
  );
}
