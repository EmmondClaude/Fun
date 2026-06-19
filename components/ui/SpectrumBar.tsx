"use client";

import { motion } from "motion/react";

/**
 * The spectrum, drawn open. The only information system that matters: a single
 * thin line of the one true ramp. When motion is allowed it scales in from the
 * left on the expo curve; reduced-motion renders it already full.
 */
export function SpectrumBar({ reduced }: { reduced: boolean }) {
  return (
    <div
      className="h-px w-full max-w-[22rem] origin-left overflow-hidden"
      role="presentation"
    >
      <motion.div
        className="h-full w-full bg-spectrum"
        initial={reduced ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 1.1,
          delay: 0.5,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ originX: 0 }}
      />
    </div>
  );
}
