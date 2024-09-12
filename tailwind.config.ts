import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blueish: {
          100: '#E0E4E8', // Light Gray (for text)
          200: '#4A5D81', // Steel Blue (for accents)
          300: '#2F3A4F', // Slate Blue (for secondary elements)
          400: '#1E2A38', // Dark Blue (for headers)
          500: '#121C28', // Very Dark Blue (for backgrounds)
          600: '#2A3E55', // Muted Blue (for buttons)
          700: '#3B4F68', // Hover Effect Blue (for button hover)
          800: '#1A2633', // Darker Blue (for borders/dividers)
        },
      },
    },
  },
  plugins: [],
};
export default config;
