import { Request, Response, NextFunction } from "express";
import { Permission, hasAnyPermission } from "@aire/authorization";
import { ApiResponse, ErrorCode } from "@aire/shared-types";
import { AuthorizationService } from "../services/authorization.service.js";
import { logAuditEvent } from "../services/audit.service.js";

export interface AuthorizeOptions {
  requireTenant?: boolean;
}

/**
 * AIRE Centralized Authorization Middleware.
 * Enforces least privilege, default deny, membership verification, and tenant context isolation.
 */
export function requirePermission(
  permission: Permission,
  options: AuthorizeOptions = {},
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const correlationId =
      (req.headers["x-correlation-id"] as string) || "UNKNOWN";

    if (!req.user) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.UNAUTHORIZED,
          message: "Authentication required before authorization",
          correlationId,
        },
      };
      res.status(401).json(response);
      return;
    }

    const userId = req.user.id;
    const rawHeader = req.headers["x-institution-id"];
    const headerInstitutionId = Array.isArray(rawHeader)
      ? rawHeader[0]
      : rawHeader;
    const rawParam = req.params.institutionId;
    const paramId = Array.isArray(rawParam) ? rawParam[0] : rawParam;
    const requestedInstitutionId: string | undefined =
      paramId || headerInstitutionId || undefined;

    try {
      // 1. Tenant Scope Resolution (if tenant context requested or institution param present)
      if (options.requireTenant || requestedInstitutionId) {
        const tenantResolution = await AuthorizationService.resolveTenantAccess(
          userId,
          requestedInstitutionId,
        );

        if (!tenantResolution.authorized || !tenantResolution.institutionId) {
          await logAuditEvent({
            severity: "warn",
            correlationId,
            actorId: userId,
            tenantId: requestedInstitutionId || null,
            action: "TENANT_ACCESS_DENIED",
            resourceType: "INSTITUTION",
            resourceId: requestedInstitutionId || null,
            status: "DENIED",
            metadata: { reason: tenantResolution.reason },
          });

          const response: ApiResponse<null> = {
            data: null,
            error: {
              code: ErrorCode.PERMISSION_DENIED,
              message: `Tenant access denied: ${tenantResolution.reason || "Unauthorized"}`,
              correlationId,
            },
          };
          res.status(403).json(response);
          return;
        }

        req.tenantContext = {
          institutionId: tenantResolution.institutionId,
          role: tenantResolution.role || "UNKNOWN",
          isPlatformAdmin: tenantResolution.isPlatformAdmin,
        };
      }

      // 2. Permission Evaluation
      const userRoles: string[] = [];
      if (req.tenantContext?.role) {
        userRoles.push(req.tenantContext.role);
      }

      const platformRoles =
        await AuthorizationService.getActivePlatformRoles(userId);
      userRoles.push(...platformRoles);

      const hasRequiredPermission = hasAnyPermission(userRoles, permission);

      if (!hasRequiredPermission) {
        await logAuditEvent({
          severity: "warn",
          correlationId,
          actorId: userId,
          tenantId: req.tenantContext?.institutionId || null,
          action: "ROLE_PERMISSION_DENIED",
          resourceType: "PERMISSION",
          resourceId: permission,
          status: "DENIED",
          metadata: { userRoles, requiredPermission: permission },
        });

        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.PERMISSION_DENIED,
            message: `User does not possess the required permission: ${permission}`,
            correlationId,
          },
        };
        res.status(403).json(response);
        return;
      }

      next();
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Internal authorization failure",
          correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  };
}
