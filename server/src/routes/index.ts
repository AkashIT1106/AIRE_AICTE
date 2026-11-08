import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { authRouter } from "./auth.routes.js";
import { tenantRouter } from "./tenant.routes.js";
import { submissionRouter } from "./submission.routes.js";
import { institutionRegistryRouter } from "./institution-registry.routes.js";
import { approvalRegistryRouter } from "./approval-registry.routes.js";
import { policyRouter } from "./policy.routes.js";
import { admissionLedgerRouter } from "./admission-ledger.routes.js";

export const apiV1Router: Router = Router();

// Mount system health probes
apiV1Router.use("/", healthRouter);

// Mount authentication and session lifecycle operations (M01 & J-01)
apiV1Router.use("/auth", authRouter);

// Mount tenant and identity operations
apiV1Router.use("/", tenantRouter);

// Mount admission batch submission and quarantine triage (J-02)
apiV1Router.use("/", submissionRouter);

// Mount Phase 3: Institution & Programme Registry (M02)
apiV1Router.use("/", institutionRegistryRouter);

// Mount Phase 3: Approval & Entitlement Registry (M03)
apiV1Router.use("/", approvalRegistryRouter);

// Mount Phase 4: Regulatory Policy Registry & Rule Engine (M04)
apiV1Router.use("/policies", policyRouter);

// Mount Phase 6: Identity Gateway & Admission Ledger (M07, M08, M15)
apiV1Router.use("/", admissionLedgerRouter);
