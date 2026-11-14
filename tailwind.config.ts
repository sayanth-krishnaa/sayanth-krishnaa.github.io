import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        portfolio: {
          bg: "#0B0C10",
          card: "#1F2833",
          lightCard: "#FFFFFF",
          border: "#2A2E35",
          accent: "#C5A880", // Tomasz Gajda template warm gold / premium highlight
          accentHover: "#B3956D",
          darkBg: "#121212",
          grayText: "#8F9094",
        }
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-montserrat)", "sans-serif"]
      }
    },
  },
  plugins: [],
};
export default config;
