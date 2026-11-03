import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/authorize.js";
import { Permission, UserRole } from "@aire/authorization";
import { withTenantContext, getPrismaClient } from "../config/database.js";
import { ApiResponse, ErrorCode } from "@aire/shared-types";
import { AuthorizationService } from "../services/authorization.service.js";

export const tenantRouter: Router = Router();

/**
 * Returns current authenticated identity profile, memberships, active tenant, and effective permissions.
 */
tenantRouter.get(
  "/auth/me",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const headerInst = req.headers["x-institution-id"];
      const requestedInstId = Array.isArray(headerInst)
        ? headerInst[0]
        : (headerInst as string | undefined) ||
          (req.query.institutionId as string | undefined);

      const context = await AuthorizationService.getUserContext(
        req.user!,
        requestedInstId,
      );

      const response: ApiResponse<typeof context> = {
        data: context,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to resolve authenticated session context",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Returns institutions authorized for the current user.
 */
tenantRouter.get(
  "/institutions",
  authenticate,
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const prisma = getPrismaClient();

    try {
      const platformRoles =
        await AuthorizationService.getActivePlatformRoles(userId);
      const isPlatformAdmin = platformRoles.some(
        (r) => r === UserRole.SUPER_ADMIN || r === UserRole.AICTE_ADMIN,
      );

      let institutions;
      if (isPlatformAdmin) {
        institutions = await prisma.institution.findMany({
          orderBy: { name: "asc" },
        });
      } else {
        const memberships =
          await AuthorizationService.getUserMemberships(userId);
        institutions = memberships.map((m) => m.institution);
      }

      const response: ApiResponse<typeof institutions> = {
        data: institutions,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to list authorized institutions",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Reads institution records protected by tenant authorization and PostgreSQL RLS.
 */
tenantRouter.get(
  "/institutions/:institutionId/records",
  authenticate,
  requirePermission(Permission.INSTITUTION_READ, { requireTenant: true }),
  async (req: Request, res: Response) => {
    const institutionId = req.tenantContext!.institutionId;

    try {
      const records = await withTenantContext(institutionId, async (tx) => {
        return tx.institutionRecord.findMany({
          orderBy: { createdAt: "desc" },
        });
      });

      const response: ApiResponse<unknown> = {
        data: records,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to read tenant records",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Writes an institution record protected by tenant authorization and PostgreSQL RLS.
 */
tenantRouter.post(
  "/institutions/:institutionId/records",
  authenticate,
  requirePermission(Permission.INSTITUTION_WRITE, { requireTenant: true }),
  async (req: Request, res: Response) => {
    const institutionId = req.tenantContext!.institutionId;
    const { title, payload } = req.body || {};

    if (!title || typeof title !== "string") {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: "title is required and must be a string",
          correlationId: req.correlationId,
        },
      };
      res.status(400).json(response);
      return;
    }

    try {
      const createdRecord = await withTenantContext(
        institutionId,
        async (tx) => {
          return tx.institutionRecord.create({
            data: {
              institutionId,
              title,
              payload: payload || null,
            },
          });
        },
      );

      const response: ApiResponse<unknown> = {
        data: createdRecord,
        error: null,
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to create tenant record",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);
