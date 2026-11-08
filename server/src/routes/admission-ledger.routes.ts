import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/authorize.js";
import { Permission } from "@aire/authorization";
import { ApiResponse, ErrorCode } from "@aire/shared-types";
import {
  branchChangeRequestSchema,
  cancellationRequestSchema,
  migrationRequestSchema,
  vaultAccessRequestSchema,
} from "@aire/validation";
import { AdmissionLedgerService } from "../services/admission-ledger.service.js";
import { IdentityVaultService } from "../services/identity-vault.service.js";

export const admissionLedgerRouter: Router = Router();

/**
 * Lists admission records for the tenant institution.
 */
admissionLedgerRouter.get(
  "/institutions/:institutionId/admissions",
  authenticate,
  requirePermission(Permission.ADMISSION_READ, { requireTenant: true }),
  async (req: Request, res: Response) => {
    const institutionId = req.tenantContext!.institutionId;

    try {
      const filters = {
        programmeId: req.query.programmeId as string | undefined,
        academicYear: req.query.academicYear as string | undefined,
        status: req.query.status as string | undefined,
        apaarStatus: req.query.apaarStatus as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        pageSize: req.query.pageSize
          ? parseInt(req.query.pageSize as string, 10)
          : 20,
      };

      const result = await AdmissionLedgerService.listAdmissions(
        institutionId,
        filters,
      );
      const response: ApiResponse<typeof result> = {
        data: result,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to list admission records",
          correlationId: req.correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Retrieves details for a single admission record.
 */
admissionLedgerRouter.get(
  "/institutions/:institutionId/admissions/:id",
  authenticate,
  requirePermission(Permission.ADMISSION_READ, { requireTenant: true }),
  async (req: Request, res: Response) => {
    const institutionId = req.tenantContext!.institutionId;
    const admissionRecordId = req.params.id as string;

    try {
      const record = await AdmissionLedgerService.getAdmissionDetails(
        institutionId,
        admissionRecordId,
      );
      const response: ApiResponse<typeof record> = {
        data: record,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const err = error as Error;
      const isNotFound = err.message === "ADMISSION_RECORD_NOT_FOUND";
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: isNotFound ? ErrorCode.NOT_FOUND : ErrorCode.INTERNAL_ERROR,
          message: isNotFound
            ? "Admission record not found"
            : "Failed to retrieve admission details",
          correlationId: req.correlationId,
          details: err.message,
        },
      };
      res.status(isNotFound ? 404 : 500).json(response);
    }
  },
);

/**
 * Retrieves and cryptographically validates the chronological ledger for a student record.
 */
admissionLedgerRouter.get(
  "/institutions/:institutionId/admissions/:id/ledger",
  authenticate,
  requirePermission(Permission.ADMISSION_READ, { requireTenant: true }),
  async (req: Request, res: Response) => {
    const institutionId = req.tenantContext!.institutionId;
    const admissionRecordId = req.params.id as string;

    try {
      const record = await AdmissionLedgerService.getAdmissionDetails(
        institutionId,
        admissionRecordId,
      );
      const integrity =
        await AdmissionLedgerService.verifyLedgerIntegrity(admissionRecordId);

      const response: ApiResponse<{
        events: typeof record.ledgerEvents;
        integrity: typeof integrity;
      }> = {
        data: {
          events: record.ledgerEvents,
          integrity,
        },
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const err = error as Error;
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code:
            err.message === "ADMISSION_RECORD_NOT_FOUND"
              ? ErrorCode.NOT_FOUND
              : ErrorCode.INTERNAL_ERROR,
          message: "Failed to verify ledger integrity",
          correlationId: req.correlationId,
          details: err.message,
        },
      };
      res
        .status(err.message === "ADMISSION_RECORD_NOT_FOUND" ? 404 : 500)
        .json(response);
    }
  },
);

/**
 * Records an authorized intra-institutional branch change.
 */
admissionLedgerRouter.post(
  "/institutions/:institutionId/admissions/:id/branch-change",
  authenticate,
  requirePermission(Permission.ADMISSION_SUBMIT, { requireTenant: true }),
  async (req: Request, res: Response) => {
    const institutionId = req.tenantContext!.institutionId;
    const admissionRecordId = req.params.id as string;

    const parseResult = branchChangeRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: "Validation failed for branch change request",
          correlationId: req.correlationId,
          details: parseResult.error.format(),
        },
      };
      res.status(400).json(response);
      return;
    }

    try {
      const result = await AdmissionLedgerService.recordBranchChange(
        institutionId,
        admissionRecordId,
        parseResult.data,
        req.user?.id || "INSTITUTION_OPERATOR",
        req.correlationId,
      );

      const response: ApiResponse<typeof result> = {
        data: result,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const err = error as Error;
      const isClientErr =
        err.message === "ADMISSION_RECORD_NOT_FOUND" ||
        err.message.startsWith("CANNOT_TRANSFER_INACTIVE_RECORD") ||
        err.message === "DESTINATION_PROGRAMME_NOT_FOUND";

      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: isClientErr
            ? ErrorCode.VALIDATION_ERROR
            : ErrorCode.INTERNAL_ERROR,
          message: err.message,
          correlationId: req.correlationId,
        },
      };
      res.status(isClientErr ? 400 : 500).json(response);
    }
  },
);

/**
 * Records an authorized admission cancellation and releases seat entitlement.
 */
admissionLedgerRouter.post(
  "/institutions/:institutionId/admissions/:id/cancel",
  authenticate,
  requirePermission(Permission.ADMISSION_SUBMIT, { requireTenant: true }),
  async (req: Request, res: Response) => {
    const institutionId = req.tenantContext!.institutionId;
    const admissionRecordId = req.params.id as string;

    const parseResult = cancellationRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: "Validation failed for cancellation request",
          correlationId: req.correlationId,
          details: parseResult.error.format(),
        },
      };
      res.status(400).json(response);
      return;
    }

    try {
      const result = await AdmissionLedgerService.recordCancellation(
        institutionId,
        admissionRecordId,
        parseResult.data,
        req.user?.id || "INSTITUTION_OPERATOR",
        req.correlationId,
      );

      const response: ApiResponse<typeof result> = {
        data: result,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const err = error as Error;
      const isClientErr =
        err.message === "ADMISSION_RECORD_NOT_FOUND" ||
        err.message.startsWith("CANNOT_CANCEL_INACTIVE_RECORD");

      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: isClientErr
            ? ErrorCode.VALIDATION_ERROR
            : ErrorCode.INTERNAL_ERROR,
          message: err.message,
          correlationId: req.correlationId,
        },
      };
      res.status(isClientErr ? 400 : 500).json(response);
    }
  },
);

/**
 * Triggers external identity verification for an admission record via IdentityGateway.
 */
admissionLedgerRouter.post(
  "/institutions/:institutionId/admissions/:id/migrate",
  authenticate,
  requirePermission(Permission.ADMISSION_SUBMIT, { requireTenant: true }),
  async (req: Request, res: Response) => {
    const institutionId = req.tenantContext!.institutionId;
    const admissionRecordId = req.params.id as string;

    const parseResult = migrationRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: "Validation failed for migration request",
          correlationId: req.correlationId,
          details: parseResult.error.format(),
        },
      };
      res.status(400).json(response);
      return;
    }

    try {
      const result = await AdmissionLedgerService.recordMigration(
        institutionId,
        admissionRecordId,
        parseResult.data,
        req.user?.id || "INSTITUTION_OPERATOR",
        req.correlationId,
      );

      const response: ApiResponse<typeof result> = {
        data: result,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const err = error as Error;
      const isClientErr =
        err.message === "ADMISSION_RECORD_NOT_FOUND" ||
        err.message.startsWith("CANNOT_MIGRATE_INACTIVE_RECORD");

      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: isClientErr
            ? ErrorCode.VALIDATION_ERROR
            : ErrorCode.INTERNAL_ERROR,
          message: err.message,
          correlationId: req.correlationId,
        },
      };
      res.status(isClientErr ? 400 : 500).json(response);
    }
  },
);

/**
 * Triggers external identity verification for an admission record via IdentityGateway.
 */
admissionLedgerRouter.post(
  "/institutions/:institutionId/admissions/:id/verify-identity",
  authenticate,
  requirePermission(Permission.ADMISSION_SUBMIT, { requireTenant: true }),
  async (req: Request, res: Response) => {
    const institutionId = req.tenantContext!.institutionId;
    const admissionRecordId = req.params.id as string;

    try {
      const result = await AdmissionLedgerService.verifyAdmissionIdentity(
        institutionId,
        admissionRecordId,
        req.user?.id || "INSTITUTION_OPERATOR",
        req.correlationId,
      );

      const response: ApiResponse<typeof result> = {
        data: result,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const err = error as Error;
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code:
            err.message === "ADMISSION_RECORD_NOT_FOUND"
              ? ErrorCode.NOT_FOUND
              : ErrorCode.INTERNAL_ERROR,
          message: err.message,
          correlationId: req.correlationId,
        },
      };
      res
        .status(err.message === "ADMISSION_RECORD_NOT_FOUND" ? 404 : 500)
        .json(response);
    }
  },
);

/**
 * Purpose-bound decryption of demographic PII from the Identity Vault.
 */
admissionLedgerRouter.post(
  "/institutions/:institutionId/admissions/:id/vault-access",
  authenticate,
  requirePermission(Permission.ADMISSION_READ, { requireTenant: true }),
  async (req: Request, res: Response) => {
    const institutionId = req.tenantContext!.institutionId;
    const admissionRecordId = req.params.id as string;

    const parseResult = vaultAccessRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message:
            "Statutory processing purpose code is required to access Identity Vault",
          correlationId: req.correlationId,
          details: parseResult.error.format(),
        },
      };
      res.status(400).json(response);
      return;
    }

    try {
      const record = await AdmissionLedgerService.getAdmissionDetails(
        institutionId,
        admissionRecordId,
      );

      const decryptedIdentity = await IdentityVaultService.decryptStudentRecord(
        record.studentToken,
        parseResult.data.purposeCode,
        req.user?.id || "AUDITOR",
        req.correlationId,
        institutionId,
      );

      const response: ApiResponse<typeof decryptedIdentity> = {
        data: decryptedIdentity,
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const err = error as Error;
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: err.message,
          correlationId: req.correlationId,
        },
      };
      res.status(500).json(response);
    }
  },
);
