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

// -----------------------------------------------------------------------------
// Authentication & Session DTOs (M01 & J-01)
// -----------------------------------------------------------------------------

export interface AuthUserDto {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AuthSessionDto {
  id: string;
  userId: string;
  expiresAt: string | Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface AuthResponseDto {
  user: AuthUserDto;
  session?: AuthSessionDto | null;
}

export interface StepUpResponseDto {
  stepUpVerified: boolean;
  verifiedAt: string;
}

export interface SessionTouchResponseDto {
  touched: boolean;
  updatedAt: string;
}

export interface SessionRevocationResponseDto {
  revoked: boolean;
  count: number;
}

// -----------------------------------------------------------------------------
// Policy Engine & Regulatory Policy Registry DTOs (M04 & S-23 / S-40)
// -----------------------------------------------------------------------------

export type PolicyPackStatus =
  | "DRAFT"
  | "COUNCIL_REVIEW"
  | "GAZETTE_NOTIFIED"
  | "IN_FORCE"
  | "SUPERSEDED"
  | "AMENDED";

export type RuleCategory =
  "CAPACITY" | "QUOTA" | "ELIGIBILITY" | "TIMELINE" | "PENAL_ACTION";

export type RuleSeverity = "VIOLATION" | "WARNING";

export type EvaluationResultStatus =
  "COMPLIANT" | "VIOLATION" | "WARNING" | "INCONCLUSIVE";

export type InstitutionalPenalStatus =
  | "APPROVED"
  | "REDUCED_INTAKE"
  | "NO_ADMISSION"
  | "WITHDRAWAL_OF_APPROVAL"
  | "RESTORATION";

export interface PolicyRuleDto {
  id: string;
  policyPackId: string;
  code: string;
  name: string;
  category: RuleCategory;
  clauseReference: string;
  description?: string | null;
  severity: RuleSeverity;
  parameters: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyTestFixtureDto {
  id: string;
  policyPackId: string;
  name: string;
  description?: string | null;
  inputData: Record<string, unknown>;
  expectedOutput: Record<string, unknown>;
  lastRunStatus?: "PASSED" | "FAILED" | null;
  lastRunAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyActivationSignoffDto {
  id: string;
  policyPackId: string;
  reviewerId: string;
  gazetteNotificationNumber: string;
  stepUpVerifiedAt: string;
  fixtureRunEvidenceHash: string;
  signoffNotes?: string | null;
  activatedAt: string;
}

export interface PolicyPackDto {
  id: string;
  code: string;
  name: string;
  academicYear: string;
  edition: string;
  status: PolicyPackStatus;
  stateCode?: string | null;
  gazetteReference?: string | null;
  contentHash?: string | null;
  authorId: string;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  supersededById?: string | null;
  parentPackId?: string | null;
  rules?: PolicyRuleDto[];
  fixtures?: PolicyTestFixtureDto[];
  activationSignoffs?: PolicyActivationSignoffDto[];
  createdAt: string;
  updatedAt: string;
}

export interface ReplaySimulationRequestDto {
  policyPackId: string;
  baselinePolicyPackId?: string;
  cohort: {
    academicYear: string;
    sanctionedIntake: number;
    admittedRegularCount: number;
    categories: {
      OPEN: number;
      SC: number;
      ST: number;
      OBC: number;
    };
    supernumerary: {
      EWS: number;
      TFW: number;
      lateralEntry?: number;
    };
    institutionalStatus?: InstitutionalPenalStatus;
  };
}

export interface ReplaySimulationResultDto {
  policyPackId: string;
  policyCode: string;
  evaluatedAt: string;
  headcountEvaluated: number;
  overallStatus: EvaluationResultStatus;
  ruleResults: Array<{
    ruleCode: string;
    ruleName: string;
    clauseReference: string;
    status: EvaluationResultStatus;
    message: string;
    breachMagnitude?: number;
    details?: Record<string, unknown>;
  }>;
  summary: {
    compliantCount: number;
    violationCount: number;
    warningCount: number;
  };
}
