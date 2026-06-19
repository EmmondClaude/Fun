"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

/**
 * The close. A large serif invitation in the void, the CTA carrying the warm
 * point of focus, and one mono line naming the quiet reference — five facets,
 * the Blaque mark. Headline rises on scroll-in (GSAP); reduced-motion resolves
 * it instantly.
 */
export function Closing() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.from(".closing-rise", {
          opacity: 0,
          y: 60,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="enter"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-32 text-center sm:px-10"
    >
      {/* a soft bloom — the light, gathered one last time */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(199,14,110,0.25) 0%, rgba(139,92,246,0.18) 45%, transparent 75%)",
        }}
      />

      <p className="closing-rise relative mb-7 font-mono text-[0.72rem] uppercase tracking-[0.42em] text-dark-muted">
        The spectrum was always inside the void
      </p>

      <h2 className="closing-rise relative font-display text-[clamp(3rem,12vw,9rem)] font-light leading-[0.94] tracking-[-0.02em] text-dark-ink">
        Enter the dark
      </h2>

      <a
        href="#top"
        className="closing-rise group relative mt-12 inline-flex items-center gap-3 rounded-full border border-dark-violet/40 px-8 py-3.5 text-[0.78rem] uppercase tracking-[0.28em] text-dark-ink transition-[box-shadow,border-color,transform] duration-500 ease-expo hover:-translate-y-0.5 hover:border-dark-cyan hover:shadow-[0_0_32px_rgba(34,230,255,0.5)] focus-visible:border-dark-cyan focus-visible:shadow-[0_0_32px_rgba(34,230,255,0.5)]"
      >
        <span>Begin</span>
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-dark-cyan transition-transform duration-500 ease-expo group-hover:translate-x-1"
        />
      </a>

      <footer className="closing-rise relative mt-28 flex flex-col items-center gap-3">
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 bg-spectrum"
          style={{ clipPath: "polygon(50% 0%, 95% 35%, 78% 100%, 22% 100%, 5% 35%)" }}
        />
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.38em] text-dark-muted">
          Five facets · one light · the Blaque mark, refracted
        </span>
      </footer>
    </section>
  );
}
