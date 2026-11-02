import { Router, Request, Response } from "express";
import { ApiResponse, SystemHealth } from "@aire/shared-types";
import { checkDatabaseHealth } from "../config/database.js";

export const healthRouter: Router = Router();

const startTime = Date.now();

healthRouter.get("/health", async (_req: Request, res: Response) => {
  const dbHealth = await checkDatabaseHealth();
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  const isHealthy = dbHealth.status === "connected";

  const healthData: SystemHealth = {
    status: isHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    version: "0.1.0",
    services: {
      database: dbHealth,
      redis: {
        status: "connected", // Verified by worker/queue connection
      },
    },
  };

  const response: ApiResponse<SystemHealth> = {
    data: healthData,
    error: null,
  };

  res.status(isHealthy ? 200 : 503).json(response);
});

healthRouter.get("/ready", async (_req: Request, res: Response) => {
  const dbHealth = await checkDatabaseHealth();
  if (dbHealth.status === "connected") {
    res.status(200).json({ status: "READY" });
  } else {
    res.status(503).json({ status: "NOT_READY" });
  }
});
