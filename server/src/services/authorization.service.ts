import { getPrismaClient } from "../config/database.js";
import {
  Permission,
  UserRole,
  MembershipStatus,
  hasAnyPermission,
  ROLE_PERMISSIONS,
} from "@aire/authorization";

export interface ResolvedTenantAccess {
  authorized: boolean;
  institutionId?: string;
  role?: string;
  isPlatformAdmin?: boolean;
  reason?: string;
}

export interface UserAuthContext {
  user: {
    id: string;
    email: string;
    name: string;
  };
  platformRoles: string[];
  memberships: Array<{
    institutionId: string;
    role: string;
    status: string;
    institution: {
      id: string;
      code: string;
      name: string;
      status: string;
    };
  }>;
  activeInstitution: {
    id: string;
    code: string;
    name: string;
    role: string;
  } | null;
  permissions: Permission[];
}

/**
 * AIRE Authorization Domain Service.
 * Implements authorization, RBAC/ABAC, membership validation, and scope verification.
 * Specification: PROJECT_PLAN.md Section 16 & Section 17.4
 */
export class AuthorizationService {
  /**
   * Retrieves all active platform roles assigned to a user.
   */
  static async getActivePlatformRoles(userId: string): Promise<string[]> {
    const prisma = getPrismaClient();
    const platformRoles = await prisma.platformUserRole.findMany({
      where: {
        userId,
        status: "ACTIVE",
      },
    });
    return platformRoles.map((r) => r.role);
  }

  /**
   * Retrieves all active institution memberships for a user with institution details.
   */
  static async getUserMemberships(userId: string) {
    const prisma = getPrismaClient();
    return prisma.institutionMember.findMany({
      where: {
        userId,
        status: MembershipStatus.ACTIVE,
      },
      include: {
        institution: true,
      },
    });
  }

  /**
   * Retrieves the active membership for a specific institution.
   */
  static async getActiveMembership(userId: string, institutionId: string) {
    const prisma = getPrismaClient();
    return prisma.institutionMember.findUnique({
      where: {
        institutionId_userId: {
          institutionId,
          userId,
        },
      },
      include: {
        institution: true,
      },
    });
  }

  /**
   * Resolves whether a user is authorized to access a specific institution context.
   * Never trusts client-supplied institution ID; verifies membership or platform authority.
   */
  static async resolveTenantAccess(
    userId: string,
    requestedInstitutionId?: string,
  ): Promise<ResolvedTenantAccess> {
    const platformRoles = await this.getActivePlatformRoles(userId);

    // 1. Super Admins and AICTE Admins possess cross-tenant oversight authority
    const hasGlobalAdmin = platformRoles.some(
      (role) => role === UserRole.SUPER_ADMIN || role === UserRole.AICTE_ADMIN,
    );

    if (hasGlobalAdmin && requestedInstitutionId) {
      return {
        authorized: true,
        institutionId: requestedInstitutionId,
        role: UserRole.AICTE_ADMIN,
        isPlatformAdmin: true,
      };
    }

    // 2. If no institution is requested, check if the user belongs to exactly one active institution
    if (!requestedInstitutionId) {
      const activeMemberships = await this.getUserMemberships(userId);

      if (activeMemberships.length === 1) {
        return {
          authorized: true,
          institutionId: activeMemberships[0].institutionId,
          role: activeMemberships[0].role,
          isPlatformAdmin: false,
        };
      }

      return {
        authorized: false,
        reason: "EXPLICIT_TENANT_ID_REQUIRED",
      };
    }

    // 3. User requested a specific institution: strictly verify active membership
    const membership = await this.getActiveMembership(
      userId,
      requestedInstitutionId,
    );

    if (!membership) {
      return {
        authorized: false,
        reason: "NO_MEMBERSHIP_FOUND",
      };
    }

    if (membership.status !== MembershipStatus.ACTIVE) {
      return {
        authorized: false,
        reason: `MEMBERSHIP_${membership.status}`,
      };
    }

    if (membership.institution.status !== "ACTIVE") {
      return {
        authorized: false,
        reason: `INSTITUTION_${membership.institution.status}`,
      };
    }

    return {
      authorized: true,
      institutionId: membership.institutionId,
      role: membership.role,
      isPlatformAdmin: false,
    };
  }

  /**
   * Builds the comprehensive authorization context for an authenticated user.
   */
  static async getUserContext(
    user: { id: string; email: string; name: string },
    requestedInstitutionId?: string,
  ): Promise<UserAuthContext> {
    const [platformRoles, memberships] = await Promise.all([
      this.getActivePlatformRoles(user.id),
      this.getUserMemberships(user.id),
    ]);

    // Determine active institution
    let activeInstitution: UserAuthContext["activeInstitution"] = null;
    let activeRole: string | undefined;

    if (requestedInstitutionId) {
      const targetMember = memberships.find(
        (m) => m.institutionId === requestedInstitutionId,
      );
      if (targetMember) {
        activeInstitution = {
          id: targetMember.institution.id,
          code: targetMember.institution.code,
          name: targetMember.institution.name,
          role: targetMember.role,
        };
        activeRole = targetMember.role;
      }
    }

    if (!activeInstitution && memberships.length > 0) {
      const first = memberships[0];
      activeInstitution = {
        id: first.institution.id,
        code: first.institution.code,
        name: first.institution.name,
        role: first.role,
      };
      activeRole = first.role;
    }

    // Aggregate effective permissions
    const effectiveRoles = [...platformRoles];
    if (activeRole) {
      effectiveRoles.push(activeRole);
    }

    const permissionSet = new Set<Permission>();
    for (const role of effectiveRoles) {
      const perms = ROLE_PERMISSIONS[role as UserRole] || [];
      for (const p of perms) {
        permissionSet.add(p);
      }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      platformRoles,
      memberships: memberships.map((m) => ({
        institutionId: m.institutionId,
        role: m.role,
        status: m.status,
        institution: {
          id: m.institution.id,
          code: m.institution.code,
          name: m.institution.name,
          status: m.institution.status,
        },
      })),
      activeInstitution,
      permissions: Array.from(permissionSet),
    };
  }

  /**
   * Verifies that the resolved user roles satisfy the required permission.
   */
  static hasPermission(roles: string[], permission: Permission): boolean {
    return hasAnyPermission(roles, permission);
  }
}
