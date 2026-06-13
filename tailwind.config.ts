import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#FDF6F5",
          100: "#F5E6E4",
          200: "#EDCECA",
          300: "#D9A8A2",
          400: "#C47D77",
          500: "#B0625C",
          600: "#9D4F49",
          700: "#5C3A38",
          800: "#3D2523",
          900: "#1F1210",
        },
      },
      fontFamily: {
        sans:    ["var(--font-sans)",    "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 4px rgba(0,0,0,0.04), 0 4px 20px -2px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.07), 0 16px 40px -4px rgba(0,0,0,0.10)",
        float: "0 8px 32px -4px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
