/**
 * Standard API error structure according to PROJECT_PLAN.md Section 11.3.
 */
export interface ApiError {
  code: string;
  message: string;
  correlationId?: string;
  details?: unknown;
}

/**
 * Standard API success/error response envelope according to PROJECT_PLAN.md Section 11.3.
 */
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
}

/**
 * Standard HTTP error codes mapped to domain categories.
 */
export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  TENANT_MISMATCH = "TENANT_MISMATCH",
  DATABASE_ERROR = "DATABASE_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
}

/**
 * Request execution context carried through application layers.
 */
export interface RequestContext {
  correlationId: string;
  requestId: string;
  timestamp: string;
  userId?: string;
  institutionId?: string;
  roles?: string[];
}

/**
 * System and operational health status.
 */
export interface SystemHealth {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  uptimeSeconds: number;
  version: string;
  services: {
    database: {
      status: "connected" | "disconnected";
      latencyMs?: number;
    };
    redis: {
      status: "connected" | "disconnected";
    };
  };
}

// -----------------------------------------------------------------------------
// Phase 3: Modules M02 & M03 Domain Entities DTOs
// -----------------------------------------------------------------------------

export interface CampusDto {
  id: string;
  institutionId: string;
  code: string;
  name: string;
  address?: string | null;
  state?: string | null;
  district?: string | null;
  pincode?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgrammeDto {
  id: string;
  canonicalCode: string;
  name: string;
  degreeLevel: string;
  discipline: string;
  durationYears: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgrammeAliasDto {
  id: string;
  programmeId: string;
  rawTitle: string;
  normalisedTitle: string;
  institutionId?: string | null;
  confidence: number;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionDto {
  id: string;
  code: string;
  name: string;
  aicteId?: string | null;
  legalName?: string | null;
  address?: string | null;
  state?: string | null;
  district?: string | null;
  pincode?: string | null;
  status: string;
  campuses?: CampusDto[];
  createdAt: string;
  updatedAt: string;
}

export interface SeatEntitlementDto {
  id: string;
  approvalOrderId: string;
  programmeId: string;
  campusId?: string | null;
  sanctionedIntake: number;
  openSeats: number;
  scSeats: number;
  stSeats: number;
  obcSeats: number;
  ewsSeats: number;
  tfwSeats: number;
  supernumerarySeats: number;
  programme?: ProgrammeDto;
  campus?: CampusDto;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalOrderDto {
  id: string;
  institutionId: string;
  academicYear: string;
  orderNumber: string;
  orderType: string;
  issueDate: string;
  status: string;
  supersededById?: string | null;
  entitlements?: SeatEntitlementDto[];
  institution?: InstitutionDto;
  createdAt: string;
  updatedAt: string;
}
