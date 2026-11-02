/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        aicte: {
          primary: "#1e3a8a",
          secondary: "#0f766e",
          accent: "#d97706",
          danger: "#dc2626",
        },
      },
    },
  },
  plugins: [],
};
