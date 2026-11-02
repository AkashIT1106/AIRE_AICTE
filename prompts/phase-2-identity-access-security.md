# AIRE Phase 2 Task Prompt: Identity, Access, Tenant Isolation & SSO Readiness

## 1. Goal

Implement AIRE's Phase 2 identity and security foundation in accordance with `PROJECT_PLAN.md` (Sections 11.4, 12, 16, 17, 18, 19, and Phase 2 Deliverables) and `AGENTS.md`.

Use **Better Auth** (`better-auth`) for authentication and session management. Retain AIRE's domain authorization, user-to-institution memberships, permission registry, tenant context derivation, PostgreSQL Row-Level Security (RLS) with restricted application DB roles, and audit logging within AIRE.

**Scope Note (Per User Instruction):** No live SSO integration tasks, provider-specific endpoints, credentials, protocol implementation, account-linking flows, or mock SSO flows are included in Phase 2. External SSO (AICTE SSO, MeriPehchaan, DigiLocker) is marked as **future scope — not implemented**. The architecture maintains a clean provider-integration boundary and clear documentation so external identity providers can be connected later without redesigning Better Auth, AIRE authorization, memberships, tenant context, or RLS.

---

## 2. Sources and References

- `AGENTS.md` (Engineering operating principles, phase discipline, security & RLS rules)
- `PROJECT_PLAN.md` (Sections 16: Authentication & Authorization, 17: Database Security & Tenant Isolation, 19: Audit, Phase 2 tasks)
- `.agents/skills/supabase-postgres-best-practices/SKILL.md` & reference docs (`security-privileges.md`, `security-rls-basics.md`)
- `.agents/skills/prisma-client-api/SKILL.md`, `prisma-cli/SKILL.md`
- `.agents/skills/zod/SKILL.md`
- `.agents/skills/typescript-advanced-types/SKILL.md`
- Better Auth official documentation for Express integration, `toNodeHandler`, `fromNodeHeaders`, and Prisma adapter

---

## 3. Phase 1 Audit Findings

An exhaustive audit of the Phase 1 codebase was conducted on 2026-11-02.

| Check                          | Status            | Command / Evidence                                                   | Details & Impact                                                                                                                                                                                                  |
| ------------------------------ | ----------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Git Status                     | **PASS**          | `git status`                                                         | Clean working tree on `main`, no uncommitted files.                                                                                                                                                               |
| Typecheck                      | **PASS**          | `pnpm run typecheck`                                                 | All 8 workspace projects compiled with 0 errors.                                                                                                                                                                  |
| Lint                           | **PASS**          | `pnpm run lint`                                                      | Oxlint checked 30 files with 96 rules, 0 errors, 0 warnings.                                                                                                                                                      |
| Formatting                     | **FAIL**          | `pnpm run format:check`                                              | Prettier reported code style issues on `AGENTS.md` (markdown formatting of tables/lists).                                                                                                                         |
| Build                          | **PASS**          | `pnpm run build`                                                     | All packages, client (Vite bundle), server (tsc), and workers compiled successfully.                                                                                                                              |
| Unit Tests                     | **PASS**          | `pnpm run test`                                                      | All 10 existing tests passed (6 server, 2 worker, 2 client).                                                                                                                                                      |
| API Startup                    | **PASS**          | `pnpm --filter @aire/server start`                                   | Server initialized and bound to port 4000 (`{"eventType":"SERVER_STARTUP","port":4000,"outcome":"LISTENING"}`).                                                                                                   |
| Worker Startup                 | **PASS**          | `pnpm --filter @aire/workers start`                                  | BullMQ worker initialized (`{"eventType":"WORKER_STARTUP","queueName":"aire-outbox-events","status":"INITIALIZING"}`).                                                                                            |
| Health Endpoints               | **PASS**          | `curl http://localhost:4000/api/v1/health` & `/ready`                | Both returned HTTP 200 with database latency 69ms and redis connected.                                                                                                                                            |
| Environment Validation         | **PASS**          | `packages/validation/src/index.ts`                                   | Zod schema validates required DB, Redis, and port variables.                                                                                                                                                      |
| Database Migration Pipeline    | **FAIL** (Defect) | `server/package.json` line 13 (`"prisma:migrate": "prisma db push"`) | `prisma db push` was used instead of committed migrations. No `prisma/migrations` directory exists. Violates `AGENTS.md` §9. Must be repaired as prerequisite.                                                    |
| Database Roles & RLS Readiness | **FAIL** (Defect) | `docker exec -i aire-postgres psql -U aire_user -d aire_db -c "\du"` | Only superuser `aire_user` (`Bypass RLS`) exists. In PostgreSQL, superusers completely bypass RLS. No non-superuser application role (`aire_app_user` with `NOBYPASSRLS`) or tenant isolation policies exist yet. |
| Better Auth Status             | **NOT RUN**       | `grep -i "better-auth" package.json`                                 | Not yet installed in repository (planned for Phase 2).                                                                                                                                                            |

### Prerequisite Repairs Required for Phase 2:

1. Transition from `prisma db push` to committed Prisma migrations (`prisma migrate dev` / `prisma migrate deploy`). Create baseline migration `0_init` for existing Phase 1 tables.
2. Initialize restricted PostgreSQL application role `aire_app_user` (`NOSUPERUSER`, `NOBYPASSRLS`) in Postgres initialization scripts to enable genuine database-enforced RLS.

---

## 4. Scope and Non-Goals

### In-Scope (Phase 2):

1. **Prerequisite Migration & Role Repair:**
   - Commit baseline migration for existing Phase 1 tables.
   - Configure PostgreSQL role `aire_app_user` with `NOBYPASSRLS` and grant appropriate table/schema permissions.
2. **Better Auth Installation & Core Configuration:**
   - Install `better-auth` (v1.7.x) and configure the Prisma database adapter in `@aire/server`.
   - Implement Better Auth schema in `prisma/schema.prisma` (`User`, `Session`, `Account`, `Verification`).
   - Mount Better Auth handler in Express before body-parser middleware via `toNodeHandler(auth)`.
   - Configure session cookies (`HttpOnly`, `Secure`, `SameSite=lax`) and server-side session resolution via `fromNodeHeaders`.
3. **AIRE Authorization & Membership Domain:**
   - Add models: `Institution`, `InstitutionMember` (with roles `INSTITUTION_ADMIN`, `INSTITUTION_OPERATOR`, statuses `ACTIVE`, `INACTIVE`, `REVOKED`), and `PlatformUserRole` (for `SUPER_ADMIN`, `AICTE_ADMIN`, `AICTE_REVIEWER`, `AUDITOR`).
   - Implement centralized AIRE authorization middleware in `server/src/middleware/authorize.ts` and `@aire/authorization`.
   - Default deny on protected endpoints.
4. **Tenant Isolation & PostgreSQL Row-Level Security (RLS):**
   - Create tenant-scoped model `InstitutionRecord` (or `TenantScopedEntity`) to anchor tenant isolation.
   - Enable `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` and `FORCE ROW LEVEL SECURITY`.
   - Write SQL policies enforcing `institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')`.
   - Implement `withTenantContext(institutionId, callback)` executing within `prisma.$transaction` using `SET LOCAL app.current_tenant_id`.
5. **Audit Logging Foundation:**
   - Record tenant-scoped audit events for authentication lifecycle, session revocation, membership checks, and tenant access failures in `audit_events`.
6. **SSO Provider Readiness Boundary:**
   - Create `server/src/services/sso/` module with verified OpenID Connect specification mappings.
   - Keep external SSO disabled by default (`SSO_ENABLED=false`).
   - Enforce safe account linking logic (no unverified automatic email merging).
   - Document required external credentials and onboarding checklist for AICTE SSO and MeriPehchaan.
7. **Comprehensive Security Test Suite:**
   - Automated tests verifying all 13 security scenarios mandated in user request §7.

### Non-Goals (Out of Scope for Phase 2):

- Building institution onboarding portals, admission submissions, student reconciliation, or approval management (Phases 3–5).
- Integrating unverified, unauthorized live external SSO credentials.
- Integrating DigiLocker document access APIs (consent gateways and document fetching are out of Phase 2 scope).
- Adding unrequested frontend workflows or redesigning UI components.

---

## 5. Technical Architecture & Component Design

### 5.1 Better Auth vs. AIRE Responsibility Boundary

```
+-----------------------------------------------------------------------------------------+
|                                    INCOMING REQUEST                                     |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------------+
| BETTER AUTH LAYER (Authentication & Session Lifecycle)                                  |
| - Verifies credentials / passwords (argon2/scrypt)                                     |
| - Issues / validates HttpOnly session cookies                                            |
| - Handles session creation, rotation, revocation (/api/auth/*)                          |
| - Mounts via toNodeHandler BEFORE express.json() to prevent stream locking              |
+-----------------------------------------------------------------------------------------+
                                           |
                                   session.user.id
                                           v
+-----------------------------------------------------------------------------------------+
| AIRE DOMAIN AUTHORIZATION LAYER (@aire/authorization & server middleware)               |
| - Resolves User -> InstitutionMember (Status: ACTIVE / INACTIVE / REVOKED)             |
| - Evaluates Role-Based Permissions against canonical Permission Registry                |
| - Verifies platform roles (AICTE_ADMIN, AICTE_REVIEWER) against assignment registry    |
| - Enforces DEFAULT DENY; rejects client-supplied institution IDs                        |
+-----------------------------------------------------------------------------------------+
                                           |
                            validated institutionId context
                                           v
+-----------------------------------------------------------------------------------------+
| SECURE TRANSACTION WRAPPER (withTenantContext)                                          |
| - Opens prisma.$transaction                                                             |
| - Sets SET LOCAL app.current_tenant_id = '<validated_institution_id>'                   |
| - Automatically clears context on COMMIT or ROLLBACK (zero connection pool leakage)     |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------------+
| POSTGRESQL ENGINE RLS LAYER                                                             |
| - Connects as aire_app_user (NOBYPASSRLS)                                               |
| - Table: FORCE ROW LEVEL SECURITY                                                        |
| - Policy: institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')   |
| - Missing or mismatched context -> 0 rows visible / write rejected                     |
+-----------------------------------------------------------------------------------------+
```

### 5.2 Database Schema Evolution

```prisma
// Better Auth Core Models
model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false) @map("email_verified")
  image         String?
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  sessions      Session[]
  accounts      Account[]
  memberships   InstitutionMember[]
  platformRoles PlatformUserRole[]

  @@map("users")
}

model Session {
  id        String   @id @default(uuid())
  expiresAt DateTime @map("expires_at")
  token     String   @unique
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  ipAddress String?  @map("ip_address")
  userAgent String?  @map("user_agent")
  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model Account {
  id                    String    @id @default(uuid())
  accountId             String    @map("account_id")
  providerId            String    @map("provider_id")
  userId                String    @map("user_id")
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?   @map("access_token")
  refreshToken          String?   @map("refresh_token")
  idToken               String?   @map("id_token")
  accessTokenExpiresAt  DateTime? @map("access_token_expires_at")
  refreshTokenExpiresAt DateTime? @map("refresh_token_expires_at")
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  @@unique([providerId, accountId])
  @@map("accounts")
}

model Verification {
  id         String    @id @default(uuid())
  identifier String
  value      String
  expiresAt  DateTime  @map("expires_at")
  createdAt  DateTime? @default(now()) @map("created_at")
  updatedAt  DateTime? @updatedAt @map("updated_at")

  @@map("verifications")
}

// AIRE Multi-Tenant Authorization Models
model Institution {
  id        String   @id @default(uuid())
  code      String   @unique
  name      String
  status    String   @default("ACTIVE") // ACTIVE, SUSPENDED, INACTIVE
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  members InstitutionMember[]
  records InstitutionRecord[]

  @@map("institutions")
}

model InstitutionMember {
  id            String   @id @default(uuid())
  institutionId String   @map("institution_id")
  userId        String   @map("user_id")
  role          String   @default("INSTITUTION_OPERATOR") // INSTITUTION_ADMIN, INSTITUTION_OPERATOR
  status        String   @default("ACTIVE") // ACTIVE, INACTIVE, REVOKED
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  institution   Institution @relation(fields: [institutionId], references: [id], onDelete: Cascade)
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([institutionId, userId])
  @@index([userId, status])
  @@map("institution_members")
}

model PlatformUserRole {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  role      String   // SUPER_ADMIN, AICTE_ADMIN, AICTE_REVIEWER, AUDITOR
  status    String   @default("ACTIVE") // ACTIVE, REVOKED
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, role])
  @@index([userId, status])
  @@map("platform_user_roles")
}

// Tenant-Scoped Table for RLS Verification
model InstitutionRecord {
  id            String   @id @default(uuid())
  institutionId String   @map("institution_id")
  title         String
  payload       Json?
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  institution   Institution @relation(fields: [institutionId], references: [id], onDelete: Cascade)

  @@index([institutionId])
  @@map("institution_records")
}
```

### 5.3 PostgreSQL RLS & Database Role Configuration

In migration SQL:

```sql
-- 1. Create dedicated application role if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'aire_app_user') THEN
    CREATE ROLE aire_app_user WITH LOGIN PASSWORD 'aire_app_secure_password' NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE;
  END IF;
END $$;

-- 2. Grant permissions to application role
GRANT USAGE ON SCHEMA public TO aire_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO aire_app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO aire_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO aire_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO aire_app_user;

-- 3. Configure RLS on tenant tables
ALTER TABLE institution_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_records FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_records_policy ON institution_records
  AS RESTRICTIVE
  FOR ALL
  USING (
    institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')
  )
  WITH CHECK (
    institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')
  );
```

### 5.4 SSO Provider Readiness Design

1. **MeriPehchaan (National SSO) Analysis:**
   - **Protocol:** OpenID Connect 1.0 (Authorization Code Flow with PKCE) and SAML 2.0.
   - **Endpoints (Standard OIDC):**
     - Authorization: `https://meripehchaan.gov.in/public/oauth2/1/authorize`
     - Token: `https://meripehchaan.gov.in/public/oauth2/1/token`
     - UserInfo: `https://meripehchaan.gov.in/public/oauth2/1/userinfo`
   - **Prerequisites for Live Integration:** Official entity onboarding via API Setu / MeriPehchaan portal, MoA/departmental approval, signed certificate exchange, and approved static redirect URIs.
   - **Status in AIRE:** `READY_FOR_CONFIG` (Adapter boundary implemented; credentials not fabricated).
2. **AICTE SSO Analysis:**
   - **Protocol:** AICTE portal authentication endpoints are private to AICTE web portals. No public `.well-known/openid-configuration` discovery document is exposed.
   - **Status in AIRE:** `PENDING_OFFICIAL_SPECIFICATION`.
3. **DigiLocker Separation:**
   - Meripehchaan authentication is NOT DigiLocker document access. Document fetching requires separate partner onboarding and consent gateway approval under India DPDP Act.
4. **Safe Account Linking Rules:**
   - External provider identities contain `providerId` and `accountId` (`sub`).
   - Automated linking based on unverified email is strictly prohibited (prevents Account Takeover).
   - Linking an external provider to an existing AIRE user requires the user to already hold an authenticated AIRE session before linking.

---

## 6. Acceptance Criteria

- [ ] **AC-1:** Better Auth installed and operational in `@aire/server`. Authentication endpoints (`/api/auth/*`) handle sign-up, sign-in, session query, and logout.
- [ ] **AC-2:** Session cookies configured with `HttpOnly`, `SameSite=lax`, and `Secure` (in production).
- [ ] **AC-3:** Migration pipeline restored. Baseline migration `0_init` and Phase 2 migration `1_phase2_identity` committed and cleanly applied via `prisma migrate deploy`.
- [ ] **AC-4:** Centralized AIRE authorization enforces default deny. Client-supplied institution parameters rejected; access derived solely from authenticated user memberships.
- [ ] **AC-5:** Revoked and inactive memberships immediately blocked from accessing institution resources.
- [ ] **AC-6:** PostgreSQL RLS strictly isolates `institution_records`. Queries using `withTenantContext` only see that tenant's records. Queries outside tenant context or with mismatched context return zero records.
- [ ] **AC-7:** Database application role `aire_app_user` has `NOBYPASSRLS`. Attempting direct query as application user without setting `app.current_tenant_id` returns 0 rows.
- [ ] **AC-8:** Tenant context leakage prevented across transactions and pool connections (verified by executing alternating tenant transactions sequentially).
- [ ] **AC-9:** Audit events recorded for all authentication attempts, membership changes, and tenant authorization failures.
- [ ] **AC-10:** SSO provider boundary in place, documented, and disabled by default until official credentials and approvals are present.
- [ ] **AC-11:** All 13 mandatory security test scenarios automated and passing.
- [ ] **AC-12:** `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`, and `pnpm run test` pass with 0 errors.

---

## 7. Automated Test Plan & Exact Commands

The following test suites will be added to `server/tests/`:

1. `server/tests/auth.test.ts`: Better Auth authentication lifecycle (sign up, sign in, bad credentials, session retrieval, logout, session revocation).
2. `server/tests/authorization.test.ts`: AIRE permission checks, active vs. inactive/revoked membership, platform role access, unauthenticated access rejection, role escalation prevention.
3. `server/tests/tenant-isolation.test.ts`: Direct PostgreSQL RLS validation, `withTenantContext` isolation, cross-tenant read/write prevention, empty context handling, connection-pool context isolation test, DB role RLS bypass attempt test.
4. `server/tests/sso-boundary.test.ts`: SSO configuration validation, safe account linking rules (preventing unverified auto-linking), disabled provider behavior.

**Execution commands:**

```bash
# Prisma migration
pnpm --filter @aire/server prisma:generate
pnpm --filter @aire/server prisma:migrate

# Code quality
pnpm run typecheck
pnpm run lint
pnpm run format:check

# Full test suite
pnpm run test

# Full monorepo build
pnpm run build
```

---

## 8. Migration & Rollback Strategy

1. **Migration Strategy:**
   - Execute baseline migration to record Phase 1 schema in `_prisma_migrations`.
   - Apply Phase 2 migration adding auth, membership, and tenant tables with forced RLS policies.
   - Run seed script to set up default test roles, institutions, and permissions in development/test database.
2. **Rollback Strategy:**
   - If migration fails, down-migration or database restore script safely rolls back schema.
   - Prisma schema maintains backward compatibility for existing health check and baseline audit tables.

### Mandatory implementation safeguards

- Treat the proposed Prisma schema and SQL snippets as design examples, not copy-paste implementation. Inspect existing models, installed versions, naming conventions, and official documentation before adapting them.
- Never hard-code database passwords, Better Auth secrets, OAuth client secrets, signing keys, or provider credentials in source code, migrations, fixtures, or logs.
- Separate migration/admin database credentials from the normal runtime application role. The runtime role must not own RLS-protected tables, be a superuser, or have `BYPASSRLS`.
- Verify RLS behavior for the actual runtime connection role. `NOBYPASSRLS` is necessary but does not by itself prevent table-owner bypass.
- Use parameterized, transaction-local tenant context. Verify that context is cleared on commit/rollback and cannot leak through pooled connections.
- Design membership/authorization lookups so the application can validate access before setting tenant context, without introducing an RLS bypass or recursive policy.
- Review migration SQL and verify clean-database setup and the existing-database upgrade path. Do not assume a new `0_init` migration safely baselines an existing database; use Prisma's documented baseline procedure where needed.
- Do not treat the proposed MeriPehchaan endpoints, protocols, or claims as verified. Confirm them against official provider specifications or onboarding material. If unavailable, document them as unresolved and keep live SSO disabled.
- Keep the implementation within approved Phase 2 scope. If a security design decision is unresolved, stop and ask rather than silently selecting a risky approach.

---

## 9. Blockers & Unresolved Questions

1. **Official Government SSO Credentials:**
   - Official credentials (Client ID, Client Secret, registered callback URL, signing certificates) for MeriPehchaan / AICTE SSO cannot be provisioned without official government entity onboarding.
   - **Safe resolution:** Implement provider-ready adapter architecture, fully test with mock/local OIDC test fixtures, and keep live production SSO disabled until credentials are provided.
