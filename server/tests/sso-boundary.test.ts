import { describe, it, expect } from "vitest";
import {
  SUPPORTED_SSO_PROVIDERS,
  isSsoProviderEnabled,
  validateSafeAccountLinkingPreconditions,
  SsoProviderId,
} from "../src/services/sso/sso-boundary.js";

describe("SSO Provider Boundary & Safe Account Linking Contract", () => {
  it("marks all external SSO providers as FUTURE_SCOPE_NOT_IMPLEMENTED", () => {
    const providerIds: SsoProviderId[] = [
      "aicte-sso",
      "meripehchaan",
      "digilocker",
    ];

    providerIds.forEach((id) => {
      const provider = SUPPORTED_SSO_PROVIDERS[id];
      expect(provider).toBeDefined();
      expect(provider.status).toBe("FUTURE_SCOPE_NOT_IMPLEMENTED");
      expect(isSsoProviderEnabled(id)).toBe(false);
    });
  });

  it("blocks account linking when user has no active authenticated AIRE session", () => {
    const result = validateSafeAccountLinkingPreconditions({
      hasActiveAireSession: false,
      providerVerifiedEmail: true,
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("UNAUTHENTICATED");
  });

  it("blocks account linking when external provider email is unverified (prevents ATO)", () => {
    const result = validateSafeAccountLinkingPreconditions({
      hasActiveAireSession: true,
      providerVerifiedEmail: false,
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("UNVERIFIED_EMAIL");
  });

  it("permits account linking when session is active and email is verified by provider", () => {
    const result = validateSafeAccountLinkingPreconditions({
      hasActiveAireSession: true,
      providerVerifiedEmail: true,
    });

    expect(result.allowed).toBe(true);
    expect(result.reason).toBeUndefined();
  });
});
