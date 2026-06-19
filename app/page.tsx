import { Closing } from "@/components/sections/Closing";
import { Facets } from "@/components/sections/Facets";
import { Hero } from "@/components/hero/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { SpectrumBeat } from "@/components/sections/SpectrumBeat";

// Server component. All 3D and scroll-beat work is client-only; nothing here
// imports three, gsap or lenis directly.
export default function Page() {
  return (
    <main id="top" className="relative w-full bg-void">
      <Hero />
      <Manifesto />
      <Facets />
      <SpectrumBeat />
      <Closing />
    </main>
  );
}
