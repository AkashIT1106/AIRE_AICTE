import React, { useState } from "react";
import { BookOpen, ChevronRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ValidationIssueGroup, MOCK_VALIDATION_ISSUES } from "./mockData";

export interface ValidationIssueSummaryProps {
  issues?: ValidationIssueGroup[];
  onSelectIssue?: (field: string, issueType: string) => void;
  selectedField?: string;
  className?: string;
}

export const ValidationIssueSummary: React.FC<ValidationIssueSummaryProps> = ({
  issues = MOCK_VALIDATION_ISSUES,
  onSelectIssue,
  selectedField,
  className,
}) => {
  const [severityFilter, setSeverityFilter] = useState<
    "ALL" | "error" | "warning"
  >("ALL");

  const filteredIssues = issues.filter((iss) => {
    if (severityFilter === "ALL") return true;
    return iss.severity === severityFilter;
  });

  const totalErrors = issues
    .filter((i) => i.severity === "error")
    .reduce((acc, i) => acc + i.count, 0);
  const totalWarnings = issues
    .filter((i) => i.severity === "warning")
    .reduce((acc, i) => acc + i.count, 0);

  return (
    <Card
      className={cn("w-full border-line-default shadow-sm", className)}
      data-testid="validation-issue-summary"
    >
      <CardHeader className="border-b border-line-subtle bg-surface-card pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="danger" className="text-[11px] font-semibold">
                {totalErrors} CRITICAL ERRORS
              </Badge>
              {totalWarnings > 0 && (
                <Badge variant="warning" className="text-[11px] font-semibold">
                  {totalWarnings} WARNINGS
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-bold text-txt-primary flex items-center gap-2">
              <BookOpen
                className="h-5 w-5 text-brand-primary"
                aria-hidden="true"
              />
              <span>Grouped Validation Rule Issues</span>
            </CardTitle>
            <CardDescription className="text-xs text-txt-secondary">
              Statutory clause violations identified across candidate records
              during deterministic evaluation.
            </CardDescription>
          </div>

          {/* Severity filter buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-md bg-surface-card-subdued border border-line-subtle self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSeverityFilter("ALL")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                severityFilter === "ALL"
                  ? "bg-surface-card text-txt-primary shadow-xs font-semibold"
                  : "text-txt-muted hover:text-txt-primary",
              )}
            >
              All ({issues.length})
            </button>
            <button
              type="button"
              onClick={() => setSeverityFilter("error")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                severityFilter === "error"
                  ? "bg-state-danger-bg text-state-danger-text shadow-xs font-semibold"
                  : "text-txt-muted hover:text-state-danger-text",
              )}
            >
              Errors
            </button>
            <button
              type="button"
              onClick={() => setSeverityFilter("warning")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                severityFilter === "warning"
                  ? "bg-state-warning-bg text-state-warning-text shadow-xs font-semibold"
                  : "text-txt-muted hover:text-state-warning-text",
              )}
            >
              Warnings
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-line-subtle bg-surface-card-subdued">
            <ShieldCheck
              className="h-8 w-8 text-state-success-icon mx-auto mb-2"
              aria-hidden="true"
            />
            <h4 className="text-sm font-semibold text-txt-primary">
              No Validation Issues Found
            </h4>
            <p className="text-xs text-txt-muted mt-1">
              All candidate records strictly comply with AICTE Approval Process
              Handbook rules.
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isError = issue.severity === "error";
            const isSelected = selectedField === issue.field;

            return (
              <div
                key={issue.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectIssue?.(issue.field, issue.issueType)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectIssue?.(issue.field, issue.issueType);
                  }
                }}
                className={cn(
                  "p-4 rounded-lg border text-left transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 group select-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                  isSelected
                    ? "border-brand-primary bg-brand-subtle ring-1 ring-brand-primary"
                    : "border-line-subtle bg-surface-card hover:bg-surface-card-subdued",
                )}
                aria-label={`Issue: ${issue.issueType} on field ${issue.field}, ${issue.count} occurrences`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={isError ? "danger" : "warning"}
                      className="text-[10px] font-bold uppercase tracking-wider"
                    >
                      {isError ? "Critical Error" : "Advisory"}
                    </Badge>
                    <span className="font-mono text-xs font-bold text-txt-primary">
                      {issue.field}
                    </span>
                    <span className="text-xs text-txt-muted">&bull;</span>
                    <span className="text-xs font-medium text-txt-secondary">
                      {issue.issueType}
                    </span>
                  </div>

                  <p className="text-xs text-txt-primary font-medium">
                    &ldquo;{issue.sampleMessage}&rdquo;
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-txt-muted">
                    <BookOpen
                      className="h-3 w-3 text-brand-teal shrink-0"
                      aria-hidden="true"
                    />
                    <span>Statutory Citation: {issue.ruleClause}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <div className="text-right">
                    <span
                      className={cn(
                        "text-lg font-bold font-tabular",
                        isError
                          ? "text-state-danger-text"
                          : "text-state-warning-text",
                      )}
                    >
                      {issue.count}
                    </span>
                    <span className="text-xs text-txt-muted block">
                      records affected
                    </span>
                  </div>

                  <ChevronRight
                    className="h-4 w-4 text-txt-muted group-hover:text-txt-primary group-hover:translate-x-0.5 transition-all"
                    aria-hidden="true"
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

ValidationIssueSummary.displayName = "ValidationIssueSummary";
