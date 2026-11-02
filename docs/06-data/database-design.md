# Database Design and Migrations

| Metadata             | Value                                                           |
| -------------------- | --------------------------------------------------------------- |
| Document             | `docs/06-data/database-design.md`                               |
| Authoritative For    | Table Schemas, Primary Keys, Indexes, Migration Protocols       |
| Status               | `CONFIRMED`                                                     |
| Source               | PROJECT_PLAN.md §12.2, §12.3, ADR-006                           |
| Related Requirements | [`AIRE-REQ-238`](../00-governance/requirements-traceability.md) |

---

## 1. Primary Keys & Indexing Strategy

- **Identifiers:** Primary keys use `CUID2` or `UUIDv7` for time-sortable, cryptographically random identifiers across all distributed records.
- **Tenant Indexes:** Every tenant-scoped table features a compound index on `(tenant_id, id)` and `(tenant_id, created_at)` to optimize PostgreSQL RLS filter execution.
- **Deduplication Indexes:** High-speed lookup index on `student_token` across `AdmissionRecord` to enable instantaneous national duplicate detection during reconciliation.

---

## 2. Committed Prisma Migrations Protocol

To eliminate schema drift and guarantee production repeatability:

1. **No `db push`:** `prisma db push` is strictly disallowed in shared branches and production environments.
2. **Committed SQL Migrations:** Schema changes must be generated via:
   ```bash
   pnpm --filter @aire/server prisma migrate dev --name <migration_name>
   ```
3. **Migration Review:** Generated SQL files under `server/prisma/migrations/` must be manually inspected to verify:
   - Indexes on foreign keys and tenant columns exist.
   - Forced RLS (`ENABLE ROW LEVEL SECURITY; FORCE ROW LEVEL SECURITY;`) is applied to new multi-tenant tables.
   - Backward-compatible column additions (use nullable columns or default values).
