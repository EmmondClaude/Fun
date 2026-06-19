/**
 * HeroPoster — the still frame.
 *
 * This is not a throwaway loading state: it is where reduced-motion, weak-GPU
 * and no-WebGL visitors all land, so it must be beautiful frozen. Rendered in
 * pure CSS (no binary asset required) — a refracted prism floating in the void,
 * its silhouette lit in the one true spectrum at the fresnel rim.
 *
 * `public/hero-poster.webp` may replace the CSS prism later by swapping the
 * <div> for an <Image fill>; the layout seam is intentionally left clean.
 */
export function HeroPoster() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-void"
    >
      {/* The generated still, if present, sits on top of the CSS prism below.
          A missing file paints nothing (no broken image), so the CSS fallback
          shows through — progressive enhancement, drop in public/hero/. */}
      <div
        className="absolute inset-0 z-[1] bg-cover bg-center"
        style={{ backgroundImage: "url('/hero/hero-poster.webp')" }}
      />
      {/* charged negative space — a soft bloom behind the form */}
      <div
        className="absolute left-1/2 top-[42%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(34,230,255,0.18) 0%, rgba(139,92,246,0.12) 40%, rgba(255,46,151,0.05) 70%, transparent 100%)",
        }}
      />

      {/* the prism — five-sided silhouette, refraction across the spectrum */}
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
        {/* fresnel rim: a slightly larger spectrum body sits behind the void
            facets, leaking light only at the silhouette */}
        <div
          className="relative h-[44vmin] w-[44vmin] bg-spectrum"
          style={{
            clipPath:
              "polygon(50% 0%, 95% 35%, 78% 92%, 22% 92%, 5% 35%)",
            filter: "drop-shadow(0 0 28px rgba(34,230,255,0.35))",
          }}
        >
          {/* inner faceting: the void seen through glass, light bending through */}
          <div
            className="absolute inset-[2px]"
            style={{
              clipPath: "polygon(50% 0%, 95% 35%, 78% 92%, 22% 92%, 5% 35%)",
              background:
                "radial-gradient(120% 120% at 38% 28%, rgba(20,17,33,0.35) 0%, rgba(11,9,22,0.88) 55%, rgba(7,6,11,0.97) 100%)",
            }}
          />
          {/* oil-slick highlight — one specular sweep, top-left */}
          <div
            className="absolute inset-[2px] opacity-70 mix-blend-screen"
            style={{
              clipPath: "polygon(50% 0%, 95% 35%, 78% 92%, 22% 92%, 5% 35%)",
              background:
                "linear-gradient(135deg, rgba(127,240,255,0.55) 0%, transparent 38%)",
            }}
          />
          {/* internal refraction lines toward the warm point of focus */}
          <div
            className="absolute inset-[2px] opacity-60 mix-blend-screen"
            style={{
              clipPath: "polygon(50% 0%, 95% 35%, 78% 92%, 22% 92%, 5% 35%)",
              background:
                "conic-gradient(from 210deg at 62% 70%, rgba(255,46,151,0.45), rgba(199,14,110,0.25) 25%, transparent 55%, rgba(34,230,255,0.30) 90%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
