import React, { useState } from "react";
import { GraduationCap, Search, ShieldCheck } from "lucide-react";
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
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="pb-2 border-b border-[var(--border-default)]">
        <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)] uppercase tracking-wider">
          <GraduationCap className="h-4 w-4 text-[var(--brand-teal)]" />
          <span>Student Portal &bull; Admission Entitlement</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
          Admission Entitlement Verification
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          Verify technical admission approval order status and download
          Admission Entitlement Proof (AEP).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verify Entitlement by APAAR / Roll Number</CardTitle>
          <CardDescription>
            Enter your APAAR (One Nation One Student ID) or Institution Roll
            Number.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="id-input" className="text-xs font-medium">
                Student Identifier
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                  <Input
                    id="id-input"
                    type="text"
                    placeholder="e.g. 9821-4412-1042 or 2026-CSE-001"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>
                <Button type="submit" size="sm" className="h-9 gap-1.5">
                  <Search className="h-3.5 w-3.5" />
                  <span>Verify Status</span>
                </Button>
              </div>
            </div>
          </form>

          {searched && (
            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] space-y-4">
              <Alert variant="info">
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle className="font-semibold">
                  Admission Entitlement Verification
                </AlertTitle>
                <AlertDescription className="text-xs">
                  Centralized verification is active for enrolled candidates in
                  approved batches. If your record is not yet validated, consult
                  your institution registrar before the regulatory freeze
                  deadline.
                </AlertDescription>
              </Alert>

              <div className="p-4 rounded border border-[var(--border-default)] bg-[var(--surface-card-subdued)] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">
                    Queried Identifier:
                  </span>
                  <span className="font-mono font-semibold text-[var(--text-primary)]">
                    {identifier}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">
                    Verification Gate:
                  </span>
                  <span className="text-[var(--brand-teal)] font-medium">
                    AICTE Regulatory Registry Active
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
