# REPO-SPEC — Afterdark Hero (Claude Code build brief)

Hand this file to Claude Code in a fresh, empty repo. It is a complete brief to
scaffold a standalone **Afterdark hero page** on the Apex stack, built to the
`3d-heavy-creative` playbook. Two HTML prototypes ship alongside it
(`afterdark-hero-baseline.html` = no skill, `afterdark-hero-skill.html` = the
target feel); the skill version is the look to match in real React/R3F.

## 0. First, install the skill

This build depends on the **`3d-heavy-creative`** skill (SKILL.md + five reference
files). Copy `skills/3d-heavy-creative/` into the repo (or install the `.skill`)
and read it before writing components. The references are the source of truth for
each technique; this spec is the assembly order.

## 1. What we're building

One page: an Afterdark hero that feels aware of the visitor on load and resolves to
a beautiful still when motion is off. Concept: **Refracted Dark — one light source,
refracted** (see `AFTERDARK-DESIGN-PHILOSOPHY.md`). Not a full site — a single,
shippable hero we can drop into the portal later or use as a client demo shell.

## 2. Stack

- Next.js 15 (App Router) + React 19 + TypeScript (strict)
- Tailwind 3.4 with `dark-*` tokens in `tailwind.config.ts`
- React Three Fiber 9 + drei 10 + three 0.184
- Motion 12 (entrances/hover), GSAP 3 + ScrollTrigger (reserved for the later
  scroll beat), Lenis (light smoothing)
- No backend needed for the hero.

## 3. Design tokens (put in tailwind.config.ts under `dark-*`)

```
void-0  #141121   void-1  #07060B     (radial bg, never flat black)
cyan    #22E6FF   cyan-l  #7FF0FF
violet  #8B5CF6   magenta #FF2E97     ember #C70E6E
ink     #F4F1FF   muted   #9B95B8
spectrum: #22E6FF → #7FF0FF → #8B5CF6 → #FF2E97 → #C70E6E
```
Fonts: Fraunces (serif display, weights 300/500) for the wordmark, JetBrains Mono
for kicker/meta, via `next/font` with `display:"swap"`.

## 4. File structure

```
app/
  layout.tsx            // fonts, base styles
  page.tsx              // server component; renders <Hero/>
components/
  hero/
    Hero.tsx            // "use client" shell: reduced-motion gate + error boundary
    HeroCanvas.tsx      // dynamic({ssr:false}) R3F canvas
    Crystal.tsx         // the reactive prism object + spectrum/fresnel shader
    HeroCopy.tsx        // kinetic type overlay (Motion mask reveals)
    HeroPoster.tsx      // static fallback (the cover-tile quality bar)
  ui/
    SpectrumBar.tsx
lib/
  useReducedMotion.ts
shaders/
  fresnelSpectrum.glsl  // or inline in Crystal.tsx
public/
  hero-poster.webp      // exported still of the final frame
```

## 5. Build order (do NOT open with the shader)

1. **Static first.** `page.tsx` + `HeroPoster.tsx` + `HeroCopy.tsx` laid out with
   real copy over a poster image. This doubles as the reduced-motion fallback —
   required, not throwaway. Ship-able at this step.
2. **Reactive hero.** `Crystal.tsx`: IcosahedronGeometry + the fresnel→spectrum
   shader (see `references/materials-and-shaders.md`). Wire pointer-with-inertia +
   idle drift in `useFrame` (frame-rate-independent ease `1 - pow(c, dt)`), per
   `references/reactive-hero.md`. Mount via `next/dynamic({ssr:false})`.
3. **Kinetic type.** `HeroCopy.tsx`: each headline line in an overflow mask, Motion
   slide-up with expo easing `[0.16,1,0.3,1]`, staggered; real text always in DOM
   (`references/kinetic-type.md`). Spectrum bar draws open.
4. **Finish.** Vignette + film grain + scanlines overlay; CTA with cyan hover glow.
5. **Gate + verify.** Reduced-motion → poster + instant-resolved copy; WebGL error
   boundary → poster; cap DPR `[1,2]`; pause loop off-screen.

(Scroll beat is out of scope for v1 — leave a clean seam for it. When added, follow
`references/scroll-choreography.md` and the lane rule.)

## 6. Non-negotiables (from CLAUDE.md + the skill)

- Animation lanes never overlap on one animation: Motion = entrances/hover, GSAP =
  the (future) scroll beat, Lenis = smoothing only. One library per property.
- All 3D is client-only (`ssr:false`); never import three into a Server Component.
- Tokens only — no arbitrary hex in components; everything from `dark-*`.
- The still frame must be beautiful on its own (reduced-motion / weak-GPU / no-WebGL
  all land here). If the poster is ugly, it's not done.
- Body-text contrast checked against the void; spectrum is for accents + display.

## 7. Acceptance

- `npm run build` passes (type-check + lint + prerender).
- Loads with `prefers-reduced-motion: reduce` → no animation, whole poster.
- Kill WebGL context → error boundary shows poster, page still works.
- Mid-tier mobile GPU holds ~60fps or degrades; pointer motion has visible inertia
  (not a snap); nothing linear.
- Tab-through reaches the CTA with focus visible; canvas is `aria-hidden`.

## 8. Suggested first commit / prompt to Claude Code

> "Read `skills/3d-heavy-creative/SKILL.md` and `REPO-SPEC.md`. Scaffold the
> Next.js 15 + R3F repo per the file structure, then build the Afterdark hero in
> the order in §5, static-first. Match the feel of `afterdark-hero-skill.html`.
> Stop after step 1 and show me the static page before adding 3D."
