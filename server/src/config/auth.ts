import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { getPrismaClient } from "./database.js";
import { env } from "./env.js";

/**
 * Better Auth configuration for AIRE platform.
 * Responsible strictly for:
 * - Credential verification & password hashing
 * - Session issuance, validation, rotation, and revocation
 * - Session cookies (HttpOnly, SameSite, Secure)
 *
 * Domain authorization, tenant isolation, memberships, and RLS remain in AIRE.
 */
export const auth = betterAuth({
  database: prismaAdapter(getPrismaClient(), {
    provider: "postgresql",
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [
    env.CORS_ORIGIN,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: false,
    },
  },
  advanced: {
    cookiePrefix: "aire",
    useSecureCookies: env.NODE_ENV === "production",
  },
});

export type AuthInstance = typeof auth;
