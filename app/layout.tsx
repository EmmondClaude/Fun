import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
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

export const metadata: Metadata = {
  title: "Afterdark — Refracted Dark",
  description:
    "One light source, refracted. A reactive hero that resolves to a beautiful still when motion is off.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jetbrains.variable}`}>
      <body className="bg-dark-void-1 font-mono text-dark-ink antialiased">
        <SiteHeader />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
