# Privacy by Design and Identity Vault

| Metadata             | Value                                                                                                                                                                                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/05-security-privacy/privacy-by-design.md`                                                                                                                                                                                                                                                                                       |
| Authoritative For    | Privacy Architecture, Identity Vault, Envelope Encryption, Data Subject Rights                                                                                                                                                                                                                                                        |
| Status               | `CONFIRMED`                                                                                                                                                                                                                                                                                                                           |
| Source               | PROJECT_PLAN.md §15.1, §15.5, §15.6, §18, ADR-008                                                                                                                                                                                                                                                                                     |
| Related Requirements | [`AIRE-REQ-090`](../00-governance/requirements-traceability.md), [`AIRE-REQ-093`](../00-governance/requirements-traceability.md), [`AIRE-REQ-094`](../00-governance/requirements-traceability.md), [`AIRE-REQ-110`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-113`](../00-governance/requirements-traceability.md) |

---

## 1. Identity Vault & Envelope Encryption

To comply with the Digital Personal Data Protection (DPDP) Act 2023, raw student Personally Identifiable Information (PII) is isolated from operational admission tables:

```
[ OPERATIONAL SCHEMA: aire_app ]
AdmissionRecord:
├── id: "adm_01J..."
├── tenant_id: "inst_104"
├── programme_id: "prog_cs"
├── student_token: "tok_8f9a2b..." <-------+ (Pseudonymous Reference)
└── quota_status: "RECONCILED"             |
                                           |
                                           v
[ ISOLATED IDENTITY VAULT SCHEMA: aire_vault ]
IdentityVaultRecord:
├── student_token: "tok_8f9a2b..."
├── encrypted_payload: "v1:enc:7a8b..." (AES-256-GCM encrypted PII)
├── encrypted_dek: "kek_enc:4f2c..."    (DEK encrypted under master KEK)
├── apaar_hash: "sha256:3d1e..."        (Blinded search hash)
└── created_at: 2026-11-02T10:00:00Z
```

- **Envelope Encryption Pattern:** Every student PII record is encrypted with a unique, randomly generated Data Encryption Key (DEK) using AES-256-GCM. The DEK is encrypted under a master Key Encryption Key (KEK) managed in an isolated keystore.
- **Pseudonymous Tokens:** Operational tables, reconciliation workers, and analytical exports reference only the pseudonymous `student_token`.

---

## 2. Purpose-Bound Token Access

- Direct decryption of student PII is restricted to legally authorized workflows (e.g. student grievance resolution, formal court audit).
- Any decryption request requires an explicit `processing_purpose_code` and generates an immutable security audit event.

---

## 3. Data Subject Rights (DPDP Alignment)

AIRE implements dedicated workflows for data subjects:

1. **Right to Confirmation & Access:** Enrolled students can log in to the Student Portal to view their verified admission details and AEP credential.
2. **Right to Correction:** Students can submit demographic correction requests with supporting evidence. Corrections are vetted by institutional operators before amending the ledger.
3. **Right to Erasure:** Upon expiration of statutory educational record retention periods, student identity vault records undergo cryptographic erasure.
