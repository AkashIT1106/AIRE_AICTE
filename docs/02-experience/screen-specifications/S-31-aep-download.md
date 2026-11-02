# S-31 — AEP Credential View & Dynamic QR Display

| Metadata             | Value                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-31`                                                                                                                                       |
| Screen Name          | Admission Entitlement Proof (AEP) Credential & Verifiable QR Display                                                                         |
| Purpose              | Official digital certificate view of the student's Admission Entitlement Proof; renders dynamic high-contrast SVG QR code and PDF export     |
| User Roles Allowed   | `STUDENT`                                                                                                                                    |
| Related Journeys     | [`J-06`](../user-journeys/J-06-student-verification.md)                                                                                      |
| Primary Route        | `/student/credential`                                                                                                                        |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                        |
| Source Reference     | PROJECT_PLAN.md §2.4, §31; [`docs/04-domain/business-rules/reconciliation-rules.md`](../../04-domain/business-rules/reconciliation-rules.md) |
| Related Requirements | [`AIRE-REQ-050`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-051`](../../00-governance/requirements-traceability.md)       |
| Last Updated         | 2 November 2026                                                                                                                              |

---

## 1. Information Hierarchy & Content Sections

1. **Header Context:** Breadcrumb: `Student Portal > Entitlement Proof (AEP)`.
2. **Official AEP Certificate Card ( Guilloche Border Aesthetic):**
   - **Header Crest:** Government of India / AICTE official emblem.
   - **Document Title:** _"ADMISSION ENTITLEMENT PROOF (AEP) — ACADEMIC YEAR 2026-27"_.
   - **Legal Attestation Notice:** _"This document certifies that the admission of the candidate named herein has been reconciled against sanctioned seat entitlements and regulatory policies governed by the All India Council for Technical Education."_
   - **Core Details Grid:** Student Name, Roll No, Admitted College, Degree, Sanctioned Intake Order Number.
   - **Dynamic Verification QR Code:** High-contrast, scalable vector SVG QR code encoding the cryptographically signed offline verification token.
   - **Cryptographic Hash Digest:** Canonical SHA-256 batch Merkle digest (Monospace).
3. **Action Controls Bar:**
   - Primary: _"Download Official Signed PDF Credential"_ (`bg-indigo-600 text-white`).
   - Secondary: _"Copy Public Verification Link"_.
   - Informational Link: _"How Third-Party Verifiers Authenticate This Document"_.
