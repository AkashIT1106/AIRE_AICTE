# Coding Standards and Architecture Layers

| Metadata          | Value                                                       |
| ----------------- | ----------------------------------------------------------- |
| Document          | `docs/08-engineering/coding-standards.md`                   |
| Authoritative For | TypeScript Rules, Layer Responsibilities, Coding Guidelines |
| Status            | `CONFIRMED`                                                 |
| Source            | PROJECT_PLAN.md §11.2, §36.1 to §36.3, AGENTS.md §9         |

---

## 1. TypeScript Rules & Quality Standards

1. **Strict Mode Enabled:** `tsconfig.base.json` enforces `strict: true`, `noImplicitAny: true`, and `strictNullChecks: true`.
2. **Zero `any` Policy:** Explicit types or generic parameters are required everywhere.
3. **Zod Parsing at Boundaries:** All untrusted external inputs (HTTP request bodies, query parameters, external API responses, file rows) must pass through Zod `.parse()` or `.safeParse()`.

---

## 2. Layer Responsibilities

Code inside `server/src/` is organized into distinct architectural layers:

```
[ Routes ]          HTTP method mapping, path parameters, middleware attachment. Thin.
    |
[ Controllers ]     Extracts params, validates DTO with Zod, invokes services, maps response envelope.
    |
[ Services ]        Pure domain logic, transaction coordination, outbox event dispatch.
    |
[ Repositories ]    Prisma queries, tenant context enforcement, raw SQL queries.
```

- Domain business logic **must never** live inside route files or UI components.
- Domain calculations (e.g. quota math) must reside in pure functions inside `packages/reconciliation/` with zero database dependencies.
