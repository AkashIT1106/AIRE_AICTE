# Milestones and Exit Criteria (Definition of Done)

| Metadata             | Value                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/09-delivery/milestones-and-exit-criteria.md`                                                                                 |
| Authoritative For    | Milestone Gates, Exit Criteria, Definition of Done                                                                                 |
| Status               | `CONFIRMED`                                                                                                                        |
| Source               | PROJECT_PLAN.md §41, §42, §47                                                                                                      |
| Related Requirements | [`AIRE-REQ-220`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-243`](../00-governance/requirements-traceability.md) |

---

## 1. Definition of Done (DoD)

A task, module, or milestone is considered **Done** only when:

1. **Code & Types:** Strict TypeScript mode passes with zero errors; no `any` types introduced.
2. **Validation:** All inputs validated via Zod schemas at runtime boundaries.
3. **Security & Isolation:** Forced RLS policies verified by automated cross-tenant tests.
4. **Tests Passing:** Unit, integration, and applicable adversarial test suites pass.
5. **Database Discipline:** Schema changes captured in committed SQL migrations.
6. **Documentation Updated:** Authoritative domain specifications in `docs/` reflect the change; traceability matrix updated.
7. **No Unrequested Additions:** Zero unrequested libraries, features, or architectural layers added.
