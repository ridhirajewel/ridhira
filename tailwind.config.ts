import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F7F3EC",
        ink: "#241F1A",
        bark: "#4A4038",
        gold: "#A9863C",
        "gold-light": "#C9A961",
        bottle: "#2F3B33",
        oxblood: "#8B3A3A",
        hairline: "#E4DCCB",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
