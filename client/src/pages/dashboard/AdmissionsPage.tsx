import { useState } from "react";
import { Download, History, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { MOCK_ADMISSION_RECORDS, type MockAdmissionRecord } from "@/lib/mockData";

export function AdmissionsPage() {
  const [admissions] = useState<MockAdmissionRecord[]>(MOCK_ADMISSION_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<MockAdmissionRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredAdmissions = admissions.filter((rec) => {
    if (statusFilter !== "ALL" && rec.reconciliationStatus !== statusFilter) return false;
    return true;
  });

  const columns: Column<MockAdmissionRecord>[] = [
    {
      header: "Student Token (Pseudonymous)",
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
      header: "Allocated Quota",
      accessor: "category",
      cell: (row) => (
        <div>
          <span className="font-mono font-semibold text-xs text-neutral-800 bg-neutral-100 px-1.5 py-0.5 rounded">
            {row.category}
          </span>
          <p className="text-[10px] text-neutral-600 truncate max-w-[150px]">{row.quotaAllocated}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: "APAAR Gateway Status",
      accessor: "apaarStatus",
      cell: (row) => (
        <div>
          <StatusBadge
            variant={
              row.apaarStatus === "MATCH_CONFIRMED" || row.apaarStatus === "VERIFIED"
                ? "success"
                : row.apaarStatus === "NAME_MISMATCH"
                ? "error"
                : "pending"
            }
            label={row.apaarStatus.replace(/_/g, " ")}
          />
          <p className="text-[10px] font-mono text-neutral-600 mt-0.5">{row.maskedApaarId}</p>
        </div>
      ),
    },
    {
      header: "Reconciliation Outcome",
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
      header: "AEP Credential",
      accessor: "aepIssued",
      cell: (row) => (
        <span
          className={`text-xs font-semibold ${
            row.aepIssued ? "text-state-success flex items-center gap-1" : "text-neutral-600"
          }`}
        >
          {row.aepIssued ? "✓ Issued" : "Pending"}
        </span>
      ),
    },
    {
      header: "Lifecycle",
      accessor: "id",
      cell: (row) => (
        <button
          onClick={() => setSelectedRecord(row)}
          className="flex items-center gap-1 text-xs font-semibold text-brand-primary hover:bg-brand-50 px-2 py-1 rounded-control transition-colors"
        >
          <History className="h-3.5 w-3.5" /> Timeline
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admission Lifecycle Ledger (M08)"
        description="Immutable, append-only student admission record repository with pseudonymized identifiers, APAAR gateway status, and regulatory chronology."
        actions={
          <button
            onClick={() => alert("Admission Ledger export initiated.")}
            className="flex items-center gap-1.5 rounded-control border border-neutral-200 bg-neutral-0 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 shadow-sm"
          >
            <Download className="h-3.5 w-3.5" /> Export Ledger
          </button>
        }
      />

      {/* Filter Strip */}
      <div className="flex items-center gap-3 rounded-card border border-neutral-150 bg-neutral-0 p-4 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
          Reconciliation Filter:
        </span>
        <select
          aria-label="Filter by Reconciliation Outcome"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-control border border-neutral-200 bg-neutral-0 px-3 py-1.5 text-xs text-neutral-800 font-medium outline-none cursor-pointer"
        >
          <option value="ALL">All Outcomes</option>
          <option value="MATCHED">Exact Matched</option>
          <option value="EXCESS">Excess Intake</option>
          <option value="MISMATCHED">Identity Mismatch</option>
          <option value="UNVERIFIED">Pending Verification</option>
        </select>
        <span className="text-xs text-neutral-600 ml-auto font-mono">
          Showing {filteredAdmissions.length} records
        </span>
      </div>

      {/* Main Table */}
      <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm">
        <DataTable
          columns={columns}
          data={filteredAdmissions}
          searchPlaceholder="Search by token, masked name, institution, or APAAR ID…"
          searchFilter={(row, q) =>
            row.studentToken.toLowerCase().includes(q.toLowerCase()) ||
            row.maskedName.toLowerCase().includes(q.toLowerCase()) ||
            row.institutionName.toLowerCase().includes(q.toLowerCase()) ||
            row.maskedApaarId.toLowerCase().includes(q.toLowerCase())
          }
        />
      </div>

      {/* Student Lifecycle Chronology Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-card border border-neutral-150 bg-neutral-0 shadow-2xl overflow-hidden font-sans">
            <div className="border-b border-neutral-150 bg-brand-deep px-6 py-4 text-white flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase text-brand-100 opacity-75">
                  Append-Only Lifecycle Ledger
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

            <div className="p-6 space-y-5 text-xs">
              <div className="rounded-control bg-neutral-50 p-3 border border-neutral-150 space-y-1">
                <p className="font-semibold text-neutral-800">
                  {selectedRecord.maskedName} • {selectedRecord.programmeName}
                </p>
                <p className="text-neutral-600 font-mono">
                  {selectedRecord.institutionName} (AY {selectedRecord.academicYear})
                </p>
              </div>

              {/* Chronological Timeline */}
              <div>
                <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[11px] mb-3">
                  Chronological Event Sequence
                </h4>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                  <div className="relative">
                    <div className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full bg-brand-primary ring-4 ring-white" />
                    <p className="font-bold text-neutral-800">1. Institutional Admission Reported</p>
                    <p className="text-neutral-600 font-mono text-[10px]">
                      {selectedRecord.admissionDate} 10:14:02 IST • Actor: Registrar Office
                    </p>
                    <p className="text-neutral-600 mt-0.5">Reported under category: {selectedRecord.category}</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full bg-teal-800 ring-4 ring-white" />
                    <p className="font-bold text-neutral-800">2. Identity Gateway Verification (APAAR)</p>
                    <p className="text-neutral-600 font-mono text-[10px]">
                      {selectedRecord.admissionDate} 10:15:40 IST • Gateway: M07 Adapter
                    </p>
                    <p className="text-neutral-600 mt-0.5">
                      Status: <strong>{selectedRecord.apaarStatus}</strong> (APAAR: {selectedRecord.maskedApaarId})
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full bg-state-success ring-4 ring-white" />
                    <p className="font-bold text-neutral-800">3. Regulatory Reconciliation Execution</p>
                    <p className="text-neutral-600 font-mono text-[10px]">
                      {selectedRecord.admissionDate} 14:30:00 IST • Engine: M10 Deterministic
                    </p>
                    <p className="text-neutral-600 mt-0.5">
                      Outcome: <strong>{selectedRecord.reconciliationStatus}</strong> within EOA quota ceiling.
                    </p>
                  </div>

                  {selectedRecord.aepIssued && (
                    <div className="relative">
                      <div className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full bg-brass-800 ring-4 ring-white" />
                      <p className="font-bold text-neutral-800">4. Admission Entitlement Proof (AEP) Issued</p>
                      <p className="text-neutral-600 font-mono text-[10px]">
                        {selectedRecord.admissionDate} 14:31:12 IST • W3C Verifiable Credential
                      </p>
                      <p className="text-neutral-600 mt-0.5">Cryptographic signature generated with QR validation.</p>
                    </div>
                  )}
                </div>
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
