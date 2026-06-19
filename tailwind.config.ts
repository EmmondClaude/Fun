import type { Config } from "tailwindcss";

/**
 * Refracted Dark tokens. One light source, refracted — every hue is the same
 * beam split through glass, always in spectrum order:
 *   cyan → cyan-l → violet → magenta → ember.
 * Components consume `dark-*` only; no arbitrary hex anywhere downstream.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          "void-0": "#141121", // soft radial center — never flat black
          "void-1": "#07060B", // true shadow at the edges
          cyan: "#22E6FF",
          "cyan-l": "#7FF0FF",
          violet: "#8B5CF6",
          magenta: "#FF2E97",
          ember: "#C70E6E",
          ink: "#F4F1FF",
          muted: "#9B95B8",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        // the spectrum, in the one true order — accents + display only
        spectrum:
          "linear-gradient(90deg, #22E6FF 0%, #7FF0FF 22%, #8B5CF6 52%, #FF2E97 80%, #C70E6E 100%)",
        // void: radial darkness breathing from a soft center to true shadow
        void: "radial-gradient(120% 120% at 50% 38%, #141121 0%, #0B0916 45%, #07060B 100%)",
      },
      transitionTimingFunction: {
        // expo-out — nothing snaps, everything decelerates into place
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "grain-shift": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -10%)" },
          "30%": { transform: "translate(3%, -15%)" },
          "50%": { transform: "translate(-8%, 5%)" },
          "70%": { transform: "translate(6%, 10%)" },
          "90%": { transform: "translate(-3%, 8%)" },
        },
      },
      animation: {
        "grain-shift": "grain-shift 8s steps(6) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
