"use client";

import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import { Vector2 } from "three";
import { Crystal } from "./Crystal";

/**
 * R3F canvas wrapper. Loaded via `next/dynamic({ ssr:false })` from Hero —
 * three never reaches a Server Component.
 *
 * The composer is the "controlled, thresholded, earned" glow the philosophy
 * asks for: bloom only on the brightest rim, a hair of chromatic aberration to
 * keep the prism feeling refracted, and a vignette pulling the eye to center.
 *
 * Performance guards: DPR capped at [1, 2]; the render loop pauses
 * (`frameloop="never"`) whenever the hero scrolls off-screen.
 */
export function HeroCanvas() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const caOffset = useMemo(() => new Vector2(0.0007, 0.0007), []);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapper} aria-hidden="true" className="absolute inset-0">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5], fov: 42 }}
      >
        <Crystal />

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.5}
            mipmapBlur
            radius={0.7}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={caOffset}
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette eskil={false} offset={0.32} darkness={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
