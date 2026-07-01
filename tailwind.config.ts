import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "palm-deep": "#1B3D2F",
        palm: "#3F7259",
        "palm-soft": "#BFD3C3",
        sand: "#E8DCC4",
        linen: "#FBF8F1",
        ink: "#221F1A",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
