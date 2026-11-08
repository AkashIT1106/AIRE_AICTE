import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/authorize.js";
import { Permission } from "@aire/authorization";
import { ApiResponse, ErrorCode } from "@aire/shared-types";
import {
  admissionBatchInputSchema,
  quarantineRemediationSchema,
  sealBatchRequestSchema,
} from "@aire/validation";
import { SubmissionService } from "../services/submission.service.js";

export const submissionRouter: Router = Router();

/**
 * Lists all admission batches for the tenant institution.
 */
submissionRouter.get(
  "/institutions/:institutionId/submissions",
  authenticate,
  requirePermission(Permission.ADMISSION_READ, { requireTenant: true }),
  async (req: Request, res: Response) => {
    const institutionId = req.tenantContext!.institutionId;

    try {
      const batches = await SubmissionService.listBatches(institutionId);
      const response: ApiResponse<unknown> = {
        data: batches,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to list submission batches",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Creates and validates an incoming admission batch per Journey J-02.
 */
submissionRouter.post(
  "/institutions/:institutionId/submissions",
  authenticate,
  requirePermission(Permission.ADMISSION_SUBMIT, { requireTenant: true }),
  async (req: Request, res: Response) => {
    const institutionId = req.tenantContext!.institutionId;

    const parseResult = admissionBatchInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: "Invalid submission batch payload",
          correlationId: req.correlationId,
          details: parseResult.error.flatten(),
        },
      };
      res.status(400).json(response);
      return;
    }

    try {
      const batch = await SubmissionService.createBatch(
        institutionId,
        parseResult.data,
        req.correlationId,
        req.user?.id,
      );

      const response: ApiResponse<unknown> = {
        data: batch,
        error: null,
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to process admission batch",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Retrieves a single submission batch with staged and quarantine details.
 */
submissionRouter.get(
  "/institutions/:institutionId/submissions/:batchId",
  authenticate,
  requirePermission(Permission.ADMISSION_READ, { requireTenant: true }),
  async (req: Request, res: Response) => {
    const institutionId = req.tenantContext!.institutionId;
    const batchId = String(req.params.batchId);

    try {
      const batch = await SubmissionService.getBatchById(
        institutionId,
        batchId,
      );

      if (!batch) {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: `Submission batch ${batchId} not found`,
            correlationId: req.correlationId,
          },
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<unknown> = {
        data: batch,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to retrieve submission batch",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Remediates a specific quarantined record inline (Journey J-02 Step 5).
 */
submissionRouter.patch(
  "/institutions/:institutionId/submissions/:batchId/quarantine/:rowId",
  authenticate,
  requirePermission(Permission.ADMISSION_SUBMIT, { requireTenant: true }),
  async (req: Request, res: Response) => {
    const institutionId = req.tenantContext!.institutionId;
    const batchId = String(req.params.batchId);
    const rowId = String(req.params.rowId);

    const parseResult = quarantineRemediationSchema.safeParse(req.body);
    if (!parseResult.success) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: "Invalid quarantine remediation data",
          correlationId: req.correlationId,
          details: parseResult.error.flatten(),
        },
      };
      res.status(400).json(response);
      return;
    }

    try {
      const updatedBatch = await SubmissionService.remediateQuarantineRow(
        institutionId,
        batchId,
        rowId,
        parseResult.data,
        req.correlationId,
        req.user?.id,
      );

      const response: ApiResponse<unknown> = {
        data: updatedBatch,
        error: null,
      };
      res.status(200).json(response);
    } catch (error: any) {
      if (
        error.message === "BATCH_NOT_FOUND" ||
        error.message === "QUARANTINE_ROW_NOT_FOUND"
      ) {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: error.message,
            correlationId: req.correlationId,
          },
        };
        res.status(404).json(response);
        return;
      }

      if (error.message === "VALIDATION_FAILED") {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: "Remediated record failed schema validation",
            correlationId: req.correlationId,
            details: error.details,
          },
        };
        res.status(422).json(response);
        return;
      }

      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to remediate quarantined row",
          correlationId: req.correlationId,
          details: error.message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Retrieves only the quarantined rows for a batch (Screen S-12).
 */
submissionRouter.get(
  "/institutions/:institutionId/submissions/:batchId/quarantine",
  authenticate,
  requirePermission(Permission.ADMISSION_READ, { requireTenant: true }),
  async (req: Request, res: Response) => {
    const institutionId = req.tenantContext!.institutionId;
    const batchId = String(req.params.batchId);

    try {
      const batch = await SubmissionService.getBatchById(
        institutionId,
        batchId,
      );

      if (!batch) {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: `Submission batch ${batchId} not found`,
            correlationId: req.correlationId,
          },
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<unknown> = {
        data: {
          batchId: batch.id,
          status: batch.status,
          quarantineCount: batch.quarantineCount,
          records: batch.quarantineRecords,
        },
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to list quarantined rows",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Cryptographically seals a batch with Merkle root hash (Journey J-03).
 */
submissionRouter.post(
  "/institutions/:institutionId/submissions/:batchId/seal",
  authenticate,
  requirePermission(Permission.ADMISSION_SUBMIT, { requireTenant: true }),
  async (req: Request, res: Response) => {
    const institutionId = req.tenantContext!.institutionId;
    const batchId = String(req.params.batchId);

    const parseResult = sealBatchRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: "Invalid seal request payload",
          correlationId: req.correlationId,
          details: parseResult.error.flatten(),
        },
      };
      res.status(400).json(response);
      return;
    }

    try {
      const sealResult = await SubmissionService.sealBatch(
        institutionId,
        batchId,
        parseResult.data,
        req.correlationId,
        req.user?.id,
      );

      const response: ApiResponse<unknown> = {
        data: sealResult,
        error: null,
      };
      res.status(200).json(response);
    } catch (error: any) {
      if (error.message === "BATCH_NOT_FOUND") {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: `Submission batch ${batchId} not found`,
            correlationId: req.correlationId,
          },
        };
        res.status(404).json(response);
        return;
      }

      if (error.message === "BATCH_ALREADY_SEALED") {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.CONFLICT,
            message: "Batch has already been sealed",
            correlationId: req.correlationId,
          },
        };
        res.status(409).json(response);
        return;
      }

      if (
        error.message === "CANNOT_SEAL_WITH_PENDING_QUARANTINE" ||
        error.message === "CANNOT_SEAL_EMPTY_BATCH"
      ) {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: error.message,
            correlationId: req.correlationId,
          },
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to seal submission batch",
          correlationId: req.correlationId,
          details: error.message,
        },
      };
      res.status(500).json(response);
    }
  },
);
