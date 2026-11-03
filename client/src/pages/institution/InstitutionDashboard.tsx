import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UploadCloud,
  FileCheck2,
  AlertTriangle,
  Building2,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { SubmissionsApi, ApiException } from "@/lib/api";
import { SubmissionBatch } from "@aire/api-contracts";
import { useAuth } from "@/context/AuthContext";

// Fallback institution ID for deterministic tests & dev seeding
export const DEMO_INSTITUTION_ID = "6c847216-26de-4d10-9ea8-c5e0edd160f0";

export const InstitutionDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activeInstitution } = useAuth();
  const effectiveInstitutionId = activeInstitution?.id || DEMO_INSTITUTION_ID;
  const institutionName =
    activeInstitution?.name || "Delhi Institute of Technology";
  const institutionCode = activeInstitution?.code || "INST-101";

  const [batches, setBatches] = useState<SubmissionBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await SubmissionsApi.listBatches(effectiveInstitutionId);
      setBatches(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [effectiveInstitutionId]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  // Compute aggregate metrics from real loaded batches
  const totalStudents = batches.reduce((acc, b) => acc + b.totalCount, 0);
  const totalValid = batches.reduce((acc, b) => acc + b.validCount, 0);
  const totalQuarantine = batches.reduce(
    (acc, b) => acc + b.quarantineCount,
    0,
  );

  return (
    <div className="space-y-6">
      {/* 1. Header & Institution Context Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border-default)]">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)] uppercase tracking-wider">
            <Building2 className="h-4 w-4 text-[var(--brand-teal)]" />
            <span>
              Institution Workspace &bull; {institutionName} ({institutionCode})
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            Admission Reporting & Batch Submissions
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Academic Year 2026-27 &bull; Regulatory Freeze Deadline: 15 Nov 2026
            (Active Window)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBatches}
            disabled={loading}
            className="h-9 gap-1.5 min-w-[90px]"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => navigate("/institution/submissions/new")}
            className="h-9 gap-2 shadow-sm min-w-[150px]"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload New Batch</span>
          </Button>
        </div>
      </div>

      {/* 2. Statutory Reporting Freeze Notice */}
      <Alert variant="info">
        <Clock className="h-4 w-4" />
        <AlertTitle className="font-semibold">
          Active Statutory Reporting Period (Journey J-02)
        </AlertTitle>
        <AlertDescription className="text-xs">
          Institution Data Operators may ingest unformatted admission
          spreadsheets, map headers, and remediate quarantined student records.
          All batches must be verified and sealed prior to statutory freeze.
        </AlertDescription>
      </Alert>

      {/* 3. KPI Aggregate Metrics */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] h-[106px] flex flex-col justify-between"
            >
              <div className="h-3.5 w-20 bg-[var(--surface-card-subdued)] rounded" />
              <div className="h-7 w-16 bg-[var(--surface-card-subdued)] rounded" />
              <div className="h-3 w-28 bg-[var(--surface-card-subdued)] rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-[var(--surface-card)] h-[106px] flex flex-col justify-between">
            <div className="text-xs font-medium text-[var(--text-muted)] flex items-center justify-between">
              <span>Total Batches</span>
              <Layers className="h-4 w-4 text-[var(--text-muted)]" />
            </div>
            <div className="text-2xl font-bold font-mono font-tabular text-[var(--text-primary)]">
              {batches.length}
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Submitted in cycle 2026-27
            </p>
          </Card>

          <Card className="p-4 bg-[var(--surface-card)] h-[106px] flex flex-col justify-between">
            <div className="text-xs font-medium text-[var(--text-muted)] flex items-center justify-between">
              <span>Total Admitted</span>
              <FileCheck2 className="h-4 w-4 text-[var(--brand-primary)]" />
            </div>
            <div className="text-2xl font-bold font-mono font-tabular text-[var(--text-primary)]">
              {totalStudents}
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Total candidate records
            </p>
          </Card>

          <Card className="p-4 bg-[var(--surface-card)] border-[var(--state-success-border)] bg-[var(--state-success-bg)]/20 h-[106px] flex flex-col justify-between">
            <div className="text-xs font-medium text-[var(--state-success-text)] flex items-center justify-between">
              <span>Compliant / Staged</span>
              <CheckCircle2 className="h-4 w-4 text-[var(--state-success-icon)]" />
            </div>
            <div className="text-2xl font-bold font-mono font-tabular text-[var(--state-success-text)]">
              {totalValid}
            </div>
            <p className="text-[11px] text-[var(--state-success-text)] opacity-80">
              Passed schema verification
            </p>
          </Card>

          <Card className="p-4 bg-[var(--surface-card)] border-[var(--state-warning-border)] bg-[var(--state-warning-bg)]/30 h-[106px] flex flex-col justify-between">
            <div className="text-xs font-medium text-[var(--state-warning-text)] flex items-center justify-between">
              <span>Quarantined</span>
              <AlertTriangle className="h-4 w-4 text-[var(--state-warning-icon)]" />
            </div>
            <div className="text-2xl font-bold font-mono font-tabular text-[var(--state-warning-text)]">
              {totalQuarantine}
            </div>
            <p className="text-[11px] text-[var(--state-warning-text)] opacity-80">
              Remediation required
            </p>
          </Card>
        </div>
      )}

      {/* 4. Submissions Ledger & Action Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle>Ingested Batches Ledger</CardTitle>
              <CardDescription>
                Admission spreadsheets ingested for this institution. Defective
                rows are isolated in quarantine triage.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2 p-2">
              <div className="h-9 w-full bg-[var(--surface-card-subdued)] rounded animate-pulse" />
              {[1, 2, 3].map((r) => (
                <div
                  key={r}
                  className="h-[36px] w-full bg-[var(--surface-card-subdued)]/60 rounded animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <ErrorState
              title="Failed to Load Submission Batches"
              message={error.message}
              correlationId={error.correlationId}
              onRetry={fetchBatches}
            />
          ) : batches.length === 0 ? (
            <EmptyState
              title="No Admission Batches Ingested"
              description="No admission spreadsheets have been uploaded for academic cycle 2026-27 yet."
              action={
                <Button
                  size="sm"
                  onClick={() => navigate("/institution/submissions/new")}
                >
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload First Batch
                </Button>
              }
            />
          ) : (
            <div className="rounded border border-[var(--border-default)] overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse table-compact font-sans">
                <thead>
                  <tr className="border-b border-[var(--border-default)] bg-[var(--surface-card-subdued)] text-xs font-semibold text-[var(--text-secondary)]">
                    <th className="px-3 py-2 w-[28%]">Batch / Programme</th>
                    <th className="px-3 py-2 w-[10%]">Cycle</th>
                    <th className="px-3 py-2 w-[20%]">File Name</th>
                    <th className="px-3 py-2 w-[8%] text-center">Total</th>
                    <th className="px-3 py-2 w-[8%] text-center">Staged</th>
                    <th className="px-3 py-2 w-[8%] text-center">Quarantine</th>
                    <th className="px-3 py-2 w-[12%]">Status</th>
                    <th className="px-3 py-2 w-[6%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-xs text-[var(--text-primary)]">
                  {batches.map((batch) => {
                    const hasQuarantine = batch.quarantineCount > 0;
                    return (
                      <tr
                        key={batch.id}
                        className="hover:bg-[var(--surface-card-subdued)] transition-colors cursor-pointer h-[36px]"
                        onClick={() =>
                          navigate(`/institution/submissions/${batch.id}`)
                        }
                      >
                        <td className="px-3 py-2 font-medium">
                          <div className="font-semibold text-[var(--text-primary)] truncate max-w-[240px]">
                            {batch.programme}
                          </div>
                          <div className="text-[11px] font-mono text-[var(--text-muted)] truncate max-w-[180px]">
                            ID: {batch.id.slice(0, 8)}...
                          </div>
                        </td>
                        <td className="px-3 py-2 font-mono text-[var(--text-secondary)] font-tabular">
                          {batch.academicYear}
                        </td>
                        <td className="px-3 py-2 text-[var(--text-secondary)] font-mono text-[11px] truncate max-w-[160px]">
                          {batch.fileName}
                        </td>
                        <td className="px-3 py-2 font-mono font-tabular text-center font-medium">
                          {batch.totalCount}
                        </td>
                        <td className="px-3 py-2 font-mono font-tabular text-center text-[var(--state-success-text)] font-semibold">
                          {batch.validCount}
                        </td>
                        <td className="px-3 py-2 font-mono font-tabular text-center">
                          {hasQuarantine ? (
                            <span className="text-[var(--state-warning-text)] font-bold px-1.5 py-0.5 rounded bg-[var(--state-warning-bg)] border border-[var(--state-warning-border)]">
                              {batch.quarantineCount}
                            </span>
                          ) : (
                            <span className="text-[var(--text-muted)]">0</span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <Badge
                            variant={
                              batch.status === "READY_FOR_SIGN_OFF" ||
                              batch.status === "VALIDATED"
                                ? "success"
                                : batch.status === "QUARANTINED"
                                  ? "warning"
                                  : "secondary"
                            }
                            size="sm"
                          >
                            {batch.status === "READY_FOR_SIGN_OFF"
                              ? "Ready for Sign-Off"
                              : batch.status === "QUARANTINED"
                                ? "Quarantine (Action Req)"
                                : batch.status}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Link
                            to={`/institution/submissions/${batch.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center text-xs font-medium text-[var(--brand-primary)] hover:underline"
                          >
                            <span>{hasQuarantine ? "Triage" : "View"}</span>
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
