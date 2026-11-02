# Data Quality and Ingestion Pipeline (M06)

| Metadata             | Value                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/06-data/data-quality-and-validation.md`                                                                                      |
| Authoritative For    | Ingestion Pipeline, Zod Schema Validation, Defective Row Quarantine                                                                |
| Status               | `CONFIRMED`                                                                                                                        |
| Source               | PROJECT_PLAN.md §25                                                                                                                |
| Related Requirements | [`AIRE-REQ-150`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-155`](../00-governance/requirements-traceability.md) |

---

## 1. Ingestion Pipeline Stages

The ingestion worker (`@aire/workers`) processes batch uploads in three stages:

1. **Stage 1: Streaming Parse & Structure Check:** Validates file encoding, header naming, and row delimiters. Supports CSV, XLSX, and Parquet.
2. **Stage 2: Row-Level Zod Schema Validation:** Parses each row against strict type schemas:
   - Programme Code exists in institution registry.
   - 12-digit APAAR format check (numeric, valid Luhn-variant check).
   - Category code valid (`GEN`, `SC`, `ST`, `OBC_NCL`, `EWS`).
   - Quota code valid (`REGULAR`, `TFW`, `PMSSS`, `LATERAL_ENTRY`).
3. **Stage 3: Deterministic Demographic Cleaning:** Trims whitespace, standardizes casing, formats dates to ISO-8601 UTC.

---

## 2. Defective Row Quarantine Policy

- If a row fails validation, the entire batch **is not rejected**.
- Valid rows transition to `STAGED`.
- Defective rows are flagged with specific error codes (`ERR_INVALID_APAAR_FORMAT`, `ERR_UNKNOWN_PROGRAMME_CODE`) and written to a dedicated quarantine table.
- Institutional operators can inspect, correct, and re-process quarantined records directly in the workbench.
