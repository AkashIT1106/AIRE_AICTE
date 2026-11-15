import { useState } from "react";
import { CheckCircle, Eye, X, Clock, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { MOCK_EXCEPTIONS, type MockException } from "@/lib/mockData";

export function ExceptionsPage() {
  const [exceptions] = useState<MockException[]>(MOCK_EXCEPTIONS);
  const [selectedCase, setSelectedCase] = useState<MockException | null>(null);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [officerSigned, setOfficerSigned] = useState(false);

  const filteredCases = exceptions.filter((c) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "ACTIVE") return c.status !== "RESOLVED";
    if (activeTab === "RESOLVED") return c.status === "RESOLVED";
    return c.severity === activeTab;
  });

  const columns: Column<MockException>[] = [
    {
      header: "Statutory Case ID",
      accessor: "exceptionNumber",
      cell: (row) => (
        <div>
          <span className="font-mono font-bold text-xs text-brand-primary">{row.exceptionNumber}</span>
          <p className="text-[11px] text-neutral-600">Detected: {row.detectedDate}</p>
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
          <span className="text-[11px] text-neutral-600 font-mono">Code: {row.institutionCode} • {row.programmeName}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Violation Category",
      accessor: "violationCategory",
      cell: (row) => (
        <div>
          <p className="text-xs font-semibold text-neutral-800">{row.violationCategory.replace(/_/g, " ")}</p>
          <p className="text-[10px] text-neutral-600 truncate max-w-[200px]">{row.ruleReference}</p>
        </div>
      ),
      sortable: true,
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
      sortable: true,
    },
    {
      header: "Regulatory Workflow Stage",
      accessor: "status",
      cell: (row) => (
        <span className="text-xs font-mono font-medium text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
          {row.status.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Assigned Officer",
      accessor: "assignedOfficer",
      className: "text-xs text-neutral-600",
    },
    {
      header: "Action",
      accessor: "id",
      cell: (row) => (
        <button
          onClick={() => {
            setSelectedCase(row);
            setOfficerSigned(false);
          }}
          className="flex items-center gap-1 text-xs font-semibold text-brand-primary hover:bg-brand-50 px-2 py-1 rounded-control transition-colors"
        >
          <Eye className="h-3.5 w-3.5" /> Adjudicate Case
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exception & Human Review Workbench (M11)"
        description="Structured regulatory case management pipeline for admission discrepancies, show-cause issuance, institutional evidence examination, and dual-authorization sign-off."
      />

      {/* Tabs */}
      <div className="flex border-b border-neutral-200">
        {["ALL", "ACTIVE", "CRITICAL", "HIGH", "RESOLVED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-neutral-600 hover:text-neutral-800"
            }`}
          >
            {tab === "ALL" ? "All Cases" : tab === "ACTIVE" ? "Active Proceedings" : tab}
          </button>
        ))}
      </div>

      {/* Cases Table */}
      <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm">
        <DataTable
          columns={columns}
          data={filteredCases}
          searchPlaceholder="Search case ID, institution name, or assigned officer…"
          searchFilter={(row, q) =>
            row.exceptionNumber.toLowerCase().includes(q.toLowerCase()) ||
            row.institutionName.toLowerCase().includes(q.toLowerCase()) ||
            row.assignedOfficer.toLowerCase().includes(q.toLowerCase())
          }
        />
      </div>

      {/* Case Adjudication Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-card border border-neutral-150 bg-neutral-0 shadow-2xl overflow-hidden font-sans">
            <div className="border-b border-neutral-150 bg-brand-deep px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-brand-100 opacity-75">
                  Statutory Proceeding
                </span>
                <h3 className="text-base font-bold text-white">{selectedCase.exceptionNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-brand-100 hover:bg-white/10 p-1 rounded-control"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Institution Context */}
              <div className="rounded-card border border-neutral-150 bg-neutral-50 p-4 space-y-1">
                <p className="font-bold text-sm text-neutral-800">{selectedCase.institutionName}</p>
                <p className="text-neutral-600">
                  Programme: <strong>{selectedCase.programmeName}</strong> • AICTE ID: {selectedCase.institutionCode}
                </p>
                <p className="text-neutral-600">Assigned Hearing Officer: {selectedCase.assignedOfficer}</p>
              </div>

              {/* Workflow Stepper */}
              <div>
                <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[11px] mb-3">
                  Statutory Workflow Stage Sequence
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                  <div className="p-2 rounded bg-state-success-bg text-state-success border border-state-success-border">
                    1. Detection
                  </div>
                  <div className="p-2 rounded bg-state-success-bg text-state-success border border-state-success-border">
                    2. Show-Cause
                  </div>
                  <div className="p-2 rounded bg-brand-50 text-brand-primary border border-brand-100">
                    3. Evidence Exam
                  </div>
                  <div className="p-2 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
                    4. Dual Sign-off
                  </div>
                </div>
              </div>

              {/* Allegation & Rule */}
              <div>
                <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[11px] mb-2">
                  Charge &amp; Ground for Action
                </h4>
                <div className="rounded-card border border-neutral-150 p-3 space-y-2 bg-neutral-0">
                  <p className="font-semibold text-neutral-800">{selectedCase.description}</p>
                  <p className="text-neutral-600 font-mono text-[11px] bg-neutral-50 p-2 rounded">
                    Statutory Rule Reference: {selectedCase.ruleReference}
                  </p>
                  <p className="text-state-error font-medium">Affected Admissions: {selectedCase.affectedCount} students</p>
                </div>
              </div>

              {/* Dual Authorization Requirement */}
              <div className="rounded-card border border-neutral-150 bg-neutral-50 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-brand-primary" />
                  <h4 className="font-bold text-neutral-800">Dual Authorization Sign-off Control</h4>
                </div>
                <p className="text-neutral-600 leading-relaxed text-[11px]">
                  Per Section 19.3 of the AIRE Governance Manual, resolution of any intake violation requires formal
                  digital signatures from both the <strong>Regional Regulatory Officer</strong> and the <strong>Member Secretary</strong>.
                </p>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="rounded p-2.5 border bg-white space-y-1">
                    <span className="text-neutral-600 block text-[10px]">Officer 1: Regional Officer</span>
                    <span className="font-semibold text-state-success flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Signed &amp; Recommended
                    </span>
                  </div>
                  <div className="rounded p-2.5 border bg-white space-y-1">
                    <span className="text-neutral-600 block text-[10px]">Officer 2: Approval Bureau</span>
                    {officerSigned ? (
                      <span className="font-semibold text-state-success flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Counter-signed (Approved)
                      </span>
                    ) : (
                      <span className="font-semibold text-state-warning flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Awaiting Counter-signature
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-150 bg-neutral-50 px-6 py-3 flex justify-between">
              <button
                onClick={() => setSelectedCase(null)}
                className="rounded-control px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-200"
              >
                Close Dossier
              </button>

              {!officerSigned ? (
                <button
                  onClick={() => {
                    setOfficerSigned(true);
                    alert("Counter-signature recorded in immutable audit log with cryptographic timestamp.");
                  }}
                  className="rounded-control bg-brand-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-900 shadow-sm"
                >
                  Apply Digital Counter-signature
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedCase(null);
                    alert("Case closed with dual authorization.");
                  }}
                  className="rounded-control bg-state-success px-4 py-1.5 text-xs font-semibold text-white hover:bg-state-success/90 shadow-sm"
                >
                  Finalize Case Resolution
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
