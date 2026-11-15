/**
 * Centralized API service layer for AIRE frontend.
 * All requests include credentials (HttpOnly cookies via Better Auth).
 */

import type { ApiResponse } from "@aire/shared-types";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "/api/v1";

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly correlationId?: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const headers: Record<string, string> = {};
  if (body !== undefined && (method === "POST" || method === "PATCH" || method === "PUT")) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Handle 204 No Content
  if (res.status === 204) {
    return undefined as unknown as T;
  }

  let json: ApiResponse<T>;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(
      "PARSE_ERROR",
      `Failed to parse response from ${method} ${path} (HTTP ${res.status})`,
    );
  }

  if (json.error) {
    throw new ApiError(
      json.error.code,
      json.error.message,
      json.error.correlationId,
      json.error.details,
    );
  }

  if (!res.ok) {
    throw new ApiError(
      "HTTP_ERROR",
      `HTTP ${res.status} from ${method} ${path}`,
    );
  }

  return json.data as T;
}

export const api = {
  get<T>(path: string): Promise<T> {
    return request<T>("GET", path);
  },
  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>("POST", path, body);
  },
  patch<T>(path: string, body?: unknown): Promise<T> {
    return request<T>("PATCH", path, body);
  },
  put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>("PUT", path, body);
  },
  delete<T>(path: string): Promise<T> {
    return request<T>("DELETE", path);
  },
};
