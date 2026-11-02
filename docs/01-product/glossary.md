# Platform Glossary & Acronyms

| Metadata          | Value                                     |
| ----------------- | ----------------------------------------- |
| Document          | `docs/01-product/glossary.md`             |
| Authoritative For | Domain Terminology, Acronyms, Definitions |
| Status            | `CONFIRMED`                               |
| Source            | PROJECT_PLAN.md §0, §2, §3, §4            |

---

| Term                    | Full Form / Definition                        | Context / Usage                                                                                                |
| ----------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **ABC**                 | Academic Bank of Credits                      | National credit repository managed under DigiLocker/UGC.                                                       |
| **AEP**                 | Admission Entitlement Proof                   | Cryptographically verifiable digital credential issued to verified students.                                   |
| **AISHE**               | All India Survey on Higher Education          | National institutional survey database maintained by the Ministry of Education.                                |
| **AICTE**               | All India Council for Technical Education     | Statutory regulatory authority for technical education in India.                                               |
| **APAAR**               | Automated Permanent Academic Account Registry | Unique 12-digit lifelong academic identifier assigned to students in India (formerly EduLocker ID).            |
| **APH**                 | Approval Process Handbook                     | Annual regulatory rulebook published by AICTE governing approval norms and intake quotas.                      |
| **DEK**                 | Data Encryption Key                           | Symmetric key (AES-256) used to encrypt sensitive payload data in the Identity Vault.                          |
| **DPDP Act**            | Digital Personal Data Protection Act 2023     | India's national data privacy legislation governing consent and processing of personal data.                   |
| **EOA**                 | Extension of Approval                         | Annual approval order issued by AICTE to continuing technical institutions.                                    |
| **EWS**                 | Economically Weaker Sections                  | 10% supernumerary quota over sanctioned intake for eligible students.                                          |
| **Forced RLS**          | Forced Row-Level Security                     | PostgreSQL setting (`FORCE ROW LEVEL SECURITY`) ensuring tenant isolation policies apply even to table owners. |
| **Ghost Enrollment**    | Dual or Multi-Institution Enrollment          | Discrepancy where a single student is reported as admitted in more than one institution simultaneously.        |
| **KEK**                 | Key Encryption Key                            | Master asymmetric key pair used to wrap/encrypt Data Encryption Keys in envelope encryption.                   |
| **Lateral Entry**       | Direct Admission to 2nd Year (3rd Sem)        | Supernumerary admission quota (typically 10% of sanctioned intake) for diploma/B.Sc holders.                   |
| **LOA**                 | Letter of Approval                            | Approval order issued by AICTE to newly established technical institutions.                                    |
| **PMSSS / J&K**         | Prime Minister's Special Scholarship Scheme   | Supernumerary quota for students from Jammu, Kashmir, and Ladakh.                                              |
| **Regulatory Replay**   | Historical Policy Evaluation                  | Capability to re-evaluate historical admission cohorts against historical policy versions deterministically.   |
| **Sanctioned Intake**   | Approved Intake Capacity                      | Maximum statutory seat capacity granted to an approved institution for a specific programme.                   |
| **Supernumerary Seats** | Over-and-Above Approved Intake                | Statutory seats allocated above sanctioned intake (TFW, EWS, PMSSS, NRI) with defined legal ceilings.          |
| **TFW**                 | Tuition Fee Waiver Scheme                     | 5% supernumerary seats allocated to meritorious economically disadvantaged students.                           |
| **W3C VC**              | W3C Verifiable Credentials                    | Global standard data model for tamper-evident, cryptographically verifiable credentials.                       |
