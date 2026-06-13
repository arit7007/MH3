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
          50: "#eef6f5",
          100: "#d6eae8",
          200: "#aed5d1",
          300: "#7fbab4",
          400: "#519a94",
          500: "#357f79",
          600: "#286662",
          700: "#225350",
          800: "#1d423f",
          900: "#173432",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
