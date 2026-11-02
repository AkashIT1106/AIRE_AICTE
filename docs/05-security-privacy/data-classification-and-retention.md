# Data Classification and Retention Policy

| Metadata             | Value                                                                                                                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Document             | `docs/05-security-privacy/data-classification-and-retention.md`                                                                                                                                                                                                    |
| Authoritative For    | 4-Tier Data Classification, Retention Schedules, Legal Holds                                                                                                                                                                                                       |
| Status               | `CONFIRMED`                                                                                                                                                                                                                                                        |
| Source               | PROJECT_PLAN.md §15.2, §15.3, §15.4, §19.4                                                                                                                                                                                                                         |
| Related Requirements | [`AIRE-REQ-091`](../00-governance/requirements-traceability.md), [`AIRE-REQ-095`](../00-governance/requirements-traceability.md), [`AIRE-REQ-118`](../00-governance/requirements-traceability.md), [`AIRE-REQ-119`](../00-governance/requirements-traceability.md) |

---

## 1. Four-Tier Data Classification Matrix

| Tier       | Classification     | Examples                                                                                                               | Controls & Restrictions                                                         |
| ---------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Tier 1** | `PUBLIC`           | Approved AICTE institution list, sanctioned programme intake, regulatory policy rules, public AEP verification status. | Openly accessible; cached at edge; no authentication required.                  |
| **Tier 2** | `INTERNAL`         | Aggregated state admission statistics, submission metadata, system performance metrics.                                | Authenticated users; scoped by organizational hierarchy.                        |
| **Tier 3** | `CONFIDENTIAL`     | Unsealed batch admissions, Show Cause notices, institutional hearing transcripts, reviewer internal notes.             | Restricted to tenant operators and designated AICTE regional reviewers.         |
| **Tier 4** | `RESTRICTED / PII` | Student 12-digit APAAR ID, Aadhaar number, parental income certificates, caste certificates.                           | Stored exclusively in Identity Vault; envelope encrypted; purpose-bound access. |

---

## 2. Retention Schedules & Legal Holds

1. **Active Operational Records:** Retained throughout the duration of the student's degree programme plus 1 academic year (total: 5 years for engineering, 3 years for diploma).
2. **Verifiable Admission Ledger & AEP:** Retained indefinitely as permanent permanent educational records.
3. **Ingestion Staging & Quarantined Batches:** Automatically purged 90 days after successful batch sealing.
4. **Audit Trail Logs:** Retained for a minimum of 7 years in cold append-only storage.
5. **Legal Hold Override:** When an institution or cohort is placed under formal inquiry or litigation, automated deletion schedules are suspended immediately until the legal hold is formally lifted.
