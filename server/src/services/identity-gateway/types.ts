export type AdapterMode = "LIVE" | "SANDBOX" | "MOCK";

export type ApaarVerificationStatus =
  "VERIFIED" | "UNVERIFIED" | "FAILED" | "TIMEOUT";

export interface ApaarVerificationRequest {
  apaarId: string;
  studentName?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  gender?: string;
  correlationId: string;
}

export interface ApaarVerificationResult {
  status: ApaarVerificationStatus;
  verifiedAt?: string;
  referenceNumber?: string;
  matchConfidence?: number;
  message?: string;
  demographicMismatchFlags?: string[];
  executionMode: AdapterMode;
  latencyMs: number;
}

export interface ApaarAdapter {
  getMode(): AdapterMode;
  verify(request: ApaarVerificationRequest): Promise<ApaarVerificationResult>;
}
