# HIGGSFIELD-ASSETS — Afterdark asset pack brief

Hand this file to cowork / Higgsfield. It is a complete brief to generate **one
zipped asset pack** for the Afterdark "Refracted Dark" hero page. Produce every
file listed in §4, named exactly as written, in the folder structure of §5, and
return them in a single `afterdark-assets.zip`. The files drop straight into the
site's `public/` directory and are already wired in code — names and dimensions
must match.

---

## 0. The one rule

**One light source, refracted.** Every asset is the *same* beam of white light
bent through glass until it splits into a spectrum — nothing else. No objects, no
scenes, no daylight, no decoration. Abstract refracted light in a deep, breathing
void. If an asset reads as "a thing in a room," it is wrong; it should read as
"light bending through dark."

The full worldview is in `AFTERDARK-DESIGN-PHILOSOPHY.md` — read it first.

---

## 1. Palette (do not deviate)

```
void-0  #141121   soft radial center  — the void breathes from here
void-1  #07060B   true shadow         — never flat #000000
cyan    #22E6FF
cyan-l  #7FF0FF
violet  #8B5CF6
magenta #FF2E97
ember   #C70E6E
ink     #F4F1FF   (text only — used in the OG card)
```

**Spectrum order, always:** `cyan → cyan-l → violet → magenta → ember`.
Color appears **only** as thin refracted highlights against the void. No greens,
yellows, oranges, teals-outside-cyan, warm tungsten, or pastels. Backgrounds are
near-black (`#07060B`–`#141121`), never pure `#000000` (it bands).

---

## 2. Style preamble (prepend to every generation prompt)

> Abstract refracted light in a deep near-black void (#07060B to #141121, never
> flat black). A single white light source bent through unseen glass, splitting
> into thin spectral highlights — cyan #22E6FF, pale cyan #7FF0FF, violet
> #8B5CF6, magenta #FF2E97, deep ember #C70E6E, in that order. Glassy, wet, lit,
> iridescent oil-slick sheen, fresnel rim glints, volumetric caustics. Cinematic,
> meticulously crafted, controlled and thresholded glow — gorgeous, never garish.
> Vast negative space, one dominant gesture surrounded by stillness. 8-bit sRGB.

**Negative prompt (every asset):**

> text, words, letters, watermark, logo, signature, UI, faces, people, hands,
> recognizable objects, product, room, landscape, sky, daylight, sunlight, warm
> tungsten, green, yellow, orange, teal, brown, pastel, flat black #000000,
> banding, posterization, noise, jpeg artifacts, low resolution, blurry, busy,
> cluttered, five colors fighting each other.

---

## 3. Global technical spec

- **Color space:** sRGB, 8-bit. No HDR, no wide-gamut, no log.
- **Black floor:** darkest pixels around `#07060B`; avoid true `#000000`.
- **No baked text** in any asset **except** the OG card (§4.5), where the wordmark
  is required.
- **Overlay assets** (the section accents, §4.3) are composed on a **pure-black
  field** so they can be dropped in with `mix-blend-mode: screen` (black falls
  away, only the light remains). Alternatively deliver as transparent PNG — but
  black-field WebP is preferred and lighter.
- **No audio** on any video.
- Hit the file-size budgets — these load on a hero, weight matters.

---

## 4. Deliverables

### 4.1 Hero ambient loop  →  `hero-loop.webm` + `hero-loop.mp4`

The faint, drifting chorus *behind* the live 3D crystal and the headline — it
deepens the void, it never competes. Slow volumetric caustics and thin spectral
beams bending through unseen glass; mostly darkness, light only at the edges.

- **Content prompt:** *(style preamble) + "slow drifting volumetric light
  caustics and thin refracted spectral beams sweeping through a deep black void,
  no central object, light pooling and bending at the frame edges, extremely
  slow and weighted motion, hypnotic, seamless."*
- **Aspect / resolution:** 16:9, **1920×1080**.
- **Duration:** 10s, **seamless loop** (first frame must equal last frame — no
  visible cut or pop).
- **Frame rate:** 24 fps.
- **Motion:** very slow, decelerating, organic drift. Nothing linear, nothing
  fast, no flashing.
- **Brightness:** must look right at **25–40% opacity over #07060B** — keep it
  dark; bright frames will blow out the hero.
- **Formats / budget:** WebM (VP9) **and** MP4 (H.264), each **≤ 4 MB**.

### 4.2 Hero poster still  →  `hero-poster.webp`

The frozen hero — what reduced-motion, no-WebGL and weak-GPU visitors see. It
**must be beautiful on its own**; it is effectively the poster of the whole page.
Export the single most striking frame of the §4.1 loop (or generate to match),
with one clear refracted-glass gesture and the spectrum glinting at its rim.

- **Aspect / resolution:** 16:9, **1920×1080**.
- **Format / budget:** WebP, quality ~82, **≤ 400 KB**.
- Composition centered slightly high (≈42% from top) — the headline sits over the
  lower third, so keep the busiest light in the upper-middle.

### 4.3 Section accent media (3 stills, black-field, screen-blend)

Subtle, dark, atmospheric — they sit *under* text at low opacity. Pure-black
background, light only as refracted spectral highlights.

| File | Size | Brief (style preamble +) |
|------|------|--------------------------|
| `manifesto-veil.webp` | 2400×1200 | "a faint horizontal smear of refracted spectral light low across a black field, mostly empty darkness, a single soft cyan-to-violet bend left of center" |
| `facets-grain.webp` | 2000×2000 | "a dark iridescent glass surface, oil-slick sheen catching the full spectrum in thin order, seen edge-on, near-black, tileable feel" |
| `spectrum-flare.webp` | 2400×400 | "a single thin horizontal spectral flare, cyan→cyan-l→violet→magenta→ember left to right, sharp at center fading to black at both ends, on pure black" |

- **Format / budget:** WebP, quality ~80, **≤ 250 KB** each.
- All on **pure black**, designed for `mix-blend-mode: screen`.

### 4.4 (Optional) Hero portrait loop  →  `hero-loop-portrait.webm` + `.mp4`

Same content/spec as §4.1 but **9:16, 1080×1920**, for mobile. Optional — include
if cheap; the 16:9 master will be used as fallback otherwise.

### 4.5 Social / OG card  →  `og-image.png`

The link-preview card. This one **does** carry text.

- **Size:** exactly **1200×630** (the OG standard).
- **Content:** the hero refracted-glass composition on the void, with the wordmark
  **"Afterdark"** (serif, light, in `#F4F1FF`) and a smaller line **"Refracted
  Dark — one light, refracted"** beneath it. A thin spectrum rule as accent.
- **Format / budget:** PNG (or high-quality JPG), **≤ 1 MB**. sRGB.
- Keep text well inside a 1080×510 safe area (platforms crop edges).

---

## 5. Zip structure (must match exactly)

Return `afterdark-assets.zip` with this layout. It mirrors the site's `public/`
folder, so the contents are copied in 1:1:

```
afterdark-assets/
  hero/
    hero-loop.webm
    hero-loop.mp4
    hero-poster.webp
    hero-loop-portrait.webm   (optional)
    hero-loop-portrait.mp4    (optional)
  sections/
    manifesto-veil.webp
    facets-grain.webp
    spectrum-flare.webp
  social/
    og-image.png
```

→ these land at `public/hero/…`, `public/sections/…`, `public/social/…`.

---

## 6. Acceptance checklist

- [ ] Every required file from §4 present, named exactly, in the §5 structure.
- [ ] Only spectrum-order hues appear; no green/yellow/orange/warm casts.
- [ ] Backgrounds near-black (`#07060B`–`#141121`), no flat `#000000`, no banding.
- [ ] Hero loop is **seamless** (first frame == last) and reads well at 25–40%
      opacity over the void.
- [ ] No baked text anywhere except `og-image.png`.
- [ ] Section accents are on pure black, clean under `screen` blend.
- [ ] File-size budgets met (hero videos ≤ 4 MB each, poster ≤ 400 KB, accents ≤
      250 KB, OG ≤ 1 MB).
- [ ] sRGB / 8-bit; motion is slow and decelerating, nothing linear or flashing.

When the zip is back, I'll unpack it into `public/`, wire the loop + poster into
the hero (with the reduced-motion / no-WebGL gates intact), layer the accents
into the sections at low opacity, and add the OG meta tags.
