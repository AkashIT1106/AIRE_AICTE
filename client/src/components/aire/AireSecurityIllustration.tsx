import React from "react";

export const AireSecurityIllustration: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`relative w-full max-w-lg mx-auto ${className}`}>
      {/* Ambient background glow */}
      <div
        className="absolute -inset-4 bg-gradient-to-br from-[#ECFDF5]/50 via-[#EFF6FF]/40 to-[#F8FAFC] rounded-3xl blur-2xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 540 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-lg"
        role="img"
        aria-label="Technical security diagram representing AIRE tenant isolation, Identity Vault, and immutable audit logging"
      >
        <defs>
          <linearGradient id="secShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="secVaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          <linearGradient id="secCardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>

          <filter id="secDropShadow" x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0F172A" floodOpacity="0.07" />
          </filter>
        </defs>

        {/* 1. Underlying Coordinate Field */}
        <g opacity="0.3" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3">
          <line x1="30" y1="50" x2="510" y2="50" />
          <line x1="30" y1="150" x2="510" y2="150" />
          <line x1="30" y1="250" x2="510" y2="250" />
          <line x1="30" y1="350" x2="510" y2="350" />
        </g>

        {/* 2. Platform Base Tier: PostgreSQL Multi-Tenant Isolation Enclave */}
        <g id="tenant-isolation-tier" filter="url(#secDropShadow)">
          {/* Main Tenant Barrier */}
          <rect
            x="40"
            y="280"
            width="460"
            height="100"
            rx="12"
            fill="url(#secCardGrad)"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />

          {/* Tier Label Strip */}
          <rect x="40" y="280" width="460" height="28" rx="12" fill="#1E293B" />
          <rect x="40" y="296" width="460" height="12" fill="#1E293B" />
          <text
            x="58"
            y="298"
            fill="#94A3B8"
            fontSize="10"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
            letterSpacing="0.08em"
          >
            TIER 1: DATABASE ROW-LEVEL SECURITY (FORCED RLS)
          </text>
          <rect x="420" y="286" width="66" height="16" rx="8" fill="#065F46" />
          <text
            x="453"
            y="298"
            fill="#A7F3D0"
            fontSize="8"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
            textAnchor="middle"
          >
            ISOLATED
          </text>

          {/* Tenant 1 Chamber */}
          <rect x="56" y="320" width="124" height="48" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <text x="68" y="338" fill="#1E293B" fontSize="10" fontWeight="bold">Institution A</text>
          <text x="68" y="352" fill="#64748B" fontSize="8" fontFamily="monospace">tenant_id = 0x4A1</text>

          {/* Wall Barrier */}
          <line x1="196" y1="320" x2="196" y2="368" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 2" />

          {/* Tenant 2 Chamber */}
          <rect x="212" y="320" width="124" height="48" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <text x="224" y="338" fill="#1E293B" fontSize="10" fontWeight="bold">Institution B</text>
          <text x="224" y="352" fill="#64748B" fontSize="8" fontFamily="monospace">tenant_id = 0x7B8</text>

          {/* Wall Barrier */}
          <line x1="352" y1="320" x2="352" y2="368" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 2" />

          {/* Tenant N Chamber */}
          <rect x="368" y="320" width="116" height="48" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <text x="380" y="338" fill="#1E293B" fontSize="10" fontWeight="bold">Institution N</text>
          <text x="380" y="352" fill="#64748B" fontSize="8" fontFamily="monospace">tenant_id = 0x9F3</text>
        </g>

        {/* 3. Middle Tier Left: Identity Vault (DPDP Act 2023 Isolation) */}
        <g id="identity-vault-box" filter="url(#secDropShadow)">
          <rect
            x="40"
            y="120"
            width="216"
            height="136"
            rx="12"
            fill="url(#secCardGrad)"
            stroke="#A7F3D0"
            strokeWidth="1.5"
          />
          {/* Header */}
          <path
            d="M40 132 C40 125.373 45.373 120 52 120 L244 120 C250.627 120 256 125.373 256 132 L256 148 L40 148 Z"
            fill="url(#secVaultGrad)"
          />
          <text
            x="56"
            y="139"
            fill="#FFFFFF"
            fontSize="10"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            PROTECTED IDENTITY VAULT
          </text>

          {/* Vault Icon */}
          <g transform="translate(60, 168)">
            <circle cx="16" cy="16" r="16" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
            <path
              d="M16 9 V15 M11 15 H21 M11 15 V23 H21 V15"
              stroke="#059669"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          <text x="100" y="178" fill="#0F172A" fontSize="10" fontWeight="bold">Zero PII in Logs</text>
          <text x="100" y="191" fill="#64748B" fontSize="8.5">Envelope Encryption</text>

          {/* Masked Data Record Preview */}
          <rect x="56" y="210" width="184" height="32" rx="4" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
          <text x="68" y="225" fill="#475569" fontSize="8" fontFamily="monospace">APAAR: •••• •••• 8912</text>
          <text x="68" y="236" fill="#059669" fontSize="7.5" fontWeight="bold">ACCESS: PURPOSE-BOUND</text>
        </g>

        {/* 4. Middle Tier Right: Tamper-Evident Ledger & Audit Chain */}
        <g id="audit-ledger-box" filter="url(#secDropShadow)">
          <rect
            x="284"
            y="120"
            width="216"
            height="136"
            rx="12"
            fill="url(#secCardGrad)"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />
          {/* Header */}
          <path
            d="M284 132 C284 125.373 289.373 120 296 120 L488 120 C494.627 120 500 125.373 500 132 L500 148 L284 148 Z"
            fill="url(#secShieldGrad)"
          />
          <text
            x="300"
            y="139"
            fill="#FFFFFF"
            fontSize="10"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            TAMPER-EVIDENT AUDIT TRAIL
          </text>

          {/* Mini Hash Link 1 */}
          <rect x="300" y="162" width="184" height="24" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="312" cy="174" r="3" fill="#2563EB" />
          <text x="322" y="177" fill="#334155" fontSize="8" fontFamily="monospace">BATCH_SEAL: 0x8a7f...2d</text>

          {/* Connector Line */}
          <line x1="392" y1="186" x2="392" y2="194" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

          {/* Mini Hash Link 2 */}
          <rect x="300" y="194" width="184" height="24" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="312" cy="206" r="3" fill="#10B981" />
          <text x="322" y="209" fill="#334155" fontSize="8" fontFamily="monospace">AUTH_EVENT: NodalOfficer#04</text>

          {/* Status strip */}
          <text x="300" y="242" fill="#64748B" fontSize="8.5" fontWeight="600">
            Append-Only Log • Historical Immutability
          </text>
        </g>

        {/* 5. Top Crest: Human Governance Authority */}
        <g id="human-authority-crest" filter="url(#secDropShadow)">
          <rect
            x="170"
            y="30"
            width="200"
            height="62"
            rx="12"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />
          <circle cx="200" cy="61" r="16" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
          {/* Scales of justice / gavel icon */}
          <path
            d="M200 52 V70 M193 57 H207 M190 64 L193 57 L196 64 Z M204 64 L207 57 L210 64 Z"
            stroke="#B45309"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="226" y="55" fill="#1E293B" fontSize="10" fontWeight="bold">Human Governance</text>
          <text x="226" y="68" fill="#64748B" fontSize="8">Policy & Final Decisions</text>
        </g>

        {/* Flow Connectors connecting Governance to Tiers */}
        <path
          d="M270 92 V110"
          stroke="#94A3B8"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <path
          d="M148 256 V280"
          stroke="#059669"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <path
          d="M392 256 V280"
          stroke="#2563EB"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
      </svg>
    </div>
  );
};
