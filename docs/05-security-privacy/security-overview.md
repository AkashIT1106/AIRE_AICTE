# Security Overview and Threat Model

| Metadata             | Value                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/05-security-privacy/security-overview.md`                                                                                  |
| Authoritative For    | Defense-in-Depth, Threat Boundaries, Threat Model                                                                                |
| Status               | `CONFIRMED`                                                                                                                      |
| Source               | PROJECT_PLAN.md §7, §16, §17, §42                                                                                                |
| Related Requirements | [`AIRE-REQ-056`](../00-governance/requirements-traceability.md), [`AIRE-REQ-228`](../00-governance/requirements-traceability.md) |

---

## 1. Security Posture & Defense-in-Depth

AIRE protects national educational regulatory data through defense-in-depth:

```
[ LAYER 1: Transport & Edge ]     HTTPS, TLS 1.3, CSP, HSTS, Rate Limiting per Tenant/IP
              |
[ LAYER 2: Application Auth ]      Better Auth, Session Cookies (HttpOnly, Secure, SameSite=Lax)
              |
[ LAYER 3: Authorization Middleware] Default-Deny, RBAC + ABAC Scope Validation, SoD Enforcement
              |
[ LAYER 4: Database Multi-Tenancy] PostgreSQL Engine Forced Row-Level Security (Forced RLS)
              |
[ LAYER 5: Database Roles ]        aire_app_user (NOSUPERUSER, NOBYPASSRLS)
              |
[ LAYER 6: Cryptographic Vault ]   Envelope Encryption (AES-256-GCM DEK + RSA/KMS KEK) for PII
              |
[ LAYER 7: Immutable Audit ]       Append-Only, Hash-Chained Audit Logs with Truncate/Delete Revoked
```

---

## 2. Threat Modeling & Threat Vectors

1. **Cross-Tenant Data Exposure:** Malicious institution user attempts to read another college's admission roster by manipulating API parameters.
   - _Mitigation:_ Forced RLS in PostgreSQL rejects queries regardless of application-level bugs; returns 0 rows.
2. **Privilege Escalation:** Operator crafts payload claiming `AICTE_ADMIN` role or modifying approved intake.
   - _Mitigation:_ Zero trust of client claims. Identity and role are derived exclusively from verified server-side session state.
3. **Ghost Enrollment & Dual Allocation Fraud:** Collusion between institutions to claim the same student across multiple colleges.
   - _Mitigation:_ Pseudonymous student tokens indexed globally detect cross-institution duplication automatically during Pass 3 reconciliation.
4. **Audit Trail Tampering:** Insider administrator deletes or alters records of an unapproved admission.
   - _Mitigation:_ `UPDATE` and `DELETE` permissions are revoked on audit tables for all application users; logs use cryptographic hash chaining.
