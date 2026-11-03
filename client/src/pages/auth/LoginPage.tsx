import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  FileCheck2,
  AlertTriangle,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated, redirect to destination or root gateway
  const from = (location.state as any)?.from?.pathname || "/";
  if (isAuthenticated && user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(
        err.message || "Authentication failed. Please verify credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] flex flex-col lg:grid lg:grid-cols-12 text-[var(--text-primary)]">
      {/* 1. Left Context Column (Desktop only: 5/12 cols) */}
      <aside className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-[var(--brand-primary)] text-[var(--text-inverted)] p-12 flex-col justify-between select-none">
        {/* Top: Brand Identity */}
        <div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center h-10 w-10 rounded bg-[var(--brand-teal)]/20 border border-[var(--brand-teal)]/40 text-[var(--brand-teal)]">
              <ShieldCheck className="h-6 w-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[var(--text-inverted)]">
                AIRE
              </span>
              <p className="text-xs text-[var(--text-inverted)]/75">
                Admission Reconciliation &amp; Evidence Platform
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text-inverted)] leading-snug">
                Deterministic admission reconciliation &amp; verifiable audit
                trails.
              </h2>
              <p className="text-xs text-[var(--text-inverted)]/80 mt-2 leading-relaxed">
                Structured portal for higher education institutions and
                reviewers to reconcile intake quotas, resolve cohort anomalies,
                and maintain evidence integrity.
              </p>
            </div>

            {/* Workflow Pillars */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded bg-white/10 text-[var(--text-inverted)] shrink-0 mt-0.5">
                  <FileSpreadsheet className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-[var(--text-inverted)]">
                    Cohort Reporting
                  </h3>
                  <p className="text-[11px] text-[var(--text-inverted)]/70 leading-normal">
                    Structured admission batch ingestion with automated intake
                    quota verification.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded bg-white/10 text-[var(--text-inverted)] shrink-0 mt-0.5">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-[var(--text-inverted)]">
                    Discrepancy Triage
                  </h3>
                  <p className="text-[11px] text-[var(--text-inverted)]/70 leading-normal">
                    Audited remediation workflows for quota, category, and
                    eligibility variances.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded bg-white/10 text-[var(--text-inverted)] shrink-0 mt-0.5">
                  <FileCheck2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-[var(--text-inverted)]">
                    Verifiable Record Keeping
                  </h3>
                  <p className="text-[11px] text-[var(--text-inverted)]/70 leading-normal">
                    Immutable event ledger preserving data provenance and
                    decision history.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Context Details */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-[var(--text-inverted)]/70">
          <span>Academic Cycle 2026–27</span>
          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-black/20 border border-white/10">
            Institutional Access
          </span>
        </div>
      </aside>

      {/* 2. Right Sign-In Column (Mobile & Desktop: 7/12 cols) */}
      <main className="col-span-12 lg:col-span-7 xl:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-14 min-h-screen">
        {/* Mobile / Tablet Header (Hidden on Desktop) */}
        <div className="lg:hidden flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center justify-center h-8 w-8 rounded bg-[var(--brand-teal)]/20 border border-[var(--brand-teal)]/40 text-[var(--brand-teal)]">
              <ShieldCheck className="h-5 w-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-[var(--text-primary)] leading-none">
                AIRE
              </span>
              <p className="text-[11px] text-[var(--text-muted)] leading-tight">
                Admission Reconciliation Platform
              </p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-[var(--brand-primary)] bg-[var(--surface-card-subdued)] border border-[var(--border-subtle)] px-2 py-0.5 rounded">
            2026–27
          </span>
        </div>

        {/* Centered Sign-In Container */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="border border-[var(--border-default)] bg-[var(--surface-card)] rounded-lg shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                Sign in to your account
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                Enter your institutional or administrative credentials to access
                your designated workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="min-h-[44px] flex items-center">
                {errorMessage && (
                  <Alert variant="destructive" className="py-2.5 w-full">
                    <AlertDescription className="text-xs">
                      {errorMessage}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@institution.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-9 text-xs"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 h-9 text-xs"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="default"
                className="w-full h-9 gap-2 mt-2 text-xs font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-muted)]">
              <Lock className="h-3.5 w-3.5" />
              <span>
                Authorized access only. All activities are recorded for audit.
              </span>
            </div>
          </div>
        </div>

        {/* Clean Neutral Footer */}
        <footer className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[var(--text-muted)] gap-2">
          <span>
            AIRE &bull; Admission Reconciliation &amp; Evidence Platform
          </span>
          <span>Confidential Institutional System</span>
        </footer>
      </main>
    </div>
  );
};
