import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#0a0a0a",
        void: "#000000",
        surface: "#0a0a0f",
        gold: {
          DEFAULT: "#C9A962",
          light: "#E8D5A3",
          dark: "#8B7355",
          glow: "#FFD700",
        },
        electric: {
          blue: "#4A9EFF",
          purple: "#8B5CF6",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        display: ["Playfair Display", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-gold": "pulseGold 2s infinite",
        "electric": "electric 2s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201, 169, 98, 0.4)" },
          "50%": { boxShadow: "0 0 0 20px rgba(201, 169, 98, 0)" },
        },
        electric: {
          "0%, 100%": { filter: "brightness(1)" },
          "50%": { filter: "brightness(1.2)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(201, 169, 98, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(201, 169, 98, 0.6)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
