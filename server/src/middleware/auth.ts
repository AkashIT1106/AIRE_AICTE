import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";
import { ApiResponse, ErrorCode } from "@aire/shared-types";
import { logAuditEvent } from "../services/audit.service.js";

/**
 * Middleware ensuring an authenticated Better Auth session is present.
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const correlationId =
    (req.headers["x-correlation-id"] as string) || "UNKNOWN";

  try {
    const sessionData = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!sessionData || !sessionData.user || !sessionData.session) {
      await logAuditEvent({
        severity: "warn",
        correlationId,
        action: "AUTH_UNAUTHENTICATED_ACCESS_BLOCKED",
        resourceType: "HTTP_ENDPOINT",
        resourceId: req.originalUrl,
        status: "DENIED",
      });

      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.UNAUTHORIZED,
          message:
            "Authentication required: valid session token must be provided",
          correlationId,
        },
      };

      res.status(401).json(response);
      return;
    }

    req.user = sessionData.user;
    req.session = sessionData.session;
    next();
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: "Failed to verify session authentication",
        correlationId,
        details: (error as Error).message,
      },
    };
    res.status(500).json(response);
  }
}
