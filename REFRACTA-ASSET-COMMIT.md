# REFRACTA-ASSET-COMMIT — wire the generated asset pack into the hero

Hand this file to Claude Code in the refracta repo. It tells you (a) exactly where
each generated asset lands in `public/`, named per the Higgsfield brief, and (b) how
to **layer the new `prism.glb` 3D mesh with the ambient video and the poster** so the
hero reads as one refracted light — the layered, "appears-3D-after-motion" feel, not a
flat video.

Source of truth for look + budgets: `HIGGSFIELDASSETS.md` (§4 specs, §5 layout, §6
checklist) and `AFTERDARK-DESIGN-PHILOSOPHY.md`. This file is the **assembly + wiring**
order; it does not restate the palette — that's in those two.

---

## 0. What's in the pack

Generated on Higgsfield (seedream_v4_5 stills, kling3_0_turbo video, SAM 3 image-to-3D).
Each raw asset maps to one named deliverable. The middle column is the Higgsfield
generation it came from (kept for re-export / regeneration).

| Deliverable (named, final) | Source generation | Status |
|---|---|---|
| `hero/hero-poster.webp` | poster A (`55ddf484`) — cyan beam in, full-bleed black | crop→1920×1080, WebP q82, ≤400 KB |
| `hero/hero-loop.webm` + `.mp4` | video v3 beam-fan (`ebef8cc8`) — **chosen** | encode VP9 + H.264, ≤4 MB each |
| `hero/prism.glb` | SAM 3 3D (`ba3930c9`) from poster A | white mesh — see §3 |
| `sections/manifesto-veil.webp` | `40b278f2` | crop→2400×1200, ≤250 KB |
| `sections/facets-grain.webp` | `9a7a03c2` | resize→2000×2000, ≤250 KB ⚠ palette |
| `sections/spectrum-flare.webp` | built programmatically | **done**, 2400×400, 4.7 KB |
| `social/og-image.png` | composite text on poster A | 1200×630, ≤1 MB |

Two notes carried from QC:
- **Poster B** (`a1e0f20e`) is an alt; it has white letterbox bars top/bottom, so A is
  the clean pick. Keep B only as a fallback crop if A reads weak at final size.
- **facets-grain** drifts into green in places — off the spectrum (cyan→cyan-l→violet
  →magenta→ember). It sits at very low opacity under text so it's tolerable, but if you
  regenerate, constrain the palette and drop green.
- **Videos v1 (`c5e70a4a`) and v2 (`01cac670`)** read as aurora *landscapes* (and v2
  has green/amber) — off-concept. Use **v3** for the hero. v1/v2 are not committed.

---

## 1. Final folder layout (matches Higgsfield §5 → repo `public/`)

```
public/
  hero/
    hero-poster.webp        # reduced-motion / no-WebGL / weak-GPU still
    hero-loop.webm          # ambient chorus, VP9
    hero-loop.mp4           # ambient chorus, H.264 fallback
    prism.glb               # NEW — the reactive lead object (see §3)
  sections/
    manifesto-veil.webp     # screen-blend accent
    facets-grain.webp       # screen-blend accent
    spectrum-flare.webp     # screen-blend accent
  social/
    og-image.png            # link preview card, carries the wordmark
```

`prism.glb` lives under `public/hero/` so drei's `useGLTF("/hero/prism.glb")` resolves
it as a static asset (no bundler import needed).

---

## 2. The layering model — one light, three planes

The "wow" reels you're chasing are **not** a single AI video. They composite planes that
each move at a different rate, so the eye reads depth. Our hero does the same with three
stacked layers inside `HeroCanvas` / `Hero`, back to front:

```
 ┌─────────────────────────────────────────────┐
 │  PLANE 3 · HeroCopy  (DOM, kinetic type)      │  ← always real text
 ├─────────────────────────────────────────────┤
 │  PLANE 2 · Crystal  (R3F prism.glb + shader)  │  ← the LEAD, pointer-reactive
 ├─────────────────────────────────────────────┤
 │  PLANE 1 · VideoPlate (hero-loop, screen)     │  ← the CHORUS, slow drift, far
 └─────────────────────────────────────────────┘
              all over the void radial bg
```

- **Plane 1 — the video is the chorus, never the hero.** It sits *behind* the prism at
  low opacity and `mix-blend-mode: screen` (the near-black floor falls away, only the
  light adds). It drifts; it never competes. This is §4.1 of the brief.
- **Plane 2 — the prism is the lead.** Real R3F geometry with the fresnel→spectrum glass
  shader. Pointer inertia + idle drift. This is where the genuine 3D lives — not faked.
- **Plane 3 — type** stays in the DOM, always.

Parallax is what sells depth: when the pointer moves, the three planes shift by different
amounts (video least, prism most, type a hair). Frame-rate-independent ease
`1 - pow(c, dt)` per `references/reactive-hero.md`. Nothing linear, nothing snaps.

---

## 3. Wiring `prism.glb` into Crystal.tsx

The current `Crystal.tsx` uses `IcosahedronGeometry`. Swap the geometry for the generated
mesh **but keep the material** — the GLB is a clean white mesh; the look comes from the
live shader, not baked textures (that's deliberate: baked beams would fight the shader).

```tsx
// Crystal.tsx
import { useGLTF } from "@react-three/drei";

function PrismMesh(props) {
  const { nodes } = useGLTF("/hero/prism.glb");
  // grab the first mesh geometry from the GLB
  const geometry = Object.values(nodes).find((n) => n.geometry)?.geometry;
  return (
    <mesh geometry={geometry} {...props}>
      {/* the existing fresnel→spectrum / transmission material, unchanged */}
      <fresnelSpectrumMaterial /* …uniforms… */ />
    </mesh>
  );
}
useGLTF.preload("/hero/prism.glb");
```

Keep `IcosahedronGeometry` as the fallback if the GLB fails to load, so the hero degrades
cleanly. Cap DPR `[1,2]`, client-only via `next/dynamic({ ssr:false })` — non-negotiables
from CLAUDE.md still apply.

> If the SAM 3 mesh comes back rough or off-axis, the procedural `IcosahedronGeometry`
> stays the shippable default — the GLB is an upgrade, not a dependency.

---

## 4. The VideoPlate (Plane 1)

```tsx
// behind the canvas, inside Hero
<video
  className="absolute inset-0 h-full w-full object-cover
             opacity-30 mix-blend-screen pointer-events-none"
  autoPlay muted loop playsInline
  poster="/hero/hero-poster.webp"
>
  <source src="/hero/hero-loop.webm" type="video/webm" />
  <source src="/hero/hero-loop.mp4"  type="video/mp4" />
</video>
```

- `opacity-30` lands it in the 25–40% window the brief calls for over `#07060B`.
- `poster` doubles as the first paint and the reduced-motion still.
- Gate the whole `<video>` behind `!prefersReducedMotion` and pause it when off-screen.

---

## 5. Section accents (screen-blend, low opacity)

All three are composed on near/pure black for `mix-blend-mode: screen`:

```tsx
<div className="relative">
  <img src="/sections/manifesto-veil.webp"
       className="absolute inset-0 h-full w-full object-cover
                  opacity-40 mix-blend-screen pointer-events-none" alt="" />
  {/* section content above */}
</div>
```

`spectrum-flare.webp` works well as a thin divider rule between sections (full-width,
short height). `facets-grain.webp` tiles as a faint texture — keep it ≤25% opacity given
the palette drift noted above.

---

## 6. OG card

`social/og-image.png` carries baked text (the only asset that does): wordmark
**Refracta** (Fraunces, light, `#F4F1FF`), sub-line **"Refracted Dark — one light,
refracted"**, **"Blaque Lyon"** in a corner, a thin spectrum rule. 1200×630, text inside
the 1080×510 safe area. Reference it in `app/layout.tsx`:

```tsx
export const metadata = {
  openGraph: { images: [{ url: "/social/og-image.png", width: 1200, height: 630 }] },
  twitter:   { card: "summary_large_image", images: ["/social/og-image.png"] },
};
```

---

## 7. Acceptance (carried from §6, plus the 3D layer)

- [ ] All files present, named exactly, in the §1 layout.
- [ ] Video sits behind the prism at 25–40% opacity, screen-blended; pauses off-screen.
- [ ] `prism.glb` loads in Crystal with the live shader; falls back to icosahedron.
- [ ] Pointer parallax differs per plane (video < prism < type); nothing linear.
- [ ] Reduced-motion → poster + instant copy, no video, no canvas.
- [ ] Kill WebGL → error boundary shows poster; page still works.
- [ ] Only spectrum-order hues read; no green/amber leak into the composite.
- [ ] Budgets met: videos ≤4 MB, poster ≤400 KB, accents ≤250 KB, OG ≤1 MB.

## 8. Suggested commit

```
feat(hero): wire Refracta asset pack — video chorus + prism.glb + poster

- public/hero: hero-loop.{webm,mp4}, hero-poster.webp, prism.glb
- public/sections: manifesto-veil, facets-grain, spectrum-flare (screen-blend)
- public/social: og-image.png
- Crystal: load prism.glb, keep fresnel→spectrum shader; icosahedron fallback
- VideoPlate behind prism @30% screen; reduced-motion + WebGL gates intact
```
