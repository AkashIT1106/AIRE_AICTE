# Authorization and PostgreSQL Tenant Isolation

| Metadata             | Value                                                                                                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/05-security-privacy/authorization-and-tenant-isolation.md`                                                                                                                                    |
| Authoritative For    | Central Authorization, Forced RLS, Database Roles, Tenant Context                                                                                                                                   |
| Status               | `CONFIRMED`                                                                                                                                                                                         |
| Source               | PROJECT_PLAN.md §16.2 to §16.6, §17.1 to §17.6, ADR-005, ADR-006                                                                                                                                    |
| Related Requirements | [`AIRE-REQ-097`](../00-governance/requirements-traceability.md), [`AIRE-REQ-104`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-109`](../00-governance/requirements-traceability.md) |

---

## 1. Centralized Authorization Middleware

AIRE enforces a strict **default-deny** authorization policy:

1. **Authentication Gate:** Requests without a valid Better Auth session token are rejected with HTTP 401.
2. **Membership & Status Check:** Resolves `User -> InstitutionMember`. If status is `INACTIVE` or `REVOKED`, request is rejected with HTTP 403.
3. **Permission Evaluation (`requirePermission`):** Evaluates whether the user's role grants the requested action (e.g. `admission:upload`, `exception:review`).
4. **Scope & Hierarchy Check:** Validates that the user's scope covers the target entity (Global, Regional, Institution, or Campus).
5. **Purpose Check:** Sensitive student data reads require an explicit, audited processing purpose.

---

## 2. PostgreSQL Forced Row-Level Security (Forced RLS)

Multi-tenant data isolation is guaranteed at the database engine level:

- All tenant-owned tables (e.g. `SubmissionBatch`, `AdmissionRecord`, `LedgerEvent`, `ExceptionCase`) enable and force RLS:
  ```sql
  ALTER TABLE "AdmissionRecord" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "AdmissionRecord" FORCE ROW LEVEL SECURITY;
  ```
- RLS Policy isolates tenant records using session configuration:
  ```sql
  CREATE POLICY tenant_isolation_policy ON "AdmissionRecord"
    FOR ALL
    USING (
      tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::text
      OR
      current_setting('app.is_reviewer_bypass', true) = 'true'
    );
  ```

---

## 3. Database Roles & `withTenantContext` Wrapper

1. **Restricted Application Role:** The Node.js application connects to PostgreSQL using the unprivileged role `aire_app_user` (`NOSUPERUSER`, `NOBYPASSRLS`). Superusers completely bypass RLS and are strictly prohibited in application connection pools.
2. **Interactive Transaction Wrapper:** Every tenant-scoped database operation must execute within an interactive Prisma transaction using the approved wrapper:

```typescript
export async function withTenantContext<T>(
  tenantId: string,
  callback: (tx: PrismaTransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    // Set session variable local to this interactive transaction
    await tx.$executeRaw`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`;
    return callback(tx);
  });
}
```

3. **Connection Pool Hygiene:** Because connection pooling is utilized, `true` is passed to `set_config` to ensure the setting is strictly local to the transaction. Upon transaction commit or rollback, the variable is automatically reset, preventing tenant leakage across requests.
