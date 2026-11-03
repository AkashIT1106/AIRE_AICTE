import React from "react";

export interface ProcessStepProps {
  stepNumber: string;
  phaseLabel: string;
  title: string;
  description: string;
  artifact: string;
  isLast?: boolean;
}

export const ProcessStep: React.FC<ProcessStepProps> = ({
  stepNumber,
  phaseLabel,
  title,
  description,
  artifact,
  isLast = false,
}) => {
  return (
    <div className="relative flex flex-col h-full z-10">
      {/* Step Header with Number Circle & Connection Line Anchor */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#1E293B] text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm border-2 border-white ring-2 ring-[#CBD5E1]">
          {stepNumber}
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#2563EB]">
            {phaseLabel}
          </span>
          <span className="text-xs text-[#64748B] font-semibold">
            Stage {stepNumber}
          </span>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="bg-[#FAFBFD] border border-[#CBD5E1] rounded-xl p-5 sm:p-6 flex flex-col justify-between flex-grow hover:border-[#2563EB] hover:shadow-sm transition-all duration-200">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-2">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-4">
            {description}
          </p>
        </div>

        {/* Verifiable Stage Proof / Artifact */}
        <div className="pt-3 border-t border-[#E2E8F0]">
          <span className="text-[11px] font-bold text-[#334155] block mb-1.5 uppercase tracking-wider">
            Verification Output:
          </span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-[#CBD5E1] text-[11px] font-mono font-semibold text-[#0F172A]">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
              aria-hidden="true"
            />
            {artifact}
          </div>
        </div>
      </div>

      {/* Horizontal connector arrow for desktop */}
      {!isLast && (
        <div
          className="hidden lg:flex absolute -right-3 top-5 text-[#94A3B8] font-bold text-sm z-20 pointer-events-none"
          aria-hidden="true"
        >
          →
        </div>
      )}
    </div>
  );
};
