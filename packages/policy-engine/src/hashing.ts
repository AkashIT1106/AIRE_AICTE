import { createHash } from "node:crypto";

/**
 * Deterministically computes SHA-256 hash of a policy pack and its declarative rules.
 */
export function computePolicyPackContentHash(pack: {
  code: string;
  academicYear: string;
  edition: string;
  stateCode?: string | null;
  rules: Array<{
    code: string;
    category: string;
    clauseReference: string;
    severity?: string;
    parameters: unknown;
  }>;
}): string {
  // Sort rules deterministically by code
  const sortedRules = [...pack.rules].sort((a, b) =>
    a.code.localeCompare(b.code),
  );

  const canonicalPayload = {
    code: pack.code,
    academicYear: pack.academicYear,
    edition: pack.edition,
    stateCode: pack.stateCode ?? null,
    rules: sortedRules.map((r) => ({
      code: r.code,
      category: r.category,
      clauseReference: r.clauseReference,
      severity: r.severity ?? "VIOLATION",
      parameters: r.parameters,
    })),
  };

  const serialized = JSON.stringify(canonicalPayload);
  return createHash("sha256").update(serialized).digest("hex");
}

/**
 * Computes evidence hash for test fixture execution run.
 */
export function computeFixtureEvidenceHash(evidence: {
  policyPackId: string;
  timestamp: string;
  passRatePercentage: number;
  results: Array<{ fixtureId: string; passed: boolean }>;
}): string {
  const serialized = JSON.stringify(evidence);
  return createHash("sha256").update(serialized).digest("hex");
}
