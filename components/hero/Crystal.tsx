"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Component, type ReactNode, Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vViewNormal;
  varying vec3 vViewDir;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vViewNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

// Fresnel rim split into the spectrum around the silhouette (the prism doing its
// one job), a thin chromatic dispersion fringe, and a travelling specular so the
// surface reads as wet glass — not paint.
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uPower;
  uniform float uIntensity;
  uniform float uAppear;
  varying vec3 vWorldNormal;
  varying vec3 vViewNormal;
  varying vec3 vViewDir;

  vec3 spectrum(float t) {
    vec3 c0 = vec3(0.133, 0.902, 1.000); // #22E6FF
    vec3 c1 = vec3(0.498, 0.941, 1.000); // #7FF0FF
    vec3 c2 = vec3(0.545, 0.361, 0.965); // #8B5CF6
    vec3 c3 = vec3(1.000, 0.180, 0.592); // #FF2E97
    vec3 c4 = vec3(0.780, 0.055, 0.431); // #C70E6E
    t = fract(t);
    if (t < 0.25) return mix(c0, c1, t / 0.25);
    if (t < 0.55) return mix(c1, c2, (t - 0.25) / 0.30);
    if (t < 0.80) return mix(c2, c3, (t - 0.55) / 0.25);
    return mix(c3, c4, (t - 0.80) / 0.20);
  }

  void main() {
    vec3 vn = normalize(vViewNormal);
    float fres = 1.0 - clamp(dot(normalize(vWorldNormal), normalize(vViewDir)), 0.0, 1.0);
    float rim = pow(fres, uPower);

    float ang = atan(vn.y, vn.x) / 6.28318530718 + 0.5;
    float base = ang + uTime * 0.02;

    float disp = 0.06 + rim * 0.10;
    vec3 col =
        spectrum(base - disp) * vec3(1.0, 0.35, 0.25)
      + spectrum(base)        * vec3(0.35, 1.0, 0.35)
      + spectrum(base + disp) * vec3(0.25, 0.35, 1.0);
    col *= 0.85;

    vec3 lightDir = normalize(vec3(0.6, 0.8, 0.7));
    vec3 ref = reflect(-normalize(vViewDir), normalize(vWorldNormal));
    float spec = pow(max(dot(ref, lightDir), 0.0), 22.0);

    vec3 body = vec3(0.043, 0.035, 0.067);
    vec3 color = body + col * rim * uIntensity + vec3(0.55, 0.82, 1.0) * spec * 0.6;
    color *= uAppear;

    float alpha = clamp(0.16 + rim * 1.05 + spec * 0.4, 0.0, 1.0) * uAppear;
    gl_FragColor = vec4(color, alpha);
  }
`;

const GLB_URL = "/hero/prism.glb";

/**
 * The body of the prism: geometry + the fresnel→spectrum glass shader + all of
 * the motion (pointer inertia, idle drift, mount intro). Geometry is injected so
 * the same material/behaviour drives either the generated `prism.glb` mesh or
 * the procedural icosahedron fallback. `baseScale` normalizes an arbitrary GLB
 * to roughly the icosahedron's footprint.
 */
function CrystalBody({
  geometry,
  baseScale = 1,
}: {
  geometry?: THREE.BufferGeometry | null;
  baseScale?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const rot = useRef({ x: 0, y: 0 });
  const appear = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPower: { value: 2.4 },
      uIntensity: { value: 1.25 },
      uAppear: { value: 0 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    appear.current += (1 - appear.current) * (1 - Math.pow(0.02, dt));
    const a = appear.current;

    const targetY = state.pointer.x * 0.55 + Math.sin(t * 0.18) * 0.12;
    const targetX = -state.pointer.y * 0.4 + Math.cos(t * 0.14) * 0.08;
    rot.current.y += (targetY - rot.current.y) * (1 - Math.pow(0.0006, dt));
    rot.current.x += (targetX - rot.current.x) * (1 - Math.pow(0.0012, dt));

    if (mesh.current) {
      mesh.current.rotation.y = rot.current.y;
      mesh.current.rotation.x = rot.current.x;
      mesh.current.rotation.z = t * 0.04;
      mesh.current.scale.setScalar((0.82 + a * 0.18) * baseScale);
    }
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
      matRef.current.uniforms.uAppear.value = a;
    }
  });

  return (
    <mesh ref={mesh} scale={0.82 * baseScale}>
      {geometry ? (
        <primitive object={geometry} attach="geometry" />
      ) : (
        <icosahedronGeometry args={[1.35, 0]} />
      )}
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

/** Loads the generated mesh, centers + normalizes it, drives it with the shader. */
function PrismCrystal() {
  const gltf = useGLTF(GLB_URL);

  const geometry = useMemo(() => {
    let found: THREE.BufferGeometry | undefined;
    gltf.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!found && m.isMesh && m.geometry) found = m.geometry;
    });
    if (!found) return null;
    const g = found.clone();
    g.center();
    g.computeBoundingSphere();
    return g;
  }, [gltf]);

  const baseScale =
    geometry?.boundingSphere && geometry.boundingSphere.radius > 0
      ? 1.35 / geometry.boundingSphere.radius
      : 1;

  return <CrystalBody geometry={geometry} baseScale={baseScale} />;
}

/**
 * If the GLB is missing or fails to parse, fall back to the procedural
 * icosahedron — the prism.glb is an upgrade, never a dependency.
 */
class GLBBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * The reactive prism (Plane 2 — the lead). Tries the generated `prism.glb`;
 * while it loads, and if it ever fails, the procedural icosahedron stands in
 * with the identical shader and motion.
 */
export function Crystal() {
  return (
    <GLBBoundary fallback={<CrystalBody />}>
      <Suspense fallback={<CrystalBody />}>
        <PrismCrystal />
      </Suspense>
    </GLBBoundary>
  );
}

useGLTF.preload(GLB_URL);
