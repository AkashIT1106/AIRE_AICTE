# J-06 — Student Entitlement View & AEP Retrieval

| Metadata            | Value                                                                                                                                                                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Journey ID          | `J-06`                                                                                                                                                                                                                                                                             |
| Journey Title       | Student Entitlement Verification, Admission Entitlement Proof (AEP) & Demographic Correction                                                                                                                                                                                       |
| Status              | `CONFIRMED`                                                                                                                                                                                                                                                                        |
| Primary Personas    | `STUDENT` (Enrolled Student)                                                                                                                                                                                                                                                       |
| Source Requirements | [`AIRE-REQ-048`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-051`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-188`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-192`](../../00-governance/requirements-traceability.md) |
| Related Screens     | [`S-30`](../screen-specifications/S-30-student-record.md), [`S-31`](../screen-specifications/S-31-aep-download.md), [`S-32`](../screen-specifications/S-32-correction-request.md)                                                                                                  |
| Last Updated        | 2 November 2026                                                                                                                                                                                                                                                                    |

---

## 1. Goal & Context

An enrolled technical student logs into the AIRE Student Portal to independently verify that their college admission has been legitimately reported, authenticated via APAAR, reconciled against approved AICTE intake quotas, and certified under an authoritative Approval Order. The student views their personal Admission Entitlement Proof (AEP), displays a high-contrast verifiable QR code for third-party verifiers, downloads an official tamper-evident PDF credential, or submits a structured demographic correction request if their name or date of birth was misspelled by the college operator.

---

## 2. Preconditions

- Student holds an authenticated account mapped to their unique APAAR ID / student identity reference.
- College has ingested and sealed the student's admission record in a batch.
- Student scope is strictly constrained: access is restricted 100% to the student's own individual record (`student_id = auth.user_id`).

---

## 3. Entry Point

- Direct login to `/login`, redirecting automatically to the Student Workspace root: `/student/record` (`S-30`).

---

## 4. Main Success Path

```mermaid
sequenceDiagram
    autonumber
    actor St as Student
    participant UI as React Client (S-30, S-31)
    participant API as Express API
    participant Vault as Identity Vault (AES-256)
    participant DB as PostgreSQL (Prisma + RLS)

    St->>UI: Logs in; arrives at /student/record (S-30)
    UI->>API: GET /api/v1/admissions/me
    API->>DB: Queries admission record where student_id = req.user.id
    API->>Vault: Retrieves verified student name & masked APAAR identifier
    DB-->>API: Returns admission status, EOA reference, AEP token
    API-->>UI: Renders Admission Entitlement Card (S-30)

    Note over St,UI: Status displayed: "VERIFIED & RECONCILED (COMPLIANT)"<br/>College: College of Engineering Pune (COEP)<br/>Branch: B.Tech Computer Engineering | Year: 2026-27

    St->>UI: Clicks "View Admission Entitlement Proof (AEP)"
    UI->>UI: Navigates to /student/credential (S-31)
    UI->>UI: Generates dynamic offline-verifiable SVG QR Code
    St->>UI: Clicks "Download Official PDF Proof"
    UI->>API: GET /api/v1/admission-proofs/:aepId/pdf
    API-->>UI: Streams cryptographically signed PDF document
    UI->>St: Browser saves "AIRE_Admission_Proof_2026.pdf"
```

### Detailed Operational Steps

1. **Viewing Personal Entitlement (`S-30`):**
   - The student is presented with a calm, high-legibility verification card:
     - **Verification Status Badge:**
       - `VERIFIED & RECONCILED` (Emerald Green): Fully compliant with AICTE seat quota.
       - `PENDING_INSTITUTION_SEAL` (Amber): Uploaded in draft, awaiting college principal sign-off.
       - `UNDER_REGULATORY_REVIEW` (Blue/Indigo): Subject to an open Show Cause inquiry.
     - **Institution Details:** Official AICTE College Name, Permanent Institute ID, Campus City.
     - **Academic Programme:** Conferred Degree, Discipline, Admitted Academic Year.
     - **Regulatory Citations:** AICTE Extension of Approval (EOA) Order Number & Issue Date.
     - **Identity Status:** Masked APAAR ID (`******-1234`) with green checkmark: _"Academic Identity Verified via National Gateway"_.
2. **Accessing the AEP Credential View (`S-31`):**
   - Student navigates to the Credential Tab.
   - The screen renders the **Admission Entitlement Proof (AEP)**:
     - Dynamic vector SVG QR Code containing an offline cryptographic verification token.
     - Tamper-Evident SHA-256 Hash Digest.
     - Issuance Timestamp and Certificate Serial Number.
   - Action buttons:
     - _"Download PDF Proof"_ (Generates an official document with security guilloche patterns, digital AIRE seal, and instructions for employers).
     - _"Copy Verification URL"_.
3. **Submitting a Demographic Correction (`S-32`):**
   - If the student observes a clerical typo (e.g. name spelled "Rohan Shrama" instead of "Rohan Sharma"):
   - Student clicks _"Request Correction"_.
   - Enters corrected spelling and uploads supporting proof (Class 10 Certificate / Digilocker record).
   - Submits request directly to the institution's registrar workbench without exposing other students' data.

---

## 5. Alternate & Failure Paths

### 5.1 Admission Under Regulatory Review

- If the college's admission batch is flagged for an intake quota breach (under active Show Cause investigation):
  - Student card status renders as: _"Under Regulatory Review"_.
  - Explanatory message: _"Your admission is currently undergoing routine regulatory reconciliation between your institution and AICTE. No action is required by you at this time."_
  - Protects student from panic while preserving complete transparency.

### 5.2 Admission Record Not Found

- If a student authenticates but their college has not yet uploaded the cohort:
  - Screen displays clean informational state: _"Admission Record Not Yet Reported: Your institution has not yet submitted admission batches for academic year 2026-27. Please contact your college registrar."_

---

## 6. Privacy & Purpose Limitation

- **Strict Data Minimization:** The student portal displays zero financial data, zero family income details, and zero unmasked Aadhaar information.
- **Strict Multi-Tenant Isolation:** Enforced natively via PostgreSQL Row-Level Security ensuring no student can manipulate query parameters or API payloads to view another candidate's records.
