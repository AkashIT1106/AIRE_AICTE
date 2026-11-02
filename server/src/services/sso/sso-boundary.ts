/**
 * AIRE SSO Provider Integration Boundary.
 *
 * Scope: Future Phase SSO Readiness.
 * External SSO providers (AICTE SSO, MeriPehchaan, DigiLocker) are NOT implemented in Phase 2.
 *
 * This boundary establishes the contract and decoupling required so external providers
 * can be plugged into Better Auth later via `genericOAuth` plugins WITHOUT redesigning:
 * - Better Auth core sessions
 * - AIRE domain authorization
 * - User-to-institution memberships
 * - Secure transaction wrappers (`withTenantContext`)
 * - PostgreSQL Row-Level Security (RLS)
 */

export type SsoProviderId = "aicte-sso" | "meripehchaan" | "digilocker";

export interface ExternalSsoProviderMetadata {
  providerId: SsoProviderId;
  name: string;
  protocol: "OIDC" | "SAML2";
  status: "FUTURE_SCOPE_NOT_IMPLEMENTED";
  requiredScopes: readonly string[];
  docReference: string;
}

export const SUPPORTED_SSO_PROVIDERS: Record<
  SsoProviderId,
  ExternalSsoProviderMetadata
> = {
  "aicte-sso": {
    providerId: "aicte-sso",
    name: "AICTE Unified Single Sign-On",
    protocol: "OIDC",
    status: "FUTURE_SCOPE_NOT_IMPLEMENTED",
    requiredScopes: ["openid", "email", "profile"],
    docReference: "docs/SSO_PROVIDER_INTEGRATION_BOUNDARY.md",
  },
  meripehchaan: {
    providerId: "meripehchaan",
    name: "MeriPehchaan (National Single Sign-On / NSSO)",
    protocol: "OIDC",
    status: "FUTURE_SCOPE_NOT_IMPLEMENTED",
    requiredScopes: ["openid", "profile"],
    docReference: "docs/SSO_PROVIDER_INTEGRATION_BOUNDARY.md",
  },
  digilocker: {
    providerId: "digilocker",
    name: "DigiLocker Identity",
    protocol: "OIDC",
    status: "FUTURE_SCOPE_NOT_IMPLEMENTED",
    requiredScopes: ["openid"],
    docReference: "docs/SSO_PROVIDER_INTEGRATION_BOUNDARY.md",
  },
};

/**
 * Returns false. No live external SSO provider is enabled in Phase 2.
 */
export function isSsoProviderEnabled(_providerId: SsoProviderId): boolean {
  return false;
}

/**
 * Safe Account Linking Specification:
 * In future phases, linking an external provider identity (e.g. from MeriPehchaan or AICTE SSO)
 * to an existing AIRE user MUST require an already-authenticated AIRE session.
 * Automated account linking based solely on matching unverified emails is strictly prohibited
 * to eliminate Account Takeover vulnerabilities.
 */
export function validateSafeAccountLinkingPreconditions(params: {
  hasActiveAireSession: boolean;
  providerVerifiedEmail?: boolean;
}): { allowed: boolean; reason?: string } {
  if (!params.hasActiveAireSession) {
    return {
      allowed: false,
      reason:
        "UNAUTHENTICATED: External account linking requires an existing authenticated AIRE session.",
    };
  }

  if (params.providerVerifiedEmail === false) {
    return {
      allowed: false,
      reason:
        "UNVERIFIED_EMAIL: External provider did not attest to email verification.",
    };
  }

  return { allowed: true };
}
