import { Router, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";
import { authenticate } from "../middleware/auth.js";
import { getPrismaClient } from "../config/database.js";
import { logAuditEvent } from "../services/audit.service.js";
import { AuthorizationService } from "../services/authorization.service.js";
import { signInSchema, signUpSchema, stepUpSchema } from "@aire/validation";
import {
  ApiResponse,
  ErrorCode,
  AuthResponseDto,
  StepUpResponseDto,
  SessionTouchResponseDto,
  SessionRevocationResponseDto,
} from "@aire/shared-types";

export const authRouter: Router = Router();

/**
 * Forwards Set-Cookie headers from Better Auth Web API Response into Express HTTP Response.
 */
function forwardBetterAuthCookies(
  betterAuthRes: globalThis.Response,
  expressRes: Response,
): void {
  const getSetCookie = (
    betterAuthRes.headers as unknown as { getSetCookie?: () => string[] }
  ).getSetCookie;

  if (typeof getSetCookie === "function") {
    const cookies = getSetCookie.call(betterAuthRes.headers);
    if (cookies && cookies.length > 0) {
      expressRes.setHeader("Set-Cookie", cookies);
      return;
    }
  }

  const single = betterAuthRes.headers.get("set-cookie");
  if (single) {
    expressRes.setHeader("Set-Cookie", single);
  }
}

/**
 * POST /api/v1/auth/sign-in
 * Authenticates user credentials via Better Auth, sets session cookies, and records audit event.
 */
authRouter.post("/sign-in", async (req: Request, res: Response) => {
  const correlationId =
    (req.headers["x-correlation-id"] as string) || "UNKNOWN";

  const parseResult = signInSchema.safeParse(req.body);
  if (!parseResult.success) {
    const response: ApiResponse<null> = {
      data: null,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: "Invalid sign-in credentials format",
        correlationId,
        details: parseResult.error.errors,
      },
    };
    res.status(400).json(response);
    return;
  }

  const { email, password } = parseResult.data;

  try {
    const authRes = await auth.api.signInEmail({
      body: { email, password },
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    forwardBetterAuthCookies(authRes, res);

    if (!authRes.ok) {
      await logAuditEvent({
        severity: "warn",
        correlationId,
        action: "AUTH_LOGIN_FAILURE",
        resourceType: "USER",
        resourceId: email,
        status: "DENIED",
      });

      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.UNAUTHORIZED,
          message: "Invalid email or password",
          correlationId,
        },
      };
      res.status(401).json(response);
      return;
    }

    const authData = (await authRes.json()) as AuthResponseDto;

    await logAuditEvent({
      severity: "info",
      correlationId,
      actorId: authData.user.id,
      action: "AUTH_LOGIN_SUCCESS",
      resourceType: "USER",
      resourceId: authData.user.id,
      status: "SUCCESS",
    });

    const response: ApiResponse<AuthResponseDto> = {
      data: authData,
      error: null,
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: "Sign-in authentication failed",
        correlationId,
        details: (error as Error).message,
      },
    };
    res.status(500).json(response);
  }
});

/**
 * POST /api/v1/auth/sign-up
 * Registers user credentials in Better Auth, sets session cookies, and records audit event.
 */
authRouter.post("/sign-up", async (req: Request, res: Response) => {
  const correlationId =
    (req.headers["x-correlation-id"] as string) || "UNKNOWN";

  const parseResult = signUpSchema.safeParse(req.body);
  if (!parseResult.success) {
    const response: ApiResponse<null> = {
      data: null,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: "Invalid sign-up registration format",
        correlationId,
        details: parseResult.error.errors,
      },
    };
    res.status(400).json(response);
    return;
  }

  const { email, password, name } = parseResult.data;

  try {
    const authRes = await auth.api.signUpEmail({
      body: { email, password, name },
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    forwardBetterAuthCookies(authRes, res);

    if (!authRes.ok) {
      const errData = await authRes.json().catch(() => ({}));
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message:
            (errData as { message?: string }).message ||
            "Failed to create user account",
          correlationId,
        },
      };
      res.status(authRes.status).json(response);
      return;
    }

    const authData = (await authRes.json()) as AuthResponseDto;

    await logAuditEvent({
      severity: "info",
      correlationId,
      actorId: authData.user.id,
      action: "AUTH_USER_CREATED",
      resourceType: "USER",
      resourceId: authData.user.id,
      status: "SUCCESS",
    });

    const response: ApiResponse<AuthResponseDto> = {
      data: authData,
      error: null,
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: "Sign-up registration failed",
        correlationId,
        details: (error as Error).message,
      },
    };
    res.status(500).json(response);
  }
});

/**
 * POST /api/v1/auth/sign-out
 * Terminates active session, clears cookies, and records audit event.
 */
authRouter.post(
  "/sign-out",
  authenticate,
  async (req: Request, res: Response) => {
    const correlationId =
      (req.headers["x-correlation-id"] as string) || "UNKNOWN";

    try {
      const authRes = await auth.api.signOut({
        headers: fromNodeHeaders(req.headers),
        asResponse: true,
      });

      forwardBetterAuthCookies(authRes, res);

      await logAuditEvent({
        severity: "info",
        correlationId,
        actorId: req.user?.id,
        action: "AUTH_LOGOUT",
        resourceType: "SESSION",
        resourceId: req.session?.id || null,
        status: "SUCCESS",
      });

      const response: ApiResponse<{ signedOut: boolean }> = {
        data: { signedOut: true },
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Sign-out failed",
          correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * GET /api/v1/auth/session
 * Returns active session and identity basic profile if valid session cookie is provided.
 */
authRouter.get("/session", async (req: Request, res: Response) => {
  const correlationId =
    (req.headers["x-correlation-id"] as string) || "UNKNOWN";

  try {
    const sessionData = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!sessionData || !sessionData.user || !sessionData.session) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.UNAUTHORIZED,
          message: "No active session found",
          correlationId,
        },
      };
      res.status(401).json(response);
      return;
    }

    const response: ApiResponse<typeof sessionData> = {
      data: sessionData,
      error: null,
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: "Failed to resolve active session",
        correlationId,
        details: (error as Error).message,
      },
    };
    res.status(500).json(response);
  }
});

/**
 * GET /api/v1/auth/me
 * Returns current authenticated identity profile, memberships, active tenant, and effective permissions.
 */
authRouter.get("/me", authenticate, async (req: Request, res: Response) => {
  const correlationId =
    (req.headers["x-correlation-id"] as string) || "UNKNOWN";

  try {
    const headerInst = req.headers["x-institution-id"];
    const requestedInstId = Array.isArray(headerInst)
      ? headerInst[0]
      : (headerInst as string | undefined) ||
        (req.query.institutionId as string | undefined);

    const context = await AuthorizationService.getUserContext(
      req.user!,
      requestedInstId,
    );

    const response: ApiResponse<typeof context> = {
      data: context,
      error: null,
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: "Failed to resolve authenticated session context",
        correlationId,
        details: (error as Error).message,
      },
    };
    res.status(500).json(response);
  }
});

/**
 * POST /api/v1/auth/session/touch
 * Heartbeat endpoint resetting idle session expiry (S-03 inactivity modal).
 */
authRouter.post(
  "/session/touch",
  authenticate,
  async (req: Request, res: Response) => {
    const correlationId =
      (req.headers["x-correlation-id"] as string) || "UNKNOWN";

    try {
      const prisma = getPrismaClient();
      const updatedSession = await prisma.session.update({
        where: { id: req.session!.id },
        data: { updatedAt: new Date() },
      });

      const response: ApiResponse<SessionTouchResponseDto> = {
        data: {
          touched: true,
          updatedAt: updatedSession.updatedAt.toISOString(),
        },
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to update session touch timestamp",
          correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * POST /api/v1/auth/step-up
 * Password verification for privileged, irreversible transactions when session age > 15m (S-02).
 */
authRouter.post(
  "/step-up",
  authenticate,
  async (req: Request, res: Response) => {
    const correlationId =
      (req.headers["x-correlation-id"] as string) || "UNKNOWN";

    const parseResult = stepUpSchema.safeParse(req.body);
    if (!parseResult.success) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: "Password is required for step-up authentication",
          correlationId,
          details: parseResult.error.errors,
        },
      };
      res.status(400).json(response);
      return;
    }

    const { password } = parseResult.data;

    try {
      const verifyRes = await auth.api.verifyPassword({
        body: { password },
        headers: fromNodeHeaders(req.headers),
        asResponse: true,
      });

      if (!verifyRes.ok) {
        await logAuditEvent({
          severity: "warn",
          correlationId,
          actorId: req.user!.id,
          action: "AUTH_STEPUP_FAILURE",
          resourceType: "USER",
          resourceId: req.user!.id,
          status: "DENIED",
        });

        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: ErrorCode.UNAUTHORIZED,
            message: "Invalid step-up password",
            correlationId,
          },
        };
        res.status(401).json(response);
        return;
      }

      await logAuditEvent({
        severity: "info",
        correlationId,
        actorId: req.user!.id,
        action: "AUTH_STEPUP_SUCCESS",
        resourceType: "USER",
        resourceId: req.user!.id,
        status: "SUCCESS",
      });

      const response: ApiResponse<StepUpResponseDto> = {
        data: {
          stepUpVerified: true,
          verifiedAt: new Date().toISOString(),
        },
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Step-up authentication failed",
          correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);

/**
 * POST /api/v1/auth/sessions/revoke-all
 * Invalidates all active sessions for the user across all devices (AIRE-REQ-124).
 */
authRouter.post(
  "/sessions/revoke-all",
  authenticate,
  async (req: Request, res: Response) => {
    const correlationId =
      (req.headers["x-correlation-id"] as string) || "UNKNOWN";

    try {
      const prisma = getPrismaClient();
      const result = await prisma.session.deleteMany({
        where: { userId: req.user!.id },
      });

      res.clearCookie("aire.session_token", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
      });

      await logAuditEvent({
        severity: "warn",
        correlationId,
        actorId: req.user!.id,
        action: "AUTH_SESSION_REVOKED_ALL",
        resourceType: "USER",
        resourceId: req.user!.id,
        status: "SUCCESS",
        metadata: { revokedCount: result.count },
      });

      const response: ApiResponse<SessionRevocationResponseDto> = {
        data: {
          revoked: true,
          count: result.count,
        },
        error: null,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Failed to revoke sessions",
          correlationId,
          details: (error as Error).message,
        },
      };
      res.status(500).json(response);
    }
  },
);
