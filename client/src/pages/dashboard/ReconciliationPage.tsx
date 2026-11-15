import { useState } from "react";
import { CheckCircle, AlertTriangle, RefreshCw, Download, Eye, X, Calculator, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MOCK_ADMISSION_RECORDS, type MockAdmissionRecord } from "@/lib/mockData";

export function ReconciliationPage() {
  const [admissions] = useState<MockAdmissionRecord[]>(MOCK_ADMISSION_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<MockAdmissionRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isRunning, setIsRunning] = useState(false);

  const filteredData = admissions.filter((r) => {
    if (statusFilter !== "ALL" && r.reconciliationStatus !== statusFilter) return false;
    return true;
  });

  const handleRunReconciliation = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      alert("Multi-pass reconciliation cycle finished: 6 records evaluated across 4 deterministic rules. 1 excess admission flagged.");
    }, 1200);
  };

  const columns: Column<MockAdmissionRecord>[] = [
    {
      header: "Candidate Reference",
      accessor: "studentToken",
      cell: (row) => (
        <div>
          <span className="font-mono font-bold text-xs text-brand-primary">{row.studentToken}</span>
          <p className="text-[11px] text-neutral-600 font-medium">{row.maskedName}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Institution & Programme",
      accessor: "institutionName",
      cell: (row) => (
        <div>
          <p className="font-semibold text-neutral-800 text-xs">{row.institutionName}</p>
          <span className="text-[11px] text-neutral-600">{row.programmeName}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Category & Quota",
      accessor: "category",
      cell: (row) => (
        <div>
          <span className="font-mono text-xs font-semibold bg-neutral-100 px-1.5 py-0.5 rounded">
            {row.category}
          </span>
          <p className="text-[10px] text-neutral-600">{row.quotaAllocated}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: "APAAR State",
      accessor: "apaarStatus",
      cell: (row) => (
        <span className="font-mono text-xs text-neutral-800 font-medium">
          {row.apaarStatus.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Reconciliation Verdict",
      accessor: "reconciliationStatus",
      cell: (row) => (
        <StatusBadge
          variant={
            row.reconciliationStatus === "MATCHED"
              ? "matched"
              : row.reconciliationStatus === "EXCESS"
              ? "excess"
              : row.reconciliationStatus === "MISMATCHED"
              ? "mismatched"
              : "pending"
          }
          label={row.reconciliationStatus}
        />
      ),
      sortable: true,
    },
    {
      header: "Audit Explanations",
      accessor: "id",
      cell: (row) => (
        <button
          onClick={() => setSelectedRecord(row)}
          className="flex items-center gap-1 text-xs font-semibold text-brand-primary hover:bg-brand-50 px-2 py-1 rounded-control transition-colors"
        >
          <Eye className="h-3.5 w-3.5" /> Rule Trace
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cohort Reconciliation Workbench (M10)"
        description="Deterministic multi-pass reconciliation engine comparing institutional admission cohorts against AICTE sanctioned intake, statutory reservations, and identity tokens."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Reconciliation Ledger CSV exported.")}
              className="flex items-center gap-1.5 rounded-control border border-neutral-200 bg-neutral-0 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 shadow-sm"
            >
              <Download className="h-3.5 w-3.5" /> Export Reconciliation Report
            </button>
            <button
              onClick={handleRunReconciliation}
              disabled={isRunning}
              className="flex items-center gap-1.5 rounded-control bg-brand-primary px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-900 disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRunning ? "animate-spin" : ""}`} />
              {isRunning ? "Evaluating Multi-Pass…" : "Execute Reconciliation Run"}
            </button>
          </div>
        }
      />

      {/* Multi-Pass Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Pass 1: Intake Ceiling"
          value="99.2%"
          icon={CheckCircle}
          variant="success"
          trend={{ direction: "up", percent: 0.8, label: "within approved cap" }}
        />
        <MetricCard
          label="Pass 2: Quota Alignment"
          value="98.4%"
          icon={Calculator}
          variant="info"
        />
        <MetricCard
          label="Pass 3: Identity Verification"
          value="97.1%"
          icon={ShieldCheck}
          variant="default"
        />
        <MetricCard
          label="Pass 4: Ghost / Excess Breaches"
          value="1 Flagged"
          icon={AlertTriangle}
          variant="critical"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 rounded-card border border-neutral-150 bg-neutral-0 p-4 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
          Filter by Status:
        </span>
        <select
          aria-label="Filter records by Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-control border border-neutral-200 bg-neutral-0 px-3 py-1.5 text-xs text-neutral-800 font-medium outline-none cursor-pointer"
        >
          <option value="ALL">All Outcomes</option>
          <option value="MATCHED">MATCHED</option>
          <option value="EXCESS">EXCESS ADMISSION</option>
          <option value="MISMATCHED">MISMATCHED IDENTITY</option>
          <option value="UNVERIFIED">UNVERIFIED</option>
        </select>
        <span className="text-xs text-neutral-600 ml-auto font-mono">
          Showing {filteredData.length} records
        </span>
      </div>

      {/* Main Workbench Table */}
      <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm">
        <DataTable
          columns={columns}
          data={filteredData}
          searchPlaceholder="Search candidate reference, institution name, or APAAR state…"
          searchFilter={(row, q) =>
            row.studentToken.toLowerCase().includes(q.toLowerCase()) ||
            row.maskedName.toLowerCase().includes(q.toLowerCase()) ||
            row.institutionName.toLowerCase().includes(q.toLowerCase())
          }
        />
      </div>

      {/* Rule Trace Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-card border border-neutral-150 bg-neutral-0 shadow-2xl overflow-hidden font-sans">
            <div className="border-b border-neutral-150 bg-brand-deep px-6 py-4 text-white flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase text-brand-100 opacity-75">
                  Deterministic Rule Trace
                </p>
                <h3 className="text-base font-bold text-white">{selectedRecord.studentToken}</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-brand-100 hover:bg-white/10 p-1 rounded-control"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="rounded-control bg-neutral-50 p-3 border border-neutral-150 space-y-1">
                <p className="font-semibold text-neutral-800">
                  {selectedRecord.maskedName} • {selectedRecord.programmeName}
                </p>
                <p className="text-neutral-600 font-mono">{selectedRecord.institutionName}</p>
              </div>

              <div>
                <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[11px] mb-2">
                  Four-Pass Arithmetic Evaluation Ledger
                </h4>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-control border border-neutral-150 bg-neutral-50 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-800">Pass 1: Sanctioned Seat Cap Check</p>
                      <p className="text-[11px] text-neutral-600">Calculated intake ceiling: 120 seats</p>
                    </div>
                    <span
                      className={`font-semibold font-mono ${
                        selectedRecord.reconciliationStatus === "EXCESS" ? "text-state-error" : "text-state-success"
                      }`}
                    >
                      {selectedRecord.reconciliationStatus === "EXCESS" ? "FAIL (Seat #126 / 120)" : "PASS (Seat within cap)"}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-control border border-neutral-150 bg-neutral-50 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-800">Pass 2: Quota Fraction Check</p>
                      <p className="text-[11px] text-neutral-600">Category: {selectedRecord.category}</p>
                    </div>
                    <span className="font-semibold font-mono text-state-success">PASS</span>
                  </div>

                  <div className="p-2.5 rounded-control border border-neutral-150 bg-neutral-50 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-800">Pass 3: APAAR Identity Check</p>
                      <p className="text-[11px] text-neutral-600">Gateway Status: {selectedRecord.apaarStatus}</p>
                    </div>
                    <span
                      className={`font-semibold font-mono ${
                        selectedRecord.apaarStatus === "NAME_MISMATCH" ? "text-state-error" : "text-state-success"
                      }`}
                    >
                      {selectedRecord.apaarStatus === "NAME_MISMATCH" ? "DISCREPANCY" : "PASS"}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-control border border-neutral-150 bg-neutral-50 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-800">Pass 4: Multi-Enrollment Check</p>
                      <p className="text-[11px] text-neutral-600">National Cross-Registry Deduplication</p>
                    </div>
                    <span className="font-semibold font-mono text-state-success">UNIQUE</span>
                  </div>
                </div>
              </div>

              <div className="rounded-control bg-brand-50 p-3 border border-brand-100 text-brand-primary">
                <strong>Regulatory Determinism Guarantee:</strong> This outcome is derived purely by rule code. No
                AI model or heuristic estimation is permitted to overturn or compute regulatory admission entitlement.
              </div>
            </div>

            <div className="border-t border-neutral-150 bg-neutral-50 px-6 py-3 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="rounded-control bg-neutral-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
