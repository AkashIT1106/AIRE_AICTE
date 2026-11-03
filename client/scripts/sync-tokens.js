import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKENS_PATH = path.resolve(__dirname, "../design-tokens.json");
const CSS_PATH = path.resolve(__dirname, "../src/index.css");

function hexToHsl(hex) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  return {
    h: hDeg,
    s: sPct,
    l: lPct,
    stringVal: `${hDeg} ${sPct}% ${lPct}%`,
  };
}

export function loadAndResolveTokens() {
  const fileContent = fs.readFileSync(TOKENS_PATH, "utf-8");
  const raw = JSON.parse(fileContent);

  function getByPath(root, pathStr) {
    const parts = pathStr.split(".");
    let current = root;
    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    return current;
  }

  function resolveValue(val) {
    if (typeof val === "string" && val.startsWith("{") && val.endsWith("}")) {
      const targetPath = val.slice(1, -1);
      const targetNode = getByPath(raw, targetPath);
      if (!targetNode) {
        throw new Error(`Unresolved token reference: ${val}`);
      }
      return resolveValue(targetNode.$value);
    }
    if (val && typeof val === "object" && "hex" in val) {
      return val.hex;
    }
    return val;
  }

  const resolved = {};

  function traverse(node, prefix = "") {
    for (const [key, val] of Object.entries(node)) {
      if (key.startsWith("$")) continue;
      const currentPath = prefix ? `${prefix}.${key}` : key;
      if (val && typeof val === "object") {
        if ("$value" in val) {
          const res = resolveValue(val.$value);
          resolved[currentPath] = res;
        } else {
          traverse(val, currentPath);
        }
      }
    }
  }

  traverse(raw);
  return { raw, resolved };
}

export function syncTokensToCss() {
  const { resolved } = loadAndResolveTokens();

  // Extract key colors
  const canvas = resolved["color.semantic.surface.canvas"];
  const card = resolved["color.semantic.surface.card"];
  const cardSubdued = resolved["color.semantic.surface.card-subdued"];
  const header = resolved["color.semantic.surface.header"];
  const sidebar = resolved["color.semantic.surface.sidebar"];
  const overlay =
    resolved["color.semantic.surface.overlay"] || "rgba(23, 43, 58, 0.6)";

  const textPrimary = resolved["color.semantic.text.primary"];
  const textSecondary = resolved["color.semantic.text.secondary"];
  const textMuted = resolved["color.semantic.text.muted"];
  const textInverted = resolved["color.semantic.text.inverted"];
  const textLink = resolved["color.semantic.text.link"];

  const borderSubtle = resolved["color.semantic.border.subtle"];
  const borderDefault = resolved["color.semantic.border.default"];
  const borderStrong = resolved["color.semantic.border.strong"];
  const borderInteractive = resolved["color.semantic.border.interactive"];

  const brandPrimary = resolved["color.semantic.action.primary"];
  const brandPrimaryHover = resolved["color.semantic.action.primary-hover"];
  const brandPrimaryActive = resolved["color.semantic.action.primary-active"];
  const brandSubtle = resolved["color.semantic.action.primary-subtle"];
  const brandTeal = resolved["color.semantic.accent.teal"];

  const stateSuccessBg = resolved["color.semantic.status.success.bg"];
  const stateSuccessBorder = resolved["color.semantic.status.success.border"];
  const stateSuccessText = resolved["color.semantic.status.success.text"];
  const stateSuccessIcon = resolved["color.semantic.status.success.icon"];

  const stateWarningBg = resolved["color.semantic.status.warning.bg"];
  const stateWarningBorder = resolved["color.semantic.status.warning.border"];
  const stateWarningText = resolved["color.semantic.status.warning.text"];
  const stateWarningIcon = resolved["color.semantic.status.warning.icon"];

  const stateDangerBg = resolved["color.semantic.status.error.bg"];
  const stateDangerBorder = resolved["color.semantic.status.error.border"];
  const stateDangerText = resolved["color.semantic.status.error.text"];
  const stateDangerIcon = resolved["color.semantic.status.error.icon"];

  const stateInfoBg = resolved["color.semantic.status.info.bg"];
  const stateInfoBorder = resolved["color.semantic.status.info.border"];
  const stateInfoText = resolved["color.semantic.status.info.text"];
  const stateInfoIcon = resolved["color.semantic.status.info.icon"];

  const maskedBg = resolved["color.semantic.masked.bg"];
  const maskedBorder = resolved["color.semantic.masked.border"];
  const maskedText = resolved["color.semantic.masked.text"];
  const maskedIcon = resolved["color.semantic.masked.icon"];

  const focusRing = resolved["color.semantic.focus.ring"];
  const focusRingOffset = resolved["color.semantic.focus.offset"];

  // Compute shadcn/Radix HSL equivalents
  const backgroundHsl = hexToHsl(canvas).stringVal;
  const foregroundHsl = hexToHsl(textPrimary).stringVal;
  const cardHsl = hexToHsl(card).stringVal;
  const cardForegroundHsl = hexToHsl(textPrimary).stringVal;
  const popoverHsl = hexToHsl(card).stringVal;
  const popoverForegroundHsl = hexToHsl(textPrimary).stringVal;
  const primaryHsl = hexToHsl(brandPrimary).stringVal;
  const primaryForegroundHsl = hexToHsl(textInverted).stringVal;
  const secondaryHsl = hexToHsl(cardSubdued).stringVal;
  const secondaryForegroundHsl = hexToHsl(textPrimary).stringVal;
  const mutedHsl = hexToHsl(cardSubdued).stringVal;
  const mutedForegroundHsl = hexToHsl(textMuted).stringVal;
  const accentHsl = hexToHsl(focusRing).stringVal;
  const accentForegroundHsl = hexToHsl(textInverted).stringVal;
  const destructiveHsl = hexToHsl(stateDangerIcon).stringVal;
  const destructiveForegroundHsl = hexToHsl(textInverted).stringVal;
  const borderHsl = hexToHsl(borderDefault).stringVal;
  const inputHsl = hexToHsl(borderDefault).stringVal;
  const ringHsl = hexToHsl(focusRing).stringVal;

  const generatedCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* ==========================================================================
   AIRE Canonical Design Tokens (Generated from client/design-tokens.json)
   DO NOT manually edit hex values here; run "pnpm run build:tokens" to sync.
   ========================================================================== */

@layer base {
  :root {
    /* Surfaces */
    --surface-canvas: ${canvas};
    --surface-card: ${card};
    --surface-card-subdued: ${cardSubdued};
    --surface-header: ${header};
    --surface-sidebar: ${sidebar};
    --surface-overlay: ${overlay};

    /* Text */
    --text-primary: ${textPrimary};
    --text-secondary: ${textSecondary};
    --text-muted: ${textMuted};
    --text-inverted: ${textInverted};
    --text-link: ${textLink};

    /* Borders */
    --border-subtle: ${borderSubtle};
    --border-default: ${borderDefault};
    --border-strong: ${borderStrong};
    --border-interactive: ${borderInteractive};

    /* Brand & Interactive (Institutional Navy & Teal Accent) */
    --brand-primary: ${brandPrimary};
    --brand-primary-hover: ${brandPrimaryHover};
    --brand-primary-active: ${brandPrimaryActive};
    --brand-subtle: ${brandSubtle};
    --brand-teal: ${brandTeal};

    /* Stacking */
    --z-header: 40;
    --z-overlay: 50;
    --z-toast: 60;

    /* Semantic Status */
    --state-success-bg: ${stateSuccessBg};
    --state-success-border: ${stateSuccessBorder};
    --state-success-text: ${stateSuccessText};
    --state-success-icon: ${stateSuccessIcon};

    --state-warning-bg: ${stateWarningBg};
    --state-warning-border: ${stateWarningBorder};
    --state-warning-text: ${stateWarningText};
    --state-warning-icon: ${stateWarningIcon};

    --state-danger-bg: ${stateDangerBg};
    --state-danger-border: ${stateDangerBorder};
    --state-danger-text: ${stateDangerText};
    --state-danger-icon: ${stateDangerIcon};

    --state-info-bg: ${stateInfoBg};
    --state-info-border: ${stateInfoBorder};
    --state-info-text: ${stateInfoText};
    --state-info-icon: ${stateInfoIcon};

    /* Privacy & Masked Data */
    --masked-data-bg: ${maskedBg};
    --masked-data-border: ${maskedBorder};
    --masked-data-text: ${maskedText};
    --masked-data-icon: ${maskedIcon};

    /* Focus Ring (WCAG 2.2 AA SC 2.4.11 / 2.4.13) */
    --focus-ring: ${focusRing};
    --focus-ring-offset: ${focusRingOffset};

    /* Standard shadcn HSL mapping synchronized with AIRE tokens */
    --background: ${backgroundHsl};
    --foreground: ${foregroundHsl};
    --card: ${cardHsl};
    --card-foreground: ${cardForegroundHsl};
    --popover: ${popoverHsl};
    --popover-foreground: ${popoverForegroundHsl};
    --primary: ${primaryHsl};
    --primary-foreground: ${primaryForegroundHsl};
    --secondary: ${secondaryHsl};
    --secondary-foreground: ${secondaryForegroundHsl};
    --muted: ${mutedHsl};
    --muted-foreground: ${mutedForegroundHsl};
    --accent: ${accentHsl};
    --accent-foreground: ${accentForegroundHsl};
    --destructive: ${destructiveHsl};
    --destructive-foreground: ${destructiveForegroundHsl};
    --border: ${borderHsl};
    --input: ${inputHsl};
    --ring: ${ringHsl};
    --radius: 0.25rem;
  }

  body {
    background-color: var(--surface-canvas);
    color: var(--text-primary);
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
  }
}

/* Tabular numbers for regulatory data, quotas, roll numbers, digests */
.font-tabular {
  font-feature-settings: "tnum" 1;
  font-variant-numeric: tabular-nums;
}

/* High-density institutional data tables (DD-004) */
.table-compact th,
.table-compact td {
  height: 36px;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: 0.8125rem; /* 13px */
  line-height: 1.125rem; /* 18px */
}

/* Standard density public/mobile tables */
.table-standard th,
.table-standard td {
  height: 44px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.875rem; /* 14px */
  line-height: 1.25rem; /* 20px */
}

/* WCAG 2.2 AA SC 2.4.11 Visible Focus Indicator */
.focus-aire {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus-aire:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

@layer base {
  button:not(:disabled),
  a[href],
  [role="button"]:not([aria-disabled="true"]),
  summary,
  label[for],
  select,
  input[type="checkbox"],
  input[type="radio"] {
    cursor: pointer;
  }

  :disabled,
  [aria-disabled="true"] {
    cursor: not-allowed;
  }
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: -3rem;
  z-index: 70;
  border-radius: 4px;
  background: var(--brand-primary);
  color: var(--text-inverted);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.skip-link:focus {
  top: 0.75rem;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;

  fs.writeFileSync(CSS_PATH, generatedCss, "utf-8");
  console.log(
    `[build:tokens] Successfully synchronized tokens from ${TOKENS_PATH} -> ${CSS_PATH}`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncTokensToCss();
}
