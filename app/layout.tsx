import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import { IntroTransition } from "@/components/intro/IntroTransition";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SpectralCursor } from "@/components/ui/SpectralCursor";
import "./globals.css";

// Serif display wordmark — held large and quiet. Light weights only.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "500"],
  display: "swap",
  variable: "--font-fraunces",
});

// Mono meta — whispered beneath. One line, never more.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://refracta.blaquelyoninc.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Refracta — Refracted Dark",
  description:
    "One light source, refracted. A reactive prism that resolves to a beautiful still when motion is off. By Blaque Lyon.",
  openGraph: {
    title: "Refracta — Refracted Dark",
    description: "One light source, refracted. By Blaque Lyon.",
    type: "website",
    url: SITE_URL,
    images: [
      {
        url: "/social/og-image.png",
        width: 1200,
        height: 630,
        alt: "Refracta — a refracted prism glowing in the void",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Refracta — Refracted Dark",
    description: "One light source, refracted. By Blaque Lyon.",
    images: ["/social/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jetbrains.variable}`}>
      <body className="bg-dark-void-1 font-mono text-dark-ink antialiased">
        <IntroTransition />
        <SiteHeader />
        <SmoothScroll>{children}</SmoothScroll>
        <SpectralCursor />
      </body>
    </html>
  );
}
