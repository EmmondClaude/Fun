"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { HeroCopy } from "./HeroCopy";
import { HeroPoster } from "./HeroPoster";
import { VideoPlate } from "./VideoPlate";

// 3D is client-only. ssr:false keeps three out of the server bundle; the poster
// is the placeholder while the canvas chunk loads.
const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false, loading: () => <HeroPoster /> },
);

/**
 * Catches any WebGL / R3F failure (lost context, no GPU, init throw) and lands
 * the visitor on the still poster. The page keeps working — the hero just
 * resolves to its frozen frame.
 */
class CanvasBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <HeroPoster />;
    return this.props.children;
  }
}

/**
 * Hero shell. Gates motion: reduced-motion (or WebGL failure) → the static
 * poster with instantly-resolved copy; otherwise the reactive prism. The copy
 * layer and the cinematic overlays are constant across both paths.
 */
export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative h-screen w-full">
      {reduced ? (
        <HeroPoster />
      ) : (
        <>
          {/* Plane 1 — ambient video chorus, behind everything */}
          <VideoPlate />
          {/* Plane 2 — the reactive prism, the lead */}
          <CanvasBoundary>
            <HeroCanvas />
          </CanvasBoundary>
        </>
      )}

      {/* Plane 3 — type, always real DOM */}
      <HeroCopy reduced={reduced} />

      <Overlays />
    </section>
  );
}

/**
 * Cinematic finish — vignette, film grain and scanlines. Controlled and
 * thresholded, never garish; tuned so the still frame reads as crafted, not
 * filtered. All non-interactive and aria-hidden.
 */
function Overlays() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      {/* vignette — pulls the eye to the charged center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 42%, transparent 45%, rgba(7,6,11,0.55) 78%, rgba(7,6,11,0.92) 100%)",
        }}
      />
      {/* scanlines — a faint signal, the screen behind the glass */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(244,241,255,0.9) 0px, rgba(244,241,255,0.9) 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* film grain — a restless drift, suppressed under reduced-motion via CSS */}
      <div
        className="absolute inset-[-50%] animate-grain-shift opacity-[0.05] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
