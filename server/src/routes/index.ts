import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { tenantRouter } from "./tenant.routes.js";

export const apiV1Router: Router = Router();

// Mount system health probes
apiV1Router.use("/", healthRouter);

// Mount tenant and identity operations
apiV1Router.use("/", tenantRouter);
