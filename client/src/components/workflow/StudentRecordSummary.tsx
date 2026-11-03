import React, { useState } from "react";
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  EyeOff,
  Building2,
  Download,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { StudentRecordDetails, MOCK_STUDENT_RECORD } from "./mockData";

export interface StudentRecordSummaryProps {
  student?: StudentRecordDetails;
  allowUnmask?: boolean;
  onUnmask?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
  className?: string;
}

export const StudentRecordSummary: React.FC<StudentRecordSummaryProps> = ({
  student = MOCK_STUDENT_RECORD,
  allowUnmask = true,
  onUnmask,
  onPrint,
  onDownload,
  className,
}) => {
  const [isUnmasked, setIsUnmasked] = useState(false);

  const handleToggleUnmask = () => {
    setIsUnmasked(!isUnmasked);
    onUnmask?.();
  };

  const isVerified = student.status === "VERIFIED";
  const isQuarantined = student.status === "QUARANTINED";
  const isPending = student.status === "PENDING";

  return (
    <Card
      className={cn(
        "w-full border-line-default shadow-sm overflow-hidden",
        className,
      )}
      data-testid="student-record-summary"
    >
      <div className="h-1.5 bg-gradient-to-r from-brand-primary via-brand-teal to-brand-primary" />

      <CardHeader className="border-b border-line-subtle bg-surface-card pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-[11px]">
                {student.institutionCode}
              </Badge>
              <Badge
                variant={
                  isVerified
                    ? "success"
                    : isQuarantined
                      ? "warning"
                      : "secondary"
                }
                className="text-[11px] font-semibold"
              >
                {student.status}
              </Badge>
              {student.concordanceStatus && (
                <Badge variant="info" className="text-[11px]">
                  {student.concordanceStatus}
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl font-bold text-txt-primary flex items-center gap-2">
              <GraduationCap
                className="h-5 w-5 text-brand-primary"
                aria-hidden="true"
              />
              <span>{student.studentName}</span>
            </CardTitle>
            <CardDescription className="text-xs text-txt-secondary flex items-center gap-1.5">
              <Building2
                className="h-3.5 w-3.5 text-txt-muted"
                aria-hidden="true"
              />
              <span>{student.institutionName}</span>
            </CardDescription>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-2 shrink-0">
            {onDownload && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="text-xs h-8 border-line-default gap-1"
              >
                <Download
                  className="h-3.5 w-3.5 text-brand-primary"
                  aria-hidden="true"
                />
                <span>Download Proof</span>
              </Button>
            )}
            {onPrint && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onPrint}
                className="text-xs h-8 border-line-default gap-1"
              >
                <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Print</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {/* Verification Status Callout */}
        <div
          className={cn(
            "rounded-lg border p-3.5 flex items-center justify-between text-xs",
            isVerified &&
              "border-state-success-border bg-state-success-bg text-state-success-text",
            isQuarantined &&
              "border-state-warning-border bg-state-warning-bg text-state-warning-text",
            isPending &&
              "border-line-subtle bg-surface-card-subdued text-txt-secondary",
          )}
        >
          <div className="flex items-center gap-2.5">
            {isVerified && (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-state-success-icon" />
            )}
            {isQuarantined && (
              <AlertTriangle className="h-4 w-4 shrink-0 text-state-warning-icon" />
            )}
            {isPending && <Clock className="h-4 w-4 shrink-0 text-txt-muted" />}

            <div>
              <span className="font-semibold">
                {isVerified
                  ? "Statutory Concordance Established"
                  : isQuarantined
                    ? "Quarantine Triage Required"
                    : "Verification In Progress"}
              </span>
              <p className="text-[11px] opacity-90 mt-0.5">
                Verified at: {student.verifiedAt} &bull; Deterministic Engine
                v2.0
              </p>
            </div>
          </div>

          <ShieldCheck
            className="h-5 w-5 opacity-40 shrink-0"
            aria-hidden="true"
          />
        </div>

        {/* 6 Grid Data Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1 p-2.5 rounded border border-line-subtle bg-surface-card-subdued/50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-txt-muted block">
              Roll / Registration No.
            </span>
            <div className="font-mono font-bold text-sm text-txt-primary">
              {student.rollNumber}
            </div>
          </div>

          <div className="space-y-1 p-2.5 rounded border border-line-subtle bg-surface-card-subdued/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-txt-muted">
                APAAR (Student ID)
              </span>
              {allowUnmask && (
                <button
                  type="button"
                  onClick={handleToggleUnmask}
                  className="text-[11px] font-semibold text-brand-primary hover:underline inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded-sm"
                  aria-pressed={isUnmasked}
                  aria-controls="apaar-id-value"
                  aria-label={
                    isUnmasked
                      ? "Mask APAAR identifier"
                      : "Unmask APAAR identifier"
                  }
                >
                  {isUnmasked ? (
                    <>
                      <EyeOff className="h-3 w-3" />
                      <span>Mask</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3" />
                      <span>Unmask</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <div
              id="apaar-id-value"
              className="font-mono font-bold text-sm text-txt-primary"
            >
              {isUnmasked
                ? student.apaarIdRaw || student.apaarIdMasked
                : student.apaarIdMasked}
            </div>
          </div>

          <div className="space-y-1 p-2.5 rounded border border-line-subtle bg-surface-card-subdued/50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-txt-muted block">
              Date of Birth
            </span>
            <div className="font-mono font-bold text-sm text-txt-primary">
              {student.dateOfBirth}
            </div>
          </div>

          <div className="space-y-1 p-2.5 rounded border border-line-subtle bg-surface-card-subdued/50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-txt-muted block">
              Programme &amp; Branch
            </span>
            <div className="font-semibold text-txt-primary">
              {student.programme}
            </div>
          </div>

          <div className="space-y-1 p-2.5 rounded border border-line-subtle bg-surface-card-subdued/50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-txt-muted block">
              Statutory Category
            </span>
            <div className="font-bold text-brand-primary">
              {student.category}
            </div>
          </div>

          <div className="space-y-1 p-2.5 rounded border border-line-subtle bg-surface-card-subdued/50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-txt-muted block">
              Admission Quota
            </span>
            <div className="font-semibold text-txt-primary">
              {student.quota}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-line-subtle bg-surface-card-subdued px-6 py-3 flex items-center justify-between text-xs text-txt-muted">
        <span>
          Identity protected under Digital Personal Data Protection Act 2023.
        </span>
        <span className="font-mono text-[11px]">
          Audit Ref: {student.rollNumber}-CONCORD
        </span>
      </CardFooter>
    </Card>
  );
};

StudentRecordSummary.displayName = "StudentRecordSummary";
