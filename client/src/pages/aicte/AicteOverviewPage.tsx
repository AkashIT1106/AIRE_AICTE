import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  FileCheck2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
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
import { AuthApi } from "@/lib/api";
import { LoadingState } from "@/components/feedback/LoadingState";

export const AicteOverviewPage: React.FC = () => {
  const [institutions, setInstitutions] = useState<
    Array<{ id: string; code: string; name: string; status: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const list = await AuthApi.listInstitutions();
      setInstitutions(list);
    } catch {
      setInstitutions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border-default)]">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)] uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-[var(--brand-teal)]" />
            <span>AICTE Headquarters &bull; Regulatory Oversight Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            National Admission Compliance & Scrutiny
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Academic Year 2026-27 &bull; Statutory Submission Window Active
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInstitutions}
            disabled={loading}
            className="h-9 gap-1.5"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh Roster</span>
          </Button>
        </div>
      </div>

      {/* 2. Regulatory Notice */}
      <Alert variant="info">
        <Clock className="h-4 w-4" />
        <AlertTitle className="font-semibold">
          Statutory Reporting Active (Section 10.1 Oversight)
        </AlertTitle>
        <AlertDescription className="text-xs">
          AICTE Regional Offices and Headquarters Scrutiny officers monitor
          institutional cohort uploads, validate seat allocations against
          approved intake limits, and issue regulatory Show Cause notices.
        </AlertDescription>
      </Alert>

      {/* 3. National KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-[var(--surface-card)]">
          <div className="text-xs font-medium text-[var(--text-muted)] flex items-center justify-between">
            <span>Registered Institutes</span>
            <Building2 className="h-4 w-4 text-[var(--text-muted)]" />
          </div>
          <div className="text-2xl font-bold font-mono font-tabular text-[var(--text-primary)] mt-2">
            {institutions.length}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Active in Cycle 2026-27
          </p>
        </Card>

        <Card className="p-4 bg-[var(--surface-card)]">
          <div className="text-xs font-medium text-[var(--text-muted)] flex items-center justify-between">
            <span>Regulatory Engine</span>
            <FileCheck2 className="h-4 w-4 text-[var(--brand-primary)]" />
          </div>
          <div className="text-sm font-semibold text-[var(--state-success-text)] mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[var(--state-success-icon)]" />
            <span>Deterministic RLS</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            PostgreSQL Multi-Tenant Policies
          </p>
        </Card>

        <Card className="p-4 bg-[var(--surface-card)]">
          <div className="text-xs font-medium text-[var(--text-muted)] flex items-center justify-between">
            <span>Audit Standard</span>
            <ShieldCheck className="h-4 w-4 text-[var(--brand-teal)]" />
          </div>
          <div className="text-sm font-semibold text-[var(--brand-teal)] mt-2">
            Purpose-Bound Audit
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Append-Only Audit Trail
          </p>
        </Card>

        <Card className="p-4 bg-[var(--surface-card)]">
          <div className="text-xs font-medium text-[var(--text-muted)] flex items-center justify-between">
            <span>Security Boundary</span>
            <ShieldCheck className="h-4 w-4 text-[var(--state-success-icon)]" />
          </div>
          <div className="text-sm font-semibold text-[var(--text-primary)] mt-2">
            RBAC + ABAC
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Server & Database Enforced
          </p>
        </Card>
      </div>

      {/* 4. Institutional Directory */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Institutional Compliance Directory</CardTitle>
          <CardDescription>
            AICTE-approved technical institutions enrolled for centralized
            admission reconciliation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingState
              variant="skeleton-table"
              rows={3}
              label="Loading institutional directory..."
            />
          ) : institutions.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              No institutions currently enrolled in local registry.
            </div>
          ) : (
            <div className="rounded border border-[var(--border-default)] overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse table-compact font-sans">
                <thead>
                  <tr className="border-b border-[var(--border-default)] bg-[var(--surface-card-subdued)] text-xs font-semibold text-[var(--text-secondary)]">
                    <th className="px-3 py-2">Institution Code</th>
                    <th className="px-3 py-2">Institution Name</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-xs text-[var(--text-primary)]">
                  {institutions.map((inst) => (
                    <tr
                      key={inst.id}
                      className="hover:bg-[var(--surface-card-subdued)] transition-colors"
                    >
                      <td className="px-3 py-2 font-mono font-medium text-[var(--brand-primary)]">
                        {inst.code}
                      </td>
                      <td className="px-3 py-2 font-medium">{inst.name}</td>
                      <td className="px-3 py-2">
                        <Badge variant="success" size="sm">
                          {inst.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Link
                          to={`/institution/dashboard`}
                          className="inline-flex items-center text-xs font-medium text-[var(--brand-primary)] hover:underline"
                        >
                          <span>Inspect Cohort</span>
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
