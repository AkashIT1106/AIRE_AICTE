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
 * Membership status options.
 */
export enum MembershipStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  REVOKED = "REVOKED",
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
 * Role to Permission mapping table (least privilege principle).
 */
export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  [UserRole.AICTE_ADMIN]: [
    Permission.SYSTEM_READ,
    Permission.INSTITUTION_READ,
    Permission.INSTITUTION_WRITE,
    Permission.ADMISSION_READ,
    Permission.RECONCILIATION_RUN,
    Permission.RECONCILIATION_READ,
    Permission.EXCEPTION_REVIEW,
    Permission.EXCEPTION_DECIDE,
    Permission.EVIDENCE_READ,
    Permission.RECORD_VERIFY,
    Permission.AUDIT_READ,
  ],
  [UserRole.AICTE_REVIEWER]: [
    Permission.SYSTEM_READ,
    Permission.INSTITUTION_READ,
    Permission.ADMISSION_READ,
    Permission.RECONCILIATION_READ,
    Permission.EXCEPTION_REVIEW,
    Permission.EVIDENCE_READ,
    Permission.RECORD_VERIFY,
  ],
  [UserRole.INSTITUTION_ADMIN]: [
    Permission.SYSTEM_READ,
    Permission.INSTITUTION_READ,
    Permission.INSTITUTION_WRITE,
    Permission.ADMISSION_SUBMIT,
    Permission.ADMISSION_READ,
    Permission.RECONCILIATION_READ,
    Permission.EVIDENCE_UPLOAD,
    Permission.EVIDENCE_READ,
    Permission.AUDIT_READ,
  ],
  [UserRole.INSTITUTION_OPERATOR]: [
    Permission.SYSTEM_READ,
    Permission.INSTITUTION_READ,
    Permission.ADMISSION_SUBMIT,
    Permission.ADMISSION_READ,
    Permission.EVIDENCE_UPLOAD,
    Permission.EVIDENCE_READ,
  ],
  [UserRole.STUDENT]: [
    Permission.SYSTEM_READ,
    Permission.ADMISSION_READ,
    Permission.EVIDENCE_READ,
  ],
  [UserRole.EXTERNAL_VERIFIER]: [
    Permission.SYSTEM_READ,
    Permission.RECORD_VERIFY,
    Permission.EVIDENCE_READ,
  ],
  [UserRole.AUDITOR]: [
    Permission.SYSTEM_READ,
    Permission.INSTITUTION_READ,
    Permission.ADMISSION_READ,
    Permission.RECONCILIATION_READ,
    Permission.AUDIT_READ,
  ],
};

/**
 * Tenant and resource scope boundary.
 */
export interface AuthorizationScope {
  institutionId?: string;
  campusId?: string;
  programmeId?: string;
  academicYear?: string;
}

/**
 * Validates whether a specific role possesses the required permission.
 */
export function hasPermission(
  role: UserRole | string,
  permission: Permission,
): boolean {
  const perms = ROLE_PERMISSIONS[role as UserRole];
  if (!perms) return false;
  return perms.includes(permission);
}

/**
 * Validates whether any of the supplied roles possess the required permission.
 */
export function hasAnyPermission(
  roles: (UserRole | string)[],
  permission: Permission,
): boolean {
  return roles.some((role) => hasPermission(role, permission));
}

/**
 * Checks if a role is a platform-level role.
 */
export function isPlatformRole(role: string): boolean {
  return (
    role === UserRole.SUPER_ADMIN ||
    role === UserRole.AICTE_ADMIN ||
    role === UserRole.AICTE_REVIEWER ||
    role === UserRole.AUDITOR
  );
}

/**
 * Checks if a role is an institution-level role.
 */
export function isInstitutionRole(role: string): boolean {
  return (
    role === UserRole.INSTITUTION_ADMIN ||
    role === UserRole.INSTITUTION_OPERATOR
  );
}
