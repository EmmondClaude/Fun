# Refracta — Refracted Dark

*By Blaque Lyon.*

A standalone, reactive hero page built to the **Refracted Dark** philosophy:
*one light source, refracted.* A glass prism floats in a breathing void; light
is split into the spectrum around its silhouette, glowing through controlled,
thresholded bloom, while a faint chromatic-dispersion fringe keeps it feeling
refracted. The whole thing must be beautiful frozen — the still frame is the
poster.

See `AFTERDARK-DESIGN-PHILOSOPHY.md` for the worldview, `REPO-SPEC.md` for the
build brief, and `HIGGSFIELD-ASSETS.md` for the generated-asset pack spec.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind 3.4** — Refracted Dark tokens live under `dark-*` in
  `tailwind.config.ts`; components consume tokens only, never raw hex
- **React Three Fiber 9** + **drei 10** + **three 0.184** — client-only 3D
- **Motion 12** — entrances + hover. **GSAP 3 + ScrollTrigger** and **Lenis**
  are installed but reserved for the future scroll beat (out of scope for v1)

One animation lane per property: Motion = entrances/hover, GSAP = the future
scroll beat, Lenis = smoothing only. They never overlap.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # type-check + lint + prerender
```

## Structure

```
app/
  layout.tsx          fonts (Fraunces display, JetBrains mono) + base styles
  page.tsx            server component; renders <Hero/>
components/
  hero/
    Hero.tsx          client shell: reduced-motion gate + WebGL error boundary
    HeroCanvas.tsx    dynamic({ssr:false}) R3F canvas; DPR-capped, pauses off-screen
    Crystal.tsx       reactive icosahedron + fresnel→spectrum shader, pointer inertia
    HeroCopy.tsx      kinetic type (Motion mask reveals); real text always in DOM
    HeroPoster.tsx    static fallback — the still, rendered in pure CSS
  ui/
    SpectrumBar.tsx   the one true ramp, drawn open
lib/
  useReducedMotion.ts
shaders/
  fresnelSpectrum.glsl  reference source for the inlined Crystal shader
public/
  README.md           where a hand-graded hero-poster.webp would go
```

## Fallback behaviour (non-negotiable)

- `prefers-reduced-motion: reduce` → no animation, the whole CSS poster, copy
  resolved instantly.
- WebGL context lost / no GPU → error boundary lands on the poster; page still
  works.
- DPR capped at `[1, 2]`; the render loop pauses when the hero is off-screen.
- The canvas is `aria-hidden`; tab order reaches the CTA with visible focus.

The scroll beat is deliberately not built yet — a clean seam is left for it.
