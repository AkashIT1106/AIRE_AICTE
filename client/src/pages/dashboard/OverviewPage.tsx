import { useState } from "react";
import {
  Building2,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ArrowUpRight,
  Filter,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import {
  MOCK_INSTITUTIONS,
  MOCK_EXCEPTIONS,
  MOCK_AUDIT_EVENTS,
  type MockInstitution,
  type MockException,
} from "@/lib/mockData";
import { useAuthStore } from "@/stores/auth.store";

export function OverviewPage() {
  const { user, platformRoles } = useAuthStore();
  const [academicYear, setAcademicYear] = useState("2026-2027");

  const isRegulator =
    platformRoles.includes("SUPER_ADMIN" as any) ||
    platformRoles.includes("AICTE_ADMIN" as any) ||
    platformRoles.includes("AICTE_REVIEWER" as any) ||
    !user; // Default preview to regulator view

  // Intake vs Admissions Chart Data
  const intakeComparisonData = [
    { name: "DTU (Delhi)", approved: 2400, admitted: 2385 },
    { name: "COEP (Pune)", approved: 1250, admitted: 1250 },
    { name: "NITK (Surathkal)", approved: 1100, admitted: 1098 },
    { name: "PSG Tech (TN)", approved: 1480, admitted: 1510 },
    { name: "Jadavpur Univ", approved: 1320, admitted: 1312 },
    { name: "VIT (Vellore)", approved: 4200, admitted: 4235 },
    { name: "MNIT Jaipur", approved: 980, admitted: 976 },
  ];

  // Reconciliation Outcome Data
  const reconciliationData = [
    { name: "Exact Match", value: 12150, color: "#176B45" },
    { name: "Minor Discrepancy", value: 340, color: "#245B78" },
    { name: "Unverified Identity", value: 145, color: "#8A4D0A" },
    { name: "Excess / Quota Breach", value: 41, color: "#B42318" },
  ];

  const institutionColumns: Column<MockInstitution>[] = [
    {
      header: "Institution Name & Code",
      accessor: "name",
      cell: (row) => (
        <div>
          <p className="font-semibold text-neutral-800">{row.name}</p>
          <p className="text-xs text-neutral-600 font-mono">Code: {row.code} • {row.state}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Type",
      accessor: "type",
      className: "text-neutral-600",
    },
    {
      header: "Approved Intake",
      accessor: "approvedIntake",
      cell: (row) => <span className="font-mono font-medium">{row.approvedIntake.toLocaleString()}</span>,
      sortable: true,
    },
    {
      header: "Reported Admissions",
      accessor: "reportedAdmissions",
      cell: (row) => (
        <span
          className={`font-mono font-medium ${
            row.reportedAdmissions > row.approvedIntake ? "text-state-error font-bold" : "text-neutral-800"
          }`}
        >
          {row.reportedAdmissions.toLocaleString()}
        </span>
      ),
      sortable: true,
    },
    {
      header: "Compliance",
      accessor: "complianceRate",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 rounded-full bg-neutral-100 overflow-hidden">
            <div
              className={`h-full ${
                row.complianceRate >= 98
                  ? "bg-state-success"
                  : row.complianceRate >= 95
                  ? "bg-state-warning"
                  : "bg-state-error"
              }`}
              style={{ width: `${row.complianceRate}%` }}
            />
          </div>
          <span className="text-xs font-mono font-medium">{row.complianceRate}%</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <StatusBadge
          variant={row.openExceptions > 0 ? "error" : "success"}
          label={row.openExceptions > 0 ? `${row.openExceptions} Notice(s)` : "Compliant"}
        />
      ),
    },
  ];

  const exceptionColumns: Column<MockException>[] = [
    {
      header: "Case ID & Notice",
      accessor: "exceptionNumber",
      cell: (row) => (
        <div>
          <span className="font-mono font-bold text-xs text-brand-primary">{row.exceptionNumber}</span>
          <p className="text-xs text-neutral-600 truncate max-w-[220px]">{row.institutionName}</p>
        </div>
      ),
    },
    {
      header: "Violation Category",
      accessor: "violationCategory",
      cell: (row) => (
        <span className="text-xs font-medium text-neutral-800">
          {row.violationCategory.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Severity",
      accessor: "severity",
      cell: (row) => (
        <StatusBadge
          variant={row.severity === "CRITICAL" ? "error" : row.severity === "HIGH" ? "warning" : "info"}
          label={row.severity}
        />
      ),
    },
    {
      header: "Stage",
      accessor: "status",
      cell: (row) => (
        <span className="text-xs font-mono text-neutral-600">
          {row.status.replace(/_/g, " ")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={isRegulator ? "National Admission Regulatory Console" : "Institutional Admission Dashboard"}
        description="Real-time statutory reconciliation between AICTE sanctioned intake and actual reported admissions."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-state-success-bg px-2.5 py-1 text-xs font-semibold text-state-success border border-state-success-border">
            <span className="h-1.5 w-1.5 rounded-full bg-state-success animate-pulse" />
            Live Regulatory Session
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-control border border-neutral-200 bg-neutral-0 px-3 py-1.5 text-xs text-neutral-800 shadow-sm">
              <Filter className="h-3.5 w-3.5 text-neutral-600" />
              <select
                aria-label="Select Academic Year"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="bg-transparent font-medium outline-none cursor-pointer"
              >
                <option value="2026-2027">AY 2026-2027 (Active)</option>
                <option value="2025-2026">AY 2025-2026</option>
                <option value="2024-2025">AY 2024-2025</option>
              </select>
            </div>
            <button
              onClick={() => alert("Statutory Summary Report generation started. Download will commence shortly.")}
              className="flex items-center gap-1.5 rounded-control bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-900 transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              Export Dossier
            </button>
          </div>
        }
      />

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Registered Institutions"
          value="9,412"
          icon={Building2}
          variant="default"
          trend={{ direction: "up", percent: 3.4, label: "vs last year" }}
        />
        <MetricCard
          label="Approved Seat Capacity"
          value="31,84,200"
          icon={GraduationCap}
          variant="info"
        />
        <MetricCard
          label="Admissions Reconciled"
          value="29,48,610"
          icon={CheckCircle2}
          variant="success"
          trend={{ direction: "up", percent: 92.6, label: "completion" }}
        />
        <MetricCard
          label="Pending Regulatory Exceptions"
          value="184"
          icon={AlertTriangle}
          variant="critical"
          trend={{ direction: "down", percent: 12.0, label: "active show-cause" }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Bar Chart: Sanctioned vs Admitted */}
        <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-800">
                Approved Intake vs. Reported Admissions (Sample Institutions)
              </h3>
              <p className="text-xs text-neutral-600">
                Identifying delta between sanctioned statutory ceiling and admitted cohort
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-600">Unit: Seats</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intakeComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7ECEE" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#536474" }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: "#536474" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "6px",
                    border: "1px solid #D8E0E3",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Bar dataKey="approved" name="Sanctioned Intake" fill="#24536F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="admitted" name="Reported Admissions" fill="#075E58" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Reconciliation Outcome */}
        <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-neutral-800">Reconciliation Distribution</h3>
            <p className="text-xs text-neutral-600">National multi-pass matching outcome</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reconciliationData}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {reconciliationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${Number(value).toLocaleString()} Students`, "Cohort Size"]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "6px",
                    border: "1px solid #D8E0E3",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} layout="horizontal" verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Split Tables: Institution Compliance & Urgent Exceptions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Institutions Table */}
        <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-800">Monitored Institutional Entities</h3>
              <p className="text-xs text-neutral-600">Sample technical institutions under reconciliation scrutiny</p>
            </div>
            <a
              href="/dashboard/institutions"
              className="flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
            >
              View All Directory <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <DataTable columns={institutionColumns} data={MOCK_INSTITUTIONS.slice(0, 5)} />
        </div>

        {/* Urgent Exceptions Workbench Card */}
        <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-800">Active Regulatory Notices</h3>
                <p className="text-xs text-neutral-600">Show-cause & audit exceptions pending sign-off</p>
              </div>
              <a
                href="/dashboard/exceptions"
                className="flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
              >
                Workbench <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
            <DataTable columns={exceptionColumns} data={MOCK_EXCEPTIONS} />
          </div>

          <div className="mt-4 rounded-control border border-state-warning-border bg-state-warning-bg p-3">
            <p className="text-xs text-state-warning font-medium leading-relaxed">
              <strong>Human Authority Mandate:</strong> No automated disciplinary sanction or forfeiture is applied
              without dual-authorized regulatory hearing and evidence examination.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Audit Timeline Strip */}
      <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-brand-primary" />
            <h3 className="text-sm font-bold text-neutral-800">Immutable Audit Chronology (Recent System Events)</h3>
          </div>
          <a href="/dashboard/audit" className="text-xs font-semibold text-brand-primary hover:underline">
            Inspect Full Ledger →
          </a>
        </div>
        <div className="divide-y divide-neutral-150">
          {MOCK_AUDIT_EVENTS.slice(0, 3).map((event) => (
            <div key={event.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-neutral-600">{event.timestamp}</span>
                <span className="font-semibold text-neutral-800">{event.summary}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600">
                  {event.actor}
                </span>
                <span className="font-mono text-[10px] text-neutral-600">{event.tamperProofHash.slice(0, 16)}…</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
