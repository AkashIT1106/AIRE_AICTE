import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth.js";
import { UserRole } from "@aire/authorization";
import { ApiResponse, ErrorCode } from "@aire/shared-types";
import {
  activatePolicyPackSchema,
  createPolicyFixtureSchema,
  createPolicyPackSchema,
  createPolicyRuleSchema,
  replaySimulationSchema,
} from "@aire/validation";
import { AuthorizationService } from "../services/authorization.service.js";
import { PolicyRegistryService } from "../services/policy-registry.service.js";

export const policyRouter: Router = Router();

/**
 * Middleware requiring platform admin role (AICTE_ADMIN or SUPER_ADMIN).
 */
async function requireAicteAdmin(
  req: Request,
  res: Response,
  next: () => void,
): Promise<void> {
  const correlationId =
    (req.headers["x-correlation-id"] as string) || "UNKNOWN";
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      data: null,
      error: {
        code: ErrorCode.UNAUTHORIZED,
        message: "Authentication required",
        correlationId,
      },
    });
    return;
  }

  const roles = await AuthorizationService.getActivePlatformRoles(userId);
  const isAdmin = roles.some(
    (r) => r === UserRole.SUPER_ADMIN || r === UserRole.AICTE_ADMIN,
  );

  if (!isAdmin) {
    res.status(403).json({
      data: null,
      error: {
        code: ErrorCode.PERMISSION_DENIED,
        message: "AICTE administrative privileges required",
        correlationId,
      },
    });
    return;
  }

  next();
}

/**
 * GET /api/v1/policies
 * Lists all regulatory policy packs. Accessible by all authenticated users (Institutions, Regulators, Auditors).
 */
policyRouter.get(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const academicYear = req.query.academicYear as string | undefined;
      const status = req.query.status as any;
      const stateCode = req.query.stateCode as string | undefined;

      const packs = await PolicyRegistryService.listPolicyPacks({
        academicYear,
        status,
        stateCode,
      });

      const response: ApiResponse<typeof packs> = {
        data: packs,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to list policy packs",
          correlationId: req.headers["x-correlation-id"] as string,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * GET /api/v1/policies/:id
 * Retrieves details, rules, fixtures, and signoffs for a specific policy pack.
 */
policyRouter.get(
  "/:id",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const correlationId =
      (req.headers["x-correlation-id"] as string) || "UNKNOWN";
    try {
      const packId = req.params.id as string;
      const pack = await PolicyRegistryService.getPolicyPackById(packId);
      if (!pack) {
        res.status(404).json({
          data: null,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: `Policy pack with ID '${packId}' was not found`,
            correlationId,
          },
        });
        return;
      }

      res.status(200).json({ data: pack, error: null });
    } catch (error) {
      res.status(500).json({
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to retrieve policy pack",
          correlationId,
          details: (error as Error).message,
        },
      });
    }
  },
);

/**
 * POST /api/v1/policies
 * Creates a new regulatory policy pack in DRAFT status. (AICTE_ADMIN only).
 */
policyRouter.post(
  "/",
  authenticate,
  requireAicteAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const correlationId =
      (req.headers["x-correlation-id"] as string) || "UNKNOWN";
    try {
      const parsed = createPolicyPackSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          data: null,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: "Invalid policy pack parameters",
            correlationId,
            details: parsed.error.issues,
          },
        });
        return;
      }

      const pack = await PolicyRegistryService.createPolicyPack(
        parsed.data,
        req.user!.id,
        { correlationId },
      );

      res.status(201).json({ data: pack, error: null });
    } catch (error) {
      const msg = (error as Error).message;
      const isConflict = msg.startsWith("POLICY_CODE_EXISTS");
      res.status(isConflict ? 409 : 500).json({
        data: null,
        error: {
          code: isConflict ? ErrorCode.CONFLICT : ErrorCode.INTERNAL_ERROR,
          message: msg,
          correlationId,
        },
      });
    }
  },
);

/**
 * POST /api/v1/policies/:id/rules
 * Adds a declarative evaluation rule to a DRAFT policy pack.
 */
policyRouter.post(
  "/:id/rules",
  authenticate,
  requireAicteAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const correlationId =
      (req.headers["x-correlation-id"] as string) || "UNKNOWN";
    try {
      const parsed = createPolicyRuleSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          data: null,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: "Invalid rule definition parameters",
            correlationId,
            details: parsed.error.issues,
          },
        });
        return;
      }

      const rule = await PolicyRegistryService.addRuleToPack(
        req.params.id as string,
        parsed.data,
        req.user!.id,
        { correlationId },
      );

      res.status(201).json({ data: rule, error: null });
    } catch (error) {
      const msg = (error as Error).message;
      const isImmutable = msg.startsWith("IMMUTABLE_POLICY_ERROR");
      const isNotFound = msg.startsWith("POLICY_PACK_NOT_FOUND");
      res.status(isNotFound ? 404 : isImmutable ? 409 : 500).json({
        data: null,
        error: {
          code: isNotFound
            ? ErrorCode.NOT_FOUND
            : isImmutable
              ? ErrorCode.CONFLICT
              : ErrorCode.INTERNAL_ERROR,
          message: msg,
          correlationId,
        },
      });
    }
  },
);

/**
 * POST /api/v1/policies/:id/fixtures
 * Adds a synthetic test fixture to a DRAFT policy pack.
 */
policyRouter.post(
  "/:id/fixtures",
  authenticate,
  requireAicteAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const correlationId =
      (req.headers["x-correlation-id"] as string) || "UNKNOWN";
    try {
      const parsed = createPolicyFixtureSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          data: null,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: "Invalid fixture parameters",
            correlationId,
            details: parsed.error.issues,
          },
        });
        return;
      }

      const fixture = await PolicyRegistryService.addFixtureToPack(
        req.params.id as string,
        parsed.data,
        req.user!.id,
        { correlationId },
      );

      res.status(201).json({ data: fixture, error: null });
    } catch (error) {
      const msg = (error as Error).message;
      const isNotFound = msg.startsWith("POLICY_PACK_NOT_FOUND");
      res.status(isNotFound ? 404 : 500).json({
        data: null,
        error: {
          code: isNotFound ? ErrorCode.NOT_FOUND : ErrorCode.INTERNAL_ERROR,
          message: msg,
          correlationId,
        },
      });
    }
  },
);

/**
 * POST /api/v1/policies/:id/test
 * Runs all test fixtures associated with a policy pack.
 */
policyRouter.post(
  "/:id/test",
  authenticate,
  requireAicteAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const correlationId =
      (req.headers["x-correlation-id"] as string) || "UNKNOWN";
    try {
      const suiteResult = await PolicyRegistryService.runPackFixtures(
        req.params.id as string,
        req.user!.id,
        { correlationId },
      );

      res.status(200).json({ data: suiteResult, error: null });
    } catch (error) {
      const msg = (error as Error).message;
      const isNotFound = msg.startsWith("POLICY_PACK_NOT_FOUND");
      res.status(isNotFound ? 404 : 500).json({
        data: null,
        error: {
          code: isNotFound ? ErrorCode.NOT_FOUND : ErrorCode.INTERNAL_ERROR,
          message: msg,
          correlationId,
        },
      });
    }
  },
);

/**
 * POST /api/v1/policies/:id/submit-review
 * Submits a policy pack for council review (enforces 100% fixture pass rate).
 */
policyRouter.post(
  "/:id/submit-review",
  authenticate,
  requireAicteAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const correlationId =
      (req.headers["x-correlation-id"] as string) || "UNKNOWN";
    try {
      const pack = await PolicyRegistryService.submitPackForCouncilReview(
        req.params.id as string,
        req.user!.id,
        { correlationId },
      );

      res.status(200).json({ data: pack, error: null });
    } catch (error) {
      const msg = (error as Error).message;
      const isValidation = msg.startsWith("FIXTURE_VALIDATION_FAILED");
      const isTransition = msg.startsWith("INVALID_STATE_TRANSITION");
      res.status(isValidation || isTransition ? 400 : 500).json({
        data: null,
        error: {
          code: isValidation
            ? ErrorCode.VALIDATION_ERROR
            : ErrorCode.INTERNAL_ERROR,
          message: msg,
          correlationId,
        },
      });
    }
  },
);

/**
 * POST /api/v1/policies/:id/activate
 * Dual-authorization activation sign-off (reviewer !== author with Gazette Notification reference).
 */
policyRouter.post(
  "/:id/activate",
  authenticate,
  requireAicteAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const correlationId =
      (req.headers["x-correlation-id"] as string) || "UNKNOWN";
    try {
      const parsed = activatePolicyPackSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          data: null,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: "Invalid activation parameters",
            correlationId,
            details: parsed.error.issues,
          },
        });
        return;
      }

      const pack = await PolicyRegistryService.activatePolicyPack(
        req.params.id as string,
        req.user!.id,
        {
          gazetteNotificationNumber: parsed.data.gazetteNotificationNumber,
          signoffNotes: parsed.data.signoffNotes,
          stepUpVerifiedAt: new Date(),
        },
        { correlationId },
      );

      res.status(200).json({ data: pack, error: null });
    } catch (error) {
      const msg = (error as Error).message;
      const isDutyViolation = msg.startsWith("SEPARATION_OF_DUTIES_VIOLATION");
      const isTransition = msg.startsWith("INVALID_STATE_TRANSITION");
      res.status(isDutyViolation || isTransition ? 400 : 500).json({
        data: null,
        error: {
          code: isDutyViolation
            ? ErrorCode.PERMISSION_DENIED
            : ErrorCode.INTERNAL_ERROR,
          message: msg,
          correlationId,
        },
      });
    }
  },
);

/**
 * POST /api/v1/policies/replay
 * Executes a simulated policy evaluation on student admission cohorts without database mutation.
 */
policyRouter.post(
  "/replay",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const correlationId =
      (req.headers["x-correlation-id"] as string) || "UNKNOWN";
    try {
      const parsed = replaySimulationSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          data: null,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: "Invalid replay simulation parameters",
            correlationId,
            details: parsed.error.issues,
          },
        });
        return;
      }

      const result = await PolicyRegistryService.simulateReplay(
        parsed.data,
        req.user?.id || "anonymous",
        { correlationId },
      );

      res.status(200).json({ data: result, error: null });
    } catch (error) {
      const msg = (error as Error).message;
      const isNotFound = msg.startsWith("POLICY_PACK_NOT_FOUND");
      res.status(isNotFound ? 404 : 500).json({
        data: null,
        error: {
          code: isNotFound ? ErrorCode.NOT_FOUND : ErrorCode.INTERNAL_ERROR,
          message: msg,
          correlationId,
        },
      });
    }
  },
);
