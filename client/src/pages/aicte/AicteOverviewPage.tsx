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
  Search,
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
import { AuthApi } from "@/lib/api";
import { LoadingState } from "@/components/feedback/LoadingState";

export const AicteOverviewPage: React.FC = () => {
  const [institutions, setInstitutions] = useState<
    Array<{ id: string; code: string; name: string; status: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredInstitutions = institutions.filter((inst) => {
    const q = searchQuery.toLowerCase();
    return (
      inst.name.toLowerCase().includes(q) || inst.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 uppercase tracking-wider mb-1.5 font-semibold">
            <ShieldCheck className="h-4 w-4 text-[#245B75]" />
            <span>AICTE Headquarters &bull; Regulatory Oversight Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            National Admission Compliance &amp; Scrutiny
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>
              Academic Year 2026-27 &bull; Statutory Submission Window Active
            </span>
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInstitutions}
            disabled={loading}
            className="h-9 gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh Roster</span>
          </Button>
        </div>
      </div>

      {/* 2. Regulatory Notice */}
      <Alert
        variant="info"
        className="border-sky-200 bg-sky-50 text-sky-950 shadow-2xs"
      >
        <Clock className="h-4 w-4 text-sky-700" />
        <AlertTitle className="font-semibold text-xs text-sky-900">
          Statutory Reporting Active (Section 10.1 Oversight)
        </AlertTitle>
        <AlertDescription className="text-xs text-sky-800 mt-0.5 leading-relaxed">
          AICTE Regional Offices and Headquarters Scrutiny officers monitor
          institutional cohort uploads, validate seat allocations against
          approved intake limits, and issue regulatory Show Cause notices.
        </AlertDescription>
      </Alert>

      {/* 3. National KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200 shadow-2xs rounded-xl flex flex-col justify-between h-[106px]">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>Registered Institutes</span>
            <Building2 className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono font-tabular text-slate-900">
            {institutions.length}
          </div>
          <p className="text-[11px] text-slate-400">Active in Cycle 2026-27</p>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-2xs rounded-xl flex flex-col justify-between h-[106px]">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>Regulatory Engine</span>
            <FileCheck2 className="h-4 w-4 text-[#245B75]" />
          </div>
          <div className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Deterministic RLS</span>
          </div>
          <p className="text-[11px] text-slate-400">
            PostgreSQL Multi-Tenant Policies
          </p>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-2xs rounded-xl flex flex-col justify-between h-[106px]">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>Audit Standard</span>
            <ShieldCheck className="h-4 w-4 text-[#245B75]" />
          </div>
          <div className="text-sm font-semibold text-[#245B75]">
            Purpose-Bound Audit
          </div>
          <p className="text-[11px] text-slate-400">Append-Only Audit Trail</p>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-2xs rounded-xl flex flex-col justify-between h-[106px]">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>Security Boundary</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-sm font-semibold text-slate-900">
            RBAC + ABAC
          </div>
          <p className="text-[11px] text-slate-400">
            Server &amp; Database Enforced
          </p>
        </Card>
      </div>

      {/* 4. Institutional Directory */}
      <Card className="bg-white border border-slate-200 shadow-xs rounded-xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Institutional Compliance Directory
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                AICTE-approved technical institutions enrolled for centralized
                admission reconciliation.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search institution or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs border-slate-200"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <LoadingState
                variant="skeleton-table"
                rows={3}
                label="Loading institutional directory..."
              />
            </div>
          ) : filteredInstitutions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 bg-slate-50/50">
              No institutions currently enrolled in local registry.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-compact font-sans">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="px-4 py-3 w-[20%]">Institution Code</th>
                    <th className="px-4 py-3 w-[45%]">Institution Name</th>
                    <th className="px-4 py-3 w-[20%]">Status</th>
                    <th className="px-4 py-3 w-[15%] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                  {filteredInstitutions.map((inst) => (
                    <tr
                      key={inst.id}
                      className="hover:bg-slate-50/70 transition-colors h-[44px]"
                    >
                      <td className="px-4 py-2.5 font-mono font-bold text-[#245B75]">
                        {inst.code}
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-slate-900">
                        {inst.name}
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant="success" size="sm">
                          {inst.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <Link
                          to="/institution/dashboard"
                          className="inline-flex items-center text-xs font-semibold text-[#245B75] hover:text-[#1C4666] hover:underline"
                        >
                          <span>Inspect Cohort</span>
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
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
