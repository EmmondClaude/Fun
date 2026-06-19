import { Hero } from "@/components/hero/Hero";

// Server component. All 3D is client-only; nothing here imports three.
export default function Page() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-void">
      <Hero />
    </main>
  );
}
