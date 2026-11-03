import { ApiResponse, ApiError } from "@aire/shared-types";
import { SubmissionBatch } from "@aire/api-contracts";
import { AdmissionBatchInput, QuarantineRemediation } from "@aire/validation";
import { Permission } from "@aire/authorization";

const API_BASE = "";

let currentActiveTenantId: string | null = null;

export function setActiveTenantHeader(tenantId: string | null) {
  currentActiveTenantId = tenantId;
  if (typeof window !== "undefined" && window.localStorage) {
    if (tenantId) {
      window.localStorage.setItem("aire_active_tenant_id", tenantId);
    } else {
      window.localStorage.removeItem("aire_active_tenant_id");
    }
  }
}

export function getActiveTenantHeader(): string | null {
  if (currentActiveTenantId) return currentActiveTenantId;
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage.getItem("aire_active_tenant_id");
  }
  return null;
}

export class ApiException extends Error {
  public code: string;
  public correlationId?: string;
  public details?: unknown;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiException";
    this.code = error.code;
    this.correlationId = error.correlationId;
    this.details = error.details;
  }
}

/**
 * Standard typed HTTP fetch wrapper supporting correlation tracing, active tenant headers, and credentials.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const correlationId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `req-${Date.now()}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Correlation-ID": correlationId,
  };

  const activeTenant = getActiveTenantHeader();
  if (activeTenant) {
    defaultHeaders["X-Institution-ID"] = activeTenant;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const body: ApiResponse<T> = await response.json();

  if (!response.ok || body.error) {
    const error: ApiError = body.error || {
      code: "HTTP_ERROR",
      message: `HTTP Error ${response.status}: ${response.statusText}`,
      correlationId,
    };
    throw new ApiException(error);
  }

  return body.data as T;
}

// -----------------------------------------------------------------------------
// Authentication & Identity Operations
// -----------------------------------------------------------------------------

export interface AuthContextResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  platformRoles: string[];
  memberships: Array<{
    institutionId: string;
    role: string;
    status: string;
    institution: {
      id: string;
      code: string;
      name: string;
      status: string;
    };
  }>;
  activeInstitution: {
    id: string;
    code: string;
    name: string;
    role: string;
  } | null;
  permissions: Permission[];
}

export const AuthApi = {
  /**
   * Retrieves the current authenticated session profile and tenant memberships.
   */
  async getMe(institutionId?: string): Promise<AuthContextResponse> {
    const query = institutionId
      ? `?institutionId=${encodeURIComponent(institutionId)}`
      : "";
    return apiRequest<AuthContextResponse>(`/api/v1/auth/me${query}`);
  },

  /**
   * Signs in via local Better Auth email credentials.
   */
  async signIn(email: string, password: string): Promise<unknown> {
    return apiRequest<unknown>("/api/auth/sign-in/email", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Signs out current Better Auth session.
   */
  async signOut(): Promise<unknown> {
    return apiRequest<unknown>("/api/auth/sign-out", {
      method: "POST",
    });
  },

  /**
   * Lists all institutions authorized for the current user.
   */
  async listInstitutions(): Promise<
    Array<{ id: string; code: string; name: string; status: string }>
  > {
    return apiRequest<
      Array<{ id: string; code: string; name: string; status: string }>
    >("/api/v1/institutions");
  },
};

// -----------------------------------------------------------------------------
// Journey J-02 Institution Admission API Operations
// -----------------------------------------------------------------------------

export const SubmissionsApi = {
  /**
   * Lists all admission batches for the institution.
   */
  async listBatches(institutionId: string): Promise<SubmissionBatch[]> {
    return apiRequest<SubmissionBatch[]>(
      `/api/v1/institutions/${institutionId}/submissions`,
    );
  },

  /**
   * Uploads and stages a new admission batch for asynchronous schema validation.
   */
  async createBatch(
    institutionId: string,
    payload: AdmissionBatchInput,
  ): Promise<SubmissionBatch> {
    return apiRequest<SubmissionBatch>(
      `/api/v1/institutions/${institutionId}/submissions`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },

  /**
   * Retrieves single batch details including staged records and quarantine items.
   */
  async getBatch(
    institutionId: string,
    batchId: string,
  ): Promise<SubmissionBatch> {
    return apiRequest<SubmissionBatch>(
      `/api/v1/institutions/${institutionId}/submissions/${batchId}`,
    );
  },

  /**
   * Remediates a quarantined student admission record inline.
   */
  async remediateRow(
    institutionId: string,
    batchId: string,
    rowId: string,
    remediation: QuarantineRemediation,
  ): Promise<SubmissionBatch> {
    return apiRequest<SubmissionBatch>(
      `/api/v1/institutions/${institutionId}/submissions/${batchId}/quarantine/${rowId}`,
      {
        method: "PATCH",
        body: JSON.stringify(remediation),
      },
    );
  },
};
