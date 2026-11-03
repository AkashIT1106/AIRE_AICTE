import React from "react";

export const AireHeroIllustration: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`relative w-full max-w-lg mx-auto ${className}`}>
      {/* Ambient background glow */}
      <div
        className="absolute -inset-4 bg-gradient-to-tr from-[#E0E7FF]/50 via-[#F3E8FF]/30 to-[#ECFDF5]/40 rounded-3xl blur-2xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Main SVG Vector Artwork */}
      <svg
        viewBox="0 0 560 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xl"
        role="img"
        aria-label="Illustration of AIRE deterministic admission verification process with institutional gateway and cryptographic ledger"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="heroGatewayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="heroGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id="heroIndigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>

          <linearGradient id="heroTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="heroCardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>

          <linearGradient id="glassBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.4" />
          </linearGradient>

          <filter id="heroShadow" x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#0F172A" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* 1. Background Grid & Coordinates (Data Engineering & Evidence Lattice) */}
        <g opacity="0.4" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3">
          <line x1="40" y1="60" x2="520" y2="60" />
          <line x1="40" y1="160" x2="520" y2="160" />
          <line x1="40" y1="260" x2="520" y2="260" />
          <line x1="40" y1="360" x2="520" y2="360" />
          <line x1="100" y1="40" x2="100" y2="400" />
          <line x1="220" y1="40" x2="220" y2="400" />
          <line x1="340" y1="40" x2="340" y2="400" />
          <line x1="460" y1="40" x2="460" y2="400" />
        </g>

        {/* 2. Institutional Architectural Pediment & Columns (Sovereign Authority & Trust) */}
        <g id="institutional-gateway" filter="url(#heroShadow)">
          {/* Base Foundation */}
          <rect x="80" y="370" width="400" height="14" rx="4" fill="#334155" />
          <rect x="65" y="384" width="430" height="10" rx="3" fill="#1E293B" />

          {/* Pediment Roof (Geometric Triangle) */}
          <path
            d="M60 120 L280 40 L500 120 Z"
            fill="url(#heroGatewayGrad)"
          />
          {/* Pediment Inner Architrave */}
          <rect x="75" y="120" width="410" height="12" fill="#475569" rx="2" />
          <rect x="90" y="132" width="380" height="8" fill="#334155" rx="1" />

          {/* Central Ashoka / Sunburst Emblem in Pediment */}
          <circle cx="280" cy="90" r="18" fill="url(#heroGoldGrad)" />
          <circle cx="280" cy="90" r="14" fill="#1E293B" />
          <g stroke="url(#heroGoldGrad)" strokeWidth="1.5">
            <line x1="280" y1="78" x2="280" y2="102" />
            <line x1="268" y1="90" x2="292" y2="90" />
            <line x1="271.5" y1="81.5" x2="288.5" y2="98.5" />
            <line x1="271.5" y1="98.5" x2="288.5" y2="81.5" />
          </g>
          <circle cx="280" cy="90" r="4" fill="url(#heroGoldGrad)" />

          {/* Classical Colonnade Pillars (Geometric 4 Columns) */}
          {/* Pillar 1 */}
          <rect x="100" y="140" width="22" height="230" rx="3" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="107" y1="140" x2="107" y2="370" stroke="#E2E8F0" strokeWidth="1.5" />
          <line x1="115" y1="140" x2="115" y2="370" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Pillar 2 */}
          <rect x="200" y="140" width="22" height="230" rx="3" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="207" y1="140" x2="207" y2="370" stroke="#E2E8F0" strokeWidth="1.5" />
          <line x1="215" y1="140" x2="215" y2="370" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Pillar 3 */}
          <rect x="338" y="140" width="22" height="230" rx="3" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="345" y1="140" x2="345" y2="370" stroke="#E2E8F0" strokeWidth="1.5" />
          <line x1="353" y1="140" x2="353" y2="370" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Pillar 4 */}
          <rect x="438" y="140" width="22" height="230" rx="3" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="445" y1="140" x2="445" y2="370" stroke="#E2E8F0" strokeWidth="1.5" />
          <line x1="453" y1="140" x2="453" y2="370" stroke="#CBD5E1" strokeWidth="1.5" />
        </g>

        {/* 3. Central Deterministic Verification Matrix (Central Focal Layer) */}
        <g id="central-matrix" filter="url(#heroShadow)">
          {/* Main Elevated Surface */}
          <rect
            x="150"
            y="170"
            width="260"
            height="185"
            rx="16"
            fill="url(#heroCardGrad)"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />

          {/* Top Decorative Header of the Slate */}
          <path
            d="M150 186 C150 177.163 157.163 170 166 170 L394 170 C402.837 170 410 177.163 410 186 L410 206 L150 206 Z"
            fill="#1E293B"
          />
          <circle cx="170" cy="188" r="4" fill="#EF4444" />
          <circle cx="182" cy="188" r="4" fill="#F59E0B" />
          <circle cx="194" cy="188" r="4" fill="#10B981" />
          <text
            x="280"
            y="192"
            fill="#94A3B8"
            fontSize="10"
            fontFamily="system-ui, sans-serif"
            fontWeight="600"
            textAnchor="middle"
            letterSpacing="0.05em"
          >
            DETERMINISTIC VERIFICATION MATRIX
          </text>

          {/* Verification Badge & Guilloche Motif */}
          <g transform="translate(280, 260)">
            {/* Outer Concentric Circles */}
            <circle r="44" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
            <circle r="36" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1" strokeDasharray="4 2" />
            <circle r="28" fill="url(#heroIndigoGrad)" />

            {/* Checkmark in Center */}
            <path
              d="M-8 0 L-2 6 L9 -5"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Data Channels / Connectors */}
          <path
            d="M185 240 L225 240 M185 260 L225 260 M185 280 L225 280"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M335 240 L375 240 M335 260 L375 260 M335 280 L375 280"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Matrix Status Ribbon */}
          <rect x="175" y="318" width="210" height="24" rx="6" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="192" cy="330" r="4" fill="#10B981" />
          <text
            x="204"
            y="334"
            fill="#334155"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            RULE EVALUATION: 100% DETERMINISTIC
          </text>
        </g>

        {/* 4. Floating Restrained Glassmorphic Panel (Top-Right: Batch Evidence Stamp) */}
        <g id="glass-card-top" filter="url(#heroShadow)">
          {/* Glass Surface with Backdrop simulation */}
          <rect
            x="320"
            y="95"
            width="210"
            height="72"
            rx="12"
            fill="#FFFFFF"
            fillOpacity="0.88"
            stroke="url(#glassBorder)"
            strokeWidth="1.5"
          />
          <rect x="332" y="107" width="26" height="26" rx="6" fill="url(#heroIndigoGrad)" />
          {/* Mini Document Icon */}
          <path
            d="M341 114 H349 M341 118 H349 M341 122 H346"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <text
            x="366"
            y="119"
            fill="#0F172A"
            fontSize="11"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
          >
            Batch Roster Ingestion
          </text>
          <text
            x="366"
            y="131"
            fill="#64748B"
            fontSize="9"
            fontFamily="monospace"
          >
            SHA-256: 7f8a9...b3c4
          </text>
          <rect x="332" y="142" width="70" height="16" rx="8" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
          <circle cx="340" cy="150" r="3" fill="#059669" />
          <text
            x="348"
            y="153"
            fill="#065F46"
            fontSize="8"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
          >
            SEALED
          </text>
        </g>

        {/* 5. Floating Restrained Glassmorphic Panel (Bottom-Left: Intake Reconciliation) */}
        <g id="glass-card-bottom" filter="url(#heroShadow)">
          <rect
            x="30"
            y="290"
            width="200"
            height="76"
            rx="12"
            fill="#FFFFFF"
            fillOpacity="0.92"
            stroke="url(#glassBorder)"
            strokeWidth="1.5"
          />
          <rect x="42" y="302" width="26" height="26" rx="6" fill="url(#heroTealGrad)" />
          {/* Check shield icon */}
          <path
            d="M50 315 L53 318 L60 311"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="76"
            y="314"
            fill="#0F172A"
            fontSize="11"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
          >
            Sanctioned Seat Intake
          </text>
          <text
            x="76"
            y="326"
            fill="#64748B"
            fontSize="9"
            fontFamily="system-ui, sans-serif"
          >
            Approved: 120 / Enrolled: 118
          </text>

          <rect x="42" y="337" width="176" height="18" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <text
            x="130"
            y="349"
            fill="#059669"
            fontSize="8.5"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
            textAnchor="middle"
          >
            ✓ ZERO OVER-ADMISSION DETECTED
          </text>
        </g>

        {/* 6. Dynamic Connection Trace Lines */}
        <path
          d="M230 330 C250 330 260 310 260 290"
          fill="none"
          stroke="#10B981"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <path
          d="M330 150 C300 150 290 170 290 190"
          fill="none"
          stroke="#6366F1"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
      </svg>
    </div>
  );
};
