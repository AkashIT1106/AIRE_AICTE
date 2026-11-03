import { describe, it, expect } from "vitest";
import {
  evaluateAccessPolicy,
  UserRole,
  MembershipStatus,
  Permission,
  WorkspaceType,
  isRoleAuthorizedForWorkspace,
  AccessSubject,
  AccessResource,
} from "@aire/authorization";

describe("RBAC + ABAC Policy Decision Engine", () => {
  const inst1Id = "inst-delhi-101";
  const inst2Id = "inst-mumbai-202";

  const operatorSubject: AccessSubject = {
    userId: "user-op-1",
    roles: [UserRole.INSTITUTION_OPERATOR],
    activeInstitutionId: inst1Id,
    institutionMemberships: [
      {
        institutionId: inst1Id,
        role: UserRole.INSTITUTION_OPERATOR,
        status: MembershipStatus.ACTIVE,
      },
    ],
  };

  const adminSubject: AccessSubject = {
    userId: "user-admin-1",
    roles: [UserRole.INSTITUTION_ADMIN],
    activeInstitutionId: inst1Id,
    institutionMemberships: [
      {
        institutionId: inst1Id,
        role: UserRole.INSTITUTION_ADMIN,
        status: MembershipStatus.ACTIVE,
      },
    ],
  };

  const aicteAdminSubject: AccessSubject = {
    userId: "user-aicte-1",
    roles: [UserRole.AICTE_ADMIN],
    platformRoles: [UserRole.AICTE_ADMIN],
  };

  it("permits institution operator to submit admission batch for their active institution", () => {
    const resource: AccessResource = {
      type: "SUBMISSION_BATCH",
      institutionId: inst1Id,
      workflowState: "DRAFT",
    };

    const decision = evaluateAccessPolicy(
      operatorSubject,
      Permission.ADMISSION_SUBMIT,
      resource,
    );

    expect(decision.allowed).toBe(true);
  });

  it("blocks institution operator from submitting batch for another institution (ABAC Tenant Isolation)", () => {
    const resource: AccessResource = {
      type: "SUBMISSION_BATCH",
      institutionId: inst2Id,
      workflowState: "DRAFT",
    };

    const decision = evaluateAccessPolicy(
      operatorSubject,
      Permission.ADMISSION_SUBMIT,
      resource,
    );

    expect(decision.allowed).toBe(false);
    expect(decision.deniedCode).toBe("ACCESS_DENIED_SCOPE_MISMATCH");
    expect(decision.reason).toContain("Cross-institution access denied");
  });

  it("allows AICTE_ADMIN to access resources across any institution (Global Scope)", () => {
    const resource: AccessResource = {
      type: "SUBMISSION_BATCH",
      institutionId: inst2Id,
      workflowState: "DRAFT",
    };

    const decision = evaluateAccessPolicy(
      aicteAdminSubject,
      Permission.ADMISSION_READ,
      resource,
    );

    expect(decision.allowed).toBe(true);
  });

  it("blocks modifying a batch when workflowState is SEALED or LOCKED (ABAC Workflow State Invariant)", () => {
    const sealedResource: AccessResource = {
      type: "SUBMISSION_BATCH",
      institutionId: inst1Id,
      workflowState: "SEALED",
    };

    const lockedResource: AccessResource = {
      type: "SUBMISSION_BATCH",
      institutionId: inst1Id,
      workflowState: "LOCKED",
    };

    const decisionSealed = evaluateAccessPolicy(
      operatorSubject,
      Permission.ADMISSION_SUBMIT,
      sealedResource,
    );
    expect(decisionSealed.allowed).toBe(false);
    expect(decisionSealed.deniedCode).toBe("WORKFLOW_STATE_LOCKED");

    const decisionLocked = evaluateAccessPolicy(
      adminSubject,
      Permission.INSTITUTION_WRITE,
      lockedResource,
    );
    expect(decisionLocked.allowed).toBe(false);
    expect(decisionLocked.deniedCode).toBe("WORKFLOW_STATE_LOCKED");
  });

  it("enforces Separation of Duties (SoD): record creator cannot review/decide exception", () => {
    const exceptionResource: AccessResource = {
      type: "EXCEPTION_CASE",
      institutionId: inst1Id,
      ownerId: "user-op-1", // Same as operatorSubject.userId
    };

    const decision = evaluateAccessPolicy(
      operatorSubject,
      Permission.EXCEPTION_REVIEW,
      exceptionResource,
    );

    // Operator doesn't have permission first (RBAC check)
    expect(decision.allowed).toBe(false);

    // Give a user who HAS permission (e.g. AICTE_ADMIN) but was also the creator:
    const creatorSubjectWithPerm: AccessSubject = {
      userId: "user-creator-1",
      roles: [UserRole.AICTE_ADMIN],
    };

    const sameCreatorResource: AccessResource = {
      type: "EXCEPTION_CASE",
      ownerId: "user-creator-1",
    };

    const sodDecision = evaluateAccessPolicy(
      creatorSubjectWithPerm,
      Permission.EXCEPTION_DECIDE,
      sameCreatorResource,
    );

    expect(sodDecision.allowed).toBe(false);
    expect(sodDecision.deniedCode).toBe("SOD_VIOLATION");
    expect(sodDecision.reason).toContain("Separation of duties violation");
  });

  it("blocks member with INACTIVE or REVOKED status", () => {
    const inactiveSubject: AccessSubject = {
      userId: "user-inactive",
      roles: [UserRole.INSTITUTION_OPERATOR],
      activeInstitutionId: inst1Id,
      institutionMemberships: [
        {
          institutionId: inst1Id,
          role: UserRole.INSTITUTION_OPERATOR,
          status: MembershipStatus.INACTIVE,
        },
      ],
    };

    const resource: AccessResource = {
      type: "SUBMISSION_BATCH",
      institutionId: inst1Id,
    };

    const decision = evaluateAccessPolicy(
      inactiveSubject,
      Permission.ADMISSION_READ,
      resource,
    );

    expect(decision.allowed).toBe(false);
    expect(decision.deniedCode).toBe("MEMBERSHIP_INACTIVE");
  });

  it("correctly evaluates workspace role authorization", () => {
    expect(
      isRoleAuthorizedForWorkspace(
        UserRole.INSTITUTION_OPERATOR,
        WorkspaceType.INSTITUTION,
      ),
    ).toBe(true);

    expect(
      isRoleAuthorizedForWorkspace(UserRole.STUDENT, WorkspaceType.INSTITUTION),
    ).toBe(false);

    expect(
      isRoleAuthorizedForWorkspace(
        UserRole.AICTE_REVIEWER,
        WorkspaceType.AICTE,
      ),
    ).toBe(true);

    expect(
      isRoleAuthorizedForWorkspace(UserRole.AUDITOR, WorkspaceType.AUDITOR),
    ).toBe(true);
  });
});
