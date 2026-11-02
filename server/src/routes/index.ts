import { Router } from "express";
import { healthRouter } from "./health.routes.js";

export const apiV1Router: Router = Router();

// Mount system health probes
apiV1Router.use("/", healthRouter);
