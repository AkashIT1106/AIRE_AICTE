import { useState } from "react";
import { Upload, FileUp, CheckCircle, Lock, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";

interface SubmissionBatch {
  id: string;
  batchNumber: string;
  programmeName: string;
  academicYear: string;
  totalRecords: number;
  validRecords: number;
  quarantinedRecords: number;
  submittedAt: string;
  status: "DRAFT" | "PROCESSING" | "QUARANTINED" | "SEALED" | "LOCKED";
  checksum: string;
}

const MOCK_BATCHES: SubmissionBatch[] = [
  {
    id: "bat-001",
    batchNumber: "BAT-2026-DTU-CSE-01",
    programmeName: "Computer Science & Engineering",
    academicYear: "2026-2027",
    totalRecords: 360,
    validRecords: 360,
    quarantinedRecords: 0,
    submittedAt: "2026-08-10 16:30 IST",
    status: "SEALED",
    checksum: "sha256:8a129fbc8890...",
  },
  {
    id: "bat-002",
    batchNumber: "BAT-2026-DTU-AI-01",
    programmeName: "Artificial Intelligence & Data Science",
    academicYear: "2026-2027",
    totalRecords: 180,
    validRecords: 178,
    quarantinedRecords: 2,
    submittedAt: "2026-08-12 11:15 IST",
    status: "QUARANTINED",
    checksum: "sha256:99cfa10023ee...",
  },
  {
    id: "bat-003",
    batchNumber: "BAT-2026-COEP-ENTC-01",
    programmeName: "Electronics & Telecommunication",
    academicYear: "2026-2027",
    totalRecords: 180,
    validRecords: 180,
    quarantinedRecords: 0,
    submittedAt: "2026-08-14 14:00 IST",
    status: "LOCKED",
    checksum: "sha256:119ea900bfda...",
  },
];

export function SubmissionsPage() {
  const [batches, setBatches] = useState<SubmissionBatch[]>(MOCK_BATCHES);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedProg, setSelectedProg] = useState("Computer Science & Engineering");
  const [fileUploaded, setFileUploaded] = useState(false);

  const columns: Column<SubmissionBatch>[] = [
    {
      header: "Batch Identification",
      accessor: "batchNumber",
      cell: (row) => (
        <div>
          <span className="font-mono font-bold text-xs text-brand-primary">{row.batchNumber}</span>
          <p className="text-[11px] text-neutral-600">{row.submittedAt}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Programme & Session",
      accessor: "programmeName",
      cell: (row) => (
        <div>
          <p className="font-semibold text-neutral-800 text-xs">{row.programmeName}</p>
          <span className="text-[11px] text-neutral-600 font-mono">AY {row.academicYear}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Ingestion Volume",
      accessor: "totalRecords",
      cell: (row) => (
        <span className="font-mono font-medium text-xs">
          {row.totalRecords} records
        </span>
      ),
      sortable: true,
    },
    {
      header: "Data Quality Triage",
      accessor: "validRecords",
      cell: (row) => (
        <div className="text-xs">
          <span className="text-state-success font-medium font-mono">{row.validRecords} Valid</span>
          {row.quarantinedRecords > 0 && (
            <span className="ml-2 text-state-error font-medium font-mono">
              ({row.quarantinedRecords} Quarantined)
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Lifecycle Stage",
      accessor: "status",
      cell: (row) => (
        <StatusBadge
          variant={
            row.status === "LOCKED" || row.status === "SEALED"
              ? "success"
              : row.status === "QUARANTINED"
              ? "error"
              : "pending"
          }
          label={row.status}
        />
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.status === "QUARANTINED" && (
            <button
              onClick={() => alert(`Reviewing quarantine records for ${row.batchNumber}`)}
              className="text-xs font-semibold text-state-error hover:underline"
            >
              Remediate
            </button>
          )}
          {row.status === "SEALED" && (
            <span className="text-xs font-semibold text-neutral-600 flex items-center gap-1">
              <Lock className="h-3 w-3" /> Sealed
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admission Batch Submissions (M05 / M06)"
        description="Structured statutory admission data ingestion pipeline with automated data quality triage, schema validation, and cryptographically sealed batch finalization."
        actions={
          <button
            onClick={() => {
              setWizardStep(1);
              setFileUploaded(false);
              setShowWizard(true);
            }}
            className="flex items-center gap-1.5 rounded-control bg-brand-primary px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-900 shadow-sm"
          >
            <Upload className="h-3.5 w-3.5" /> Start New Submission
          </button>
        }
      />

      {/* Batches Table */}
      <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm">
        <DataTable
          columns={columns}
          data={batches}
          searchPlaceholder="Search by batch number or programme…"
          searchFilter={(row, q) =>
            row.batchNumber.toLowerCase().includes(q.toLowerCase()) ||
            row.programmeName.toLowerCase().includes(q.toLowerCase())
          }
        />
      </div>

      {/* Guided 4-Step Submission Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-card border border-neutral-150 bg-neutral-0 shadow-2xl overflow-hidden font-sans">
            <div className="border-b border-neutral-150 bg-brand-deep px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-100">
                  Step {wizardStep} of 3
                </span>
                <h3 className="text-base font-bold text-white">Institutional Admission Ingestion Wizard</h3>
              </div>
              <button
                onClick={() => setShowWizard(false)}
                className="text-brand-100 hover:bg-white/10 p-1 rounded-control"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-neutral-800">1. Select Target Academic Programme &amp; Session</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="font-semibold text-neutral-800 block mb-1">Academic Session</label>
                      <select className="w-full rounded-control border border-neutral-200 p-2 bg-neutral-0 font-medium">
                        <option>Academic Year 2026-2027</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-neutral-800 block mb-1">Approved Programme</label>
                      <select
                        value={selectedProg}
                        onChange={(e) => setSelectedProg(e.target.value)}
                        className="w-full rounded-control border border-neutral-200 p-2 bg-neutral-0 font-medium"
                      >
                        <option>Computer Science &amp; Engineering (Sanctioned Intake: 360)</option>
                        <option>Artificial Intelligence &amp; Data Science (Sanctioned Intake: 180)</option>
                        <option>Electronics &amp; Communication (Sanctioned Intake: 180)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-neutral-800">2. Upload Admission Dataset File</h4>
                  <div className="rounded-card border-2 border-dashed border-neutral-200 bg-neutral-50 p-8 text-center space-y-3">
                    <FileUp className="h-8 w-8 text-brand-primary mx-auto" />
                    <div>
                      <p className="font-semibold text-neutral-800">Drag &amp; drop institutional admission file</p>
                      <p className="text-neutral-600 text-[11px]">Supports standardized AICTE CSV / XLSX schema format</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFileUploaded(true)}
                      className="px-3 py-1.5 rounded-control bg-neutral-0 border border-neutral-200 font-semibold text-neutral-800 hover:bg-neutral-100"
                    >
                      {fileUploaded ? "✓ admission_batch_2026.csv selected (360 rows)" : "Browse File"}
                    </button>
                  </div>
                  {fileUploaded && (
                    <div className="rounded-control bg-state-success-bg border border-state-success-border p-3 text-state-success flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Schema pre-flight check passed: 360 records detected with valid headers.</span>
                    </div>
                  )}
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-neutral-800">3. Verification &amp; Cryptographic Sealing</h4>
                  <div className="rounded-card border border-neutral-150 p-4 space-y-2 bg-neutral-50">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Selected Programme:</span>
                      <span className="font-semibold text-neutral-800">{selectedProg}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Total Admission Records:</span>
                      <span className="font-mono font-semibold text-neutral-800">360</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Sanctioned Ceiling Check:</span>
                      <span className="font-semibold text-state-success">Within Cap (0 Excess)</span>
                    </div>
                  </div>
                  <div className="rounded-control bg-state-warning-bg border border-state-warning-border p-3 text-state-warning leading-relaxed">
                    <strong>Statutory Sealing Notice:</strong> Once sealed, this admission dataset cannot be edited without
                    formal institutional show-cause justification under AICTE Approval Process regulations.
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-neutral-150 bg-neutral-50 px-6 py-3 flex justify-between">
              {wizardStep > 1 ? (
                <button
                  onClick={() => setWizardStep((s) => s - 1)}
                  className="px-3 py-1.5 rounded-control text-xs font-semibold text-neutral-600 hover:bg-neutral-200"
                >
                  Previous
                </button>
              ) : <div />}

              {wizardStep < 3 ? (
                <button
                  disabled={wizardStep === 2 && !fileUploaded}
                  onClick={() => setWizardStep((s) => s + 1)}
                  className="px-4 py-1.5 rounded-control text-xs font-semibold text-white bg-brand-primary hover:bg-brand-900 disabled:opacity-50"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={() => {
                    const newBatch: SubmissionBatch = {
                      id: `bat-00${batches.length + 1}`,
                      batchNumber: `BAT-2026-DTU-NEW-${batches.length + 1}`,
                      programmeName: selectedProg.split("(")[0].trim(),
                      academicYear: "2026-2027",
                      totalRecords: 360,
                      validRecords: 360,
                      quarantinedRecords: 0,
                      submittedAt: "Just now",
                      status: "SEALED",
                      checksum: "sha256:4f810199eab2...",
                    };
                    setBatches([newBatch, ...batches]);
                    setShowWizard(false);
                    alert("Batch submitted and cryptographically sealed successfully!");
                  }}
                  className="px-4 py-1.5 rounded-control text-xs font-semibold text-white bg-state-success hover:bg-state-success/90"
                >
                  Confirm &amp; Seal Batch
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
