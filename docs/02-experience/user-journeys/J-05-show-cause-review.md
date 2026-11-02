# J-05 — Show Cause Notice Issuance & Dual-Auth Adjudication

| Metadata            | Value                                                                                                                                                                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Journey ID          | `J-05`                                                                                                                                                                                                                                                                             |
| Journey Title       | Show Cause Notice Issuance, Institutional Evidence Submission & Dual-Authorization Adjudication                                                                                                                                                                                    |
| Status              | `CONFIRMED`                                                                                                                                                                                                                                                                        |
| Primary Personas    | `AICTE_REVIEWER` (Scrutiny Officer), `INST_ADMIN` (Institution Respondent), `AICTE_ADMIN` (Approving Executive)                                                                                                                                                                    |
| Source Requirements | [`AIRE-REQ-041`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-047`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-178`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-184`](../../00-governance/requirements-traceability.md) |
| Related Screens     | [`S-15`](../screen-specifications/S-15-exceptions-notices.md), [`S-16`](../screen-specifications/S-16-evidence-upload-drawer.md), [`S-24`](../screen-specifications/S-24-show-cause-dispatcher.md), [`S-25`](../screen-specifications/S-25-exception-detail.md)                    |
| Last Updated        | 2 November 2026                                                                                                                                                                                                                                                                    |

---

## 1. Goal & Context

When a reconciliation run flags an irreconcilable statutory breach (e.g. over-intake or unapproved seats), an `AICTE_REVIEWER` issues a formal, time-bound Show Cause Notice. The affected institution's `INST_ADMIN` is notified, reviews the mathematical breach trace, and submits digital counter-evidence (such as student withdrawal affidavits, state centralized admission cancellation slips, or fee refund receipts) into an isolated evidence vault. The `AICTE_REVIEWER` re-evaluates the case and enters a reasoned recommendation. Finally, under strict Separation of Duties, an `AICTE_ADMIN` reviews the findings and digitally co-signs the final order to execute resolution.

---

## 2. Preconditions

- A deterministic reconciliation run (`M10`) has generated an active discrepancy finding in `OPEN` status.
- Reviewer possesses `exception.assign` and `exception.request_evidence` permissions.
- Institution respondent holds `INST_ADMIN` role within the target institution tenant.
- Final approving officer possesses `AICTE_ADMIN` role with `exception.resolve` permission.

---

## 3. Entry Point

- AICTE Reviewer: Show Cause Dispatcher (`/aicte/exceptions`), clicking _"Dispatch Show Cause"_.
- Institution Administrator: Institution Exceptions (`/institution/exceptions`), clicking _"Respond to Show Cause Notice"_.
- AICTE Executive: AICTE Overview (`/aicte/overview`), clicking _"Pending Dual Co-Signatures"_.

---

## 4. Main Success Path

```mermaid
sequenceDiagram
    autonumber
    actor Rev as AICTE Reviewer
    actor Inst as Inst Administrator
    actor Exec as AICTE Admin (Approver)
    participant UI as React Client (S-15, S-16, S-24, S-25)
    participant API as Express API
    participant Vault as Private Evidence Vault (S3/MinIO)
    participant DB as PostgreSQL (Prisma + RLS)

    Note over Rev,UI: Phase A: Notice Issuance
    Rev->>UI: Selects unentitled quota discrepancy in S-24
    Rev->>UI: Configures response window (14 days), checks legal citations
    Rev->>API: POST /api/v1/exceptions/:id/show-cause (violatedRule, excessSeats)
    API->>DB: Transitions exception status: OPEN -> SHOW_CAUSE_ISSUED
    API->>DB: Generates immutable notice with deadline timestamp
    API-->>UI: Notice dispatched; countdown begins

    Note over Inst,UI: Phase B: Evidence Submission
    Inst->>UI: Navigates to S-15; views active Show Cause alert (12 days remaining)
    Inst->>UI: Opens Evidence Upload Drawer (S-16)
    Inst->>UI: Attaches 4 student withdrawal slips & stamped refund proofs (PDF)
    Inst->>API: POST /api/v1/exceptions/:id/evidence (multipart upload)
    API->>Vault: Stores encrypted documents in private bucket (no public URLs)
    API->>DB: Records evidence_documents & links to exception
    Inst->>UI: Enters formal response statement; clicks "Submit to AICTE"
    UI->>API: POST /api/v1/exceptions/:id/respond
    API->>DB: Transitions exception: SHOW_CAUSE_ISSUED -> EVIDENCE_SUBMITTED

    Note over Rev,Exec: Phase C: Inquiry & Dual-Authorization
    Rev->>UI: Opens Exception Detail (S-25); inspects uploaded withdrawal PDFs
    Rev->>UI: Verifies withdrawal timestamps precede regulatory freeze date
    Rev->>UI: Enters inquiry report: "Withdrawals verified genuine. Quota restored."
    Rev->>UI: Recommends: RESOLVED_COMPLIANT
    Rev->>API: POST /api/v1/exceptions/:id/recommend
    API->>DB: Transitions exception: UNDER_REVIEW (Awaiting Co-Sign)

    Exec->>UI: Accesses S-25 Executive View; reviews reviewer recommendation
    Exec->>UI: Clicks "Co-Sign & Execute Resolution"
    UI->>Exec: Displays Dual-Authorization Re-Auth Modal
    Exec->>UI: Enters admin password / credentials
    UI->>API: POST /api/v1/exceptions/:id/resolve (dualSignoff: true)
    API->>DB: Validates distinct user IDs (Rev.id != Exec.id)
    API->>DB: Transitions exception -> RESOLVED_COMPLIANT
    API->>DB: Writes immutable audit record with both actor signatures
    API-->>UI: Resolution confirmed; legal notice closed; institution notified
```

### Detailed Operational Steps

1. **Dispatching the Notice (`S-24`):**
   - The reviewer selects an over-admission finding (e.g. 4 excess seats in B.Tech CSE).
   - The Show Cause Dispatcher modal opens:
     - Violated AICTE Rule: `APH-2026-CH4-INTAKE-LIMIT`.
     - Calculated Excess: `4 seats`.
     - Response Window Selector: `7 Days`, `14 Days` (Default), or `21 Days`.
     - Official Notice Draft: Auto-populated with institution code, programme details, and regulatory warning.
   - Reviewer clicks _"Dispatch Official Notice"_. Status transitions to `SHOW_CAUSE_ISSUED`.
2. **Institutional Evidence Submission (`S-15` & `S-16`):**
   - The institution administrator sees the high-priority notice with a prominent countdown badge.
   - Clicks _"Submit Evidence"_, opening the right-hand slide-over Evidence Upload Drawer (`S-16`).
   - Administrator attaches scanned copies of signed student cancellation applications and university refund vouchers.
   - Inputs explanation: _"4 candidates cancelled their seats on 12 Sept 2026 before freeze deadline; college admissions were within 60 seats."_
   - Clicks _"Submit Formal Response"_. Exception moves to `EVIDENCE_SUBMITTED`.
3. **Reviewer Evaluation (`S-25`):**
   - Reviewer opens the Exception Detail workbench.
   - Inspects the attached evidence directly via an embedded secure PDF viewer (served via authenticated ephemeral streams, never public URLs).
   - Reviews chronological event ledger confirming that the cancellation dates precede the annual freeze.
   - Records formal inquiry finding and recommends resolution category:
     - `RESOLVED_COMPLIANT`: Evidence accepted; admissions validated.
     - `RESOLVED_PENALTY`: Over-admission confirmed; mandatory penalty seat reduction for subsequent academic year.
     - `ESCALATED`: Referred to AICTE Standing Hearing Committee (SHC) for derecognition.
4. **Dual-Authorization Executive Co-Signature (`S-25`):**
   - The case is routed into the executive approval queue of an `AICTE_ADMIN`.
   - The approving officer examines the inquiry report and uploaded artifacts.
   - Clicks _"Co-Sign and Execute Resolution"_.
   - Enters step-up credentials in the dual-sign-off modal.
   - System verifies that the reviewer and the approver are two completely distinct individuals.
   - Database writes the final disposition and publishes an audited resolution event.

---

## 5. Alternate & Failure Paths

### 5.1 Failure to Respond Within Window

- If the countdown timer reaches zero without an institutional response:
  - System automatically escalates the exception: `STATUS_DEFAULTED_TO_PENALTY`.
  - Notification dispatches to AICTE Regional Director for immediate statutory sanction.

### 5.2 Separation of Duties Violation Block

- If the `AICTE_REVIEWER` who drafted the Show Cause notice attempts to co-sign the final resolution:
  - Backend authorization service immediately rejects the request: `ERROR_SOD_VIOLATION: Independent approving officer signature required.`
  - UI displays an informative alert preventing self-approval.

---

## 6. Privacy & Legal Integrity

- **Private Object Storage:** Institutional counter-evidence documents are stored in encrypted private storage with access logged in `evidence_access_events`.
- **Non-Repudiation:** Both the reviewer's recommendation and the executive's co-signature are cryptographically bound to the final resolution record.
