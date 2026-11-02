# SSO Provider Integration Boundary & Architecture Guide

## 1. Overview and Status

**Current Status:** Future Scope — Not Implemented in Phase 2.

In Phase 2, AIRE utilizes **Better Auth** for local email/password authentication and manages authorization, tenant isolation, and PostgreSQL RLS internally. Live integrations with external SSO providers (such as AICTE SSO, MeriPehchaan, and DigiLocker) are decoupled and deferred until official credentials, onboarding approvals, and verified specifications are provided.

This document describes the architectural boundary and step-by-step procedure for connecting external identity providers in future phases without altering AIRE's security foundation.

---

## 2. Decoupled Architecture

```
+-----------------------------------------------------------------------------------------+
| EXTERNAL IDENTITY PROVIDERS (Future Scope)                                              |
| - AICTE SSO (OIDC/SAML2)                                                                |
| - MeriPehchaan (National SSO / NSSO - OIDC/SAML2)                                       |
| - DigiLocker Identity                                                                   |
+-----------------------------------------------------------------------------------------+
                                           |
                              OAuth2 / OIDC Callback
                                           v
+-----------------------------------------------------------------------------------------+
| BETTER AUTH LAYER (Authentication Boundary)                                             |
| - genericOAuth plugin receives token & user claims (sub, email, name)                   |
| - Validates JWT signature, nonce, and issuer metadata                                   |
| - Maps external identity to Better Auth `Account` (providerId, accountId)               |
| - Generates standard AIRE session cookie (HttpOnly, Secure, SameSite)                   |
+-----------------------------------------------------------------------------------------+
                                           |
                                   session.user.id
                                           v
+-----------------------------------------------------------------------------------------+
| AIRE AUTHORIZATION & TENANT BOUNDARY (Zero Redesign Needed)                             |
| - Resolves User -> InstitutionMember (Status: ACTIVE / INACTIVE / REVOKED)             |
| - External login NEVER grants AIRE roles, institution membership, or regulatory power   |
| - Centralized middleware evaluates permissions (requirePermission)                      |
| - withTenantContext sets SET LOCAL app.current_tenant_id inside interactive transaction |
| - PostgreSQL Engine enforces Forced Row-Level Security                                  |
+-----------------------------------------------------------------------------------------+
```

---

## 3. How External Providers Will Be Added Later

When official credentials and endpoint specifications become available:

### Step 1: Configure Better Auth `genericOAuth` Plugin

In `server/src/config/auth.ts`, add Better Auth's `genericOAuth` plugin:

```typescript
import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";

export const auth = betterAuth({
  // existing config ...
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "meripehchaan",
          clientId: env.MERIPEHCHAAN_CLIENT_ID!,
          clientSecret: env.MERIPEHCHAAN_CLIENT_SECRET!,
          discoveryUrl:
            "https://meripehchaan.gov.in/public/oauth2/1/.well-known/openid-configuration",
          scopes: ["openid", "profile"],
        },
      ],
    }),
  ],
});
```

### Step 2: Safe Account Linking Rules

To prevent Account Takeover (ATO):

1. **No Automatic Email Merging:** If an SSO login returns an email that matches an existing AIRE user, Better Auth must NOT automatically merge the accounts unless the external identity was explicitly linked by an authenticated user.
2. **Explicit Linking Flow:** A user wishing to link their MeriPehchaan or AICTE SSO identity must first log in with their AIRE credentials and initiate linking from their security settings.

### Step 3: Zero Impact on Authorization and RLS

Notice that once Better Auth authenticates the external user and creates a session:

1. The request enters Express with a valid `session.user.id`.
2. AIRE's `requirePermission` middleware queries `institution_members` to resolve tenant access.
3. If an institution administrator has not formally provisioned membership for that user, the user has **NO ACCESS** to any tenant or regulatory data (default deny).
4. `withTenantContext` and PostgreSQL RLS continue enforcing data isolation at the database engine level with zero modifications.

---

## 4. Distinct Provider Characteristics

| Provider                | Purpose                               | Separation Rule                                                                                                                                          |
| ----------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **MeriPehchaan (NSSO)** | Citizen / Official Single Sign-On     | MeriPehchaan proves identity; does not grant AICTE regulatory roles.                                                                                     |
| **AICTE SSO**           | Institutional / Council Staff Sign-On | Private endpoints; requires institutional onboarding approval.                                                                                           |
| **DigiLocker**          | Identity vs. Document Access          | Authenticating via DigiLocker does **NOT** grant document fetch access. Document exchange requires separate partner consent gateways under the DPDP Act. |
