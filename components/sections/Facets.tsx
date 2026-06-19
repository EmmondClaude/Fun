"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";

/**
 * The five facets — the same five-sided mark woven through the work, one per
 * spectrum stop, always in order. A sticky left panel tracks the facet under
 * the eye while the right column scrolls; the warm focus moves down the ramp.
 *
 * Each right-hand block is self-contained (number, hue, title, line), so under
 * reduced-motion — when the sticky tracker can't update — every facet still
 * reads in full. ScrollTrigger only enhances; it never gates the content.
 */
const FACETS = [
  {
    n: "01",
    name: "Space & Form",
    color: "#22E6FF",
    line: "A breathing void — never flat black. One object holds the eye; everything else recedes into charged stillness.",
  },
  {
    n: "02",
    name: "Color & Material",
    color: "#7FF0FF",
    line: "Color arrives only as refracted light. Glass, not paint — transmission, fresnel rim, the oil-slick shimmer of iridescence.",
  },
  {
    n: "03",
    name: "Scale & Rhythm",
    color: "#8B5CF6",
    line: "Type is rare and deliberate. Motion has weight — nothing snaps, nothing is linear; everything decelerates into place.",
  },
  {
    n: "04",
    name: "Composition",
    color: "#FF2E97",
    line: "The eye is told where to go by light, not arrows. Where the light is warmest, that is the point of focus.",
  },
  {
    n: "05",
    name: "Craft",
    color: "#C70E6E",
    line: "Master-level execution in every easing curve and gradient stop — until the spectrum feels not designed, but discovered.",
  },
] as const;

export function Facets() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.registerPlugin(ScrollTrigger);
        const blocks = gsap.utils.toArray<HTMLElement>(".facet-block");
        blocks.forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => self.isActive && setActive(i),
          });
          gsap.from(el.querySelector(".facet-line"), {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 78%" },
          });
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const lead = FACETS[active];

  return (
    <section
      ref={root}
      className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 sm:px-10 md:grid-cols-[0.9fr_1.1fr]"
    >
      {/* faint iridescent glass texture — kept low; paints nothing until present */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20 mix-blend-screen"
        style={{ backgroundImage: "url('/sections/facets-grain.webp')" }}
      />
      {/* sticky tracker — the lead facet, warm under the eye */}
      <div className="relative z-10 md:sticky md:top-0 md:h-screen md:self-start">
        <div className="flex h-full flex-col justify-center">
          <p className="mb-6 text-[0.7rem] uppercase tracking-[0.4em] text-dark-muted">
            Five facets, one light
          </p>
          <span
            className="font-display text-[clamp(5rem,16vw,12rem)] font-light leading-none transition-colors duration-700 ease-expo"
            style={{ color: lead.color }}
          >
            {lead.n}
          </span>
          <span className="mt-4 font-display text-2xl font-light text-dark-ink">
            {lead.name}
          </span>
          {/* the ramp, position marking the active facet */}
          <div className="mt-8 flex gap-1.5">
            {FACETS.map((f, i) => (
              <span
                key={f.n}
                className="h-0.5 flex-1 rounded-full transition-all duration-500 ease-expo"
                style={{
                  backgroundColor: f.color,
                  opacity: i === active ? 1 : 0.28,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* the chorus — each facet, self-contained */}
      <div className="relative z-10 flex flex-col">
        {FACETS.map((f) => (
          <article
            key={f.n}
            className="facet-block flex min-h-[68vh] flex-col justify-center border-t border-dark-violet/15 py-12 first:border-t-0"
          >
            <div className="facet-line">
              <div className="mb-5 flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: f.color,
                    boxShadow: `0 0 16px ${f.color}`,
                  }}
                />
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.4em] text-dark-muted">
                  {f.n} — {f.name}
                </span>
              </div>
              <p className="max-w-xl font-display text-[clamp(1.4rem,3.2vw,2.4rem)] font-light leading-[1.28] text-dark-ink">
                {f.line}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
