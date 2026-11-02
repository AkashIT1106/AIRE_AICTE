# S-04 — Multi-Tenant Organization Switcher

| Metadata             | Value                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-04`                                                                                                                                 |
| Screen Name          | Multi-Tenant Organization & Campus Context Switcher                                                                                    |
| Purpose              | Header dropdown enabling multi-institution administrators, registrars, or regional reviewers to switch tenant scope securely           |
| User Roles Allowed   | Multi-Tenant Users (`INST_ADMIN`, `INST_OPERATOR`, `AICTE_REVIEWER`)                                                                   |
| Related Journeys     | [`J-01`](../user-journeys/J-01-authentication.md)                                                                                      |
| Primary Route        | Header dropdown in Shell (`S-00`)                                                                                                      |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                  |
| Source Reference     | PROJECT_PLAN.md §5.3, §10.1; [`docs/02-experience/information-architecture.md`](../information-architecture.md) §7                     |
| Related Requirements | [`AIRE-REQ-074`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-100`](../../00-governance/requirements-traceability.md) |
| Last Updated         | 2 November 2026                                                                                                                        |

---

## 1. Information Hierarchy & Content

1. **Trigger Pill:** Displays Active College Name, AICTE Permanent Institute ID, and campus badge with a downward chevron.
2. **Search Input:** Inline search to filter authorized institutions by name or ID.
3. **Tenant Selection List:**
   - Displays authorized institutions where user holds active memberships.
   - Shows role badge per institution (e.g. `INST_ADMIN` at Campus A, `INST_OPERATOR` at Campus B).
4. **Tenant Switch Action:**
   - Clicking an institution sets the active tenant context in PostgreSQL transaction state, clears client cache, and redirects to the target institution's dashboard.
