import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/authorize.js";
import { Permission, UserRole } from "@aire/authorization";
import { ApiResponse, ErrorCode } from "@aire/shared-types";
import {
  programmeInputSchema,
  programmeAliasInputSchema,
  approvalOrderInputSchema,
} from "@aire/validation";
import { InstitutionRegistryService } from "../services/institution-registry.service.js";
import { ApprovalRegistryService } from "../services/approval-registry.service.js";
import { AuthorizationService } from "../services/authorization.service.js";

export const approvalRegistryRouter: Router = Router();

/**
 * Lists canonical programmes.
 */
approvalRegistryRouter.get(
  "/programmes",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const discipline = req.query.discipline as string | undefined;
      const degreeLevel = req.query.degreeLevel as string | undefined;
      const status = req.query.status as string | undefined;

      const programmes = await InstitutionRegistryService.listProgrammes({
        discipline,
        degreeLevel,
        status,
      });

      const response: ApiResponse<typeof programmes> = {
        data: programmes,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to list programmes",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Creates a canonical programme (System Admin only).
 */
approvalRegistryRouter.post(
  "/programmes",
  authenticate,
  requirePermission(Permission.SYSTEM_ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const parseResult = programmeInputSchema.safeParse(req.body);
      if (!parseResult.success) {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: "Invalid programme input",
            correlationId: req.correlationId,
            details: parseResult.error.format(),
          },
        };
        res.status(400).json(response);
        return;
      }

      const programme = await InstitutionRegistryService.createProgramme(
        parseResult.data,
        {
          actorId: req.user?.id,
          correlationId: req.correlationId || "UNKNOWN",
        },
      );

      const response: ApiResponse<typeof programme> = {
        data: programme,
        error: null,
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to create programme",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Resolves a reported programme title through canonical catalog or registered aliases.
 */
approvalRegistryRouter.get(
  "/programmes/match",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const rawTitle = req.query.title as string;
      const institutionId = req.query.institutionId as string | undefined;

      if (!rawTitle) {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: "Query parameter 'title' is required",
            correlationId: req.correlationId,
          },
        };
        res.status(400).json(response);
        return;
      }

      const match = await InstitutionRegistryService.matchProgrammeAlias(
        rawTitle,
        institutionId,
      );

      const response: ApiResponse<typeof match> = {
        data: match,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to match programme title",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Registers a programme alias for normalization.
 */
approvalRegistryRouter.post(
  "/programmes/alias",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const parseResult = programmeAliasInputSchema.safeParse(req.body);
      if (!parseResult.success) {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: "Invalid programme alias input",
            correlationId: req.correlationId,
            details: parseResult.error.format(),
          },
        };
        res.status(400).json(response);
        return;
      }

      const alias = await InstitutionRegistryService.createProgrammeAlias(
        parseResult.data,
        {
          actorId: req.user?.id,
          correlationId: req.correlationId || "UNKNOWN",
        },
      );

      const response: ApiResponse<typeof alias> = {
        data: alias,
        error: null,
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to create programme alias",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Lists approval orders with tenant and platform role awareness.
 */
approvalRegistryRouter.get(
  "/approvals",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const platformRoles =
        await AuthorizationService.getActivePlatformRoles(userId);
      const isPlatformAdmin = platformRoles.some(
        (r) =>
          r === UserRole.SUPER_ADMIN ||
          r === UserRole.AICTE_ADMIN ||
          r === UserRole.AICTE_REVIEWER,
      );

      let institutionId = req.query.institutionId as string | undefined;
      if (!isPlatformAdmin) {
        // Enforce institution operator context
        const memberships =
          await AuthorizationService.getUserMemberships(userId);
        if (memberships.length === 0) {
          res.status(403).json({
            data: null,
            error: {
              code: ErrorCode.PERMISSION_DENIED,
              message: "User has no authorized institution memberships",
              correlationId: req.correlationId,
            },
          });
          return;
        }
        institutionId = memberships[0].institutionId;
      }

      const academicYear = req.query.academicYear as string | undefined;
      const status = req.query.status as string | undefined;

      const orders = await ApprovalRegistryService.listApprovalOrders({
        institutionId,
        academicYear,
        status,
      });

      const response: ApiResponse<typeof orders> = {
        data: orders,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to list approval orders",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Retrieves a single approval order by ID.
 */
approvalRegistryRouter.get(
  "/approvals/:approvalId",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const approvalId = req.params.approvalId as string;
      const order = await ApprovalRegistryService.getApprovalOrder(approvalId);

      if (!order) {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: `Approval order ${approvalId} not found`,
            correlationId: req.correlationId,
          },
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<typeof order> = {
        data: order,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to retrieve approval order",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Ingests an official AICTE Approval Order (System Admin only).
 */
approvalRegistryRouter.post(
  "/approvals",
  authenticate,
  requirePermission(Permission.SYSTEM_ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { order, entitlements } = req.body;

      const parsedOrder = approvalOrderInputSchema.safeParse(order);
      if (!parsedOrder.success) {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: "Invalid approval order payload",
            correlationId: req.correlationId,
            details: parsedOrder.error.format(),
          },
        };
        res.status(400).json(response);
        return;
      }

      if (!Array.isArray(entitlements) || entitlements.length === 0) {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message:
              "Approval order must include at least one seat entitlement",
            correlationId: req.correlationId,
          },
        };
        res.status(400).json(response);
        return;
      }

      const createdOrder = await ApprovalRegistryService.createApprovalOrder(
        parsedOrder.data,
        entitlements,
        {
          actorId: req.user?.id,
          correlationId: req.correlationId || "UNKNOWN",
        },
      );

      const response: ApiResponse<typeof createdOrder> = {
        data: createdOrder,
        error: null,
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to create approval order",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Supersedes an active approval order with a newly issued order (System Admin only).
 */
approvalRegistryRouter.post(
  "/approvals/:approvalId/supersede",
  authenticate,
  requirePermission(Permission.SYSTEM_ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const currentOrderId = req.params.approvalId as string;
      const { order, entitlements } = req.body;

      const parsedOrder = approvalOrderInputSchema.safeParse(order);
      if (!parsedOrder.success) {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: "Invalid new approval order payload",
            correlationId: req.correlationId,
            details: parsedOrder.error.format(),
          },
        };
        res.status(400).json(response);
        return;
      }

      const superseded = await ApprovalRegistryService.supersedeApprovalOrder(
        currentOrderId,
        parsedOrder.data,
        entitlements || [],
        {
          actorId: req.user?.id,
          correlationId: req.correlationId || "UNKNOWN",
        },
      );

      const response: ApiResponse<typeof superseded> = {
        data: superseded,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to supersede approval order",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);
