# Testing Strategy and Adversarial Quality Gate

| Metadata             | Value                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/08-engineering/testing-strategy.md`                                                                                          |
| Authoritative For    | Testing Pyramid, Adversarial RLS Tests, Quality Gates                                                                              |
| Status               | `CONFIRMED`                                                                                                                        |
| Source               | PROJECT_PLAN.md §37.1 to §37.4                                                                                                     |
| Related Requirements | [`AIRE-REQ-212`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-219`](../00-governance/requirements-traceability.md) |

---

## 1. Testing Pyramid

````
       /       / E2E \         End-to-End Vertical Slice (Ingestion -> AEP)
     /-------    / Integration\    API Routes, BullMQ Workers, PostgreSQL Forced RLS Tests
   /---------------  /   Unit Tests    \ Pure Quota Math, Zod Validation, Policy Rule Fixtures
 /-------------------```

---

## 2. Mandatory Adversarial Test Suite

CI must execute adversarial security tests before any release or phase gate passage:

1. **Adversarial Cross-Tenant Leakage:** Automated test connects as `INST_OPERATOR` of Institution A and attempts to query `AdmissionRecord` belonging to Institution B. 100% of attempts must return 0 rows or trigger RLS rejection.
2. **Privilege Escalation Defense:** Automated test sends forged tokens or manipulated role headers claiming `AICTE_ADMIN`. Must receive HTTP 403.
3. **AEP Cryptographic Tamper Invalidation:** Test alters 1 bit in an issued AEP payload. Verification suite must detect the signature mismatch and reject the certificate.
4. **Deterministic Reconciliation Verification:** Test executes 100 identical reconciliation runs on a synthetic 1,000-student cohort. Results, mismatch counts, and hashes must be identical across all runs.

---

## 3. CI Gate Criteria

Pre-commit and CI pipelines enforce:
- `pnpm run typecheck`: 0 TypeScript compiler errors.
- `pnpm run lint`: 0 linter errors across all packages.
- `pnpm run test`: 100% passing tests.
- `pnpm run build`: Clean build of all workspace packages.
````
