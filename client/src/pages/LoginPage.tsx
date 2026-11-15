/**
 * LoginPage — AIRE Portal Sign In
 *
 * Professional government login page. Left navy panel (desktop 40%) with
 * AIRE branding, right white panel (60%) with sign-in form.
 * Uses react-hook-form + zod. Calls auth store signIn(), then navigates to /dashboard.
 *
 * Better Auth is at /api/auth/* and AIRE custom wrapper is at /api/v1/auth/sign-in.
 * The auth store uses /api/v1/auth/sign-in (the AIRE audited endpoint).
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, Lock, FileCheck } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { AireAlert } from "@/components/aire/AireAlert";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Trust indicator data
// ---------------------------------------------------------------------------

const TRUST_INDICATORS = [
  {
    icon: Shield,
    label: "Secure",
    desc: "256-bit TLS encryption on all connections",
  },
  {
    icon: Lock,
    label: "Encrypted",
    desc: "Data encrypted at rest using AES-256",
  },
  {
    icon: FileCheck,
    label: "Audited",
    desc: "Full audit trail for every access and action",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, loginAsDemo } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotToast, setForgotToast] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage(null);
    try {
      await signIn(values.email, values.password);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        const msg = err.message.toLowerCase();
        if (
          msg.includes("500") ||
          msg.includes("offline") ||
          msg.includes("server_unavailable") ||
          msg.includes("database_offline") ||
          msg.includes("parse response") ||
          msg.includes("unavailable")
        ) {
          setErrorMessage(
            "Backend database service (PostgreSQL) is currently offline. Click 'Enter AICTE Regulatory Console (Demo Session)' below for instant access."
          );
        } else if (msg.includes("401") || msg.includes("invalid") || msg.includes("unauthorized")) {
          setErrorMessage("Invalid credentials. Please try again.");
        } else {
          setErrorMessage(err.message || "An unexpected error occurred.");
        }
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  const handleForgotPassword = () => {
    setForgotToast(true);
    setTimeout(() => setForgotToast(false), 4000);
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* ------------------------------------------------------------------ */}
      {/* Left panel — AIRE branding (desktop only)                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="hidden lg:flex lg:w-2/5 bg-brand-deep flex-col justify-between p-10 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        />

        {/* Top: Logo + name */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            {/* AIRE shield wordmark */}
            <div className="flex h-12 w-12 items-center justify-center rounded-control bg-white/15 ring-1 ring-white/25">
              <Shield className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white tracking-wide leading-tight">
                AIRE
              </p>
              <p className="text-xs text-white/60 font-medium tracking-wider uppercase">
                AICTE Portal
              </p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white leading-snug mb-3">
            AICTE Admission
            <br />
            Reconciliation &amp;
            <br />
            Evidence Platform
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            Ensuring Admission Integrity Through Verifiable Evidence
          </p>
        </div>

        {/* Middle: Trust indicators */}
        <div className="relative z-10 space-y-5">
          {TRUST_INDICATORS.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-white/10 ring-1 ring-white/20">
                <Icon className="h-4 w-4 text-white/80" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-white/55 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom: Gov badge */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-control bg-white/10 px-3 py-1.5 ring-1 ring-white/15">
            <div className="h-1.5 w-1.5 rounded-full bg-state-success" />
            <span className="text-xs text-white/70 font-medium">
              Government of India — AICTE
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Right panel — Sign in form                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-1 flex-col items-center justify-center bg-neutral-0 px-6 py-12 lg:px-16">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-control bg-brand-deep">
              <Shield className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-brand-deep">AIRE</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-1">
              Sign in to AIRE Portal
            </h2>
            <p className="text-sm text-neutral-600">
              Authorised personnel only
            </p>
          </div>

          {/* Forgot password toast */}
          {forgotToast && (
            <div className="mb-5" role="status" aria-live="polite">
              <AireAlert variant="info">
                Contact your administrator to reset your password.
              </AireAlert>
            </div>
          )}

          {/* Error alert */}
          {errorMessage && (
            <div className="mb-5" role="alert">
              <AireAlert variant="error">{errorMessage}</AireAlert>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-neutral-800"
              >
                Official Email Address{" "}
                <span className="text-state-error" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                autoCapitalize="off"
                spellCheck={false}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full rounded-control border bg-neutral-0 px-3.5 py-2 text-sm text-neutral-800 outline-none transition-colors min-h-[44px] ${
                  errors.email
                    ? "border-state-error focus:ring-1 focus:ring-state-error"
                    : "border-neutral-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                }`}
                placeholder="name@institution.ac.in"
                {...register("email")}
              />
              {errors.email && (
                <span
                  id="email-error"
                  role="alert"
                  className="text-xs font-medium text-state-error"
                >
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-neutral-800"
              >
                Password{" "}
                <span className="text-state-error" aria-hidden="true">
                  *
                </span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className={`w-full rounded-control border bg-neutral-0 px-3.5 py-2 pr-11 text-sm text-neutral-800 outline-none transition-colors min-h-[44px] ${
                    errors.password
                      ? "border-state-error focus:ring-1 focus:ring-state-error"
                      : "border-neutral-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-600 hover:text-neutral-800 focus-visible:outline-2 focus-visible:outline-brand-primary rounded-control"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span
                  id="password-error"
                  role="alert"
                  className="text-xs font-medium text-state-error"
                >
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-brand-primary hover:underline focus-visible:outline-2 focus-visible:outline-brand-primary rounded-control"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-control bg-brand-primary px-4 py-2 text-sm font-medium text-neutral-0 shadow-sm transition-colors hover:bg-brand-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-60 min-h-[44px]"
            >
              {isSubmitting && (
                <span
                  className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                  aria-hidden="true"
                />
              )}
              {isSubmitting ? "Signing in…" : "Sign In"}
            </button>

            {/* Quick Demo Access */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-neutral-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-neutral-600 uppercase tracking-wider font-semibold">Or Instant Preview</span>
              <div className="flex-grow border-t border-neutral-200"></div>
            </div>

            <button
              type="button"
              onClick={() => {
                loginAsDemo();
                navigate("/dashboard", { replace: true });
              }}
              className="w-full flex items-center justify-center gap-2 rounded-control border border-brand-primary bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-primary shadow-sm transition-colors hover:bg-brand-100 min-h-[44px]"
            >
              Enter AICTE Regulatory Console (Demo Session) →
            </button>
          </form>

          {/* Environment notice */}
          <div className="mt-8 rounded-card border border-state-warning-border bg-state-warning-bg px-4 py-3">
            <p className="text-xs text-state-warning leading-relaxed">
              <span className="font-semibold">Demonstration environment.</span>{" "}
              For production access, contact AICTE.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
