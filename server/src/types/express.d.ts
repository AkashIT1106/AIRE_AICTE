import {
  User as BetterAuthUser,
  Session as BetterAuthSession,
} from "better-auth";

declare global {
  namespace Express {
    interface Request {
      user?: BetterAuthUser | null;
      session?: BetterAuthSession | null;
      tenantContext?: {
        institutionId: string;
        role: string;
        isPlatformAdmin?: boolean;
      };
    }
  }
}

export {};
