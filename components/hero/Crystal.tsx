"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vViewDir;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uPower;
  uniform float uIntensity;
  varying vec3 vWorldNormal;
  varying vec3 vViewDir;

  vec3 spectrum(float t) {
    vec3 c0 = vec3(0.133, 0.902, 1.000); // #22E6FF
    vec3 c1 = vec3(0.498, 0.941, 1.000); // #7FF0FF
    vec3 c2 = vec3(0.545, 0.361, 0.965); // #8B5CF6
    vec3 c3 = vec3(1.000, 0.180, 0.592); // #FF2E97
    vec3 c4 = vec3(0.780, 0.055, 0.431); // #C70E6E
    t = clamp(t, 0.0, 1.0);
    if (t < 0.25) return mix(c0, c1, t / 0.25);
    if (t < 0.55) return mix(c1, c2, (t - 0.25) / 0.30);
    if (t < 0.80) return mix(c2, c3, (t - 0.55) / 0.25);
    return mix(c3, c4, (t - 0.80) / 0.20);
  }

  void main() {
    float fres = 1.0 - clamp(dot(normalize(vWorldNormal), normalize(vViewDir)), 0.0, 1.0);
    float rim = pow(fres, uPower);
    float t = fract(fres * 1.2 + uTime * 0.03);
    vec3 col = spectrum(t);
    vec3 body = vec3(0.043, 0.035, 0.067);
    vec3 color = body + col * rim * uIntensity;
    float alpha = clamp(0.18 + rim * 1.1, 0.0, 1.0);
    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * The reactive prism. An icosahedron lit by a single refracted beam: the
 * fresnel rim samples the one true spectrum so the silhouette glows in the
 * brand ramp, the body stays near-void.
 *
 * Motion has weight. Pointer input is eased toward a target with a
 * frame-rate-independent decay `1 - pow(c, dt)` (no snap, real inertia), and a
 * slow idle drift keeps the form breathing when the pointer is still.
 */
export function Crystal() {
  const mesh = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  // current eased rotation, mutated each frame
  const rot = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPower: { value: 2.6 },
      uIntensity: { value: 1.35 },
    }),
    [],
  );

  useFrame((state, delta) => {
    // clamp delta so a tab-return doesn't fling the prism
    const dt = Math.min(delta, 0.05);

    // pointer target (normalized -1..1) → gentle rotation, plus idle drift
    const t = state.clock.elapsedTime;
    const targetY = state.pointer.x * 0.55 + Math.sin(t * 0.18) * 0.12;
    const targetX = -state.pointer.y * 0.4 + Math.cos(t * 0.14) * 0.08;

    // frame-rate-independent ease — heavier on x for a touch of mass
    const easeY = 1 - Math.pow(0.0006, dt);
    const easeX = 1 - Math.pow(0.0012, dt);
    rot.current.y += (targetY - rot.current.y) * easeY;
    rot.current.x += (targetX - rot.current.x) * easeX;

    if (mesh.current) {
      mesh.current.rotation.y = rot.current.y;
      mesh.current.rotation.x = rot.current.x;
      // perpetual slow spin so the spectrum is always turning toward the eye
      mesh.current.rotation.z = t * 0.04;
    }
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
    }
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.35, 0]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
