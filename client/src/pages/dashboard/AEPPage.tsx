import { useState } from "react";
import { Award, QrCode, ShieldCheck, Download, X, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { MOCK_ADMISSION_RECORDS, type MockAdmissionRecord } from "@/lib/mockData";

export function AEPPage() {
  const [issuedRecords] = useState<MockAdmissionRecord[]>(
    MOCK_ADMISSION_RECORDS.filter((r) => r.aepIssued),
  );
  const [selectedAep, setSelectedAep] = useState<MockAdmissionRecord | null>(issuedRecords[0] ?? null);
  const [verifyModal, setVerifyModal] = useState(false);
  const [verifyInput, setVerifyInput] = useState("");
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;
    setVerificationFeedback("✓ Cryptographic Signature VALID: Signed by AICTE Regulatory Root Authority. No revocation record found.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admission Entitlement Proof — AEP (M12)"
        description="Cryptographically signed, W3C-compliant digital credentials issued to candidates whose admissions strictly conform to sanctioned regulatory quotas."
        actions={
          <button
            onClick={() => setVerifyModal(true)}
            className="flex items-center gap-1.5 rounded-control bg-brand-primary px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-900 shadow-sm"
          >
            <QrCode className="h-3.5 w-3.5" /> Verify Credential QR
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Issued Credentials List */}
        <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm space-y-4">
          <div className="border-b border-neutral-150 pb-3">
            <h3 className="text-sm font-bold text-neutral-800">Issued AEP Credentials</h3>
            <p className="text-xs text-neutral-600">Select a verified candidate credential to preview</p>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
            {issuedRecords.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setSelectedAep(rec)}
                className={`p-3 rounded-card border text-xs cursor-pointer transition-all ${
                  selectedAep?.id === rec.id
                    ? "border-brand-primary bg-brand-50/50 shadow-sm"
                    : "border-neutral-150 bg-neutral-0 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-brand-primary">{rec.studentToken}</span>
                  <StatusBadge variant="success" label="Active AEP" />
                </div>
                <p className="font-semibold text-neutral-800">{rec.maskedName}</p>
                <p className="text-neutral-600 truncate text-[11px]">{rec.institutionName}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Digital Credential Dossier Preview */}
        {selectedAep && (
          <div className="rounded-card border-2 border-brand-primary/20 bg-neutral-0 p-8 shadow-md lg:col-span-2 space-y-6 font-sans">
            {/* Certificate Header */}
            <div className="border-b-2 border-neutral-200 pb-5 text-center space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-primary">
                <Award className="h-4 w-4" /> All India Council for Technical Education
              </div>
              <h2 className="text-xl font-bold text-neutral-800 tracking-tight">
                ADMISSION ENTITLEMENT PROOF (AEP)
              </h2>
              <p className="text-xs font-mono text-neutral-600">
                W3C Verifiable Credential • Standard Ed. 2026 • AICTE-VC-AEP-90218
              </p>
            </div>

            {/* Credential Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                    Candidate Pseudonym Token
                  </span>
                  <p className="font-mono font-bold text-sm text-neutral-800">{selectedAep.studentToken}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                    Masked Legal Identity
                  </span>
                  <p className="font-semibold text-neutral-800">{selectedAep.maskedName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                    Admitted Academic Programme
                  </span>
                  <p className="font-semibold text-neutral-800">{selectedAep.programmeName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                    Admitting Institution
                  </span>
                  <p className="font-semibold text-neutral-800">{selectedAep.institutionName}</p>
                  <p className="text-[11px] font-mono text-neutral-600">Code: {selectedAep.institutionCode}</p>
                </div>
              </div>

              {/* Dynamic QR Representation */}
              <div className="flex flex-col items-center justify-center rounded-card border border-neutral-150 bg-neutral-50 p-6 text-center space-y-3">
                <div className="h-32 w-32 rounded border border-neutral-300 bg-white p-2 shadow-inner flex items-center justify-center">
                  <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="white" />
                    <rect x="10" y="10" width="24" height="24" fill="#142C3D" />
                    <rect x="14" y="14" width="16" height="16" fill="white" />
                    <rect x="18" y="18" width="8" height="8" fill="#142C3D" />

                    <rect x="66" y="10" width="24" height="24" fill="#142C3D" />
                    <rect x="70" y="14" width="16" height="16" fill="white" />
                    <rect x="74" y="18" width="8" height="8" fill="#142C3D" />

                    <rect x="10" y="66" width="24" height="24" fill="#142C3D" />
                    <rect x="14" y="70" width="16" height="16" fill="white" />
                    <rect x="18" y="74" width="8" height="8" fill="#142C3D" />

                    <circle cx="50" cy="50" r="10" fill="#24536F" />
                    <rect x="42" y="18" width="6" height="6" fill="#142C3D" />
                    <rect x="74" y="42" width="6" height="6" fill="#142C3D" />
                    <rect x="42" y="74" width="6" height="6" fill="#142C3D" />
                    <rect x="66" y="66" width="12" height="12" fill="#142C3D" />
                  </svg>
                </div>
                <div className="text-[11px] text-neutral-600">
                  <p className="font-mono font-bold text-neutral-800">Scan to Verify Dynamic QR</p>
                  <p>Resolves to AICTE Public Verifier Gateway</p>
                </div>
              </div>
            </div>

            {/* Cryptographic Signature Box */}
            <div className="rounded-control border border-neutral-150 bg-neutral-50 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-800 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-state-success" /> Ed25519 Cryptographic Proof
                </span>
                <span className="font-mono text-[10px] text-neutral-600">Algorithm: Ed25519Signature2020</span>
              </div>
              <p className="font-mono text-[11px] text-neutral-600 break-all bg-white p-2 rounded border border-neutral-200">
                z5A6gY8FqY3...7x89qWmKaL298dcB10aBcD37281f62e847c2a1104e
              </p>
            </div>

            {/* Print & Download Button */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-control border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
              >
                <FileText className="h-3.5 w-3.5" /> Print Credential
              </button>
              <button
                onClick={() => alert(`AEP verifiable credential JSON downloaded for ${selectedAep.studentToken}`)}
                className="flex items-center gap-1.5 rounded-control bg-brand-primary px-4 py-2 text-xs font-semibold text-white hover:bg-brand-900"
              >
                <Download className="h-3.5 w-3.5" /> Download JSON-LD Dossier
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {verifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-card border border-neutral-150 bg-neutral-0 p-6 space-y-4 font-sans shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-800">Public AEP Credential Verifier</h3>
              <button onClick={() => setVerifyModal(false)} className="text-neutral-600 hover:text-neutral-800">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleVerify} className="space-y-3">
              <label className="text-xs font-semibold text-neutral-800 block">
                Enter AEP Credential Hash or Payload
              </label>
              <textarea
                value={verifyInput}
                onChange={(e) => setVerifyInput(e.target.value)}
                placeholder="Paste verifiable credential JSON or token hash…"
                rows={3}
                className="w-full rounded-control border border-neutral-200 p-2.5 text-xs font-mono outline-none focus:border-brand-primary"
              />
              <button
                type="submit"
                className="w-full rounded-control bg-brand-primary py-2 text-xs font-semibold text-white hover:bg-brand-900"
              >
                Execute Cryptographic Verification
              </button>
            </form>

            {verificationFeedback && (
              <div className="rounded-control bg-state-success-bg border border-state-success-border p-3 text-xs text-state-success">
                {verificationFeedback}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
