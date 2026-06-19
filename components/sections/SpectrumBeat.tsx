"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

/**
 * A full-bleed beat between sections: the one true ramp drawn open as it crosses
 * the viewport (GSAP scrub) with one mono line beneath. Reduced-motion shows the
 * spectrum already full — the held note, not the strike.
 */
export function SpectrumBeat() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.set(".beat-bar", { scaleX: 0, transformOrigin: "left center" });
        gsap.to(".beat-bar", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            end: "center 55%",
            scrub: true,
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex flex-col items-center gap-6 px-6 py-28 sm:px-10"
    >
      <div className="beat-bar h-px w-full max-w-4xl bg-spectrum shadow-[0_0_24px_rgba(139,92,246,0.4)]" />
      <p className="text-center font-mono text-[0.72rem] uppercase tracking-[0.4em] text-dark-muted">
        Where the light is warmest — that is the point of focus
      </p>
    </section>
  );
}
