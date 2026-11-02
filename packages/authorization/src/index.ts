/**
 * Canonical roles defined in PROJECT_PLAN.md Section 5.
 */
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  AICTE_ADMIN = "AICTE_ADMIN",
  AICTE_REVIEWER = "AICTE_REVIEWER",
  INSTITUTION_ADMIN = "INSTITUTION_ADMIN",
  INSTITUTION_OPERATOR = "INSTITUTION_OPERATOR",
  STUDENT = "STUDENT",
  EXTERNAL_VERIFIER = "EXTERNAL_VERIFIER",
  AUDITOR = "AUDITOR",
}

/**
 * High-level permission primitives.
 */
export enum Permission {
  // System & Health
  SYSTEM_READ = "system:read",
  SYSTEM_ADMIN = "system:admin",

  // Institution & Admissions
  INSTITUTION_READ = "institution:read",
  INSTITUTION_WRITE = "institution:write",
  ADMISSION_SUBMIT = "admission:submit",
  ADMISSION_READ = "admission:read",

  // Reconciliation & Exceptions
  RECONCILIATION_RUN = "reconciliation:run",
  RECONCILIATION_READ = "reconciliation:read",
  EXCEPTION_REVIEW = "exception:review",
  EXCEPTION_DECIDE = "exception:decide",

  // Evidence & Verification
  EVIDENCE_UPLOAD = "evidence:upload",
  EVIDENCE_READ = "evidence:read",
  RECORD_VERIFY = "record:verify",

  // Audit & Governance
  AUDIT_READ = "audit:read",
}

/**
 * Tenant and resource scope boundary.
 */
export interface AuthorizationScope {
  institutionId?: string;
  campusId?: string;
  programmeId?: string;
  academicYear?: string;
}
