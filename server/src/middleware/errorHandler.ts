import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { ApiResponse, ErrorCode } from "@aire/shared-types";
import { logger } from "../config/logger.js";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const correlationId = req.correlationId || "UNKNOWN";
  const requestId = req.requestId || "UNKNOWN";

  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    logger.warn({
      eventType: "VALIDATION_FAILED",
      correlationId,
      requestId,
      outcome: "REJECTED",
      errors: err.errors,
    });

    const responsePayload: ApiResponse = {
      data: null,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: "Request payload validation failed.",
        correlationId,
        details: err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
    };

    res.status(400).json(responsePayload);
    return;
  }

  // 2. Custom Application Error
  if (err instanceof AppError) {
    logger.warn({
      eventType: "APP_ERROR",
      correlationId,
      requestId,
      code: err.code,
      statusCode: err.statusCode,
      message: err.message,
    });

    const responsePayload: ApiResponse = {
      data: null,
      error: {
        code: err.code,
        message: err.message,
        correlationId,
        details: err.details,
      },
    };

    res.status(err.statusCode).json(responsePayload);
    return;
  }

  // 3. Unhandled Internal Errors (Redact all internals per Section 11.3)
  logger.error({
    eventType: "INTERNAL_SERVER_ERROR",
    correlationId,
    requestId,
    errorMessage: err.message,
    errorStack: err.stack,
  });

  const responsePayload: ApiResponse = {
    data: null,
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message:
        "An internal server error occurred. Please contact support with the correlation ID.",
      correlationId,
    },
  };

  res.status(500).json(responsePayload);
};
