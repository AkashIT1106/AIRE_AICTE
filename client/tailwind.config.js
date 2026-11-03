import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // AIRE Semantic Surface Tokens
        surface: {
          canvas: "var(--surface-canvas)",
          card: "var(--surface-card)",
          "card-subdued": "var(--surface-card-subdued)",
          header: "var(--surface-header)",
          sidebar: "var(--surface-sidebar)",
          overlay: "var(--surface-overlay)",
        },
        // AIRE Semantic Text Tokens
        txt: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          inverted: "var(--text-inverted)",
          link: "var(--text-link)",
        },
        // AIRE Semantic Border Tokens
        line: {
          subtle: "var(--border-subtle)",
          default: "var(--border-default)",
          strong: "var(--border-strong)",
          interactive: "var(--border-interactive)",
        },
        // AIRE Semantic Brand Tokens
        brand: {
          primary: "var(--brand-primary)",
          hover: "var(--brand-primary-hover)",
          active: "var(--brand-primary-active)",
          subtle: "var(--brand-subtle)",
          teal: "var(--brand-teal)",
        },
        // AIRE Semantic Status Tokens
        state: {
          "success-bg": "var(--state-success-bg)",
          "success-border": "var(--state-success-border)",
          "success-text": "var(--state-success-text)",
          "success-icon": "var(--state-success-icon)",
          "warning-bg": "var(--state-warning-bg)",
          "warning-border": "var(--state-warning-border)",
          "warning-text": "var(--state-warning-text)",
          "warning-icon": "var(--state-warning-icon)",
          "danger-bg": "var(--state-danger-bg)",
          "danger-border": "var(--state-danger-border)",
          "danger-text": "var(--state-danger-text)",
          "danger-icon": "var(--state-danger-icon)",
          "info-bg": "var(--state-info-bg)",
          "info-border": "var(--state-info-border)",
          "info-text": "var(--state-info-text)",
          "info-icon": "var(--state-info-icon)",
        },
        // AIRE Privacy & Masked Data
        masked: {
          bg: "var(--masked-data-bg)",
          border: "var(--masked-data-border)",
          text: "var(--masked-data-text)",
          icon: "var(--masked-data-icon)",
        },
        // Focus Tokens
        focus: {
          ring: "var(--focus-ring)",
          offset: "var(--focus-ring-offset)",
        },
        // Standard shadcn / Radix semantic mapping
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Backward-compatible aicte palette mapped to canonical semantic tokens
        aicte: {
          primary: "var(--brand-primary)",
          secondary: "var(--brand-teal)",
          accent: "var(--state-warning-icon)",
          danger: "var(--state-danger-icon)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Menlo",
          "Monaco",
          "Consolas",
          "Courier New",
          "monospace",
        ],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "4px",
        lg: "8px",
        full: "9999px",
      },
      spacing: {
        "sidebar-expanded": "256px",
        "sidebar-collapsed": "64px",
        header: "64px",
        "row-compact": "36px",
        "row-standard": "44px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        modal:
          "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      },
      transitionDuration: {
        instant: "0ms",
        fast: "150ms",
        normal: "200ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0, 0, 0.2, 1)",
        "in-standard": "cubic-bezier(0.4, 0, 1, 1)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
