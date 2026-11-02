import { describe, it, expect } from "vitest";
import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import {
  errorHandlerMiddleware,
  AppError,
} from "../src/middleware/errorHandler.js";
import { correlationIdMiddleware } from "../src/middleware/correlationId.js";
import { ErrorCode } from "@aire/shared-types";
import { z } from "zod";

describe("Error Handling Middleware (Section 11.3 & 36.1)", () => {
  const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(correlationIdMiddleware);

    app.get(
      "/test-zod",
      (_req: Request, _res: Response, next: NextFunction) => {
        try {
          z.object({ requiredField: z.string() }).parse({});
        } catch (err) {
          next(err);
        }
      },
    );

    app.get(
      "/test-app-error",
      (_req: Request, _res: Response, next: NextFunction) => {
        next(
          new AppError(
            403,
            ErrorCode.PERMISSION_DENIED,
            "Access denied to tenant resource",
          ),
        );
      },
    );

    app.get(
      "/test-internal-error",
      (_req: Request, _res: Response, next: NextFunction) => {
        next(new Error("Internal database connection leaked raw details!"));
      },
    );

    app.use(errorHandlerMiddleware);
    return app;
  };

  const app = createTestApp();

  it("formats validation errors into standard envelope", async () => {
    const response = await request(app).get("/test-zod");
    expect(response.status).toBe(400);
    expect(response.body.data).toBeNull();
    expect(response.body.error).toMatchObject({
      code: ErrorCode.VALIDATION_ERROR,
      message: "Request payload validation failed.",
    });
    expect(response.body.error.correlationId).toBeDefined();
  });

  it("formats custom AppError with correct status and error code", async () => {
    const response = await request(app).get("/test-app-error");
    expect(response.status).toBe(403);
    expect(response.body.data).toBeNull();
    expect(response.body.error).toMatchObject({
      code: ErrorCode.PERMISSION_DENIED,
      message: "Access denied to tenant resource",
    });
  });

  it("masks raw internal errors and prevents stack trace leakage", async () => {
    const response = await request(app).get("/test-internal-error");
    expect(response.status).toBe(500);
    expect(response.body.data).toBeNull();
    expect(response.body.error.code).toBe(ErrorCode.INTERNAL_ERROR);
    expect(response.body.error.message).not.toContain(
      "database connection leaked",
    );
    expect(response.body.error).not.toHaveProperty("stack");
  });
});
