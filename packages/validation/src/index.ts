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

// -----------------------------------------------------------------------------
// Phase 3: Modules M02 & M03 Registry Schemas
// -----------------------------------------------------------------------------

export const institutionProfileSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  legalName: z.string().min(2).max(200).optional(),
  aicteId: z.string().min(3).max(50).optional(),
  address: z.string().max(255).optional(),
  state: z.string().min(2).max(100).optional(),
  district: z.string().min(2).max(100).optional(),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be 6 digits")
    .optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "INACTIVE"]).optional(),
});

export const campusInputSchema = z.object({
  code: z
    .string()
    .min(2, "Campus code must be at least 2 characters")
    .max(50)
    .regex(
      /^[A-Z0-9_-]+$/,
      "Campus code must be uppercase alphanumeric, dashes, or underscores",
    ),
  name: z.string().min(2).max(200),
  address: z.string().max(255).optional(),
  state: z.string().min(2).max(100).optional(),
  district: z.string().min(2).max(100).optional(),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be 6 digits")
    .optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const DEGREE_LEVELS = ["UG", "PG", "DIPLOMA", "POST_DIPLOMA"] as const;

export const programmeInputSchema = z.object({
  canonicalCode: z
    .string()
    .min(2)
    .max(50)
    .regex(
      /^[A-Z0-9_-]+$/,
      "Canonical code must be uppercase alphanumeric, dashes, or underscores",
    ),
  name: z.string().min(2).max(200),
  degreeLevel: z.enum(DEGREE_LEVELS),
  discipline: z.string().min(2).max(100),
  durationYears: z.coerce.number().int().min(1).max(6).default(4),
  status: z.enum(["ACTIVE", "DISCONTINUED"]).default("ACTIVE"),
});

export const programmeAliasInputSchema = z.object({
  programmeId: z.string().uuid(),
  rawTitle: z.string().min(1).max(200),
  normalisedTitle: z.string().min(1).max(200).optional(),
  institutionId: z.string().uuid().optional(),
  confidence: z.number().min(0).max(1).default(1.0),
});

export const approvalOrderInputSchema = z.object({
  institutionId: z.string().uuid(),
  academicYear: z
    .string()
    .regex(
      /^\d{4}-\d{2,4}$/,
      "Academic year must be format YYYY-YY or YYYY-YYYY",
    ),
  orderNumber: z.string().min(3).max(100),
  orderType: z.enum(["EOA", "LOA"]).default("EOA"),
  issueDate: z.coerce.date().default(() => new Date()),
  status: z.enum(["DRAFT", "ACTIVE", "SUPERSEDED"]).default("ACTIVE"),
  supersededById: z.string().uuid().optional(),
});

export const seatEntitlementInputSchema = z
  .object({
    approvalOrderId: z.string().uuid(),
    programmeId: z.string().uuid(),
    campusId: z.string().uuid().optional(),
    sanctionedIntake: z.coerce
      .number()
      .int()
      .min(0, "Sanctioned intake must be non-negative"),
    openSeats: z.coerce.number().int().min(0).default(0),
    scSeats: z.coerce.number().int().min(0).default(0),
    stSeats: z.coerce.number().int().min(0).default(0),
    obcSeats: z.coerce.number().int().min(0).default(0),
    ewsSeats: z.coerce.number().int().min(0).default(0),
    tfwSeats: z.coerce.number().int().min(0).default(0),
    supernumerarySeats: z.coerce.number().int().min(0).default(0),
  })
  .refine(
    (data) => {
      const categorySum =
        data.openSeats +
        data.scSeats +
        data.stSeats +
        data.obcSeats +
        data.ewsSeats;
      return categorySum <= data.sanctionedIntake;
    },
    {
      message:
        "Sum of statutory category seats (Open + SC + ST + OBC + EWS) cannot exceed total sanctioned intake",
      path: ["sanctionedIntake"],
    },
  );

export type InstitutionProfile = z.infer<typeof institutionProfileSchema>;
export type CampusInput = z.infer<typeof campusInputSchema>;
export type ProgrammeInput = z.infer<typeof programmeInputSchema>;
export type ProgrammeAliasInput = z.infer<typeof programmeAliasInputSchema>;
export type ApprovalOrderInput = z.infer<typeof approvalOrderInputSchema>;
export type SeatEntitlementInput = z.infer<typeof seatEntitlementInputSchema>;

// -----------------------------------------------------------------------------
// Authentication & Session Schemas (M01 & J-01)
// -----------------------------------------------------------------------------

export const signInSchema = z.object({
  email: z.string().email("Valid email address is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = z.object({
  email: z.string().email("Valid email address is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
});

export const stepUpSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required for step-up authentication"),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type StepUpInput = z.infer<typeof stepUpSchema>;

// -----------------------------------------------------------------------------
// Policy Engine & Regulatory Policy Registry Schemas (M04 & S-23 / S-40)
// -----------------------------------------------------------------------------

export const policyPackStatusSchema = z.enum([
  "DRAFT",
  "COUNCIL_REVIEW",
  "GAZETTE_NOTIFIED",
  "IN_FORCE",
  "SUPERSEDED",
  "AMENDED",
]);

export const ruleCategorySchema = z.enum([
  "CAPACITY",
  "QUOTA",
  "ELIGIBILITY",
  "TIMELINE",
  "PENAL_ACTION",
]);

export const ruleSeveritySchema = z.enum(["VIOLATION", "WARNING"]);

export const institutionalPenalStatusSchema = z.enum([
  "APPROVED",
  "REDUCED_INTAKE",
  "NO_ADMISSION",
  "WITHDRAWAL_OF_APPROVAL",
  "RESTORATION",
]);

export const createPolicyPackSchema = z.object({
  code: z
    .string()
    .min(3, "Policy pack code must be at least 3 characters")
    .max(100),
  name: z
    .string()
    .min(3, "Policy pack name must be at least 3 characters")
    .max(200),
  academicYear: z
    .string()
    .regex(
      /^\d{4}-\d{2}$/,
      "Academic year must follow YYYY-YY format (e.g. 2026-27)",
    ),
  edition: z.string().default("1.0"),
  stateCode: z.string().length(2).optional().nullable(),
  effectiveFrom: z.string().datetime().optional().nullable(),
  effectiveTo: z.string().datetime().optional().nullable(),
});

export const createPolicyRuleSchema = z.object({
  code: z
    .string()
    .min(3, "Rule code must be at least 3 characters")
    .regex(
      /^[A-Z0-9_]+$/,
      "Rule code must be uppercase alphanumeric with underscores",
    ),
  name: z.string().min(3).max(200),
  category: ruleCategorySchema,
  clauseReference: z.string().min(1, "Clause reference is required"),
  description: z.string().optional().nullable(),
  severity: ruleSeveritySchema.default("VIOLATION"),
  parameters: z.record(z.unknown()).default({}),
});

export const createPolicyFixtureSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().optional().nullable(),
  inputData: z.record(z.unknown()),
  expectedOutput: z.record(z.unknown()),
});

export const activatePolicyPackSchema = z.object({
  gazetteNotificationNumber: z
    .string()
    .min(3, "Gazette notification reference is required"),
  signoffNotes: z.string().max(1000).optional().nullable(),
});

export const replaySimulationSchema = z.object({
  policyPackId: z.string().uuid("Target policyPackId must be a valid UUID"),
  baselinePolicyPackId: z
    .string()
    .uuid("Baseline policyPackId must be a valid UUID")
    .optional(),
  cohort: z.object({
    academicYear: z
      .string()
      .regex(/^\d{4}-\d{2}$/, "Academic year must follow YYYY-YY format"),
    sanctionedIntake: z.number().int().min(0),
    admittedRegularCount: z.number().int().min(0),
    categories: z.object({
      OPEN: z.number().int().min(0),
      SC: z.number().int().min(0),
      ST: z.number().int().min(0),
      OBC: z.number().int().min(0),
    }),
    supernumerary: z.object({
      EWS: z.number().int().min(0).default(0),
      TFW: z.number().int().min(0).default(0),
      lateralEntry: z.number().int().min(0).default(0),
    }),
    institutionalStatus: institutionalPenalStatusSchema.default("APPROVED"),
  }),
});

export type CreatePolicyPackInput = z.infer<typeof createPolicyPackSchema>;
export type CreatePolicyRuleInput = z.infer<typeof createPolicyRuleSchema>;
export type CreatePolicyFixtureInput = z.infer<
  typeof createPolicyFixtureSchema
>;
export type ActivatePolicyPackInput = z.infer<typeof activatePolicyPackSchema>;
export type ReplaySimulationInput = z.infer<typeof replaySimulationSchema>;
