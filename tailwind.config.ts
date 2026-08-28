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
      boxShadow: {
        civic: "0 10px 40px -6px rgba(11, 21, 41, 0.05), 0 4px 16px -4px rgba(11, 21, 41, 0.03)"
      }
    }
  },
  plugins: []
} satisfies Config;
