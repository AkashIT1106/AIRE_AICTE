/**
 * High-fidelity realistic regulatory dataset for demonstration and fallback
 * when backend database is unseeded or offline.
 */

export interface MockInstitution {
  id: string;
  code: string;
  name: string;
  state: string;
  district: string;
  type: string;
  status: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
  approvedIntake: number;
  reportedAdmissions: number;
  complianceRate: number;
  openExceptions: number;
}

export const MOCK_INSTITUTIONS: MockInstitution[] = [
  {
    id: "inst-001",
    code: "1-10492831",
    name: "Delhi Technological University (DTU)",
    state: "Delhi",
    district: "North West Delhi",
    type: "State University",
    status: "ACTIVE",
    approvedIntake: 2400,
    reportedAdmissions: 2385,
    complianceRate: 99.4,
    openExceptions: 0,
  },
  {
    id: "inst-002",
    code: "1-20849102",
    name: "College of Engineering, Pune (COEP Tech)",
    state: "Maharashtra",
    district: "Pune",
    type: "State Autonomous",
    status: "ACTIVE",
    approvedIntake: 1250,
    reportedAdmissions: 1250,
    complianceRate: 100.0,
    openExceptions: 0,
  },
  {
    id: "inst-003",
    code: "1-30918274",
    name: "National Institute of Technology Karnataka, Surathkal",
    state: "Karnataka",
    district: "Dakshina Kannada",
    type: "National Institute",
    status: "ACTIVE",
    approvedIntake: 1100,
    reportedAdmissions: 1098,
    complianceRate: 99.8,
    openExceptions: 0,
  },
  {
    id: "inst-004",
    code: "1-40291837",
    name: "PSG College of Technology",
    state: "Tamil Nadu",
    district: "Coimbatore",
    type: "Private Aided",
    status: "ACTIVE",
    approvedIntake: 1480,
    reportedAdmissions: 1510,
    complianceRate: 94.2,
    openExceptions: 2,
  },
  {
    id: "inst-005",
    code: "1-50928371",
    name: "Jadavpur University Faculty of Engineering & Tech",
    state: "West Bengal",
    district: "Kolkata",
    type: "State University",
    status: "ACTIVE",
    approvedIntake: 1320,
    reportedAdmissions: 1312,
    complianceRate: 99.4,
    openExceptions: 0,
  },
  {
    id: "inst-006",
    code: "1-60293847",
    name: "Vellore Institute of Technology",
    state: "Tamil Nadu",
    district: "Vellore",
    type: "Deemed University",
    status: "ACTIVE",
    approvedIntake: 4200,
    reportedAdmissions: 4235,
    complianceRate: 91.8,
    openExceptions: 3,
  },
  {
    id: "inst-007",
    code: "1-70192834",
    name: "Malaviya National Institute of Technology Jaipur",
    state: "Rajasthan",
    district: "Jaipur",
    type: "National Institute",
    status: "ACTIVE",
    approvedIntake: 980,
    reportedAdmissions: 976,
    complianceRate: 99.6,
    openExceptions: 0,
  },
];

export interface MockApprovalOrder {
  id: string;
  orderNumber: string;
  institutionName: string;
  institutionCode: string;
  academicYear: string;
  programmeName: string;
  degreeLevel: string;
  approvedIntake: number;
  openQuota: number;
  obcQuota: number;
  scQuota: number;
  stQuota: number;
  ewsQuota: number;
  supernumerary: number;
  issuedDate: string;
  status: "ACTIVE" | "AMENDED" | "SUPERSEDED";
}

export const MOCK_APPROVAL_ORDERS: MockApprovalOrder[] = [
  {
    id: "app-001",
    orderNumber: "AICTE/EOA/2026-27/1-10492831/01",
    institutionName: "Delhi Technological University (DTU)",
    institutionCode: "1-10492831",
    academicYear: "2026-2027",
    programmeName: "Computer Science & Engineering",
    degreeLevel: "Undergraduate (B.Tech)",
    approvedIntake: 360,
    openQuota: 144,
    obcQuota: 97,
    scQuota: 54,
    stQuota: 27,
    ewsQuota: 38,
    supernumerary: 18,
    issuedDate: "2026-04-12",
    status: "ACTIVE",
  },
  {
    id: "app-002",
    orderNumber: "AICTE/EOA/2026-27/1-10492831/02",
    institutionName: "Delhi Technological University (DTU)",
    institutionCode: "1-10492831",
    academicYear: "2026-2027",
    programmeName: "Artificial Intelligence & Data Science",
    degreeLevel: "Undergraduate (B.Tech)",
    approvedIntake: 180,
    openQuota: 72,
    obcQuota: 49,
    scQuota: 27,
    stQuota: 13,
    ewsQuota: 19,
    supernumerary: 9,
    issuedDate: "2026-04-12",
    status: "ACTIVE",
  },
  {
    id: "app-003",
    orderNumber: "AICTE/EOA/2026-27/1-20849102/01",
    institutionName: "College of Engineering, Pune (COEP Tech)",
    institutionCode: "1-20849102",
    academicYear: "2026-2027",
    programmeName: "Electronics & Telecommunication Engineering",
    degreeLevel: "Undergraduate (B.Tech)",
    approvedIntake: 180,
    openQuota: 72,
    obcQuota: 49,
    scQuota: 27,
    stQuota: 13,
    ewsQuota: 19,
    supernumerary: 9,
    issuedDate: "2026-04-15",
    status: "ACTIVE",
  },
  {
    id: "app-004",
    orderNumber: "AICTE/EOA/2026-27/1-40291837/01",
    institutionName: "PSG College of Technology",
    institutionCode: "1-40291837",
    academicYear: "2026-2027",
    programmeName: "Mechanical Engineering",
    degreeLevel: "Undergraduate (B.Tech)",
    approvedIntake: 120,
    openQuota: 48,
    obcQuota: 32,
    scQuota: 18,
    stQuota: 9,
    ewsQuota: 13,
    supernumerary: 6,
    issuedDate: "2026-04-18",
    status: "AMENDED",
  },
  {
    id: "app-005",
    orderNumber: "AICTE/EOA/2026-27/1-30918274/01",
    institutionName: "National Institute of Technology Karnataka",
    institutionCode: "1-30918274",
    academicYear: "2026-2027",
    programmeName: "Electrical & Electronics Engineering",
    degreeLevel: "Undergraduate (B.Tech)",
    approvedIntake: 120,
    openQuota: 48,
    obcQuota: 32,
    scQuota: 18,
    stQuota: 9,
    ewsQuota: 13,
    supernumerary: 6,
    issuedDate: "2026-04-10",
    status: "ACTIVE",
  },
];

export interface MockPolicyPack {
  id: string;
  identifier: string;
  name: string;
  version: string;
  academicYear: string;
  effectiveFrom: string;
  ruleCount: number;
  status: "ACTIVE" | "SUPERSEDED" | "DRAFT";
  digest: string;
}

export const MOCK_POLICY_PACKS: MockPolicyPack[] = [
  {
    id: "pol-001",
    identifier: "APH-2026-27-REV1",
    name: "AICTE Approval Process Handbook Policy 2026-27",
    version: "1.2.0",
    academicYear: "2026-2027",
    effectiveFrom: "2026-04-01",
    ruleCount: 38,
    status: "ACTIVE",
    digest: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  },
  {
    id: "pol-002",
    identifier: "APH-2025-26-FINAL",
    name: "AICTE Approval Process Handbook Policy 2025-26",
    version: "2.1.0",
    academicYear: "2025-2026",
    effectiveFrom: "2025-04-01",
    ruleCount: 36,
    status: "SUPERSEDED",
    digest: "sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
  },
  {
    id: "pol-003",
    identifier: "EWS-SUPERNUMERARY-2026",
    name: "National EWS 10% Supernumerary Allocation Rule Pack",
    version: "1.0.0",
    academicYear: "2026-2027",
    effectiveFrom: "2026-03-15",
    ruleCount: 14,
    status: "ACTIVE",
    digest: "sha256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
  },
];

export interface MockAdmissionRecord {
  id: string;
  studentToken: string;
  maskedName: string;
  institutionCode: string;
  institutionName: string;
  programmeName: string;
  academicYear: string;
  category: "OPEN" | "OBC" | "SC" | "ST" | "EWS" | "TFW";
  quotaAllocated: string;
  admissionDate: string;
  apaarStatus: "VERIFIED" | "MATCH_CONFIRMED" | "NOT_FOUND" | "NAME_MISMATCH" | "PENDING";
  maskedApaarId: string;
  reconciliationStatus: "MATCHED" | "EXCESS" | "MISMATCHED" | "UNVERIFIED";
  aepIssued: boolean;
}

export const MOCK_ADMISSION_RECORDS: MockAdmissionRecord[] = [
  {
    id: "adm-001",
    studentToken: "tok_8f93e21a44",
    maskedName: "A*** K****",
    institutionCode: "1-10492831",
    institutionName: "Delhi Technological University (DTU)",
    programmeName: "Computer Science & Engineering",
    academicYear: "2026-2027",
    category: "OPEN",
    quotaAllocated: "State Merit (Delhi Region)",
    admissionDate: "2026-07-15",
    apaarStatus: "MATCH_CONFIRMED",
    maskedApaarId: "XXXX-XXXX-4819",
    reconciliationStatus: "MATCHED",
    aepIssued: true,
  },
  {
    id: "adm-002",
    studentToken: "tok_3b71c99f12",
    maskedName: "P***** S*****",
    institutionCode: "1-10492831",
    institutionName: "Delhi Technological University (DTU)",
    programmeName: "Computer Science & Engineering",
    academicYear: "2026-2027",
    category: "OBC",
    quotaAllocated: "OBC-NCL Reserved",
    admissionDate: "2026-07-16",
    apaarStatus: "MATCH_CONFIRMED",
    maskedApaarId: "XXXX-XXXX-9124",
    reconciliationStatus: "MATCHED",
    aepIssued: true,
  },
  {
    id: "adm-003",
    studentToken: "tok_6a12df8821",
    maskedName: "R**** V****",
    institutionCode: "1-40291837",
    institutionName: "PSG College of Technology",
    programmeName: "Mechanical Engineering",
    academicYear: "2026-2027",
    category: "OPEN",
    quotaAllocated: "Management Quota",
    admissionDate: "2026-08-02",
    apaarStatus: "NAME_MISMATCH",
    maskedApaarId: "XXXX-XXXX-6102",
    reconciliationStatus: "MISMATCHED",
    aepIssued: false,
  },
  {
    id: "adm-004",
    studentToken: "tok_99c3fa0184",
    maskedName: "S***** N******",
    institutionCode: "1-40291837",
    institutionName: "PSG College of Technology",
    programmeName: "Mechanical Engineering",
    academicYear: "2026-2027",
    category: "OPEN",
    quotaAllocated: "Unapproved Lateral Excess",
    admissionDate: "2026-08-05",
    apaarStatus: "MATCH_CONFIRMED",
    maskedApaarId: "XXXX-XXXX-8422",
    reconciliationStatus: "EXCESS",
    aepIssued: false,
  },
  {
    id: "adm-005",
    studentToken: "tok_12e45da799",
    maskedName: "M*** P****",
    institutionCode: "1-20849102",
    institutionName: "College of Engineering, Pune (COEP Tech)",
    programmeName: "Electronics & Telecommunication",
    academicYear: "2026-2027",
    category: "EWS",
    quotaAllocated: "EWS Supernumerary",
    admissionDate: "2026-07-20",
    apaarStatus: "MATCH_CONFIRMED",
    maskedApaarId: "XXXX-XXXX-3391",
    reconciliationStatus: "MATCHED",
    aepIssued: true,
  },
  {
    id: "adm-006",
    studentToken: "tok_77a98bc110",
    maskedName: "K***** D***",
    institutionCode: "1-60293847",
    institutionName: "Vellore Institute of Technology",
    programmeName: "Computer Science & Engineering",
    academicYear: "2026-2027",
    category: "OPEN",
    quotaAllocated: "Direct Allotment",
    admissionDate: "2026-07-28",
    apaarStatus: "PENDING",
    maskedApaarId: "XXXX-XXXX-1928",
    reconciliationStatus: "UNVERIFIED",
    aepIssued: false,
  },
];

export interface MockException {
  id: string;
  exceptionNumber: string;
  institutionCode: string;
  institutionName: string;
  programmeName: string;
  violationCategory: "EXCESS_INTAKE" | "QUOTA_BREACH" | "UNVERIFIED_APAAR" | "DUPLICATE_ENROLLMENT";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  detectedDate: string;
  status: "DETECTION" | "SHOW_CAUSE_ISSUED" | "RESPONSE_RECEIVED" | "UNDER_EXAMINATION" | "DUAL_AUTHORIZATION" | "RESOLVED";
  assignedOfficer: string;
  ruleReference: string;
  description: string;
  affectedCount: number;
}

export const MOCK_EXCEPTIONS: MockException[] = [
  {
    id: "exc-001",
    exceptionNumber: "EXC-2026-TN-042",
    institutionCode: "1-40291837",
    institutionName: "PSG College of Technology",
    programmeName: "Mechanical Engineering",
    violationCategory: "EXCESS_INTAKE",
    severity: "CRITICAL",
    detectedDate: "2026-08-08",
    status: "SHOW_CAUSE_ISSUED",
    assignedOfficer: "Dr. S. K. Sharma (Regional Officer, Southern)",
    ruleReference: "APH-2026-27 Rule 4.3.1 (Intake Cap Arithmetic)",
    description: "Reported admissions (126) exceed sanctioned AICTE ceiling (120) by 6 seats.",
    affectedCount: 6,
  },
  {
    id: "exc-002",
    exceptionNumber: "EXC-2026-TN-043",
    institutionCode: "1-60293847",
    institutionName: "Vellore Institute of Technology",
    programmeName: "Computer Science & Engineering",
    violationCategory: "QUOTA_BREACH",
    severity: "HIGH",
    detectedDate: "2026-08-11",
    status: "RESPONSE_RECEIVED",
    assignedOfficer: "Dr. R. Venkataraman (Assistant Director)",
    ruleReference: "Central Educational Institutions Act 2006 (OBC 27% Quota Allocation)",
    description: "OBC reservation quota underfilled while General category exceeded ceiling by 18 candidates.",
    affectedCount: 18,
  },
  {
    id: "exc-003",
    exceptionNumber: "EXC-2026-DL-009",
    institutionCode: "1-10492831",
    institutionName: "Delhi Technological University (DTU)",
    programmeName: "Information Technology",
    violationCategory: "UNVERIFIED_APAAR",
    severity: "MEDIUM",
    detectedDate: "2026-08-14",
    status: "UNDER_EXAMINATION",
    assignedOfficer: "Shri A. K. Verma (Director, Approvals)",
    ruleReference: "DPDP Act 2023 & MoE APAAR Verification Mandate",
    description: "Identity discrepancy: Student name on admission certificate differs from APAAR cryptographic response token.",
    affectedCount: 1,
  },
];

export interface MockAuditEvent {
  id: string;
  eventType: string;
  actor: string;
  actorRole: string;
  tenantCode: string;
  timestamp: string;
  correlationId: string;
  tamperProofHash: string;
  summary: string;
}

export const MOCK_AUDIT_EVENTS: MockAuditEvent[] = [
  {
    id: "aud-001",
    eventType: "SUBMISSION_SEALED",
    actor: "registrar@dtu.ac.in",
    actorRole: "INSTITUTION_ADMIN",
    tenantCode: "1-10492831",
    timestamp: "2026-08-15 14:22:19 IST",
    correlationId: "corr_9a8f21bc901e",
    tamperProofHash: "sha256:d41d8cd98f00b204e9800998ecf8427e",
    summary: "Sealed Batch B-2026-DTU-01 containing 2,385 candidate admission records",
  },
  {
    id: "aud-002",
    eventType: "POLICY_ACTIVATED",
    actor: "policy.director@aicte-india.org",
    actorRole: "AICTE_ADMIN",
    tenantCode: "AICTE-CENTRAL",
    timestamp: "2026-08-15 11:05:42 IST",
    correlationId: "corr_33b811ef29ab",
    tamperProofHash: "sha256:9e107d9d372bb6826bd81d3542a419d6",
    summary: "Activated policy APH-2026-27-REV1 version 1.2.0 across all regions",
  },
  {
    id: "aud-003",
    eventType: "EXCEPTION_NOTICED",
    actor: "system.reconciliation@aire.internal",
    actorRole: "SYSTEM_ENGINE",
    tenantCode: "1-40291837",
    timestamp: "2026-08-15 09:12:05 IST",
    correlationId: "corr_f88e100293da",
    tamperProofHash: "sha256:e4d909c290d0fb1ca068ffaddf22cbd0",
    summary: "Deterministic engine detected 6 excess admissions in Mechanical Engineering",
  },
  {
    id: "aud-004",
    eventType: "SHOW_CAUSE_ISSUED",
    actor: "officer.southern@aicte-india.org",
    actorRole: "AICTE_REVIEWER",
    tenantCode: "1-40291837",
    timestamp: "2026-08-15 09:45:30 IST",
    correlationId: "corr_77c229ba0012",
    tamperProofHash: "sha256:c20ad4d76fe97759aa27a0c99bff6710",
    summary: "Issued formal statutory Show-Cause Notice EXC-2026-TN-042 with 15-day evidence window",
  },
  {
    id: "aud-005",
    eventType: "AEP_CREDENTIAL_ISSUED",
    actor: "engine.aep@aire.internal",
    actorRole: "SYSTEM_ENGINE",
    tenantCode: "1-10492831",
    timestamp: "2026-08-15 08:30:11 IST",
    correlationId: "corr_12a3998bce77",
    tamperProofHash: "sha256:6512bd43d9caa6e02c990b0a82652dca",
    summary: "Issued Admission Entitlement Proof AEP-2026-00819 to student token tok_8f93e21a44",
  },
];
