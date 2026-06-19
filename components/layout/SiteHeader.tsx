"use client";

import { motion } from "motion/react";
import { Logo } from "@/components/ui/Logo";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Minimal fixed header. Type is rare and deliberate: the living prism wordmark
 * and one link — the only chrome. Fades in once (after the intro), never
 * competes with the hero. Entrance only (Motion lane).
 */
export function SiteHeader() {
  const reduced = useReducedMotion();

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 sm:px-10"
      initial={reduced ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: reduced ? 0 : 3, ease: [0.16, 1, 0.3, 1] }}
    >
      <Logo />
      <a
        href="#enter"
        className="text-[0.7rem] uppercase tracking-[0.4em] text-dark-muted transition-colors duration-500 ease-expo hover:text-dark-cyan focus-visible:text-dark-cyan"
      >
        Enter
      </a>
    </motion.header>
  );
}
