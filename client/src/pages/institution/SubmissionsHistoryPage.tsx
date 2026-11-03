import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UploadCloud,
  ArrowRight,
  RefreshCw,
  Search,
  AlertTriangle,
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
import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { SubmissionsApi, ApiException } from "@/lib/api";
import { SubmissionBatch } from "@aire/api-contracts";
import { useAuth } from "@/context/AuthContext";

export const SubmissionsHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeInstitution } = useAuth();
  const institutionId = activeInstitution?.id || "";

  const [batches, setBatches] = useState<SubmissionBatch[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
    return (
      b.programme.toLowerCase().includes(q) ||
      b.fileName.toLowerCase().includes(q) ||
      b.status.toLowerCase().includes(q)
    );
  });

  if (!activeInstitution) {
    return (
      <div className="space-y-6">
        <Alert variant="warning" role="alert">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold">
            Institutional Context Required
          </AlertTitle>
          <AlertDescription className="text-xs">
            No active institution is associated with your session. Please select
            an authorized institution from the tenant switcher in the header to
            view historical submissions.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border-default)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Admission Submission Batches Ledger
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {activeInstitution
              ? `${activeInstitution.name} (${activeInstitution.code})`
              : "Institution Ledger"}{" "}
            &bull; Academic Cycle 2026-27
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBatches}
            disabled={loading}
            className="h-9 gap-1.5"
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
            className="h-9 gap-2 shadow-sm"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload New Batch</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Ingestion History & Quarantine Status</CardTitle>
              <CardDescription>
                Filterable repository of staged student cohorts and remediation
                workbenches.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
              <Input
                type="text"
                placeholder="Search programme or file..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingState
              variant="skeleton-table"
              rows={4}
              label="Loading admission batches..."
            />
          ) : error ? (
            <ErrorState
              title="Failed to Load Submissions"
              message={error.message}
              correlationId={error.correlationId}
              onRetry={fetchBatches}
            />
          ) : batches.length === 0 ? (
            <EmptyState
              title="No Batches Uploaded"
              description="No admission spreadsheets have been ingested for this institution yet."
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
          ) : filteredBatches.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              No batches matched search query &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="rounded border border-[var(--border-default)] overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse table-compact font-sans">
                <thead>
                  <tr className="border-b border-[var(--border-default)] bg-[var(--surface-card-subdued)] text-xs font-semibold text-[var(--text-secondary)]">
                    <th className="px-3 py-2">Batch / Programme</th>
                    <th className="px-3 py-2">Cycle</th>
                    <th className="px-3 py-2">File Name</th>
                    <th className="px-3 py-2 text-center">Total</th>
                    <th className="px-3 py-2 text-center">Staged</th>
                    <th className="px-3 py-2 text-center">Quarantine</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-xs text-[var(--text-primary)]">
                  {filteredBatches.map((batch) => {
                    const hasQuarantine = batch.quarantineCount > 0;
                    return (
                      <tr
                        key={batch.id}
                        className="hover:bg-[var(--surface-card-subdued)] transition-colors cursor-pointer"
                        onClick={() =>
                          navigate(`/institution/submissions/${batch.id}`)
                        }
                      >
                        <td className="px-3 py-2 font-medium">
                          <div className="font-semibold text-[var(--text-primary)]">
                            {batch.programme}
                          </div>
                          <div className="text-[11px] font-mono text-[var(--text-muted)] truncate max-w-[200px]">
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
