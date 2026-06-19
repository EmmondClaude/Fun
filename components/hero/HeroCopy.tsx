"use client";

import { motion } from "motion/react";
import { SpectrumBar } from "@/components/ui/SpectrumBar";

const HEADLINE = ["Refracted", "Dark"];

// Expo-out: nothing snaps, everything decelerates into place.
const EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Kinetic type overlay. Each headline line lives in an overflow mask and slides
 * up on the expo curve, staggered. The real text is always in the DOM (never
 * drawn into the canvas), so it is selectable, translatable and screen-readable.
 *
 * When `reduced` is true every reveal resolves instantly — the copy is simply
 * *there*, the still poster's words.
 */
export function HeroCopy({ reduced }: { reduced: boolean }) {
  const line = (text: string, index: number) => (
    <span key={text} className="block overflow-hidden">
      <motion.span
        className="block"
        initial={reduced ? false : { y: "110%" }}
        animate={{ y: "0%" }}
        transition={{
          duration: 1,
          delay: 0.15 + index * 0.12,
          ease: EXPO,
        }}
      >
        {text}
      </motion.span>
    </span>
  );

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-end px-6 pb-[14vh] text-center">
      {/* kicker — one line of mono meta, whispered */}
      <motion.p
        className="mb-6 text-[0.72rem] uppercase tracking-[0.42em] text-dark-muted"
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.05, ease: EXPO }}
      >
        Afterdark — one light, refracted
      </motion.p>

      {/* the wordmark — serif display, held large and quiet */}
      <h1 className="font-display text-[clamp(3.5rem,15vw,11rem)] font-light leading-[0.92] tracking-[-0.02em] text-dark-ink">
        {HEADLINE.map(line)}
      </h1>

      <div className="mt-9 flex w-full max-w-[22rem] flex-col items-center gap-7">
        <SpectrumBar reduced={reduced} />

        {/* CTA — cyan hover glow, the warmest point inviting the eye forward */}
        <motion.a
          href="#enter"
          className="group relative inline-flex items-center gap-3 rounded-full border border-dark-violet/40 px-7 py-3 text-[0.78rem] uppercase tracking-[0.28em] text-dark-ink transition-[box-shadow,border-color,transform] duration-500 ease-expo hover:-translate-y-0.5 hover:border-dark-cyan hover:shadow-[0_0_28px_rgba(34,230,255,0.45)] focus-visible:border-dark-cyan focus-visible:shadow-[0_0_28px_rgba(34,230,255,0.45)]"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EXPO }}
        >
          <span>Enter the dark</span>
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-dark-cyan transition-transform duration-500 ease-expo group-hover:translate-x-1"
          />
        </motion.a>
      </div>
    </div>
  );
}
