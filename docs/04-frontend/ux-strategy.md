# AIRE — User Experience Strategy

| Metadata     | Value                                              |
| ------------ | -------------------------------------------------- |
| Document     | `docs/04-frontend/ux-strategy.md`                  |
| Status       | `APPROVED`                                         |
| Reference    | UX4G Handbook Chapter 1 & 2 (Strategy & Discovery) |
| Last Updated | 3 November 2026                                    |

---

## 1. Product Purpose

AIRE (AICTE Admission Reconciliation & Evidence Platform) is a statutory regulatory platform designed to verify, reconcile, and audit higher education technical admissions across India.

AIRE exists to replace ad-hoc spreadsheet reporting, untracked admission over-intake, and unverified reservation claims with a deterministic, evidence-driven, and privacy-preserving reconciliation system.

---

## 2. Who Uses AIRE

1. **Institution Administrators (Registrars, Deans of Admission):** Legally accountable for institution admission reporting, intake quota adherence, and timely resolution of regulatory anomalies.
2. **Institution Data Operators:** Administrative staff responsible for preparing, validating, and uploading admission batches (CSV/Excel) from campus ERPs, and remediating row-level data errors.
3. **AICTE Regulatory Officers / Scrutiny Committees:** Authorized regional and central officers evaluating institutional intake compliance, issuing Show Cause notices, and reviewing institutional evidence.
4. **Students / Candidates:** Individuals seeking verifiable proof of authorized technical admission (Admission Entitlement Proof - AEP) without disclosing unnecessary demographic data.
5. **Independent Regulatory Auditors:** Statutory auditors inspecting the append-only event ledger and cryptographic logs for non-repudiation.
6. **External Degree / Credential Verifiers:** Third-party background verifiers validating cryptographically signed admission tokens via a lightweight public lookup.

---

## 3. Core Problems Solved

| Stakeholder        | Legacy Bottlenecks                                                                                             | AIRE Solution                                                                                                           |
| ------------------ | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Institutions**   | Opaque intake calculation rules; fear of retroactive penalization; repetitive manual data submissions.         | Deterministic intake validation before sealing; transparent rule engines; clear row-level error triage.                 |
| **AICTE Scrutiny** | Incomplete paper-based dossiers; delayed detection of supernumerary or quota violations; high dispute volumes. | Automated reconciliation across approved intake packs; instant mismatch taxonomy; cryptographically preserved evidence. |
| **Students**       | Risk of enrolling in unauthorized programmes; delayed degree recognition; identity theft.                      | Tamper-evident Admission Entitlement Proof (AEP); privacy-preserving identity vault.                                    |
| **Regulators**     | Lack of an immutable audit trail; difficulty proving historical compliance states during legal proceedings.    | Append-only event store; temporal policy packs; deterministic replay engine.                                            |

---

## 4. Strategic Objectives & Measurable UX Outcomes

1. **Error Prevention over Detection:** Ensure 90% of admission formatting and category errors are caught and corrected during client-side or ingestion validation before cohort sealing.
2. **Zero Ambiguity in Regulatory Findings:** Every reported mismatch must link directly to the exact statutory policy clause, approved intake arithmetic, and timestamped evidence.
3. **High Operational Density without Cognitive Overload:** Administrative users handle cohorts of 1,000–10,000 students. The interface must provide high-density tabular data with keyboard navigation, explicit filters, and zero decorative noise.
4. **Strict Accessibility & Mobile Resilience:** Comply with WCAG 2.2 AA. The entire application must reflow gracefully from 320px to 1440px+ without horizontal clipping.
5. **Purpose Limitation & Privacy by Design:** Operational screens must display only pseudonymous tokens or masked identifiers. Cleartext PII remains restricted to the encrypted Identity Vault.

---

## 5. Non-Goals and Boundary Principles

- **Not an Admission Application Portal:** AIRE does not process student applications or entrance exam counseling. It ingests reported admissions from authorized institutions.
- **Not an Automated Rejection Engine:** AIRE flags anomalies; authorized human officers make regulatory determinations.
- **No Probabilistic Verdicts:** Machine learning is strictly assistive (OCR, document classification). Regulatory arithmetic is 100% deterministic TypeScript.
