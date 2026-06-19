# public/ — Refracta asset pack

The site is **pre-wired** for the generated Higgsfield pack. Every reference uses
a graceful fallback, so the app builds and looks right **with or without** these
files; drop them in at the exact paths below and they light up on next load.

```
public/
  hero/
    hero-poster.webp     # reduced-motion / no-WebGL still (else CSS prism shows)
    hero-loop.webm       # ambient chorus video, VP9   (else transparent)
    hero-loop.mp4        # ambient chorus video, H.264 fallback
    prism.glb            # the reactive lead mesh       (else icosahedron)
  sections/
    manifesto-veil.webp  # screen-blend accent          (else nothing painted)
    facets-grain.webp    # screen-blend accent (kept ≤20% opacity)
    spectrum-flare.webp  # screen-blend accent over the beat bar
  social/
    og-image.png         # 1200×630 link-preview card (referenced in metadata)
```

How each fallback works:
- **prism.glb** → `Crystal.tsx` loads it via `useGLTF`, centers + normalizes it,
  and drives it with the live fresnel→spectrum shader. A Suspense + error
  boundary falls back to the procedural icosahedron if it's missing or fails.
- **hero-loop / hero-poster** → `VideoPlate.tsx` (Plane 1) plays the loop behind
  the prism at 30% `screen`; `HeroPoster.tsx` layers the still over the CSS prism.
  Both are `background-image`/`<video>` so a 404 paints nothing — no broken icons.
- **section accents** → `background-image` + `mix-blend-screen`; absent = invisible.

See `REFRACTA-ASSET-COMMIT.md` / `HIGGSFIELD-ASSETS.md` at the repo root for the
generation specs, budgets, and the layering model.
