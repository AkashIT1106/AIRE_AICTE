import React from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { AireSecurityIllustration } from "./AireSecurityIllustration";

export const AireResponsibleManagement: React.FC = () => {
  return (
    <section
      id="governance"
      className="py-16 sm:py-24 bg-[#FAFBFD] border-b border-[#E2E8F0]"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Editorial Governance Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              badge="Security & Governance"
              title="Responsible Record Management"
              subtitle="Engineered with strict purpose limitation, tenant isolation, and tamper-evident auditability to safeguard institutional trust."
              align="left"
              className="mb-4"
            />

            <div className="space-y-4">
              {/* Pillar 1: Tenant Isolation */}
              <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] flex items-start gap-4 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  01
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] mb-1">
                    Database Multi-Tenant Isolation (Forced RLS)
                  </h4>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    PostgreSQL Row-Level Security ensures that queries are
                    cryptographically scoped to the authenticated institution's
                    tenant ID. Cross-tenant data leakage is structurally blocked
                    at the database engine level.
                  </p>
                </div>
              </div>

              {/* Pillar 2: Identity Vault */}
              <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] flex items-start gap-4 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  02
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] mb-1">
                    Purpose-Bound Identity Vault & PII Minimization
                  </h4>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    Student demographic data and national identifiers are
                    segregated into a dedicated Identity Vault. Sensitive fields
                    are masked across standard interfaces and excluded from
                    application system logs.
                  </p>
                </div>
              </div>

              {/* Pillar 3: Immutable Audit Logging */}
              <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] flex items-start gap-4 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#1E293B] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  03
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] mb-1">
                    Tamper-Evident Append-Only Audit Trail
                  </h4>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    Every batch submission, status change, and discrepancy
                    triage creates an immutable ledger event signed with SHA-256
                    batch hashes, actor IDs, and correlation timestamps.
                  </p>
                </div>
              </div>

              {/* Pillar 4: Human Governance */}
              <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] flex items-start gap-4 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] text-[#D97706] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  04
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] mb-1">
                    Human Authority Over Regulatory Decisions
                  </h4>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    Computational routines calculate deterministic arithmetic;
                    they never execute automated student cancellations.
                    Sovereign policy rulings and final decisions remain strictly
                    with authorized human officials.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Custom SVG Security Architecture Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <AireSecurityIllustration />
          </div>
        </div>
      </Container>
    </section>
  );
};
