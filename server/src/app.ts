import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";
import { correlationIdMiddleware } from "./middleware/correlationId.js";
import { requestLoggerMiddleware } from "./middleware/requestLogger.js";
import { errorHandlerMiddleware } from "./middleware/errorHandler.js";
import { apiV1Router } from "./routes/index.js";
import { env } from "./config/env.js";
import { auth } from "./config/auth.js";

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(helmet());

  // CORS Configuration with Credentials
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Correlation-ID",
        "X-Institution-ID",
      ],
    }),
  );

  // Tracing Middleware
  app.use(correlationIdMiddleware);

  // Better Auth Handler: Mounted BEFORE body parsers to avoid stream consumption lockup
  app.all("/api/auth/*", toNodeHandler(auth));

  // Body Parsing Middleware (for standard API routes)
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Request Logging
  app.use(requestLoggerMiddleware);

  // Mount API v1
  app.use("/api/v1", apiV1Router);

  // Global Error Handler
  app.use(errorHandlerMiddleware);

  return app;
}
