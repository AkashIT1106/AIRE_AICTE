# Cohort Reconciliation and Mismatch Rules

| Metadata             | Value                                                                                                                                                                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/04-domain/business-rules/reconciliation-rules.md`                                                                                                                                                                                                                            |
| Authoritative For    | Reconciliation Algorithm, Mismatch Severity, AEP Issuance                                                                                                                                                                                                                          |
| Status               | `CONFIRMED`                                                                                                                                                                                                                                                                        |
| Source               | PROJECT_PLAN.md §28, §29, §31                                                                                                                                                                                                                                                      |
| Related Requirements | [`AIRE-REQ-033`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-040`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-166`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-177`](../../00-governance/requirements-traceability.md) |

---

## 1. Multi-Pass Reconciliation Algorithm

The Cohort Reconciliation Engine executes four sequential evaluation passes:

$$	ext{Pass 1: Quota Arithmetic} \longrightarrow 	ext{Pass 2: APAAR Registry} \longrightarrow 	ext{Pass 3: Cross-Institution Deduplication} \longrightarrow 	ext{Pass 4: Evidence Integrity}$$

1. **Pass 1 (Quota Arithmetic):** Calculates aggregate admitted counts against sanctioned intake and supernumerary caps per programme.
2. **Pass 2 (Identity Verification):** Checks student APAAR verification status via M07 gateway.
3. **Pass 3 (Cross-Institution Deduplication):** Scans the national student token index to detect whether a student token is active in more than one institution for the same academic cycle.
4. **Pass 4 (Evidence Integrity):** Validates required admission proof (caste certificate for reserved seats, income proof for TFW/EWS).

---

## 2. Mismatch Taxonomy & Severity

| Mismatch Code            | Severity   | Description                                                          | Immediate Action                                     |
| ------------------------ | ---------- | -------------------------------------------------------------------- | ---------------------------------------------------- |
| `ERR_INTAKE_EXCEEDED`    | `CRITICAL` | Admitted regular intake exceeds approved EOA seat count.             | Flag cohort; auto-generate Show Cause notice draft.  |
| `ERR_DUAL_ENROLLMENT`    | `CRITICAL` | Student token found admitted in another institution.                 | Quarantine record; alert both institutions.          |
| `ERR_RESERVATION_BREACH` | `HIGH`     | Admitted category students exceed statutory reservation ceiling.     | Flag for regional reviewer scrutiny.                 |
| `ERR_SUPERNUMERARY_CAP`  | `HIGH`     | TFW, EWS, or Lateral Entry exceeds approved legal percentage.        | Flag for entitlement recalculation.                  |
| `ERR_APAAR_UNVERIFIED`   | `MEDIUM`   | Student 12-digit APAAR ID could not be resolved by gateway.          | 30-day provisional window for institution re-upload. |
| `WARN_DEMOGRAPHIC_DIFF`  | `LOW`      | Minor spelling difference between admission name and APAAR registry. | Mark for human operator verification.                |

---

## 3. Admission Entitlement Proof (AEP) Generation

AEP credentials are issued **exclusively** to student records that pass reconciliation with zero `CRITICAL` or unresolved `HIGH` mismatches:

- Signed using the AICTE platform ECDSA private key.
- Encodes verifiable claims: Student Token, Institution AICTE ID, Programme Code, Academic Year, Quota Type, and Approval Order Hash.
- Outputs a W3C-compliant Verifiable Credential and dynamic SVG QR code.
