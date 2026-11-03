import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  Download,
  Filter,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/metric-card";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ValidationSummaryData, MOCK_VALIDATION_SUMMARY } from "./mockData";

export interface UploadValidationSummaryProps {
  summary?: ValidationSummaryData;
  onFilterQuarantine?: () => void;
  onViewStaged?: () => void;
  onExportReport?: () => void;
  className?: string;
}

export const UploadValidationSummary: React.FC<
  UploadValidationSummaryProps
> = ({
  summary = MOCK_VALIDATION_SUMMARY,
  onFilterQuarantine,
  onViewStaged,
  onExportReport,
  className,
}) => {
  const {
    totalCount = 60,
    validCount = 55,
    quarantineCount = 5,
    rejectedCount = 0,
    validatedAt = "2026-11-03 11:15 IST",
    batchId = "BATCH-2026-CSE-001",
  } = summary;

  const complianceRate =
    totalCount > 0 ? Math.round((validCount / totalCount) * 1000) / 10 : 0;

  const isCompliant = complianceRate >= 95;
  const hasQuarantine = quarantineCount > 0;

  return (
    <Card
      className={cn("w-full border-line-default shadow-sm", className)}
      data-testid="upload-validation-summary"
    >
      <CardHeader className="border-b border-line-subtle bg-surface-card pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-[11px]">
                {batchId}
              </Badge>
              <Badge
                variant={isCompliant ? "success" : "warning"}
                className="text-[11px] font-semibold"
              >
                {isCompliant
                  ? "CONCORDANCE PASS (≥95%)"
                  : "TRIAGE REQUIRED (<95%)"}
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold text-txt-primary flex items-center gap-2">
              <FileSpreadsheet
                className="h-5 w-5 text-brand-primary"
                aria-hidden="true"
              />
              <span>Upload Validation Summary</span>
            </CardTitle>
            <CardDescription className="text-xs text-txt-secondary">
              Automated deterministic verification results against AICTE
              regulatory quota specifications.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onExportReport && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onExportReport}
                className="text-xs gap-1.5 h-8 border-line-default"
              >
                <Download
                  className="h-3.5 w-3.5 text-brand-primary"
                  aria-hidden="true"
                />
                <span>Export Report</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-6">
        {/* Compliance Rate Header Banner */}
        <div className="rounded-lg border border-line-subtle bg-surface-card-subdued p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-txt-muted uppercase tracking-wider">
              Statutory Cohort Compliance Rate
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-tabular text-txt-primary tracking-tight">
                {complianceRate}%
              </span>
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1",
                  isCompliant
                    ? "bg-state-success-bg text-state-success-text"
                    : "bg-state-warning-bg text-state-warning-text",
                )}
              >
                <TrendingUp className="h-3 w-3" aria-hidden="true" />
                <span>
                  {isCompliant ? "Fully Concordant" : "Action Required"}
                </span>
              </span>
            </div>
            <p className="text-xs text-txt-secondary">
              Evaluated {totalCount} records at {validatedAt}
            </p>
          </div>

          <div className="w-full md:w-64 space-y-1.5">
            <div className="flex justify-between text-xs text-txt-muted font-tabular">
              <span>Accepted ({validCount})</span>
              <span>Quarantined ({quarantineCount})</span>
            </div>
            <Progress
              value={complianceRate}
              size="default"
              aria-label="Statutory compliance rate"
              className="[&>div]:bg-brand-primary"
            />
          </div>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            title="Total Ingested"
            value={totalCount}
            subtext="Candidate rows in CSV"
            status="default"
          />

          <MetricCard
            title="Accepted & Staged"
            value={validCount}
            subtext="Conforms to APH quotas"
            status="success"
            icon={CheckCircle2}
          />

          <MetricCard
            title="Quarantined"
            value={quarantineCount}
            subtext="Pending error remediation"
            status={hasQuarantine ? "warning" : "default"}
            icon={AlertTriangle}
          />

          <MetricCard
            title="Critical Rejected"
            value={rejectedCount}
            subtext="Unrecoverable violations"
            status={rejectedCount > 0 ? "danger" : "default"}
            icon={XCircle}
          />
        </div>
      </CardContent>

      <CardFooter className="border-t border-line-subtle bg-surface-card px-6 py-3 flex items-center justify-between">
        <span className="text-xs text-txt-muted">
          Quarantined rows must be remediated or discarded before final cohort
          sealing.
        </span>

        <div className="flex items-center gap-2">
          {hasQuarantine && onFilterQuarantine && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onFilterQuarantine}
              className="text-xs h-8 border-line-default text-state-warning-text hover:bg-state-warning-bg gap-1 font-semibold"
            >
              <Filter className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Triage {quarantineCount} Quarantined</span>
            </Button>
          )}

          {onViewStaged && (
            <Button
              type="button"
              size="sm"
              onClick={onViewStaged}
              className="text-xs h-8 bg-brand-primary hover:bg-brand-primary-hover text-txt-inverted gap-1 font-semibold"
            >
              <span>View Staged Records</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

UploadValidationSummary.displayName = "UploadValidationSummary";
