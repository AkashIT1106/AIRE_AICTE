import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UploadCloud,
  AlertTriangle,
  RefreshCw,
  Search,
  ArrowRight,
  Calendar,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { LoadingState } from "@/components/feedback/LoadingState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useAuth } from "@/context/AuthContext";

export const SubmissionsHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeInstitution } = useAuth();
  const institutionId = activeInstitution?.id || "";

  const [batches, setBatches] = useState<SubmissionBatch[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchBatches = async () => {
    if (!institutionId) return;
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
  };

  useEffect(() => {
    fetchBatches();
  }, [institutionId]);

  const filteredBatches = batches.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      b.programme.toLowerCase().includes(q) ||
      b.fileName.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.status.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (statusFilter === "ALL") return true;
    if (statusFilter === "QUARANTINED") return b.quarantineCount > 0;
    if (statusFilter === "VALIDATED") return b.quarantineCount === 0;
    return b.status === statusFilter;
  });

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
            view historical submissions.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold mb-1.5">
            <Building2 className="h-3.5 w-3.5 text-[#245B75]" />
            <span>
              {activeInstitution.name} ({activeInstitution.code}) &bull; S-13
              REPOSITORY
            </span>
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Admission Submission Batches Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>
              Academic Cycle 2026-27 &bull; Cryptographically Hashed Intake
              Ledger
            </span>
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBatches}
            disabled={loading}
            className="h-9 gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50"
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
            className="h-9 gap-2 shadow-xs bg-[#245B75] hover:bg-[#1C4666] text-white font-semibold text-xs"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload New Batch</span>
          </Button>
        </div>
      </div>

      {/* 2. Repository Table Card */}
      <Card className="bg-white border border-slate-200 shadow-xs rounded-xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Ingestion History &amp; Quarantine Status
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Filterable repository of staged student cohorts and remediation
                workbenches.
              </CardDescription>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg border border-slate-200 bg-slate-100/60 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    statusFilter === "ALL"
                      ? "bg-white text-slate-900 shadow-2xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All ({batches.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("QUARANTINED")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    statusFilter === "QUARANTINED"
                      ? "bg-amber-100 text-amber-900 shadow-2xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Quarantined
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("VALIDATED")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    statusFilter === "VALIDATED"
                      ? "bg-emerald-100 text-emerald-900 shadow-2xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Validated
                </button>
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search programme, file, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 text-xs border-slate-200"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <LoadingState
                variant="skeleton-table"
                rows={4}
                label="Loading admission batches..."
              />
            </div>
          ) : error ? (
            <div className="p-6">
              <ErrorState
                title="Failed to Load Submissions"
                message={error.message}
                correlationId={error.correlationId}
                onRetry={fetchBatches}
              />
            </div>
          ) : batches.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No Batches Uploaded"
                description="No admission spreadsheets have been ingested for this institution yet."
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
          ) : filteredBatches.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 bg-slate-50/50">
              No batches matched query &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="ux4g-o-x-auto overflow-x-auto">
              <table className="ux4g-table w-full text-left border-collapse table-compact font-sans">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="px-4 py-3">Batch / Programme</th>
                    <th className="px-4 py-3">Cycle</th>
                    <th className="px-4 py-3">File Name</th>
                    <th className="px-4 py-3 text-center">Total</th>
                    <th className="px-4 py-3 text-center">Staged</th>
                    <th className="px-4 py-3 text-center">Quarantine</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                  {filteredBatches.map((batch) => {
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
                          <div className="font-semibold text-slate-900">
                            {batch.programme}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]">
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
