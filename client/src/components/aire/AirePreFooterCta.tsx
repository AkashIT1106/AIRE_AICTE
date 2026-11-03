import React from "react";
import { Container } from "./Container";
import { Button } from "./Button";

export const AirePreFooterCta: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] text-white py-14 sm:py-18 border-b border-[#1E293B]">
      {/* Subtle geometric grid background pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none"
        aria-hidden="true"
      />

      <Container className="relative flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#1E293B] px-3 py-1 rounded text-xs font-semibold text-[#94A3B8] border border-[#334155]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" aria-hidden="true" />
            <span>AICTE Institutional Workspace</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Ready to Reconcile Your Institution's Admission Rosters?
          </h2>

          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
            Log in to the institutional workspace to stage admission batches, run
            pre-flight diagnostic checks, and generate verifiable audit seals ahead
            of regulatory submission deadlines.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <Button
            asAnchor
            href="/login"
            variant="primary"
            size="lg"
            className="font-bold px-7 text-base shadow-sm justify-center"
          >
            <span>Access Institution Portal</span>
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Button>

          <a
            href="#faq"
            className="text-sm font-semibold text-[#CBD5E1] hover:text-white transition-colors underline underline-offset-4"
          >
            Documentation & Guidelines
          </a>
        </div>
      </Container>
    </section>
  );
};
