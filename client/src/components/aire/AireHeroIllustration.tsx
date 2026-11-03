import React from "react";

export const AireHeroIllustration: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`relative w-full max-w-xl mx-auto select-none ${className}`}>
      {/* Crisp Editorial Vector Graphic — Pure AIRE Token Geometry without Generic Gradient Blobs */}
      <svg
        viewBox="0 0 580 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm"
        role="img"
        aria-label="Editorial vector diagram of the AIRE admission reconciliation pipeline, institutional ledger sheets, deterministic validation checkpoint, and cryptographic audit hash"
      >
        <defs>
          {/* Subtle Institutional Shadow */}
          <filter id="aireSubtleShadow" x="-5%" y="-5%" width="110%" height="115%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#142C3D" floodOpacity="0.06" />
          </filter>
        </defs>

        {/* 1. Technical Coordinate Grid (Fine purposeful structural lines) */}
        <g stroke="#D8E0E3" strokeWidth="1" strokeDasharray="4 4" opacity="0.6">
          <line x1="30" y1="40" x2="550" y2="40" />
          <line x1="30" y1="140" x2="550" y2="140" />
          <line x1="30" y1="240" x2="550" y2="240" />
          <line x1="30" y1="340" x2="550" y2="340" />
          <line x1="80" y1="20" x2="80" y2="420" />
          <line x1="220" y1="20" x2="220" y2="420" />
          <line x1="360" y1="20" x2="360" y2="420" />
          <line x1="500" y1="20" x2="500" y2="420" />
        </g>

        {/* 2. Pipeline Pathway Connecting Records to Verification Core */}
        <path
          d="M140 220 H 260 V 270 H 420"
          stroke="#24536F"
          strokeWidth="2"
          strokeDasharray="6 4"
          fill="none"
        />

        {/* 3. Back Ledger Stack (Base Foundation) */}
        <rect
          x="60"
          y="110"
          width="240"
          height="280"
          rx="10"
          fill="#EEF3F3"
          stroke="#D8E0E3"
          strokeWidth="1.5"
          filter="url(#aireSubtleShadow)"
        />
        <rect
          x="75"
          y="95"
          width="240"
          height="280"
          rx="10"
          fill="#FBFCFC"
          stroke="#D8E0E3"
          strokeWidth="1.5"
          filter="url(#aireSubtleShadow)"
        />

        {/* 4. Active Institutional Intake Sheet (Foreground Ledger) */}
        <g filter="url(#aireSubtleShadow)">
          <rect
            x="90"
            y="80"
            width="250"
            height="295"
            rx="10"
            fill="#FFFFFF"
            stroke="#D8E0E3"
            strokeWidth="1.5"
          />

          {/* Ledger Header Band in Institutional Ink Navy */}
          <path
            d="M90 90 Q90 80 100 80 H330 Q340 80 340 90 V124 H90 Z"
            fill="#142C3D"
          />
          <text x="110" y="107" fill="#FFFFFF" fontSize="12" fontWeight="600" fontFamily="sans-serif">
            BATCH ROSTER: 2026-IN-094
          </text>
          <circle cx="320" cy="102" r="4" fill="#075E58" />

          {/* Tabular Roster Rows */}
          {/* Header Row */}
          <rect x="105" y="136" width="220" height="20" rx="4" fill="#F5F7F7" />
          <text x="115" y="150" fill="#536474" fontSize="9" fontWeight="600" fontFamily="sans-serif">
            RECORD #
          </text>
          <text x="180" y="150" fill="#536474" fontSize="9" fontWeight="600" fontFamily="sans-serif">
            APAAR REF
          </text>
          <text x="270" y="150" fill="#536474" fontSize="9" fontWeight="600" fontFamily="sans-serif">
            INTAKE
          </text>

          {/* Row 1: Validated Record */}
          <rect x="105" y="164" width="220" height="28" rx="4" fill="#FFFFFF" stroke="#D8E0E3" strokeWidth="1" />
          <text x="115" y="182" fill="#1D2935" fontSize="10" fontWeight="500" fontFamily="sans-serif">
            REC-0012
          </text>
          <text x="180" y="182" fill="#536474" fontSize="9" fontFamily="monospace">
            ••• 9841
          </text>
          <rect x="270" y="170" width="46" height="16" rx="8" fill="#E7F2EC" />
          <text x="278" y="182" fill="#176B45" fontSize="8" fontWeight="600" fontFamily="sans-serif">
            VALID
          </text>

          {/* Row 2: Selected Focus Record */}
          <rect x="105" y="200" width="220" height="28" rx="4" fill="#EAF1F5" stroke="#24536F" strokeWidth="1.5" />
          <text x="115" y="218" fill="#142C3D" fontSize="10" fontWeight="600" fontFamily="sans-serif">
            REC-0013
          </text>
          <text x="180" y="218" fill="#24536F" fontSize="9" fontWeight="600" fontFamily="monospace">
            ••• 4029
          </text>
          <rect x="270" y="206" width="46" height="16" rx="8" fill="#E7F2EC" />
          <text x="278" y="218" fill="#176B45" fontSize="8" fontWeight="600" fontFamily="sans-serif">
            VALID
          </text>

          {/* Row 3: Quarantined Discrepancy Record */}
          <rect x="105" y="236" width="220" height="28" rx="4" fill="#FFFFFF" stroke="#D8E0E3" strokeWidth="1" />
          <text x="115" y="254" fill="#1D2935" fontSize="10" fontWeight="500" fontFamily="sans-serif">
            REC-0014
          </text>
          <text x="180" y="254" fill="#536474" fontSize="9" fontFamily="monospace">
            ••• 7120
          </text>
          <rect x="270" y="242" width="46" height="16" rx="8" fill="#F8F0E5" />
          <text x="276" y="254" fill="#8A4D0A" fontSize="8" fontWeight="600" fontFamily="sans-serif">
            TRIAGE
          </text>

          {/* Row 4: Pending */}
          <rect x="105" y="272" width="220" height="28" rx="4" fill="#FFFFFF" stroke="#D8E0E3" strokeWidth="1" />
          <text x="115" y="290" fill="#1D2935" fontSize="10" fontWeight="500" fontFamily="sans-serif">
            REC-0015
          </text>
          <text x="180" y="290" fill="#536474" fontSize="9" fontFamily="monospace">
            ••• 3318
          </text>
          <rect x="270" y="278" width="46" height="16" rx="8" fill="#EEF3F3" />
          <text x="276" y="290" fill="#536474" fontSize="8" fontWeight="600" fontFamily="sans-serif">
            QUEUED
          </text>

          {/* Ledger Bottom Proof Digest */}
          <line x1="105" y1="316" x2="325" y2="316" stroke="#E7ECEE" strokeWidth="1" />
          <text x="105" y="336" fill="#536474" fontSize="9" fontFamily="monospace">
            BATCH MERKLE: 4f9b2d...8e11
          </text>
          <text x="105" y="352" fill="#536474" fontSize="8" fontFamily="sans-serif">
            Deterministic Engine V1.4 • Zero PII Exposure
          </text>
        </g>

        {/* 5. Central Verification Node (The Verification Gateway) */}
        <g id="verification-gateway" filter="url(#aireSubtleShadow)">
          <circle cx="340" cy="214" r="22" fill="#24536F" stroke="#FFFFFF" strokeWidth="3" />
          {/* Abstract checkmark / seal mark */}
          <path
            d="M331 214 L337 220 L349 208"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* 6. Restrained Glassmorphism Evidence Badge (Design.md §7 permitted layer) */}
        {/* Uses light near-opaque surface 92% opacity, modest blur, crisp border */}
        <g id="floating-evidence-card" filter="url(#aireSubtleShadow)">
          <foreignObject x="310" y="255" width="240" height="150">
            <div className="aire-glass-panel rounded-card p-4 text-xs font-sans select-none border border-neutral-200">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-150">
                <span className="font-semibold text-neutral-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-800"></span>
                  RECONCILIATION PROOF
                </span>
                <span className="text-[10px] font-mono text-neutral-600">PASS</span>
              </div>
              <div className="space-y-1.5 text-neutral-600 text-[11px]">
                <div className="flex justify-between">
                  <span>Sanctioned Limit:</span>
                  <span className="font-semibold text-neutral-800">120 Seats</span>
                </div>
                <div className="flex justify-between">
                  <span>Admitted Cohort:</span>
                  <span className="font-semibold text-neutral-800">118 Students</span>
                </div>
                <div className="flex justify-between">
                  <span>Discrepancy Breaches:</span>
                  <span className="font-semibold text-state-success">0 Unresolved</span>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-neutral-150 flex items-center justify-between text-[10px] text-neutral-600 font-mono">
                <span>DIGEST VERIFIED</span>
                <span className="text-teal-800 font-semibold">AICTE SPEC 2026</span>
              </div>
            </div>
          </foreignObject>
        </g>

        {/* 7. Subtle Brass Accent Detail (Design.md §3.2 & §4.1) */}
        <g id="editorial-brass-accent">
          <circle cx="515" cy="115" r="5" fill="#8B4F16" />
          <path d="M515 95 V105 M515 125 V135 M495 115 H505 M525 115 H535" stroke="#8B4F16" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
};
