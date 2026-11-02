import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const startTime = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startTime;
    logger.info({
      eventType: "HTTP_REQUEST",
      correlationId: req.correlationId,
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs,
      outcome: res.statusCode < 400 ? "SUCCESS" : "FAILURE",
    });
  });

  next();
}
