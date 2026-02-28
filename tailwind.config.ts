import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        heading: ["var(--font-heading)", "sans-serif"]
      },
      colors: {
        cream: "#F4EFE6",
        sand: "#F7F1E8",
        walnut: "#4B2E1F",
        ember: "#D9733A",
        wood: "#8A6246"
      },
      boxShadow: {
        card: "0 10px 30px rgba(75, 46, 31, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
