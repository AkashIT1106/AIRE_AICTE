import { ApiResponse, SystemHealth } from "@aire/shared-types";

/**
 * Endpoint contracts and response definitions for API v1.
 */
export interface HealthCheckResponse extends ApiResponse<SystemHealth> {}

export interface ApiRoutes {
  HEALTH: "/api/v1/health";
  READY: "/api/v1/ready";
}

export const API_ROUTES: ApiRoutes = {
  HEALTH: "/api/v1/health",
  READY: "/api/v1/ready",
};
