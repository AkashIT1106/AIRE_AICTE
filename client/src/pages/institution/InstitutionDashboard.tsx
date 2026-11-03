import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UploadCloud,
  FileCheck2,
  AlertTriangle,
  RefreshCw,
  Building2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Clock,
  ShieldCheck,
  Calendar,
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
import { SubmissionsApi, ApiException } from "@/lib/api";
import { SubmissionBatch } from "@aire/api-contracts";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useAuth } from "@/context/AuthContext";

export const InstitutionDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activeInstitution } = useAuth();

  const [batches, setBatches] = useState<SubmissionBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiException | null>(null);

  const institutionId = activeInstitution?.id;

  const fetchBatches = useCallback(async () => {
    if (!institutionId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await SubmissionsApi.listBatches(institutionId);
      setBatches(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [institutionId]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  // Safe fallback if active institution context is not present
  if (!activeInstitution) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8">
        <Alert
          variant="warning"
          role="alert"
          className="border-amber-200 bg-amber-50 text-amber-900"
        >
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="font-semibold text-sm">
            Institutional Context Required
          </AlertTitle>
          <AlertDescription className="text-xs text-amber-800 leading-relaxed mt-1">
            No active institution is associated with your session. Please select
            an authorized institution from the tenant switcher in the header to
            view admission cohorts and reporting.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const institutionName = activeInstitution.name;
  const institutionCode = activeInstitution.code;

  // Compute aggregate metrics from real loaded batches
  const totalStudents = batches.reduce((acc, b) => acc + b.totalCount, 0);
  const totalValid = batches.reduce((acc, b) => acc + b.validCount, 0);
  const totalQuarantine = batches.reduce(
    (acc, b) => acc + b.quarantineCount,
    0,
  );
  const approvedCapacity = 360; // Baseline AICTE approved branch capacity
  const remainingCapacity = Math.max(0, approvedCapacity - totalStudents);
  const compliancePercentage =
    totalStudents > 0 ? Math.round((totalValid / totalStudents) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Official Institutional Masthead & Actions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <Building2 className="h-3.5 w-3.5 text-[#245B75]" />
                <span>
                  Institution Workspace &bull; {institutionName} (
                  {institutionCode})
                </span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                <span>AICTE Approved 2026–27</span>
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Admission Reporting &amp; Batch Submissions
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>
                Academic Year 2026-27 &bull; Regulatory Freeze Deadline: 15 Nov
                2026 (Active Window)
              </span>
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchBatches}
              disabled={loading}
              className="h-9 gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 min-w-[90px]"
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
              className="h-9 gap-2 shadow-xs bg-[#245B75] hover:bg-[#1C4666] text-white min-w-[150px] font-semibold text-xs"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload New Batch</span>
            </Button>
          </div>
        </div>

        {/* Dual-Track Capacity Utilization Gauge */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 mb-2">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <ShieldCheck className="h-4 w-4 text-[#245B75]" />
              <span>Approved Intake Capacity Utilization:</span>
              <span className="font-mono font-bold text-slate-900">
                {totalStudents} / {approvedCapacity} Seats Ingested
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Validated: {totalValid}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Quarantined: {totalQuarantine}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                <span>Available: {remainingCapacity}</span>
              </span>
            </div>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/60">
            <div
              style={{
                width: `${Math.min(100, (totalValid / approvedCapacity) * 100)}%`,
              }}
              className="bg-emerald-500 transition-all duration-300"
              title={`Validated: ${totalValid}`}
            />
            <div
              style={{
                width: `${Math.min(100, (totalQuarantine / approvedCapacity) * 100)}%`,
              }}
              className="bg-amber-500 transition-all duration-300"
              title={`Quarantined: ${totalQuarantine}`}
            />
          </div>
        </div>
      </div>

      {/* 2. Statutory Regulatory Alert */}
      <Alert
        variant="info"
        className="border-sky-200 bg-sky-50/70 text-sky-950 shadow-2xs"
      >
        <Clock className="h-4 w-4 text-sky-700" />
        <AlertTitle className="font-semibold text-xs tracking-tight text-sky-900">
          Active Statutory Reporting Period (Journey J-02)
        </AlertTitle>
        <AlertDescription className="text-xs text-sky-800 leading-relaxed mt-0.5">
          Institution Data Operators may ingest unformatted admission
          spreadsheets, map headers, and remediate quarantined student records.
          All batches must be verified and sealed prior to statutory freeze.
        </AlertDescription>
      </Alert>

      {/* 3. KPI Metrics Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 bg-white h-[106px] flex flex-col justify-between"
            >
              <div className="h-3.5 w-20 bg-slate-100 rounded" />
              <div className="h-7 w-16 bg-slate-100 rounded" />
              <div className="h-3 w-28 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border border-slate-200 shadow-2xs rounded-xl flex flex-col justify-between h-[106px]">
            <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>Total Batches</span>
              <Layers className="h-4 w-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold font-mono font-tabular text-slate-900">
              {batches.length}
            </div>
            <p className="text-[11px] text-slate-400">
              Submitted in cycle 2026-27
            </p>
          </Card>

          <Card className="p-4 bg-white border border-slate-200 shadow-2xs rounded-xl flex flex-col justify-between h-[106px]">
            <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>Total Admitted</span>
              <FileCheck2 className="h-4 w-4 text-[#245B75]" />
            </div>
            <div className="text-2xl font-bold font-mono font-tabular text-slate-900">
              {totalStudents}
            </div>
            <p className="text-[11px] text-slate-400">
              Total candidate records
            </p>
          </Card>

          <Card className="p-4 bg-white border border-emerald-200 shadow-2xs rounded-xl flex flex-col justify-between h-[106px]">
            <div className="text-xs font-semibold text-emerald-800 flex items-center justify-between">
              <span>Compliant / Staged</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-mono font-tabular text-emerald-700">
              {totalValid}
            </div>
            <p className="text-[11px] text-emerald-600">
              Passed schema verification
            </p>
          </Card>

          <Card className="p-4 bg-white border border-amber-200 shadow-2xs rounded-xl flex flex-col justify-between h-[106px]">
            <div className="text-xs font-semibold text-amber-800 flex items-center justify-between">
              <span>Quarantined</span>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono font-tabular text-amber-700">
              {totalQuarantine}
            </div>
            <p className="text-[11px] text-amber-600">Remediation required</p>
          </Card>
        </div>
      )}

      {/* 4. Submissions Ledger & Action Table */}
      <Card className="bg-white border border-slate-200 shadow-xs rounded-xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Ingested Batches Ledger
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Admission spreadsheets ingested for this institution. Defective
                rows are isolated in quarantine triage.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-500">
                Compliance:{" "}
                <strong className="text-slate-900">
                  {compliancePercentage}%
                </strong>
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              <div className="h-9 w-full bg-slate-100 rounded animate-pulse" />
              {[1, 2, 3].map((r) => (
                <div
                  key={r}
                  className="h-[38px] w-full bg-slate-50 rounded animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="p-4">
              <ErrorState
                title="Failed to Load Submission Batches"
                message={error.message}
                correlationId={error.correlationId}
                onRetry={fetchBatches}
              />
            </div>
          ) : batches.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No Admission Batches Ingested"
                description="No admission spreadsheets have been uploaded for academic cycle 2026-27 yet."
                action={
                  <Button
                    size="sm"
                    onClick={() => navigate("/institution/submissions/new")}
                    className="bg-[#245B75] hover:bg-[#1C4666] text-white"
                  >
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload First Batch
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="ux4g-o-x-auto overflow-x-auto">
              <table className="ux4g-table w-full text-left border-collapse table-compact font-sans">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                    <th className="px-4 py-3 w-[28%]">Batch / Programme</th>
                    <th className="px-4 py-3 w-[10%]">Cycle</th>
                    <th className="px-4 py-3 w-[20%]">File Name</th>
                    <th className="px-4 py-3 w-[8%] text-center">Total</th>
                    <th className="px-4 py-3 w-[8%] text-center">Staged</th>
                    <th className="px-4 py-3 w-[8%] text-center">Quarantine</th>
                    <th className="px-4 py-3 w-[12%]">Status</th>
                    <th className="px-4 py-3 w-[6%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                  {batches.map((batch) => {
                    const hasQuarantine = batch.quarantineCount > 0;
                    return (
                      <tr
                        key={batch.id}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer h-[44px]"
                        onClick={() =>
                          navigate(`/institution/submissions/${batch.id}`)
                        }
                      >
                        <td className="px-4 py-2.5 font-medium">
                          <div className="font-semibold text-slate-900 truncate max-w-[240px]">
                            {batch.programme}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 truncate max-w-[180px]">
                            ID: {batch.id.slice(0, 8)}...
                          </div>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-slate-600 font-tabular">
                          {batch.academicYear}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 font-mono text-[11px] truncate max-w-[160px]">
                          {batch.fileName}
                        </td>
                        <td className="px-4 py-2.5 font-mono font-tabular text-center font-medium">
                          {batch.totalCount}
                        </td>
                        <td className="px-4 py-2.5 font-mono font-tabular text-center text-emerald-700 font-semibold">
                          {batch.validCount}
                        </td>
                        <td className="px-4 py-2.5 font-mono font-tabular text-center">
                          {hasQuarantine ? (
                            <span className="text-amber-800 font-bold px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200">
                              {batch.quarantineCount}
                            </span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
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
                        <td className="px-4 py-2.5 text-right">
                          <Link
                            to={`/institution/submissions/${batch.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center text-xs font-semibold text-[#245B75] hover:text-[#1C4666] hover:underline"
                          >
                            <span>{hasQuarantine ? "Triage" : "View"}</span>
                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
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
