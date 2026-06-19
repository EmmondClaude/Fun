"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Plane 1 — the ambient chorus. The generated `hero-loop` drifts *behind* the
 * prism at low opacity, screen-blended so the near-black floor falls away and
 * only the light adds. It parallaxes the least of the three planes (the prism
 * moves most, type a hair) to sell depth, with spring weight — nothing snaps.
 *
 * Until the video files exist it simply renders transparent (no poster flash, no
 * broken element), so the hero shows the void + prism exactly as before. The
 * whole plate is only mounted on the motion path, and it pauses off-screen.
 *
 * Files (drop into public/hero/): hero-loop.webm, hero-loop.mp4, hero-poster.webp
 */
export function VideoPlate() {
  const video = useRef<HTMLVideoElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 20, mass: 0.8 });
  const sy = useSpring(y, { stiffness: 60, damping: 20, mass: 0.8 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      x.set(nx * 18); // the far plane drifts least
      y.set(ny * 18);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ x: sx, y: sy }}
    >
      <video
        ref={video}
        className="absolute inset-[-6%] h-[112%] w-[112%] object-cover opacity-30 mix-blend-screen"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/hero/hero-loop.webm" type="video/webm" />
        <source src="/hero/hero-loop.mp4" type="video/mp4" />
      </video>
    </motion.div>
  );
}
