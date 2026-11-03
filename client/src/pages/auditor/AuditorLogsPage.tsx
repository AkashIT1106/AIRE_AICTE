import React from "react";
import { ShieldCheck, FileText, Lock, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export const AuditorLogsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[var(--border-default)]">
        <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)] uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 text-[var(--brand-teal)]" />
          <span>Regulatory Auditor Workbench &bull; Read-Only</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
          Immutable Audit Trail Explorer
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          Tamper-evident verification of regulatory events, authentication
          lifecycles, and tenant isolation logs.
        </p>
      </div>

      <Alert variant="info">
        <Lock className="h-4 w-4" />
        <AlertTitle className="font-semibold">
          Append-Only Audit Standard (Section 19 / SoD Rule 3)
        </AlertTitle>
        <AlertDescription className="text-xs">
          System administrators and operators cannot alter, truncate, or delete
          audit events. Auditors hold read-only access to cryptographic
          provenance and reconciliation history.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-[var(--surface-card)]">
          <div className="text-xs font-medium text-[var(--text-muted)] flex items-center justify-between">
            <span>Audit Architecture</span>
            <FileText className="h-4 w-4 text-[var(--brand-primary)]" />
          </div>
          <div className="text-sm font-semibold text-[var(--text-primary)] mt-2">
            Append-Only Ledger
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Table: <code className="font-mono text-[10px]">audit_events</code>
          </p>
        </Card>

        <Card className="p-4 bg-[var(--surface-card)]">
          <div className="text-xs font-medium text-[var(--text-muted)] flex items-center justify-between">
            <span>Isolation Enforcement</span>
            <Lock className="h-4 w-4 text-[var(--state-success-icon)]" />
          </div>
          <div className="text-sm font-semibold text-[var(--state-success-text)] mt-2">
            Forced RLS Verified
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Tenant boundaries active
          </p>
        </Card>

        <Card className="p-4 bg-[var(--surface-card)]">
          <div className="text-xs font-medium text-[var(--text-muted)] flex items-center justify-between">
            <span>Audit Clock</span>
            <Clock className="h-4 w-4 text-[var(--brand-teal)]" />
          </div>
          <div className="text-sm font-semibold font-mono tabular-nums text-[var(--text-primary)] mt-2">
            UTC+05:30 (IST)
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Synchronized Server Time
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Audit Trail Integrity Standard</CardTitle>
          <CardDescription>
            All critical operations record actor ID, tenant context, correlation
            ID, and status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded border border-[var(--border-default)] bg-[var(--surface-card-subdued)] p-4 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <span className="font-semibold text-[var(--text-primary)]">
                Compliance Level:
              </span>
              <Badge variant="success" size="sm">
                Purpose-Bound Trail
              </Badge>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Every admission upload, schema validation failure, quarantine
              triage decision, and access denial is committed with an immutable
              correlation ID and tamper-evident metadata.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
