import type { Config } from "tailwindcss";

// Design tokens — Malindi coastal identity.
// Ocean deep teal as the anchor, warm sand as the base, coral as the one hot accent (a tide, not a template terracotta),
// gold for the dhow-sail secondary accent used sparingly on progress states.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          DEFAULT: "#0E3B43",
          light: "#175C66",
          dark: "#082226",
        },
        lagoon: "#2A8C82",
        sand: {
          DEFAULT: "#F3E9D2",
          light: "#FAF5E9",
        },
        coral: "#E85D3D",
        gold: "#D9A441",
        ink: "#0B2027",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-worksans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sail: "2px 18px 2px 18px",
      },
    },
  },
  plugins: [],
};
export default config;
