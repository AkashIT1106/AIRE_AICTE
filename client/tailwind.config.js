import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        aire: {
          canvas: "var(--ux4g-color-neutral-0)",
          subtle: "var(--ux4g-color-neutral-50)",
          soft: "var(--ux4g-color-neutral-100)",
          border: "var(--ux4g-color-neutral-200)",
          line: "var(--ux4g-color-neutral-300)",
          primary: "var(--ux4g-color-primary-600)",
          "primary-hover": "var(--ux4g-color-primary-700)",
          lavender: "var(--ux4g-color-primary-50)",
          text: "var(--ux4g-color-neutral-900)",
          muted: "var(--ux4g-color-neutral-700)",
          amber: "var(--ux4g-color-secondary-50)",
          "amber-text": "var(--ux4g-color-secondary-700)",
        },
      },
      fontFamily: {
        sans: [
          '"Noto Sans"',
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
