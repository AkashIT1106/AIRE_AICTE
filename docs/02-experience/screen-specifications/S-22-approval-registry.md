# S-22 — Approval Order Master Registry

| Metadata             | Value                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Screen ID            | `S-22`                                                                                                                                     |
| Screen Name          | Approval Order (EOA / LOA) Master Ingestion & Version Registry                                                                             |
| Purpose              | Official repository of Extension of Approval (EOA) and Letter of Approval (LOA) orders; tracks seat entitlements, amendments, and hashes   |
| User Roles Allowed   | `AICTE_ADMIN`, `AICTE_REVIEWER`                                                                                                            |
| Related Journeys     | Master Data Governance (Audit J-06)                                                                                                        |
| Primary Route        | `/aicte/approvals`                                                                                                                         |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                      |
| Source Reference     | PROJECT_PLAN.md §22; [`docs/04-domain/business-rules/intake-and-quota-rules.md`](../../04-domain/business-rules/intake-and-quota-rules.md) |
| Related Requirements | [`AIRE-REQ-007`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-013`](../../00-governance/requirements-traceability.md)   |
| Last Updated         | 2 November 2026                                                                                                                            |

---

## 1. Information Hierarchy & Content

1. **Header Context:** Breadcrumb: `AICTE > Approval Registry`.
2. **Search & Filter Controls:** Permanent Institute ID, Academic Year, State, Document Type (`EOA`, `LOA`, `AMENDMENT`).
3. **Master Approvals Table:**
   - Order Number & Issuance Date.
   - Target Institution & Campus.
   - Sanctioned Programme Entitlements (Branch, Approved Intake, Category Breakdowns).
   - Version & Amendment Number (Preserving full historical lineage).
   - Attached Official PDF Order link.
4. **Primary Action:** _"Ingest New Approval Order"_ (`bg-indigo-600 text-white`).
