import { getPrismaClient } from "../config/database.js";
import {
  Permission,
  UserRole,
  MembershipStatus,
  hasAnyPermission,
} from "@aire/authorization";

export interface ResolvedTenantAccess {
  authorized: boolean;
  institutionId?: string;
  role?: string;
  isPlatformAdmin?: boolean;
  reason?: string;
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
      const prisma = getPrismaClient();
      const activeMemberships = await prisma.institutionMember.findMany({
        where: {
          userId,
          status: MembershipStatus.ACTIVE,
        },
      });

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
   * Verifies that the resolved user roles satisfy the required permission.
   */
  static hasPermission(roles: string[], permission: Permission): boolean {
    return hasAnyPermission(roles, permission);
  }
}
