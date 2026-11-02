# S-38 — Public Cryptographic AEP Verifier Card

| Metadata             | Value                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-38`                                                                                                                                 |
| Screen Name          | Public Cryptographic Admission Entitlement Proof (AEP) Verifier Terminal                                                               |
| Purpose              | Publicly accessible verification view to authenticate student admission claims via QR code or cryptographic token without exposing PII |
| User Roles Allowed   | Public / External Verifier (`VERIFIER`, Employers, Academic Evaluators, General Public)                                                |
| Related Journeys     | [`J-07`](../user-journeys/J-07-external-aep-verification.md)                                                                           |
| Primary Route        | `/verify/:token`                                                                                                                       |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                  |
| Source Reference     | PROJECT_PLAN.md §10.1, §31; [`docs/02-experience/role-workspace-specification.md`](../role-workspace-specification.md) §4.2            |
| Related Requirements | [`AIRE-REQ-052`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-053`](../../00-governance/requirements-traceability.md) |
| Last Updated         | 2 November 2026                                                                                                                        |

---

## 1. Information Hierarchy & Content Sections

1. **Header Emblem:** AICTE regulatory mark + _"National Admission Entitlement Verification Portal"_.
2. **Instant Cryptographic Verification Card:**
   - **Prominent Authenticity Banner:**
     - `AUTHENTIC & LEGITIMATE ADMISSION` (Large Emerald Shield & Checkmark).
     - Renders immediate confidence to background screening officers.
   - **Verified Educational Details:**
     - Candidate Full Name: E.g. _"Rohan Sharma"_.
     - Admitted Institution: Full Official College Name (e.g. _"Indian Institute of Technology (BHU) Varanasi"_).
     - Permanent Institute ID: `1-3920192`.
     - Conferred Degree Programme: _"Bachelor of Technology in Metallurgical Engineering"_.
     - Admitted Academic Year: _"2026-2027"_.
     - AICTE Extension of Approval (EOA) Reference: Official Order Reference Number.
     - Tamper Evidence Hash: Cryptographic Merkle Root Digest.
3. **Privacy Disclaimer (Mandatory):**
   - _"In compliance with the Digital Personal Data Protection (DPDP) Act, 2023, personal contact information, residential addresses, and reservation categories are not disclosed on public verification surfaces."_
4. **Action Control:**
   - _"Download Verification Summary Receipt (.pdf)"_ for corporate background check files.

---

## 2. Invalid & Revocation States

- **Invalid / Tampered Token:** Red alert card with crossmark: _"VERIFICATION FAILED: The cryptographic signature is invalid or has been modified. This document cannot be authenticated."_
- **Superseded / Revoked Record:** Amber alert card: _"ADMISSION SUPERSEDED / REVOKED: This admission was officially cancelled by the institution on [Date]."_
