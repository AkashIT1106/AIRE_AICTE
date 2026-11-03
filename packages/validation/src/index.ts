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

// -----------------------------------------------------------------------------
// Admission & Submission Schemas (J-02 & M06 Data Pipeline)
// -----------------------------------------------------------------------------

export const RESERVATION_CATEGORIES = [
  "GEN",
  "OBC-NCL",
  "SC",
  "ST",
  "EWS",
] as const;

export const QUOTA_CATEGORIES = [
  "General / All India",
  "Home State Quota",
  "Management Quota",
  "Supernumerary",
  "Tuition Fee Waiver",
  "Lateral Entry",
] as const;

export const reservationCategorySchema = z.enum(RESERVATION_CATEGORIES, {
  errorMap: () => ({
    message: "Invalid category. Allowed: GEN, OBC-NCL, SC, ST, EWS",
  }),
});

export const quotaCategorySchema = z.enum(QUOTA_CATEGORIES, {
  errorMap: () => ({
    message:
      "Invalid quota category. Allowed: General / All India, Home State Quota, Management Quota, Supernumerary, Tuition Fee Waiver, Lateral Entry",
  }),
});

export const admissionRecordSchema = z.object({
  studentName: z
    .string()
    .min(2, "Student name must be at least 2 characters")
    .max(120, "Student name cannot exceed 120 characters"),
  rollNumber: z
    .string()
    .min(3, "Roll number or Application ID must be at least 3 characters")
    .max(50, "Roll number cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_\-/]+$/,
      "Roll number must contain only letters, numbers, dashes, underscores, and slashes",
    ),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format"),
  category: reservationCategorySchema,
  quota: quotaCategorySchema,
  apaarId: z
    .string()
    .regex(
      /^(\d{12}|\d{4}-\d{4}-\d{4}|••••-••••-\d{4})?$/,
      "APAAR ID must be 12 digits or formatted 12-digit format",
    )
    .optional(),
});

export const admissionBatchInputSchema = z.object({
  academicYear: z
    .string()
    .regex(
      /^\d{4}-\d{2}$/,
      "Academic year must be format YYYY-YY (e.g. 2026-27)",
    ),
  programme: z.string().min(2, "Programme must be specified"),
  fileName: z.string().min(1, "File name must be specified"),
  records: z
    .array(z.record(z.unknown()))
    .min(1, "Batch must contain at least 1 record"),
});

export const quarantineRemediationSchema = admissionRecordSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for remediation",
  });

export type AdmissionRecord = z.infer<typeof admissionRecordSchema>;
export type AdmissionBatchInput = z.infer<typeof admissionBatchInputSchema>;
export type QuarantineRemediation = z.infer<typeof quarantineRemediationSchema>;
