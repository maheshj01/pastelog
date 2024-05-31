import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: '#4f46e5',  // Custom primary color
        secondary: '#10b981', // Custom secondary color
        accent: '#f59e0b',    // Custom accent color
        background: '#f3f4f6',// Custom background color
        surface: '#ffffff',   // Custom surface color
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Custom font
        serif: ['Merriweather', 'serif'],
      },
      spacing: {
        '128': '32rem', // Custom spacing value
      },
      borderRadius: {
        '4xl': '2rem',  // Custom border radius
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()]
};
export default config;
