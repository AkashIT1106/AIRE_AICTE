import React from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { ProcessStep } from "./ProcessStep";

export const AireWorkflow: React.FC = () => {
  const steps = [
    {
      stepNumber: "01",
      phaseLabel: "Phase 1: Ingestion",
      title: "Batch Ingestion & Header Verification",
      description:
        "Authorized institutional officers upload structured admission records (CSV/XLSX) via their authenticated tenant portal with instant client-side header checks.",
      artifact: "SHA-256 Checksum Roster",
    },
    {
      stepNumber: "02",
      phaseLabel: "Phase 2: Computation",
      title: "Deterministic Rule Evaluation",
      description:
        "Computational routines evaluate records against approved intake caps, reservation quotas, and program parameters. Evaluations are transparent and reproducible.",
      artifact: "Deterministic Quota Ledger",
    },
    {
      stepNumber: "03",
      phaseLabel: "Phase 3: Procedural",
      title: "Discrepancy Quarantine & Triage",
      description:
        "Records with data ambiguities or quota overruns are placed in an isolated quarantine queue for institutional review without automated rejection.",
      artifact: "Clarification Docket",
    },
    {
      stepNumber: "04",
      phaseLabel: "Phase 4: Certification",
      title: "Immutable Seal & Regulatory Package",
      description:
        "Verified admission cohorts receive an immutable cryptographic seal and tamper-evident audit package signed by the designated nodal officer.",
      artifact: "Compliance Verification Seal",
      isLast: true,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-[#E2E8F0]">
      <Container>
        <SectionHeading
          badge="Procedural Architecture"
          title="How AIRE Works"
          subtitle="A transparent, four-stage administrative pipeline replacing ad-hoc manual spreadsheets with verifiable computational reconciliation."
        />

        {/* Stepper Pipeline Grid */}
        <div className="relative">
          {/* Desktop Connecting Pipeline Rail */}
          <div
            className="hidden lg:block absolute top-[20px] left-[5%] right-[5%] h-[2px] bg-[#CBD5E1] z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((step) => (
              <ProcessStep key={step.stepNumber} {...step} />
            ))}
          </div>
        </div>

        {/* Supporting Schema Guidance Callout */}
        <div className="mt-12 p-6 sm:p-7 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-base font-bold text-[#0F172A]">
              Preparing your institution's batch admission datasets?
            </h4>
            <p className="text-sm text-[#475569] max-w-2xl">
              Download the official AICTE Student Record Data Specification (CSV/XLSX schema)
              and review standard field validations prior to upload.
            </p>
          </div>
          <a
            href="#faq"
            className="ux4g-btn ux4g-btn-outline-primary whitespace-nowrap px-5 py-2.5 text-sm font-bold text-[#2563EB] border border-[#2563EB] rounded-lg hover:bg-[#EFF6FF] transition-colors shrink-0"
          >
            Review Schema Specifications
          </a>
        </div>
      </Container>
    </section>
  );
};
