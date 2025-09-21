/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Nunito", "sans-serif"],
        body: ["Source Sans Pro", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#E30613", // Calgary Red
          light: "#FF4D5B",   // lighter tint
          dark: "#A5000D",    // darker shade
        },
        neutral: {
          white: "#FFFFFF",
          black: "#2B2B2B",
          grayLight: "#F5F5F5",
          gray: "#9C9C9C",
        },
        accent: {
          amber: "#FFB347",
          steel: "#3A6EA5",
        },
        darkmode: {
          bg: "#121212",
          panel: "#1E1E1E",
        },
      },
    },
  },
  plugins: [],
};