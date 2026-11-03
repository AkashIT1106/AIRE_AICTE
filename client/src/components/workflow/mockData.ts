import { QuarantineRecord, SubmissionBatchStatus } from "@aire/api-contracts";
import { AdmissionRecord, AdmissionBatchInput } from "@aire/validation";

/**
 * AIRE Layer C Workflow Mock Data Fixtures
 * Statutory test fixtures for admission batch processing, quarantine triage,
 * quota compliance, duplicate resolution, audit explorer, and entitlement verification.
 */

// 1. Sample Candidate Records (CSV Template & Sample Ingestion)
export const DEMO_SAMPLE_RECORDS: AdmissionRecord[] = [
  {
    studentName: "Aarav Sharma",
    rollNumber: "2026-CSE-101",
    dateOfBirth: "2005-04-12",
    category: "GEN",
    quota: "General / All India",
    apaarId: "9821-4412-1042",
  },
  {
    studentName: "Priya Patel",
    rollNumber: "2026-CSE-102",
    dateOfBirth: "2005-08-25",
    category: "OBC-NCL",
    quota: "Home State Quota",
    apaarId: "4102-8874-9821",
  },
  {
    studentName: "Rohan Verma",
    rollNumber: "2026-CSE-103",
    dateOfBirth: "2005-01-30",
    category: "SC",
    quota: "Home State Quota",
    apaarId: "3310-9921-4109",
  },
  {
    studentName: "Ananya Iyer",
    rollNumber: "2026-CSE-104",
    dateOfBirth: "2005-11-14",
    category: "GEN",
    quota: "General / All India",
    apaarId: "5512-8841-3390",
  },
  {
    studentName: "Kabir Khan",
    rollNumber: "2026-CSE-105",
    dateOfBirth: "2004-12-05",
    category: "EWS",
    quota: "General / All India",
    apaarId: "7741-2290-8834",
  },
];

export const SAMPLE_CSV_TEMPLATE = `studentName,rollNumber,dateOfBirth,category,quota,apaarId
Aarav Sharma,2026-CSE-101,2005-04-12,GEN,General / All India,9821-4412-1042
Priya Patel,2026-CSE-102,2005-08-25,OBC-NCL,Home State Quota,4102-8874-9821
Rohan Verma,2026-CSE-103,2005-01-30,SC,Home State Quota,3310-9921-4109
`;

export const MOCK_ADMISSION_BATCH_INPUT: AdmissionBatchInput = {
  academicYear: "2026-27",
  programme: "B.Tech Computer Science and Engineering",
  fileName: "btech_cse_admissions_round2.csv",
  records: DEMO_SAMPLE_RECORDS as unknown as Record<string, unknown>[],
};

// 2. Multi-stage Ingestion Pipeline Progress
export interface ProcessingStageItem {
  id: string;
  label: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  progress?: number;
}

export const MOCK_PROCESSING_STAGES: ProcessingStageItem[] = [
  {
    id: "stage-1",
    label: "File Parsing & Header Check",
    description: "Validating CSV structure and required schema columns",
    status: "completed",
    progress: 100,
  },
  {
    id: "stage-2",
    label: "Schema & Rule Validation",
    description: "Evaluating category codes, DOB formats, and APAAR IDs",
    status: "completed",
    progress: 100,
  },
  {
    id: "stage-3",
    label: "Quarantine Sorting",
    description: "Isolating 5 defective rows for remediation triage",
    status: "running",
    progress: 65,
  },
  {
    id: "stage-4",
    label: "Regulatory Staging",
    description: "Locking verified records into institutional ledger",
    status: "pending",
    progress: 0,
  },
];

// 3. Upload Validation Summary
export interface ValidationSummaryData {
  totalCount: number;
  validCount: number;
  quarantineCount: number;
  rejectedCount: number;
  complianceRate: number;
  validatedAt: string;
  batchId?: string;
}

export const MOCK_VALIDATION_SUMMARY: ValidationSummaryData = {
  totalCount: 60,
  validCount: 55,
  quarantineCount: 5,
  rejectedCount: 0,
  complianceRate: 91.67,
  validatedAt: "2026-11-03T11:15:22 IST",
  batchId: "BATCH-2026-CSE-001",
};

// 4. Grouped Validation Issues
export interface ValidationIssueGroup {
  id: string;
  field: string;
  issueType: string;
  ruleClause: string;
  count: number;
  severity: "error" | "warning";
  sampleMessage: string;
}

export const MOCK_VALIDATION_ISSUES: ValidationIssueGroup[] = [
  {
    id: "iss-1",
    field: "dateOfBirth",
    issueType: "INVALID_DATE_FORMAT",
    ruleClause: "APH 2026-27 Section 4.2 (ISO-8601 YYYY-MM-DD format required)",
    count: 3,
    severity: "error",
    sampleMessage:
      "Date '22/07/2005' does not match required YYYY-MM-DD pattern",
  },
  {
    id: "iss-2",
    field: "category",
    issueType: "UNRECOGNIZED_RESERVATION_CATEGORY",
    ruleClause:
      "AICTE Act 1987 Clause 10 (Standard Central/State Reservation Codes)",
    count: 2,
    severity: "error",
    sampleMessage: "Code 'OBC-NCL-TYPO' is not a recognized statutory category",
  },
  {
    id: "iss-3",
    field: "apaarId",
    issueType: "UNVERIFIED_IDENTIFIER",
    ruleClause: "MoE One Nation One Student ID Guideline (Optional Advisory)",
    count: 4,
    severity: "warning",
    sampleMessage: "APAAR identifier pending DigiLocker registry lookup",
  },
];

// 5. Quarantine Records for Triage
export const MOCK_QUARANTINE_RECORDS: QuarantineRecord[] = [
  {
    rowId: "qr-001",
    rowNumber: 14,
    rawData: {
      studentName: "Divya Balasubramanian",
      rollNumber: "2026-CSE-204",
      dateOfBirth: "2005-12-05",
      category: "OBC-NCL-TYPO",
      quota: "Home State Quota",
      apaarId: "7741-2290-8834",
    },
    errors: [
      {
        field: "category",
        message:
          "Invalid category 'OBC-NCL-TYPO'. Allowed: GEN, OBC-NCL, SC, ST, EWS",
        received: "OBC-NCL-TYPO",
      },
    ],
    status: "QUARANTINED",
  },
  {
    rowId: "qr-002",
    rowNumber: 22,
    rawData: {
      studentName: "Vikram Malhotra",
      rollNumber: "2026-CSE-205",
      dateOfBirth: "22/07/2005",
      category: "EWS",
      quota: "General / All India",
      apaarId: "5512-8841-3390",
    },
    errors: [
      {
        field: "dateOfBirth",
        message: "Date of birth '22/07/2005' must be in YYYY-MM-DD format",
        received: "22/07/2005",
      },
    ],
    status: "QUARANTINED",
  },
  {
    rowId: "qr-003",
    rowNumber: 31,
    rawData: {
      studentName: "Sneha Mukherjee",
      rollNumber: "2026-CSE-206",
      dateOfBirth: "15/09/2004",
      category: "GEN",
      quota: "General / All India",
      apaarId: "9912-3341-1102",
    },
    errors: [
      {
        field: "dateOfBirth",
        message: "Date of birth '15/09/2004' must be in YYYY-MM-DD format",
        received: "15/09/2004",
      },
    ],
    status: "QUARANTINED",
  },
  {
    rowId: "qr-004",
    rowNumber: 45,
    rawData: {
      studentName: "Arjun Nair",
      rollNumber: "2026-CSE-207",
      dateOfBirth: "2005-06-18",
      category: "OBC-OTHER",
      quota: "Home State Quota",
      apaarId: "6621-8841-9903",
    },
    errors: [
      {
        field: "category",
        message:
          "Invalid reservation category 'OBC-OTHER'. Must be OBC-NCL or GEN",
        received: "OBC-OTHER",
      },
    ],
    status: "QUARANTINED",
  },
  {
    rowId: "qr-005",
    rowNumber: 58,
    rawData: {
      studentName: "Kavita Rao",
      rollNumber: "2026-CSE-208",
      dateOfBirth: "01-02-2005",
      category: "SC",
      quota: "Home State Quota",
      apaarId: "3312-7711-4402",
    },
    errors: [
      {
        field: "dateOfBirth",
        message: "Date of birth '01-02-2005' must be in YYYY-MM-DD format",
        received: "01-02-2005",
      },
    ],
    status: "QUARANTINED",
  },
];

// 6. Student Credential Record Summary
export interface StudentRecordDetails {
  studentName: string;
  rollNumber: string;
  apaarIdMasked: string;
  apaarIdRaw?: string;
  dateOfBirth: string;
  category: string;
  quota: string;
  programme: string;
  institutionName: string;
  institutionCode: string;
  status: "VERIFIED" | "PENDING" | "QUARANTINED" | "REJECTED";
  concordanceStatus: "CONCORDED" | "DISCORDANT" | "PROVISIONAL";
  verifiedAt: string;
}

export const MOCK_STUDENT_RECORD: StudentRecordDetails = {
  studentName: "Aarav Sharma",
  rollNumber: "2026-CSE-101",
  apaarIdMasked: "••••-••••-1042",
  apaarIdRaw: "9821-4412-1042",
  dateOfBirth: "2005-04-12",
  category: "GEN",
  quota: "General / All India",
  programme: "B.Tech Computer Science and Engineering",
  institutionName: "Delhi Institute of Technology",
  institutionCode: "INST-101",
  status: "VERIFIED",
  concordanceStatus: "CONCORDED",
  verifiedAt: "2026-11-01T10:30:00 IST",
};

// 7. Intake Capacity & Quota Category Allocations
export interface QuotaAllocationItem {
  quota: string;
  allocated: number;
  sanctionedCapacity: number;
  isSupernumerary?: boolean;
  status?: "compliant" | "warning" | "breach";
}

export interface QuotaCapacityOverview {
  approvedIntake: number;
  admittedCount: number;
  status: "compliant" | "warning" | "breach";
  allocations: QuotaAllocationItem[];
}

export const MOCK_QUOTA_ALLOCATIONS: QuotaCapacityOverview = {
  approvedIntake: 360,
  admittedCount: 348,
  status: "compliant",
  allocations: [
    {
      quota: "Open General (AI)",
      allocated: 172,
      sanctionedCapacity: 180,
      status: "compliant",
    },
    {
      quota: "OBC-NCL Quota",
      allocated: 96,
      sanctionedCapacity: 97,
      status: "compliant",
    },
    {
      quota: "Scheduled Caste (SC)",
      allocated: 54,
      sanctionedCapacity: 54,
      status: "compliant",
    },
    {
      quota: "Scheduled Tribe (ST)",
      allocated: 26,
      sanctionedCapacity: 27,
      status: "compliant",
    },
    {
      quota: "Economically Weaker Section (EWS)",
      allocated: 36,
      sanctionedCapacity: 36,
      status: "compliant",
    },
    {
      quota: "Tuition Fee Waiver (TFW)",
      allocated: 18,
      sanctionedCapacity: 18,
      isSupernumerary: true,
      status: "compliant",
    },
    {
      quota: "Management Quota",
      allocated: 0,
      sanctionedCapacity: 0,
      status: "compliant",
    },
  ],
};

// 8. Duplicate Record Comparison
export interface DuplicateConflictData {
  conflictType: "DUPLICATE_APAAR" | "DUPLICATE_ROLL" | "DUAL_ENROLLMENT";
  description: string;
  recordA: {
    label: string;
    studentName: string;
    rollNumber: string;
    apaarId: string;
    institutionName: string;
    institutionCode: string;
    programme: string;
    quota: string;
    category: string;
    dateOfAdmission: string;
  };
  recordB: {
    label: string;
    studentName: string;
    rollNumber: string;
    apaarId: string;
    institutionName: string;
    institutionCode: string;
    programme: string;
    quota: string;
    category: string;
    dateOfAdmission: string;
  };
  conflictingFields: string[];
}

export const MOCK_DUPLICATE_COMPARISON: DuplicateConflictData = {
  conflictType: "DUAL_ENROLLMENT",
  description:
    "Candidate APAAR 9821-4412-1042 has active admission claims in two competing AICTE institutions for Academic Year 2026-27.",
  recordA: {
    label: "Claim 1 (Existing Validated Record)",
    studentName: "Aarav Sharma",
    rollNumber: "2026-CSE-101",
    apaarId: "••••-••••-1042",
    institutionName: "Delhi Institute of Technology",
    institutionCode: "INST-101",
    programme: "B.Tech Computer Science and Engineering",
    quota: "General / All India",
    category: "GEN",
    dateOfAdmission: "2026-08-14",
  },
  recordB: {
    label: "Claim 2 (Incoming Batch Ingestion)",
    studentName: "Aarav K. Sharma",
    rollNumber: "BTECH/2026/042",
    apaarId: "••••-••••-1042",
    institutionName: "NCR Institute of Engineering & Technology",
    institutionCode: "INST-204",
    programme: "B.Tech Information Technology",
    quota: "Home State Quota",
    category: "GEN",
    dateOfAdmission: "2026-08-20",
  },
  conflictingFields: [
    "institutionName",
    "institutionCode",
    "programme",
    "rollNumber",
    "quota",
  ],
};

// 9. Submission Status Timeline
export interface SubmissionTimelineMilestone {
  status: SubmissionBatchStatus;
  title: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  note: string;
  digest?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export const MOCK_SUBMISSION_TIMELINE: {
  currentStatus: SubmissionBatchStatus;
  milestones: SubmissionTimelineMilestone[];
} = {
  currentStatus: "QUARANTINED",
  milestones: [
    {
      status: "UPLOADED",
      title: "Batch Spreadsheet Uploaded",
      timestamp: "2026-11-01 10:14 IST",
      actorName: "Dr. K. S. Sharma",
      actorRole: "Institution Registrar",
      note: "File 'admissions_round2.csv' (60 candidate rows) received.",
      digest: "e3b0c44298fc1c149afbf4c8996fb924",
      isCompleted: true,
      isCurrent: false,
    },
    {
      status: "VALIDATING",
      title: "Automated Schema & Rule Engine",
      timestamp: "2026-11-01 10:15 IST",
      actorName: "AIRE Deterministic Evaluator",
      actorRole: "Automated Pipeline",
      note: "55 records concorded. 5 rows quarantined with validation violations.",
      digest: "8f434346648f6b96df89dda901c5176b",
      isCompleted: true,
      isCurrent: false,
    },
    {
      status: "QUARANTINED",
      title: "Quarantine Triage Required",
      timestamp: "2026-11-01 10:15 IST",
      actorName: "AIRE Validation Service",
      actorRole: "Automated Pipeline",
      note: "5 rows isolated awaiting registrar remediation.",
      isCompleted: false,
      isCurrent: true,
    },
    {
      status: "VALIDATED",
      title: "All Records Remediated & Validated",
      timestamp: "Pending",
      actorName: "Institution Admin",
      actorRole: "Institution Role",
      note: "Awaiting remediation completion of remaining defective rows.",
      isCompleted: false,
      isCurrent: false,
    },
    {
      status: "READY_FOR_SIGN_OFF",
      title: "Statutory Attestation & Review",
      timestamp: "Pending",
      actorName: "Authorized Signatory",
      actorRole: "Head of Institution",
      note: "Formal institutional attestation under Section 10(1) AICTE Act.",
      isCompleted: false,
      isCurrent: false,
    },
    {
      status: "SEALED",
      title: "Cohort Cryptographically Sealed",
      timestamp: "Pending",
      actorName: "AICTE Regulatory Directorate",
      actorRole: "AICTE Officer",
      note: "Permanent ledger lock with Merkle root publication.",
      isCompleted: false,
      isCurrent: false,
    },
  ],
};

// 10. Institution Status Panel
export interface InstitutionStatusData {
  code: string;
  name: string;
  aisheCode: string;
  status: "ACTIVE" | "PROVISIONAL" | "SHOW_CAUSE";
  eoaOrderNumber: string;
  approvedIntake: number;
  enrolled: number;
  quarantined: number;
  complianceRate: number;
  regulatoryDeadline: string;
  activeNotices: Array<{
    id: string;
    title: string;
    severity: "warning" | "danger" | "info";
    issuedDate: string;
  }>;
}

export const MOCK_INSTITUTION_STATUS: InstitutionStatusData = {
  code: "INST-101",
  name: "Delhi Institute of Technology",
  aisheCode: "U-0123",
  status: "ACTIVE",
  eoaOrderNumber: "AICTE/EOA/2026-27/NW-1092819",
  approvedIntake: 360,
  enrolled: 348,
  quarantined: 5,
  complianceRate: 96.67,
  regulatoryDeadline: "2026-11-30 23:59 IST",
  activeNotices: [
    {
      id: "NOT-2026-01",
      title: "Mandatory APAAR Seed Rate Review (Target: 95%)",
      severity: "info",
      issuedDate: "2026-10-25",
    },
    {
      id: "NOT-2026-02",
      title: "Resolve 5 Quarantined Records before Final Intake Freeze",
      severity: "warning",
      issuedDate: "2026-11-01",
    },
  ],
};

// 11. Immutable Audit Events
export interface AuditLogItem {
  id: string;
  correlationId: string;
  timestamp: string;
  action:
    | "INGEST_BATCH"
    | "REMEDIATE_RECORD"
    | "AUTH_LOGIN"
    | "SEAL_COHORT"
    | "ACCESS_DENIED";
  actionLabel: string;
  actorEmail: string;
  actorRole:
    "INSTITUTION_ADMIN" | "AICTE_VERIFIER" | "AUDITOR" | "UNAUTHENTICATED";
  tenantCode: string;
  tenantName: string;
  ipAddress: string;
  status: "SUCCESS" | "WARNING" | "DENIED";
  sha256Digest: string;
  details: {
    resource: string;
    payloadSummary: string;
    merkleProof?: string;
    diff?: {
      before?: Record<string, unknown>;
      after?: Record<string, unknown>;
    };
  };
}

export const MOCK_AUDIT_EVENTS: AuditLogItem[] = [
  {
    id: "LOG-98214",
    correlationId: "corr_01HNY4P78A89BC1",
    timestamp: "2026-11-03 11:15:22 IST",
    action: "INGEST_BATCH",
    actionLabel: "Ingest Admission Batch",
    actorEmail: "admin@dit.ac.in",
    actorRole: "INSTITUTION_ADMIN",
    tenantCode: "INST-101",
    tenantName: "Delhi Institute of Technology",
    ipAddress: "14.139.45.12",
    status: "SUCCESS",
    sha256Digest:
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    details: {
      resource: "/api/v1/admissions/upload",
      payloadSummary:
        "Batch BATCH-2026-CSE-001 (60 records) uploaded with schema validation pass.",
      merkleProof:
        "0x4a7d65b2f8a910e14c3298a0d71ef4bc9c2e11894d01b87a24c5e391b072fa61",
      diff: {
        before: { totalBatches: 0, totalEnrolled: 0 },
        after: { totalBatches: 1, totalEnrolled: 60, status: "QUARANTINED" },
      },
    },
  },
  {
    id: "LOG-98213",
    correlationId: "corr_01HNY3E12D45EF2",
    timestamp: "2026-11-03 11:08:44 IST",
    action: "REMEDIATE_RECORD",
    actionLabel: "Remediate Quarantined Record",
    actorEmail: "admin@dit.ac.in",
    actorRole: "INSTITUTION_ADMIN",
    tenantCode: "INST-101",
    tenantName: "Delhi Institute of Technology",
    ipAddress: "14.139.45.12",
    status: "SUCCESS",
    sha256Digest:
      "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    details: {
      resource: "/api/v1/quarantine/remediate",
      payloadSummary:
        "Student Ananya Iyer (JEE: 260100452) category normalized from typo 'OBC-NCL-TYPO' to 'OBC-NCL'.",
      merkleProof:
        "0x1b8fe71c4a03982da9b736e4f1a280c79d3a5160eb8f4201ac6471908be14d02",
      diff: {
        before: { category: "OBC-NCL-TYPO", status: "QUARANTINED" },
        after: { category: "OBC-NCL", status: "STAGED_ACCEPTED" },
      },
    },
  },
  {
    id: "LOG-98212",
    correlationId: "corr_01HNY2K90F67GH3",
    timestamp: "2026-11-03 10:45:10 IST",
    action: "AUTH_LOGIN",
    actionLabel: "MFA Authentication & Session Issue",
    actorEmail: "scrutiny@aicte.gov.in",
    actorRole: "AICTE_VERIFIER",
    tenantCode: "AICTE-HQ",
    tenantName: "AICTE Regulatory Directorate",
    ipAddress: "164.100.24.60",
    status: "SUCCESS",
    sha256Digest:
      "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
    details: {
      resource: "/api/v1/auth/login",
      payloadSummary:
        "Issued scoped JWT session (claims: verified regulatory officer, mandate: Section 10.1 oversight).",
    },
  },
  {
    id: "LOG-98211",
    correlationId: "corr_01HNY1X88J12KL4",
    timestamp: "2026-11-03 10:12:05 IST",
    action: "ACCESS_DENIED",
    actionLabel: "Unauthorized Cross-Tenant Attempt",
    actorEmail: "external@outsider.org",
    actorRole: "UNAUTHENTICATED",
    tenantCode: "UNKNOWN",
    tenantName: "Unauthenticated Client",
    ipAddress: "185.220.101.5",
    status: "DENIED",
    sha256Digest:
      "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    details: {
      resource: "/api/v1/institutions/INST-101/admissions",
      payloadSummary:
        "Blocked request missing cryptographic tenant token signature.",
    },
  },
];

// 12. Verifiable Admission Entitlement Proof (AEP)
export interface RecordVerificationData {
  studentName: string;
  rollNumber: string;
  apaarIdMasked: string;
  institutionName: string;
  institutionCode: string;
  programme: string;
  quotaCategory: string;
  orderNumber: string;
  verifiedAt: string;
  digitalSignatureDigest: string;
  merkleRootHash: string;
  status: "AUTHENTICATED" | "PENDING" | "INVALID";
  qrCodeUrl?: string;
}

export const MOCK_RECORD_VERIFICATION: RecordVerificationData = {
  studentName: "Aarav Sharma",
  rollNumber: "2026-CSE-101",
  apaarIdMasked: "••••-••••-1042",
  institutionName: "Delhi Institute of Technology",
  institutionCode: "INST-101",
  programme: "B.Tech Computer Science and Engineering",
  quotaCategory: "General / All India Quota • GEN",
  orderNumber: "AICTE/AEP/2026/DL-109281",
  verifiedAt: "2026-11-03 11:20:00 IST",
  digitalSignatureDigest: "0x98f24a10cbe782168ea4017290bcda114e9f71c",
  merkleRootHash:
    "0x4a7d65b2f8a910e14c3298a0d71ef4bc9c2e11894d01b87a24c5e391b072fa61",
  status: "AUTHENTICATED",
  qrCodeUrl: "https://aire.aicte.gov.in/verify/aep/AICTE-AEP-2026-DL-109281",
};
