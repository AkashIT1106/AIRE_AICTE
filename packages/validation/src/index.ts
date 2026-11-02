import { z } from "zod";

export const correlationIdSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Correlation ID must contain only alphanumeric characters, underscores, and dashes",
  );

export const uuidSchema = z.string().uuid();

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_PORT: z.coerce.number().int().default(4000),
  DATABASE_URL: z.string().url(),
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().int().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .default("info"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  JWT_SECRET: z
    .string()
    .min(16)
    .default("development_jwt_secret_min_16_chars_default"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(16)
    .default("development_better_auth_secret_min_32_chars_default_test"),
  BETTER_AUTH_URL: z.string().default("http://localhost:4000"),
  APP_DATABASE_URL: z.string().optional(),
});

export type EnvironmentConfig = z.infer<typeof environmentSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
