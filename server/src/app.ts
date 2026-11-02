import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { correlationIdMiddleware } from "./middleware/correlationId.js";
import { requestLoggerMiddleware } from "./middleware/requestLogger.js";
import { errorHandlerMiddleware } from "./middleware/errorHandler.js";
import { apiV1Router } from "./routes/index.js";
import { env } from "./config/env.js";

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(helmet());

  // CORS Configuration
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Correlation-ID"],
    }),
  );

  // Body Parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Tracing & Logging Middleware
  app.use(correlationIdMiddleware);
  app.use(requestLoggerMiddleware);

  // Mount API v1
  app.use("/api/v1", apiV1Router);

  // Global Error Handler
  app.use(errorHandlerMiddleware);

  return app;
}
