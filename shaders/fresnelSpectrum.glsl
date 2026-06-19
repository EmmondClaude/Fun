// fresnelSpectrum — one light source, refracted.
//
// The body stays near-void; light is sampled from the one true spectrum and
// leaked only at the fresnel rim, so the silhouette glows in the brand ramp.
// Inlined as template strings in Crystal.tsx; kept here as the source of truth.
//
// Spectrum order (never reordered):
//   #22E6FF → #7FF0FF → #8B5CF6 → #FF2E97 → #C70E6E

// ---- vertex ----------------------------------------------------------------
varying vec3 vWorldNormal;
varying vec3 vViewDir;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}

// ---- fragment --------------------------------------------------------------
uniform float uTime;
uniform float uPower;     // fresnel falloff — higher = tighter rim
uniform float uIntensity; // rim brightness, thresholded so it never blows out
varying vec3 vWorldNormal;
varying vec3 vViewDir;

vec3 spectrum(float t) {
  vec3 c0 = vec3(0.133, 0.902, 1.000); // #22E6FF cyan
  vec3 c1 = vec3(0.498, 0.941, 1.000); // #7FF0FF cyan-l
  vec3 c2 = vec3(0.545, 0.361, 0.965); // #8B5CF6 violet
  vec3 c3 = vec3(1.000, 0.180, 0.592); // #FF2E97 magenta
  vec3 c4 = vec3(0.780, 0.055, 0.431); // #C70E6E ember
  t = clamp(t, 0.0, 1.0);
  if (t < 0.25) return mix(c0, c1, t / 0.25);
  if (t < 0.55) return mix(c1, c2, (t - 0.25) / 0.30);
  if (t < 0.80) return mix(c2, c3, (t - 0.55) / 0.25);
  return mix(c3, c4, (t - 0.80) / 0.20);
}

void main() {
  float fres = 1.0 - clamp(dot(normalize(vWorldNormal), normalize(vViewDir)), 0.0, 1.0);
  float rim = pow(fres, uPower);
  float t = fract(fres * 1.2 + uTime * 0.03); // hue breathes slowly
  vec3 col = spectrum(t);
  vec3 body = vec3(0.043, 0.035, 0.067); // ~ void-1, the dark glass interior
  vec3 color = body + col * rim * uIntensity;
  float alpha = clamp(0.18 + rim * 1.1, 0.0, 1.0);
  gl_FragColor = vec4(color, alpha);
}
