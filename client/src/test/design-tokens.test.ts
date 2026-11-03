import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

// Color contrast utilities using exact W3C WCAG 2.2 formulas
function sRGBtoLin(c: number): number {
  c = c / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return 0.2126 * sRGBtoLin(r) + 0.7152 * sRGBtoLin(g) + 0.0722 * sRGBtoLin(b);
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Canonical Design Tokens & WCAG Contrast Validation", () => {
  const tokensPath = path.resolve(__dirname, "../../design-tokens.json");
  const indexPath = path.resolve(__dirname, "../index.css");

  it("design-tokens.json exists and is valid JSON following DTCG structure", () => {
    expect(fs.existsSync(tokensPath)).toBe(true);
    const content = fs.readFileSync(tokensPath, "utf-8");
    const parsed = JSON.parse(content);
    expect(parsed).toBeDefined();
    expect(parsed.color).toBeDefined();
    expect(parsed.color.primitive).toBeDefined();
    expect(parsed.color.semantic).toBeDefined();
    expect(parsed.typography).toBeDefined();
    expect(parsed.spacing).toBeDefined();
    expect(parsed.layout).toBeDefined();
    expect(parsed.component).toBeDefined();
  });

  it("resolves all token references without broken aliases", () => {
    const content = fs.readFileSync(tokensPath, "utf-8");
    const parsed = JSON.parse(content);

    function getByPath(root: any, pathStr: string): any {
      const parts = pathStr.split(".");
      let current = root;
      for (const part of parts) {
        if (current === undefined || current === null) return undefined;
        current = current[part];
      }
      return current;
    }

    function checkNode(node: any) {
      for (const [key, val] of Object.entries(node)) {
        if (key.startsWith("$")) continue;
        if (val && typeof val === "object") {
          if ("$value" in val) {
            const v = val.$value;
            if (typeof v === "string" && v.startsWith("{") && v.endsWith("}")) {
              const ref = v.slice(1, -1);
              const resolved = getByPath(parsed, ref);
              expect(
                resolved,
                `Reference ${v} should point to a valid token`,
              ).toBeDefined();
            }
          } else {
            checkNode(val);
          }
        }
      }
    }

    checkNode(parsed);
  });

  it("verifies WCAG 2.2 Level AA contrast requirements for core token pairings", () => {
    const content = fs.readFileSync(tokensPath, "utf-8");
    const parsed = JSON.parse(content);

    const navy = parsed.color.primitive.brand.navy["900"].$value.hex; // #183B56
    const actionBlue = parsed.color.primitive.brand.action.$value.hex; // #245B75
    const teal = parsed.color.primitive.brand.teal["700"].$value.hex; // #0F766E
    const white = parsed.color.primitive.neutral.surface.$value.hex; // #FFFFFF
    const canvas = parsed.color.primitive.neutral.canvas.$value.hex; // #F5F7F8
    const textPrimary = parsed.color.primitive.neutral.slate["900"].$value.hex; // #172B3A
    const textSecondary =
      parsed.color.primitive.neutral.slate["600"].$value.hex; // #526579
    const textMuted = parsed.color.primitive.neutral.slate["500"].$value.hex; // #5A6E82
    const borderStrong = parsed.color.primitive.neutral.slate["400"].$value.hex; // #7B90A2

    const successText = parsed.color.primitive.status.success.text.$value.hex;
    const successBg = parsed.color.primitive.status.success.bg.$value.hex;
    const warningText = parsed.color.primitive.status.warning.text.$value.hex;
    const warningBg = parsed.color.primitive.status.warning.bg.$value.hex;
    const dangerText = parsed.color.primitive.status.danger.text.$value.hex;
    const dangerBg = parsed.color.primitive.status.danger.bg.$value.hex;
    const infoText = parsed.color.primitive.status.info.text.$value.hex;
    const infoBg = parsed.color.primitive.status.info.bg.$value.hex;

    // 1. Primary Text on Surface and Canvas (WCAG AA: >= 4.5:1, Target AAA: >= 7.0:1)
    const crPrimarySurface = contrastRatio(textPrimary, white);
    const crPrimaryCanvas = contrastRatio(textPrimary, canvas);
    expect(crPrimarySurface).toBeGreaterThanOrEqual(7.0);
    expect(crPrimaryCanvas).toBeGreaterThanOrEqual(7.0);

    // 2. Secondary Text on Surface and Canvas (WCAG AA: >= 4.5:1)
    const crSecondarySurface = contrastRatio(textSecondary, white);
    const crSecondaryCanvas = contrastRatio(textSecondary, canvas);
    expect(crSecondarySurface).toBeGreaterThanOrEqual(4.5);
    expect(crSecondaryCanvas).toBeGreaterThanOrEqual(4.5);

    // 3. Muted Metadata Text on Surface and Canvas (WCAG AA: >= 4.5:1)
    const crMutedSurface = contrastRatio(textMuted, white);
    const crMutedCanvas = contrastRatio(textMuted, canvas);
    expect(crMutedSurface).toBeGreaterThanOrEqual(4.5);
    expect(crMutedCanvas).toBeGreaterThanOrEqual(4.5);

    // 4. White text on Institutional Navy (WCAG AA: >= 4.5:1, AAA: >= 7.0:1)
    const crNavy = contrastRatio(white, navy);
    expect(crNavy).toBeGreaterThanOrEqual(7.0);

    // 5. White text on Action Blue (WCAG AA: >= 4.5:1) and Teal Verification Accent
    const crAction = contrastRatio(white, actionBlue);
    expect(crAction).toBeGreaterThanOrEqual(4.5);
    const crTeal = contrastRatio(white, teal);
    expect(crTeal).toBeGreaterThanOrEqual(4.5);

    // 6. Focus indicator (Action Blue) against white surface and canvas (WCAG 2.2 SC 2.4.11 / 2.4.13: >= 3.0:1)
    const crFocusRingWhite = contrastRatio(actionBlue, white);
    const crFocusRingCanvas = contrastRatio(actionBlue, canvas);
    expect(crFocusRingWhite).toBeGreaterThanOrEqual(3.0);
    expect(crFocusRingCanvas).toBeGreaterThanOrEqual(3.0);

    // 7. Interactive border strong for UI controls (WCAG 2.2 SC 1.4.11: >= 3.0:1)
    const crBorderStrong = contrastRatio(borderStrong, white);
    expect(crBorderStrong).toBeGreaterThanOrEqual(3.0);

    // 8. Semantic Status text on status background tints (WCAG AA: >= 4.5:1)
    expect(contrastRatio(successText, successBg)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(warningText, warningBg)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(dangerText, dangerBg)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(infoText, infoBg)).toBeGreaterThanOrEqual(4.5);
  });

  it("index.css contains synchronized CSS custom properties matching canonical tokens", () => {
    const css = fs.readFileSync(indexPath, "utf-8");
    expect(css).toContain("--brand-primary: #245B75;");
    expect(css).toContain("--surface-canvas: #F5F7F8;");
    expect(css).toContain("--surface-header: #183B56;");
    expect(css).toContain("--surface-card: #FFFFFF;");
    expect(css).toContain("--text-primary: #172B3A;");
    expect(css).toContain("--text-secondary: #526579;");
    expect(css).toContain("--text-muted: #5A6E82;");
    expect(css).toContain("--focus-ring: #245B75;");
    expect(css).toContain("--border-subtle: #D8E0E8;");
    expect(css).toContain("--border-default: #D8E0E7;");
    expect(css).toContain("--border-strong: #7B90A2;");
  });
});
