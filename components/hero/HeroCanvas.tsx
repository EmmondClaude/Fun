"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Crystal } from "./Crystal";

/**
 * R3F canvas wrapper. Loaded via `next/dynamic({ ssr:false })` from Hero —
 * three never reaches a Server Component.
 *
 * Performance guards from the spec: DPR capped at [1, 2], and the render loop
 * pauses (`frameloop="never"`) whenever the hero scrolls off-screen so the GPU
 * idles instead of spinning the prism nobody can see.
 */
export function HeroCanvas() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

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
    <div
      ref={wrapper}
      aria-hidden="true"
      className="absolute inset-0"
    >
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5], fov: 42 }}
      >
        {/* one beam — a single key light, the rest is refraction */}
        <ambientLight intensity={0.15} />
        <pointLight position={[3, 4, 5]} intensity={1.2} color="#7FF0FF" />
        <Crystal />
      </Canvas>
    </div>
  );
}
