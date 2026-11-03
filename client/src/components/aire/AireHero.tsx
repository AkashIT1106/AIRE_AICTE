import React from "react";
import { Container } from "./Container";
import { Button } from "./Button";
import { AireHeroIllustration } from "./AireHeroIllustration";

export const AireHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FAFBFD] to-[#F1F5F9] border-b border-[#E2E8F0] pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-22">
      {/* Subtle institutional micro-texture / watermark background grid */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Authoritative Editorial Header, Rationale, and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* National Initiative Context Banner */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F1F5F9] border border-[#CBD5E1] text-xs font-semibold text-[#1E293B]">
              <span
                className="w-2 h-2 rounded-full bg-[#2563EB]"
                aria-hidden="true"
              />
              <span>All India Council for Technical Education</span>
              <span className="text-[#94A3B8]" aria-hidden="true">
                |
              </span>
              <span className="text-[#475569] font-medium">
                Statutory Evidence Infrastructure
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-extrabold text-[#0F172A] tracking-tight leading-[1.14]">
              Admission Records.{" "}
              <span className="text-[#1D4ED8] block sm:inline">
                Verified with Deterministic Precision.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#334155] leading-relaxed max-w-2xl font-normal">
              AIRE provides AICTE-approved institutions with an authoritative
              computational framework to reconcile student admission rosters
              against sanctioned intakes, statutory criteria, and program
              allocations before official reporting deadlines.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Button
                asAnchor
                href="/login"
                variant="primary"
                size="lg"
                className="font-bold tracking-wide shadow-sm justify-center px-7 text-base"
              >
                <span>Institution Portal Login</span>
                <svg
                  className="w-4 h-4 ml-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>

              <Button
                asAnchor
                href="#how-it-works"
                variant="outline-primary"
                size="lg"
                className="font-semibold justify-center px-6 text-base"
              >
                Explore Reconciliation Process
              </Button>
            </div>

            {/* Restrained Institutional Trust Ribbon */}
            <div className="pt-8 border-t border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="border-l-2 border-[#2563EB] pl-3">
                <div className="text-sm font-bold text-[#0F172A]">
                  Deterministic Rules
                </div>
                <div className="text-xs text-[#64748B] mt-0.5">
                  100% Reproducible
                </div>
              </div>

              <div className="border-l-2 border-[#059669] pl-3">
                <div className="text-sm font-bold text-[#0F172A]">
                  Tenant Isolation
                </div>
                <div className="text-xs text-[#64748B] mt-0.5">
                  PostgreSQL RLS
                </div>
              </div>

              <div className="border-l-2 border-[#D97706] pl-3">
                <div className="text-sm font-bold text-[#0F172A]">
                  Privacy by Design
                </div>
                <div className="text-xs text-[#64748B] mt-0.5">
                  Identity Vault & Masking
                </div>
              </div>

              <div className="border-l-2 border-[#475569] pl-3">
                <div className="text-sm font-bold text-[#0F172A]">
                  Human Governance
                </div>
                <div className="text-xs text-[#64748B] mt-0.5">
                  Nodal Authority
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Custom High-Craft SVG Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <AireHeroIllustration />
          </div>
        </div>
      </Container>
    </section>
  );
};
