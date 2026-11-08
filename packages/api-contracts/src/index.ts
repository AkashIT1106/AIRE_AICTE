import { ApiResponse, SystemHealth } from "@aire/shared-types";
import { AdmissionRecord } from "@aire/validation";

/**
 * Endpoint contracts and response definitions for API v1.
 */
export interface HealthCheckResponse extends ApiResponse<SystemHealth> {}

export type SubmissionBatchStatus =
  | "UPLOADED"
  | "VALIDATING"
  | "QUARANTINED"
  | "VALIDATED"
  | "READY_FOR_SIGN_OFF"
  | "SEALED";

export interface StagedRecord {
  rowId: string;
  rowNumber: number;
  data: AdmissionRecord;
  status: "ACCEPTED";
  validatedAt: string;
}

export interface QuarantineFieldError {
  field: string;
  message: string;
  received: unknown;
}

export interface QuarantineRecord {
  rowId: string;
  rowNumber: number;
  rawData: Record<string, unknown>;
  errors: QuarantineFieldError[];
  status: "QUARANTINED";
}

export interface SubmissionBatch {
  id: string;
  institutionId: string;
  academicYear: string;
  programme: string;
  fileName: string;
  status: SubmissionBatchStatus;
  totalCount: number;
  validCount: number;
  quarantineCount: number;
  stagedRecords: StagedRecord[];
  quarantineRecords: QuarantineRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiRoutes {
  HEALTH: "/api/v1/health";
  READY: "/api/v1/ready";
  INSTITUTIONS: "/api/v1/institutions";
  INSTITUTION_DETAIL: "/api/v1/institutions/:institutionId";
  INSTITUTION_CAMPUSES: "/api/v1/institutions/:institutionId/campuses";
  PROGRAMMES: "/api/v1/programmes";
  PROGRAMME_DETAIL: "/api/v1/programmes/:programmeId";
  APPROVAL_ORDERS: "/api/v1/approvals";
  APPROVAL_ORDER_DETAIL: "/api/v1/approvals/:approvalId";
  APPROVAL_SUPERSEDE: "/api/v1/approvals/:approvalId/supersede";
  INSTITUTION_SUBMISSIONS: "/api/v1/institutions/:institutionId/submissions";
  INSTITUTION_SUBMISSION_DETAIL: "/api/v1/institutions/:institutionId/submissions/:batchId";
  INSTITUTION_QUARANTINE_REMEDIATE: "/api/v1/institutions/:institutionId/submissions/:batchId/quarantine/:rowId";
}

export const API_ROUTES: ApiRoutes = {
  HEALTH: "/api/v1/health",
  READY: "/api/v1/ready",
  INSTITUTIONS: "/api/v1/institutions",
  INSTITUTION_DETAIL: "/api/v1/institutions/:institutionId",
  INSTITUTION_CAMPUSES: "/api/v1/institutions/:institutionId/campuses",
  PROGRAMMES: "/api/v1/programmes",
  PROGRAMME_DETAIL: "/api/v1/programmes/:programmeId",
  APPROVAL_ORDERS: "/api/v1/approvals",
  APPROVAL_ORDER_DETAIL: "/api/v1/approvals/:approvalId",
  APPROVAL_SUPERSEDE: "/api/v1/approvals/:approvalId/supersede",
  INSTITUTION_SUBMISSIONS: "/api/v1/institutions/:institutionId/submissions",
  INSTITUTION_SUBMISSION_DETAIL:
    "/api/v1/institutions/:institutionId/submissions/:batchId",
  INSTITUTION_QUARANTINE_REMEDIATE:
    "/api/v1/institutions/:institutionId/submissions/:batchId/quarantine/:rowId",
};
