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
