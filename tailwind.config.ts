import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        "surface-glass": "var(--surface-glass)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        "muted-dark": "var(--muted-dark)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          glow: "var(--accent-glow)",
          secondary: "var(--accent-secondary)",
          subtle: "var(--accent-subtle)",
        },
        hud: {
          border: "var(--border-hud)",
          "border-bright": "var(--border-hud-bright)",
          grid: "var(--grid-hud)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-space)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-orbitron)", "Orbitron", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "hud-glow": "0 0 25px -5px var(--accent-glow)",
        "hud-glow-lg": "0 0 50px -10px var(--accent-glow)",
        "hud-card": "0 8px 32px 0 rgba(0, 0, 0, 0.7)",
      },
      animation: {
        "scan-line": "scanline 8s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "reticle-spin": "reticleSpin 20s linear infinite",
        "reverse-spin": "reverseSpin 25s linear infinite",
        "hud-shimmer": "shimmer 3s ease-in-out infinite",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.03)" },
        },
        reticleSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        reverseSpin: {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
