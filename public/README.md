# public/

`hero-poster.webp` — exported still of the final frame — is referenced by the
spec's file structure but is **not required** for the build: `HeroPoster.tsx`
renders the still entirely in CSS (a refracted prism in the void) so the
reduced-motion / weak-GPU / no-WebGL fallback ships without a binary asset.

When a hand-graded still is exported, drop it here as `hero-poster.webp` and
swap the CSS prism in `components/hero/HeroPoster.tsx` for a `next/image`
`<Image fill priority />`. The layout seam is intentionally clean.
