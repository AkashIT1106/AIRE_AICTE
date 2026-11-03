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
 * Application Workspace classification per docs/02-experience/information-architecture.md.
 */
export enum WorkspaceType {
  INSTITUTION = "INSTITUTION",
  AICTE = "AICTE",
  STUDENT = "STUDENT",
  AUDITOR = "AUDITOR",
  PUBLIC = "PUBLIC",
}

/**
 * Role to Workspace mapping table.
 */
export const WORKSPACE_ROLES: Record<WorkspaceType, readonly UserRole[]> = {
  [WorkspaceType.INSTITUTION]: [
    UserRole.INSTITUTION_ADMIN,
    UserRole.INSTITUTION_OPERATOR,
    UserRole.SUPER_ADMIN,
    UserRole.AICTE_ADMIN,
  ],
  [WorkspaceType.AICTE]: [
    UserRole.AICTE_ADMIN,
    UserRole.AICTE_REVIEWER,
    UserRole.SUPER_ADMIN,
  ],
  [WorkspaceType.STUDENT]: [UserRole.STUDENT, UserRole.SUPER_ADMIN],
  [WorkspaceType.AUDITOR]: [UserRole.AUDITOR, UserRole.SUPER_ADMIN],
  [WorkspaceType.PUBLIC]: [
    UserRole.EXTERNAL_VERIFIER,
    UserRole.STUDENT,
    UserRole.SUPER_ADMIN,
    UserRole.AICTE_ADMIN,
    UserRole.AICTE_REVIEWER,
    UserRole.INSTITUTION_ADMIN,
    UserRole.INSTITUTION_OPERATOR,
    UserRole.AUDITOR,
  ],
};

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
 * ABAC Access Subject attributes.
 */
export interface AccessSubject {
  userId: string;
  roles: (UserRole | string)[];
  activeInstitutionId?: string;
  institutionMemberships?: Array<{
    institutionId: string;
    role: string;
    status: MembershipStatus | string;
  }>;
  platformRoles?: string[];
}

/**
 * ABAC Access Resource contextual attributes.
 */
export interface AccessResource {
  type: string; // e.g. "INSTITUTION", "SUBMISSION_BATCH", "EXCEPTION_CASE", "AUDIT_LOG"
  institutionId?: string;
  ownerId?: string;
  workflowState?: string; // e.g. "DRAFT", "QUARANTINED", "READY_FOR_SIGN_OFF", "SEALED", "LOCKED"
  classification?: "PUBLIC" | "INTERNAL" | "RESTRICTED" | "CONFIDENTIAL";
}

/**
 * ABAC Access Evaluation Decision outcome.
 */
export interface AccessDecision {
  allowed: boolean;
  reason?: string;
  deniedCode?:
    | "UNAUTHORIZED"
    | "PERMISSION_DENIED"
    | "ACCESS_DENIED_SCOPE_MISMATCH"
    | "MEMBERSHIP_INACTIVE"
    | "WORKFLOW_STATE_LOCKED"
    | "SOD_VIOLATION";
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

/**
 * Evaluates whether a role is authorized for a specific workspace.
 */
export function isRoleAuthorizedForWorkspace(
  role: UserRole | string,
  workspace: WorkspaceType,
): boolean {
  const allowedRoles = WORKSPACE_ROLES[workspace];
  if (!allowedRoles) return false;
  return allowedRoles.includes(role as UserRole);
}

/**
 * Centralized RBAC + ABAC Policy Decision Point.
 * Evaluates Role-Based Access Controls paired with Attribute-Based Access Controls:
 * - RBAC permission check (least privilege default-deny)
 * - Tenant isolation boundary (prevents cross-institution leaks)
 * - Membership status (active vs inactive/revoked)
 * - Resource workflow state (prevents mutation of sealed/locked batches)
 * - Separation of duties (SoD: prevents submitter self-adjudication)
 */
export function evaluateAccessPolicy(
  subject: AccessSubject,
  permission: Permission,
  resource?: AccessResource,
): AccessDecision {
  // 1. RBAC Gate: Default Deny if no role grants permission
  const hasPerm = hasAnyPermission(subject.roles, permission);
  if (!hasPerm) {
    return {
      allowed: false,
      reason: `Role permission not granted for '${permission}'`,
      deniedCode: "PERMISSION_DENIED",
    };
  }

  // 2. Global platform administrator scope check (SUPER_ADMIN, AICTE_ADMIN have multi-tenant oversight)
  const isPlatformAdmin = subject.roles.some(
    (r) => r === UserRole.SUPER_ADMIN || r === UserRole.AICTE_ADMIN,
  );

  // 3. ABAC: Tenant / Institution Boundary
  if (resource?.institutionId) {
    if (!isPlatformAdmin) {
      if (!subject.activeInstitutionId) {
        return {
          allowed: false,
          reason:
            "Explicit active institution context required for tenant-scoped resource",
          deniedCode: "ACCESS_DENIED_SCOPE_MISMATCH",
        };
      }
      if (subject.activeInstitutionId !== resource.institutionId) {
        return {
          allowed: false,
          reason: `Cross-institution access denied: active tenant '${subject.activeInstitutionId}' cannot access resource for '${resource.institutionId}'`,
          deniedCode: "ACCESS_DENIED_SCOPE_MISMATCH",
        };
      }
    }
  }

  // 4. ABAC: Membership Status Check
  if (subject.institutionMemberships && resource?.institutionId) {
    const membership = subject.institutionMemberships.find(
      (m) => m.institutionId === resource.institutionId,
    );
    if (membership && membership.status !== MembershipStatus.ACTIVE) {
      return {
        allowed: false,
        reason: `Institution membership status is '${membership.status}'`,
        deniedCode: "MEMBERSHIP_INACTIVE",
      };
    }
  }

  // 5. ABAC: Workflow State Invariant (SEALED or LOCKED submissions cannot be mutated)
  if (resource?.workflowState) {
    const isMutatingAction =
      permission === Permission.ADMISSION_SUBMIT ||
      permission === Permission.INSTITUTION_WRITE ||
      permission === Permission.EVIDENCE_UPLOAD;

    if (
      isMutatingAction &&
      (resource.workflowState === "SEALED" ||
        resource.workflowState === "LOCKED")
    ) {
      return {
        allowed: false,
        reason: `Resource is in immutable workflow state '${resource.workflowState}' and cannot be modified`,
        deniedCode: "WORKFLOW_STATE_LOCKED",
      };
    }
  }

  // 6. ABAC: Separation of Duties (SoD) Invariant
  // Submitter who created the record cannot review or close exception
  if (
    (permission === Permission.EXCEPTION_DECIDE ||
      permission === Permission.EXCEPTION_REVIEW) &&
    resource?.ownerId &&
    resource.ownerId === subject.userId
  ) {
    return {
      allowed: false,
      reason:
        "Separation of duties violation: record submitter cannot adjudicate their own submission",
      deniedCode: "SOD_VIOLATION",
    };
  }

  return { allowed: true };
}
