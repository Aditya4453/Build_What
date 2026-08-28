import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-container": "var(--color-primary-container)",
        secondary: "var(--color-secondary)",
        surface: "var(--color-surface)",
        "surface-low": "var(--color-surface-low)",
        "surface-container": "var(--color-surface-container)",
        outline: "var(--color-outline)",
        "outline-variant": "var(--color-outline-variant)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)"
      },
      fontFamily: {
        sans: ["var(--font-family)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      fontSize: {
        xxs: ["var(--text-xxs)", { lineHeight: "var(--lh-xxs)" }],
        xs: ["var(--text-xs)", { lineHeight: "var(--lh-xs)" }],
        sm: ["var(--text-sm)", { lineHeight: "var(--lh-sm)" }],
        base: ["var(--text-base)", { lineHeight: "var(--lh-base)" }],
        lg: ["var(--text-lg)", { lineHeight: "var(--lh-lg)" }],
        xl: ["var(--text-xl)", { lineHeight: "var(--lh-xl)" }],
        "2xl": ["var(--text-2xl)", { lineHeight: "var(--lh-2xl)" }],
        "3xl": ["var(--text-3xl)", { lineHeight: "var(--lh-3xl)" }],
        "4xl": ["var(--text-4xl)", { lineHeight: "var(--lh-4xl)" }]
      },
      boxShadow: {
        civic: "0 10px 40px -6px rgba(11, 21, 41, 0.05), 0 4px 16px -4px rgba(11, 21, 41, 0.03)"
      }
    }
  },
  plugins: []
} satisfies Config;
