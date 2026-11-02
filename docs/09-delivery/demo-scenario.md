# Demonstration Scenario: End-to-End Vertical Slice

| Metadata             | Value                                                           |
| -------------------- | --------------------------------------------------------------- |
| Document             | `docs/09-delivery/demo-scenario.md`                             |
| Authoritative For    | Demonstration Script, Synthetic Dataset, Evaluation Sequence    |
| Status               | `CONFIRMED`                                                     |
| Source               | PROJECT_PLAN.md §41                                             |
| Related Requirements | [`AIRE-REQ-221`](../00-governance/requirements-traceability.md) |

---

## 1. Synthetic Demonstration Dataset

The demonstration uses a pre-generated synthetic dataset:

- **Institutions:** 2 Technical Colleges (Apex Engineering College, Bharat Polytechnic).
- **Programmes:** 4 Programmes (B.Tech CSE, B.Tech Mech, MBA, Diploma Civil).
- **Approved Quota:** CSE Sanctioned Intake = 60 seats (SC: 9, ST: 5, OBC: 16, GEN: 30; TFW: 3, EWS: 6).
- **Reported Admissions:** 65 students (deliberate over-admission breach of 5 seats + 1 dual enrollment).

---

## 2. Five-Step Demonstration Sequence

```
1. Ingestion: Operator uploads batch CSV -> Real-time Zod parsing -> Defective rows quarantined.
       |
2. APAAR Gateway: Async worker verifies 12-digit student tokens in Mock/Sandbox mode.
       |
3. Reconciliation: Engine evaluates intake -> Flags ERR_INTAKE_EXCEEDED (5 seats) + ERR_DUAL_ENROLLMENT.
       |
4. Exception Workbench: AICTE Reviewer issues Show Cause Notice -> Institution uploads affidavit -> Dual sign-off.
       |
5. AEP Issuance: Compliant students receive verifiable digital AEP credentials with QR code.
```
