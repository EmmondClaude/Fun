"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

const LINE =
  "One light source, refracted. Every glow, every edge, every shift of hue is the same beam — revealing another of its faces.";

/**
 * The statement. Words sit dim in the void and warm to full ink as the section
 * scrolls through center — the light reaching each word in turn (GSAP scrub,
 * the scroll-beat lane). Reduced-motion keeps every word lit from the start; the
 * sentence is simply there to read.
 */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.registerPlugin(ScrollTrigger);
        const words = gsap.utils.toArray<HTMLElement>(".mf-word");
        gsap.set(words, { opacity: 0.14 });
        gsap.to(words, {
          opacity: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: root.current,
            start: "top 72%",
            end: "bottom 55%",
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
      className="relative mx-auto flex min-h-[80vh] max-w-5xl items-center px-6 py-32 sm:px-10"
    >
      {/* screen-blend accent — paints nothing until the asset exists */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
        style={{ backgroundImage: "url('/sections/manifesto-veil.webp')" }}
      />
      <p className="relative z-10 font-display text-[clamp(1.9rem,5vw,4rem)] font-light leading-[1.18] tracking-[-0.01em] text-dark-ink">
        {LINE.split(" ").map((word, i) => (
          <span key={`${word}-${i}`} className="mf-word inline-block">
            {word}
            {" "}
          </span>
        ))}
      </p>
    </section>
  );
}
