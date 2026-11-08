import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/authorize.js";
import { Permission } from "@aire/authorization";
import { ApiResponse, ErrorCode } from "@aire/shared-types";
import { institutionProfileSchema, campusInputSchema } from "@aire/validation";
import { InstitutionRegistryService } from "../services/institution-registry.service.js";

export const institutionRegistryRouter: Router = Router();

/**
 * Retrieves detailed institution profile including campuses.
 */
institutionRegistryRouter.get(
  "/institutions/:institutionId",
  authenticate,
  requirePermission(Permission.INSTITUTION_READ, { requireTenant: true }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const institutionId = req.params.institutionId as string;
      const institution =
        await InstitutionRegistryService.getInstitution(institutionId);

      if (!institution) {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: `Institution ${institutionId} not found`,
            correlationId: req.correlationId,
          },
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<typeof institution> = {
        data: institution,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to retrieve institution details",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Updates institution profile details.
 */
institutionRegistryRouter.patch(
  "/institutions/:institutionId",
  authenticate,
  requirePermission(Permission.INSTITUTION_WRITE, { requireTenant: true }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const institutionId = req.params.institutionId as string;
      const parseResult = institutionProfileSchema.safeParse(req.body);

      if (!parseResult.success) {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: "Invalid institution profile payload",
            correlationId: req.correlationId,
            details: parseResult.error.format(),
          },
        };
        res.status(400).json(response);
        return;
      }

      const updated = await InstitutionRegistryService.updateInstitution(
        institutionId,
        parseResult.data,
        {
          actorId: req.user?.id,
          correlationId: req.correlationId || "UNKNOWN",
          tenantId: institutionId,
        },
      );

      const response: ApiResponse<typeof updated> = {
        data: updated,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to update institution profile",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Lists campuses for an institution.
 */
institutionRegistryRouter.get(
  "/institutions/:institutionId/campuses",
  authenticate,
  requirePermission(Permission.INSTITUTION_READ, { requireTenant: true }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const institutionId = req.params.institutionId as string;
      const campuses =
        await InstitutionRegistryService.listCampuses(institutionId);

      const response: ApiResponse<typeof campuses> = {
        data: campuses,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to list campuses",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Registers a new campus under an institution.
 */
institutionRegistryRouter.post(
  "/institutions/:institutionId/campuses",
  authenticate,
  requirePermission(Permission.INSTITUTION_WRITE, { requireTenant: true }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const institutionId = req.params.institutionId as string;
      const parseResult = campusInputSchema.safeParse(req.body);

      if (!parseResult.success) {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: "Invalid campus input payload",
            correlationId: req.correlationId,
            details: parseResult.error.format(),
          },
        };
        res.status(400).json(response);
        return;
      }

      const campus = await InstitutionRegistryService.createCampus(
        institutionId,
        parseResult.data,
        {
          actorId: req.user?.id,
          correlationId: req.correlationId || "UNKNOWN",
          tenantId: institutionId,
        },
      );

      const response: ApiResponse<typeof campus> = {
        data: campus,
        error: null,
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to create campus",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);
