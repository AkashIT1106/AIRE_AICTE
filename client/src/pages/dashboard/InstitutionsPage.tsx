import { useState } from "react";
import { Plus, Download, Eye, MapPin, CheckCircle, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { MOCK_INSTITUTIONS, type MockInstitution } from "@/lib/mockData";

export function InstitutionsPage() {
  const [institutions] = useState<MockInstitution[]>(MOCK_INSTITUTIONS);
  const [selectedInst, setSelectedInst] = useState<MockInstitution | null>(null);
  const [stateFilter, setStateFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filteredData = institutions.filter((inst) => {
    if (stateFilter !== "ALL" && inst.state !== stateFilter) return false;
    if (typeFilter !== "ALL" && inst.type !== typeFilter) return false;
    return true;
  });

  const columns: Column<MockInstitution>[] = [
    {
      header: "AICTE Permanent ID",
      accessor: "code",
      cell: (row) => <span className="font-mono font-semibold text-xs text-brand-primary">{row.code}</span>,
      sortable: true,
    },
    {
      header: "Institution Name",
      accessor: "name",
      cell: (row) => (
        <div>
          <p className="font-semibold text-neutral-800 text-sm">{row.name}</p>
          <p className="text-xs text-neutral-600 flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3" /> {row.district}, {row.state}
          </p>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Category & Type",
      accessor: "type",
      className: "text-neutral-600 text-xs",
      sortable: true,
    },
    {
      header: "Sanctioned Seats",
      accessor: "approvedIntake",
      cell: (row) => <span className="font-mono font-medium">{row.approvedIntake.toLocaleString()}</span>,
      sortable: true,
    },
    {
      header: "Admitted Cohort",
      accessor: "reportedAdmissions",
      cell: (row) => (
        <span
          className={`font-mono font-semibold ${
            row.reportedAdmissions > row.approvedIntake ? "text-state-error" : "text-neutral-800"
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
      header: "Regulatory Status",
      accessor: "status",
      cell: (row) => (
        <StatusBadge
          variant={row.status === "ACTIVE" ? "success" : "warning"}
          label={row.status.replace(/_/g, " ")}
        />
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row) => (
        <button
          onClick={() => setSelectedInst(row)}
          className="flex items-center gap-1 text-xs font-semibold text-brand-primary hover:bg-brand-50 px-2.5 py-1 rounded-control transition-colors"
        >
          <Eye className="h-3.5 w-3.5" /> Inspect Dossier
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institution & Campus Registry (M02)"
        description="Statutory repository of all technical education institutions, affiliated campuses, and governance metadata."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Institution Directory CSV Export queued.")}
              className="flex items-center gap-1.5 rounded-control border border-neutral-200 bg-neutral-0 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 shadow-sm"
            >
              <Download className="h-3.5 w-3.5" /> Export Directory
            </button>
            <button
              onClick={() => alert("Institution onboarding requests are submitted via AICTE Central Portal.")}
              className="flex items-center gap-1.5 rounded-control bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-900 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Onboard Institution
            </button>
          </div>
        }
      />

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-card border border-neutral-150 bg-neutral-0 p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">State:</span>
          <select
            aria-label="Filter by state"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="rounded-control border border-neutral-200 bg-neutral-0 px-2.5 py-1 text-xs text-neutral-800 font-medium outline-none cursor-pointer"
          >
            <option value="ALL">All States / UTs</option>
            <option value="Delhi">Delhi</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="West Bengal">West Bengal</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Type:</span>
          <select
            aria-label="Filter by institution type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-control border border-neutral-200 bg-neutral-0 px-2.5 py-1 text-xs text-neutral-800 font-medium outline-none cursor-pointer"
          >
            <option value="ALL">All Governance Types</option>
            <option value="State University">State University</option>
            <option value="National Institute">National Institute</option>
            <option value="State Autonomous">State Autonomous</option>
            <option value="Deemed University">Deemed University</option>
            <option value="Private Aided">Private Aided</option>
          </select>
        </div>

        {(stateFilter !== "ALL" || typeFilter !== "ALL") && (
          <button
            onClick={() => {
              setStateFilter("ALL");
              setTypeFilter("ALL");
            }}
            className="text-xs text-brand-primary font-semibold hover:underline ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm">
        <DataTable
          columns={columns}
          data={filteredData}
          searchPlaceholder="Search by institution name, code, state, or district…"
          searchFilter={(row, q) =>
            row.name.toLowerCase().includes(q.toLowerCase()) ||
            row.code.toLowerCase().includes(q.toLowerCase()) ||
            row.state.toLowerCase().includes(q.toLowerCase()) ||
            row.district.toLowerCase().includes(q.toLowerCase())
          }
        />
      </div>

      {/* Institution Dossier Modal */}
      {selectedInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-card border border-neutral-150 bg-neutral-0 shadow-2xl overflow-hidden font-sans">
            <div className="flex items-center justify-between border-b border-neutral-150 bg-brand-deep px-6 py-4 text-white">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-brand-100 opacity-75">
                  Permanent AICTE ID: {selectedInst.code}
                </p>
                <h3 className="text-lg font-bold text-white">{selectedInst.name}</h3>
              </div>
              <button
                onClick={() => setSelectedInst(null)}
                className="rounded-control p-1 text-brand-100 hover:bg-white/10 transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Statutory Highlights */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-control border border-neutral-150 bg-neutral-50 p-3">
                  <span className="text-[10px] font-semibold uppercase text-neutral-600">Category</span>
                  <p className="text-sm font-bold text-neutral-800">{selectedInst.type}</p>
                </div>
                <div className="rounded-control border border-neutral-150 bg-neutral-50 p-3">
                  <span className="text-[10px] font-semibold uppercase text-neutral-600">Sanctioned Intake</span>
                  <p className="text-sm font-bold text-brand-primary">{selectedInst.approvedIntake.toLocaleString()}</p>
                </div>
                <div className="rounded-control border border-neutral-150 bg-neutral-50 p-3">
                  <span className="text-[10px] font-semibold uppercase text-neutral-600">Reconciliation Rate</span>
                  <p className="text-sm font-bold text-state-success">{selectedInst.complianceRate}%</p>
                </div>
              </div>

              {/* Location & Jurisdiction */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                  Jurisdiction &amp; Affiliation
                </h4>
                <div className="rounded-card border border-neutral-150 p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">State / Union Territory:</span>
                    <span className="font-semibold text-neutral-800">{selectedInst.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Revenue District:</span>
                    <span className="font-semibold text-neutral-800">{selectedInst.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Statutory AICTE Regional Office:</span>
                    <span className="font-semibold text-neutral-800">
                      {selectedInst.state === "Delhi"
                        ? "North Regional Office (Kanpur)"
                        : selectedInst.state === "Maharashtra"
                        ? "Western Regional Office (Mumbai)"
                        : selectedInst.state === "Tamil Nadu"
                        ? "Southern Regional Office (Chennai)"
                        : "Regional Directorate"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Programmes Approved */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                  Programmes Under AICTE Extension of Approval (EOA)
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-control border border-neutral-150 bg-neutral-50">
                    <div>
                      <p className="font-bold text-neutral-800">B.Tech - Computer Science &amp; Engineering</p>
                      <p className="text-neutral-600 text-[11px]">Undergraduate (4 Years) • Shift I</p>
                    </div>
                    <span className="font-mono font-semibold text-neutral-800">Intake: 360</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-control border border-neutral-150 bg-neutral-50">
                    <div>
                      <p className="font-bold text-neutral-800">B.Tech - Artificial Intelligence &amp; Data Science</p>
                      <p className="text-neutral-600 text-[11px]">Undergraduate (4 Years) • Shift I</p>
                    </div>
                    <span className="font-mono font-semibold text-neutral-800">Intake: 180</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-control border border-neutral-150 bg-neutral-50">
                    <div>
                      <p className="font-bold text-neutral-800">B.Tech - Electronics &amp; Communication</p>
                      <p className="text-neutral-600 text-[11px]">Undergraduate (4 Years) • Shift I</p>
                    </div>
                    <span className="font-mono font-semibold text-neutral-800">Intake: 180</span>
                  </div>
                </div>
              </div>

              {/* Verification Stamp */}
              <div className="rounded-control border border-state-success-border bg-state-success-bg p-3 flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-state-success shrink-0 mt-0.5" />
                <p className="text-xs text-state-success leading-relaxed">
                  <strong>EOA Validated:</strong> Extension of Approval for Academic Year 2026-27 is active and
                  cryptographically signed by the AICTE Approval Bureau.
                </p>
              </div>
            </div>

            <div className="border-t border-neutral-150 bg-neutral-50 px-6 py-3 flex justify-end">
              <button
                onClick={() => setSelectedInst(null)}
                className="rounded-control bg-neutral-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-900 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
