import React from "react";
import {
  CheckCircle2,
  FileDown,
  Printer,
  Lock,
  Award,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { RecordVerificationData, MOCK_RECORD_VERIFICATION } from "./mockData";

export interface RecordVerificationSummaryProps {
  verificationData?: RecordVerificationData;
  onPrint?: () => void;
  onDownload?: () => void;
  className?: string;
}

export const RecordVerificationSummary: React.FC<
  RecordVerificationSummaryProps
> = ({
  verificationData = MOCK_RECORD_VERIFICATION,
  onPrint,
  onDownload,
  className,
}) => {
  const {
    studentName = "Aarav Sharma",
    rollNumber = "2026-CSE-101",
    apaarIdMasked = "••••-••••-1042",
    institutionName = "Delhi Institute of Technology",
    institutionCode = "INST-101",
    programme = "B.Tech Computer Science and Engineering",
    quotaCategory = "General / All India Quota • GEN",
    orderNumber = "AICTE/AEP/2026/DL-109281",
    verifiedAt = "2026-11-03 11:20:00 IST",
    digitalSignatureDigest = "0x98f24a10cbe782168ea4017290bcda114e9f71c",
    merkleRootHash = "0x4a7d65b2f8a910e14c3298a0d71ef4bc9c2e11894d01b87a24c5e391b072fa61",
    status = "AUTHENTICATED",
  } = verificationData;

  const isAuthenticated = status === "AUTHENTICATED";
  const isInvalid = status === "INVALID";

  const handleDefaultPrint = () => {
    if (onPrint) {
      onPrint();
      return;
    }
    window.print();
  };

  const handleDefaultDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    // Simple download proof trigger
    const proofText = `AICTE ADMISSION ENTITLEMENT PROOF (AEP)\nStudent: ${studentName}\nRoll: ${rollNumber}\nAPAAR: ${apaarIdMasked}\nInstitution: ${institutionName} (${institutionCode})\nProgramme: ${programme}\nQuota: ${quotaCategory}\nOrder: ${orderNumber}\nVerified: ${verifiedAt}\nSignature: ${digitalSignatureDigest}\nMerkle: ${merkleRootHash}\n`;
    const blob = new Blob([proofText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AEP_${rollNumber}_Verification.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card
      className={cn(
        "w-full border-line-default shadow-sm overflow-hidden bg-gradient-to-b from-surface-card to-surface-card-subdued/40 relative",
        className,
      )}
      data-testid="record-verification-summary"
    >
      {/* Statutory Tricolor / AICTE Header Accent Ribbon */}
      <div className="h-2 bg-gradient-to-r from-brand-primary via-brand-teal to-brand-primary" />

      <CardHeader className="border-b border-line-subtle bg-surface-card pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-brand-primary bg-brand-subtle px-2.5 py-0.5 rounded border border-brand-teal/20 inline-block">
              OFFICIAL ADMISSION ENTITLEMENT PROOF (AEP)
            </span>
            <CardTitle className="text-xl font-bold text-txt-primary flex items-center gap-2 mt-1">
              <Award
                className="h-5 w-5 text-brand-primary"
                aria-hidden="true"
              />
              <span>Technical Education Concordance Certificate</span>
            </CardTitle>
            <CardDescription className="text-xs text-txt-secondary">
              Issued under authority of All India Council for Technical
              Education (AICTE Act 1987).
            </CardDescription>
          </div>

          <Badge
            variant={
              isAuthenticated ? "success" : isInvalid ? "danger" : "warning"
            }
            className="gap-1.5 text-xs font-semibold py-1 px-3 self-start sm:self-auto"
          >
            {isAuthenticated ? (
              <CheckCircle2
                className="h-4 w-4 text-state-success-icon"
                aria-hidden="true"
              />
            ) : isInvalid ? (
              <XCircle
                className="h-4 w-4 text-state-danger-icon"
                aria-hidden="true"
              />
            ) : (
              <AlertTriangle
                className="h-4 w-4 text-state-warning-icon"
                aria-hidden="true"
              />
            )}
            <span>
              {status === "AUTHENTICATED" ? "CONCORDED & VALIDATED" : status}
            </span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Verification Credentials Grid & QR Code Container */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-surface-card p-5 rounded-xl border border-line-subtle shadow-2xs">
          {/* Left Grid: Student & Admitting Institution Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 text-xs w-full">
            <div className="space-y-1">
              <span className="text-txt-muted font-medium text-[11px] uppercase tracking-wider block">
                Candidate Name
              </span>
              <div className="font-bold text-txt-primary text-base">
                {studentName}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-txt-muted font-medium text-[11px] uppercase tracking-wider block">
                APAAR (Masked) / Roll Number
              </span>
              <div className="font-mono font-bold text-txt-primary text-sm">
                {apaarIdMasked} &bull; {rollNumber}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-txt-muted font-medium text-[11px] uppercase tracking-wider block">
                AICTE Approved Institution
              </span>
              <div className="font-semibold text-txt-primary">
                {institutionName} ({institutionCode})
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-txt-muted font-medium text-[11px] uppercase tracking-wider block">
                Programme &amp; Course
              </span>
              <div className="font-semibold text-txt-primary">{programme}</div>
            </div>

            <div className="space-y-1">
              <span className="text-txt-muted font-medium text-[11px] uppercase tracking-wider block">
                Reservation Quota &amp; Category
              </span>
              <div className="font-medium text-brand-primary">
                {quotaCategory}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-txt-muted font-medium text-[11px] uppercase tracking-wider block">
                Approval Order Number
              </span>
              <div className="font-mono font-semibold text-txt-secondary text-xs">
                {orderNumber}
              </div>
            </div>
          </div>

          {/* Right: Cryptographic QR Code Graphic Placeholder */}
          <div className="shrink-0 flex flex-col items-center justify-center p-4 bg-surface-card-subdued rounded-lg border border-line-subtle w-44 text-center">
            {/* Visual SVG QR Representation */}
            <div
              role="img"
              className="w-28 h-28 bg-surface-card p-2 rounded border border-line-default shadow-2xs flex items-center justify-center"
              aria-label={`Verification QR Code for order ${orderNumber}`}
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-txt-primary fill-current"
                aria-hidden="true"
              >
                {/* 3 Position Detection Patterns */}
                <rect x="5" y="5" width="26" height="26" fill="currentColor" />
                <rect x="8" y="8" width="20" height="20" fill="white" />
                <rect
                  x="12"
                  y="12"
                  width="12"
                  height="12"
                  fill="currentColor"
                />

                <rect x="69" y="5" width="26" height="26" fill="currentColor" />
                <rect x="72" y="8" width="20" height="20" fill="white" />
                <rect
                  x="76"
                  y="12"
                  width="12"
                  height="12"
                  fill="currentColor"
                />

                <rect x="5" y="69" width="26" height="26" fill="currentColor" />
                <rect x="8" y="72" width="20" height="20" fill="white" />
                <rect
                  x="12"
                  y="76"
                  width="12"
                  height="12"
                  fill="currentColor"
                />

                {/* Simulated Data Matrix Pixels */}
                <rect x="36" y="10" width="8" height="8" fill="currentColor" />
                <rect x="48" y="10" width="8" height="8" fill="currentColor" />
                <rect x="36" y="24" width="8" height="8" fill="currentColor" />
                <rect x="48" y="24" width="16" height="8" fill="currentColor" />

                <rect x="10" y="38" width="16" height="8" fill="currentColor" />
                <rect x="30" y="38" width="8" height="8" fill="currentColor" />
                <rect x="42" y="38" width="16" height="8" fill="currentColor" />
                <rect x="62" y="38" width="8" height="8" fill="currentColor" />
                <rect x="74" y="38" width="16" height="8" fill="currentColor" />

                <rect x="10" y="50" width="8" height="14" fill="currentColor" />
                <rect x="22" y="50" width="16" height="8" fill="currentColor" />
                <rect x="42" y="50" width="8" height="14" fill="currentColor" />
                <rect x="54" y="50" width="28" height="8" fill="currentColor" />
                <rect x="66" y="62" width="16" height="8" fill="currentColor" />

                <rect x="36" y="70" width="16" height="8" fill="currentColor" />
                <rect x="56" y="70" width="8" height="16" fill="currentColor" />
                <rect x="68" y="70" width="22" height="8" fill="currentColor" />
                <rect x="36" y="82" width="8" height="14" fill="currentColor" />
                <rect x="48" y="82" width="16" height="8" fill="currentColor" />
                <rect
                  x="78"
                  y="82"
                  width="12"
                  height="14"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-[10px] font-mono text-txt-muted mt-2 font-medium">
              Scan for AIRE Verification
            </span>
          </div>
        </div>

        {/* Cryptographic Signature & Merkle Proof Container */}
        <div className="p-3.5 rounded-lg border border-line-subtle bg-surface-card space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line-subtle/60 pb-2">
            <span className="text-[11px] font-semibold text-txt-primary flex items-center gap-1.5">
              <Lock
                className="h-3.5 w-3.5 text-brand-teal"
                aria-hidden="true"
              />
              <span>Digital Signature &amp; Cryptographic Proof</span>
            </span>
            <span className="text-[11px] text-txt-muted font-tabular">
              Verified At: {verifiedAt}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
            <div>
              <span className="text-txt-muted block text-[10px] uppercase">
                SHA-256 Digest
              </span>
              <span className="text-txt-primary truncate block select-all font-semibold">
                {digitalSignatureDigest}
              </span>
            </div>

            <div>
              <span className="text-txt-muted block text-[10px] uppercase">
                Merkle Root Hash
              </span>
              <span className="text-brand-primary truncate block select-all font-semibold">
                {merkleRootHash}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-line-subtle bg-surface-card-subdued px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-txt-muted">
          Legally valid admission proof under Information Technology Act 2000.
        </span>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDefaultDownload}
            className="text-xs h-8 border-line-default gap-1.5"
          >
            <FileDown
              className="h-3.5 w-3.5 text-brand-primary"
              aria-hidden="true"
            />
            <span>Download Proof PDF</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDefaultPrint}
            className="text-xs h-8 border-line-default gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Print</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

RecordVerificationSummary.displayName = "RecordVerificationSummary";
