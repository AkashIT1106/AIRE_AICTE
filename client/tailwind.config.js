import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          950: "var(--aire-color-brand-deep)",
          900: "var(--aire-color-brand-primary-hover)",
          800: "var(--aire-color-brand-primary)",
          700: "var(--aire-color-brand-700)",
          600: "var(--aire-color-brand-600)",
          100: "var(--aire-color-brand-100)",
          50: "var(--aire-color-brand-50)",
          primary: "var(--aire-color-brand-primary)",
          deep: "var(--aire-color-brand-deep)",
        },
        teal: {
          800: "var(--aire-color-accent-teal)",
          50: "var(--aire-color-accent-teal-subtle)",
        },
        brass: {
          800: "var(--aire-color-accent-warm)",
          50: "var(--aire-color-accent-warm-subtle)",
        },
        neutral: {
          0: "var(--aire-color-surface-default)",
          25: "var(--aire-color-surface-soft)",
          50: "var(--aire-color-surface-page)",
          100: "var(--aire-color-surface-subtle)",
          150: "var(--aire-color-border-divider)",
          200: "var(--aire-color-border-default)",
          300: "var(--aire-color-border-strong)",
          600: "var(--aire-color-text-secondary)",
          800: "var(--aire-color-text-primary)",
        },
        state: {
          success: "var(--aire-color-state-success)",
          "success-bg": "var(--aire-color-state-success-bg)",
          "success-border": "var(--aire-color-state-success-border)",
          warning: "var(--aire-color-state-warning)",
          "warning-bg": "var(--aire-color-state-warning-bg)",
          "warning-border": "var(--aire-color-state-warning-border)",
          error: "var(--aire-color-state-error)",
          "error-bg": "var(--aire-color-state-error-bg)",
          "error-border": "var(--aire-color-state-error-border)",
          info: "var(--aire-color-state-info)",
          "info-bg": "var(--aire-color-state-info-bg)",
          "info-border": "var(--aire-color-state-info-border)",
          pending: "var(--aire-color-state-pending)",
          "pending-bg": "var(--aire-color-state-pending-bg)",
          "pending-border": "var(--aire-color-state-pending-border)",
        },
      },
      borderRadius: {
        control: "var(--aire-radius-control)",
        card: "var(--aire-radius-card)",
        feature: "var(--aire-radius-feature)",
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
