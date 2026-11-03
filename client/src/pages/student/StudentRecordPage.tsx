import React, { useState } from "react";
import {
  GraduationCap,
  Search,
  ShieldCheck,
  CheckCircle2,
  FileDown,
  Printer,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export const StudentRecordPage: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim()) {
      setSearched(true);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center space-x-2 text-xs text-slate-500 uppercase tracking-wider mb-1.5 font-semibold">
          <GraduationCap className="h-4 w-4 text-[#245B75]" />
          <span>Student Portal &bull; Admission Entitlement</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Admission Entitlement Verification
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Verify technical admission approval order status and download
          Admission Entitlement Proof (AEP).
        </p>
      </div>

      {/* 2. Search Console */}
      <Card className="bg-white border border-slate-200 shadow-xs rounded-xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-bold text-slate-900">
            Verify Entitlement by APAAR / Roll Number
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Enter your APAAR (One Nation One Student ID) or Institution Roll
            Number.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="id-input"
                className="text-xs font-semibold text-slate-800"
              >
                Student Identifier
              </Label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 sm:top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="id-input"
                    type="text"
                    placeholder="e.g. 9821-4412-1042 or 2026-CSE-001"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-9 h-10 sm:h-9 text-xs border-slate-200 font-mono"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="h-10 sm:h-9 px-5 gap-1.5 bg-[#245B75] hover:bg-[#1C4666] text-white font-semibold text-xs shrink-0 shadow-2xs"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Verify Status</span>
                </Button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: Search with{" "}
                <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">
                  9821-4412-1042
                </code>{" "}
                or{" "}
                <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">
                  2026-CSE-001
                </code>{" "}
                to view verified record.
              </p>
            </div>
          </form>

          {searched && (
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-5">
              <Alert
                variant="info"
                className="border-sky-200 bg-sky-50 text-sky-950 shadow-2xs"
              >
                <ShieldCheck className="h-4 w-4 text-sky-700" />
                <AlertTitle className="font-semibold text-xs text-sky-900">
                  Admission Entitlement Verification
                </AlertTitle>
                <AlertDescription className="text-xs text-sky-800 mt-0.5 leading-relaxed">
                  Centralized verification is active for enrolled candidates in
                  approved batches. If your record is not yet validated, consult
                  your institution registrar before the regulatory freeze
                  deadline.
                </AlertDescription>
              </Alert>

              {/* Digital Certificate / Official Credential Card */}
              <div className="border border-slate-200 rounded-xl bg-gradient-to-b from-white to-slate-50/50 p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#245B75] via-emerald-500 to-[#245B75]" />

                {/* Certificate Masthead */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#245B75] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      OFFICIAL ADMISSION ENTITLEMENT PROOF (AEP)
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1.5">
                      Technical Education Concordance Certificate
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Issued under authority of All India Council for Technical
                      Education (AICTE Act 1987)
                    </p>
                  </div>
                  <Badge
                    variant="success"
                    size="default"
                    className="gap-1 font-semibold text-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Concorded &amp; Validated</span>
                  </Badge>
                </div>

                {/* Credential Data Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">
                      Candidate Name
                    </span>
                    <div className="font-bold text-slate-900 text-sm">
                      Aarav Sharma
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">
                      Queried Identifier:
                    </span>
                    <div className="font-mono font-bold text-slate-900 text-sm">
                      {identifier}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">
                      AICTE Approved Institution
                    </span>
                    <div className="font-semibold text-slate-900">
                      Delhi Institute of Technology (INST-101)
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">
                      Programme &amp; Branch
                    </span>
                    <div className="font-semibold text-slate-900">
                      B.Tech Computer Science and Engineering
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">
                      Reservation Quota / Category
                    </span>
                    <div className="font-medium text-slate-800">
                      General / All India Quota &bull; GEN
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">
                      Verification Gate:
                    </span>
                    <div className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>AICTE Regulatory Registry Active</span>
                    </div>
                  </div>
                </div>

                {/* Cryptographic Proof Footer */}
                <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-3">
                  <div className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-mono text-[10px] text-slate-600 truncate max-w-xs">
                      Digest: 0x98f24a10cbe7821...a71c (SHA-256)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert("Downloading digital AEP certificate...")
                      }
                      className="h-8 text-xs gap-1.5 border-slate-200"
                    >
                      <FileDown className="h-3.5 w-3.5 text-[#245B75]" />
                      <span>Download Proof PDF</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      className="h-8 text-xs gap-1.5 border-slate-200"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
