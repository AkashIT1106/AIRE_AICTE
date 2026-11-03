import React from "react";
import {
  Building2,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  FileText,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/metric-card";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { InstitutionStatusData, MOCK_INSTITUTION_STATUS } from "./mockData";

export interface InstitutionStatusPanelProps {
  institution?: InstitutionStatusData;
  onViewBatches?: () => void;
  onViewNotices?: () => void;
  className?: string;
}

export const InstitutionStatusPanel: React.FC<InstitutionStatusPanelProps> = ({
  institution = MOCK_INSTITUTION_STATUS,
  onViewBatches,
  onViewNotices,
  className,
}) => {
  const {
    code = "INST-101",
    name = "Delhi Institute of Technology",
    aisheCode = "U-0123",
    status = "ACTIVE",
    eoaOrderNumber = "AICTE/EOA/2026-27/NW-1092819",
    approvedIntake = 360,
    enrolled = 348,
    quarantined = 5,
    complianceRate = 96.67,
    regulatoryDeadline = "2026-11-30 23:59 IST",
    activeNotices = [],
  } = institution;

  const isShowCause = status === "SHOW_CAUSE";
  const isCompliant = complianceRate >= 95;
  const fillRate =
    approvedIntake > 0 ? Math.round((enrolled / approvedIntake) * 100) : 0;

  return (
    <Card
      className={cn("w-full border-line-default shadow-sm", className)}
      data-testid="institution-status-panel"
    >
      <CardHeader className="border-b border-line-subtle bg-surface-card pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="font-mono text-[11px] font-bold"
              >
                AISHE: {aisheCode}
              </Badge>
              <Badge variant="outline" className="font-mono text-[11px]">
                PID: {code}
              </Badge>
              <Badge
                variant={isShowCause ? "danger" : "success"}
                className="text-[11px] font-semibold"
              >
                {isShowCause
                  ? "SHOW CAUSE NOTICE"
                  : "APPROVAL ACTIVE (2026-27)"}
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold text-txt-primary flex items-center gap-2">
              <Building2
                className="h-5 w-5 text-brand-primary"
                aria-hidden="true"
              />
              <span>{name}</span>
            </CardTitle>
            <CardDescription className="text-xs text-txt-secondary">
              EOA Order:{" "}
              <span className="font-mono text-txt-primary font-medium">
                {eoaOrderNumber}
              </span>
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onViewBatches && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onViewBatches}
                className="text-xs h-8 border-line-default gap-1"
              >
                <span>View Batches</span>
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-6">
        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            title="Approved Intake"
            value={approvedIntake}
            subtext="Sanctioned branch capacity"
            status="default"
          />

          <MetricCard
            title="Enrolled Students"
            value={enrolled}
            subtext={`${approvedIntake - enrolled} available seats`}
            status="default"
            icon={Building2}
          />

          <MetricCard
            title="Quarantined Rows"
            value={quarantined}
            subtext="Pending remediation"
            status={quarantined > 0 ? "warning" : "success"}
            icon={AlertTriangle}
          />

          <MetricCard
            title="Compliance Rate"
            value={`${complianceRate}%`}
            subtext="AICTE concordance gate"
            status={isCompliant ? "success" : "warning"}
            icon={ShieldCheck}
          />
        </div>

        {/* Regulatory Deadline & Intake Progress */}
        <div className="rounded-lg border border-line-subtle bg-surface-card-subdued p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-txt-muted flex items-center gap-1.5">
              <Calendar
                className="h-3.5 w-3.5 text-brand-primary"
                aria-hidden="true"
              />
              <span>Statutory Intake Freeze Deadline</span>
            </span>
            <div className="font-mono font-bold text-sm text-txt-primary">
              {regulatoryDeadline}
            </div>
            <p className="text-xs text-txt-secondary">
              All batch remediations and attestations must be concluded prior to
              freeze.
            </p>
          </div>

          <div className="w-full sm:w-56 space-y-1">
            <div className="flex justify-between text-xs text-txt-muted font-tabular">
              <span>Intake Fill Rate</span>
              <span>{fillRate}%</span>
            </div>
            <Progress
              value={Math.min(100, Math.max(0, fillRate))}
              size="sm"
              aria-label="Intake fill rate progress"
            />
          </div>
        </div>

        {/* Active Regulatory Notices */}
        {activeNotices.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-txt-primary uppercase tracking-wider">
                Active Regulatory Directives ({activeNotices.length})
              </span>
              {onViewNotices && (
                <button
                  type="button"
                  onClick={onViewNotices}
                  className="text-xs text-brand-primary hover:underline font-semibold"
                >
                  View All Directives
                </button>
              )}
            </div>

            <div className="space-y-2">
              {activeNotices.map((notice) => (
                <div
                  key={notice.id}
                  className={cn(
                    "p-3 rounded-lg border flex items-center justify-between text-xs transition-colors",
                    notice.severity === "danger" &&
                      "border-state-danger-border bg-state-danger-bg text-state-danger-text",
                    notice.severity === "warning" &&
                      "border-state-warning-border bg-state-warning-bg text-state-warning-text",
                    notice.severity === "info" &&
                      "border-line-subtle bg-surface-card text-txt-primary",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {notice.severity === "danger" && (
                      <AlertOctagon className="h-4 w-4 shrink-0" />
                    )}
                    {notice.severity === "warning" && (
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                    )}
                    {notice.severity === "info" && (
                      <FileText className="h-4 w-4 shrink-0 text-brand-primary" />
                    )}
                    <span className="font-medium">{notice.title}</span>
                  </div>
                  <span className="text-[11px] text-txt-muted font-mono shrink-0 ml-2">
                    {notice.issuedDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-line-subtle bg-surface-card px-6 py-3 flex items-center justify-between text-xs text-txt-muted">
        <span>Verified against AICTE Approval Bureau Registry 2026.</span>
        <span className="font-mono text-[11px]">Status: Active</span>
      </CardFooter>
    </Card>
  );
};

InstitutionStatusPanel.displayName = "InstitutionStatusPanel";
