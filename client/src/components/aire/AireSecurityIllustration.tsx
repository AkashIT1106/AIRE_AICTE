import React from "react";

export const AireSecurityIllustration: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`relative w-full max-w-xl mx-auto select-none ${className}`}>
      {/* Crisp Editorial Architectural Diagram — AIRE Security & Provenance Layer */}
      <svg
        viewBox="0 0 560 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm"
        role="img"
        aria-label="Editorial vector architectural diagram of PostgreSQL Forced RLS Tenant Isolation, Purpose-Bound Identity Vault, and SHA-256 Tamper-Evident Audit Ledger"
      >
        <defs>
          <filter id="secSubtleShadow" x="-5%" y="-5%" width="110%" height="115%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#142C3D" floodOpacity="0.05" />
          </filter>
        </defs>

        {/* 1. Underlying Coordinate Field */}
        <g stroke="#D8E0E3" strokeWidth="1" strokeDasharray="4 4" opacity="0.6">
          <line x1="30" y1="50" x2="530" y2="50" />
          <line x1="30" y1="160" x2="530" y2="160" />
          <line x1="30" y1="270" x2="530" y2="270" />
          <line x1="30" y1="370" x2="530" y2="370" />
          <line x1="80" y1="30" x2="80" y2="390" />
          <line x1="280" y1="30" x2="280" y2="390" />
          <line x1="480" y1="30" x2="480" y2="390" />
        </g>

        {/* 2. Platform Base Tier: PostgreSQL Forced RLS Multi-Tenant Boundary */}
        <g id="tenant-isolation-tier" filter="url(#secSubtleShadow)">
          <rect
            x="40"
            y="270"
            width="480"
            height="110"
            rx="10"
            fill="#FFFFFF"
            stroke="#D8E0E3"
            strokeWidth="1.5"
          />
          {/* Header strip in Deep Ink Navy */}
          <path
            d="M40 280 Q40 270 50 270 H510 Q520 270 520 280 V302 H40 Z"
            fill="#142C3D"
          />
          <text x="60" y="292" fill="#FFFFFF" fontSize="11" fontWeight="600" fontFamily="sans-serif">
            DATABASE MULTI-TENANT ISOLATION LAYER (FORCED ROW-LEVEL SECURITY)
          </text>

          {/* Tenant Enclaves */}
          <g>
            {/* Institution A Enclave */}
            <rect x="58" y="316" width="138" height="50" rx="6" fill="#F5F7F7" stroke="#D8E0E3" strokeWidth="1" />
            <text x="68" y="334" fill="#142C3D" fontSize="10" fontWeight="600" fontFamily="sans-serif">
              TENANT: 1-10928
            </text>
            <text x="68" y="352" fill="#075E58" fontSize="8" fontWeight="600" fontFamily="monospace">
              RLS BOUNDARY: ENFORCED
            </text>

            {/* Institution B Enclave */}
            <rect x="211" y="316" width="138" height="50" rx="6" fill="#F5F7F7" stroke="#D8E0E3" strokeWidth="1" />
            <text x="221" y="334" fill="#142C3D" fontSize="10" fontWeight="600" fontFamily="sans-serif">
              TENANT: 1-84912
            </text>
            <text x="221" y="352" fill="#075E58" fontSize="8" fontWeight="600" fontFamily="monospace">
              RLS BOUNDARY: ENFORCED
            </text>

            {/* AICTE Regulatory Scope */}
            <rect x="364" y="316" width="138" height="50" rx="6" fill="#EAF1F5" stroke="#24536F" strokeWidth="1" />
            <text x="374" y="334" fill="#24536F" fontSize="10" fontWeight="600" fontFamily="sans-serif">
              COUNCIL AUDIT SCOPE
            </text>
            <text x="374" y="352" fill="#24536F" fontSize="8" fontWeight="600" fontFamily="monospace">
              CROSS-TENANT READ: GOVERNED
            </text>
          </g>
        </g>

        {/* 3. Purpose-Bound Identity Vault (Upper Left Tier) */}
        <g id="identity-vault-tier" filter="url(#secSubtleShadow)">
          <rect
            x="40"
            y="60"
            width="230"
            height="180"
            rx="10"
            fill="#FFFFFF"
            stroke="#D8E0E3"
            strokeWidth="1.5"
          />
          {/* Header Strip in Deep Teal */}
          <path
            d="M40 70 Q40 60 50 60 H260 Q270 60 270 70 V92 H40 Z"
            fill="#075E58"
          />
          <text x="56" y="82" fill="#FFFFFF" fontSize="11" fontWeight="600" fontFamily="sans-serif">
            IDENTITY VAULT & TOKENIZATION
          </text>

          <text x="56" y="118" fill="#536474" fontSize="10" fontFamily="sans-serif">
            Plaintext Student PII:
          </text>
          <rect x="56" y="128" width="198" height="24" rx="4" fill="#FCEDEB" stroke="#B42318" strokeWidth="1" />
          <text x="68" y="144" fill="#B42318" fontSize="9" fontWeight="600" fontFamily="monospace">
            NEVER PERSISTED IN LEDGER
          </text>

          <text x="56" y="174" fill="#536474" fontSize="10" fontFamily="sans-serif">
            Cryptographic Vault Token:
          </text>
          <rect x="56" y="184" width="198" height="24" rx="4" fill="#E7F2EF" stroke="#075E58" strokeWidth="1" />
          <text x="68" y="200" fill="#075E58" fontSize="9" fontWeight="600" fontFamily="monospace">
            tok_a79f82d1c54b03ee
          </text>
        </g>

        {/* 4. Immutable Append-Only Audit Trail (Upper Right Tier) */}
        <g id="audit-trail-tier" filter="url(#secSubtleShadow)">
          <rect
            x="290"
            y="60"
            width="230"
            height="180"
            rx="10"
            fill="#FFFFFF"
            stroke="#D8E0E3"
            strokeWidth="1.5"
          />
          {/* Header Strip in Institutional Action Navy */}
          <path
            d="M290 70 Q290 60 300 60 H510 Q520 60 520 70 V92 H290 Z"
            fill="#24536F"
          />
          <text x="306" y="82" fill="#FFFFFF" fontSize="11" fontWeight="600" fontFamily="sans-serif">
            APPEND-ONLY AUDIT LEDGER
          </text>

          {/* Audit Node 1 */}
          <circle cx="312" cy="120" r="5" fill="#24536F" />
          <line x1="312" y1="125" x2="312" y2="155" stroke="#D8E0E3" strokeWidth="1.5" />
          <text x="326" y="118" fill="#1D2935" fontSize="10" fontWeight="600" fontFamily="sans-serif">
            INTAKE_UPLOADED
          </text>
          <text x="326" y="130" fill="#536474" fontSize="8" fontFamily="monospace">
            ACTOR: REGISTRAR • HASH: e4b2..
          </text>

          {/* Audit Node 2 */}
          <circle cx="312" cy="160" r="5" fill="#075E58" />
          <line x1="312" y1="165" x2="312" y2="195" stroke="#D8E0E3" strokeWidth="1.5" />
          <text x="326" y="158" fill="#1D2935" fontSize="10" fontWeight="600" fontFamily="sans-serif">
            EVALUATION_COMPLETED
          </text>
          <text x="326" y="170" fill="#536474" fontSize="8" fontFamily="monospace">
            ENGINE: DETERMINISTIC V1.4
          </text>

          {/* Audit Node 3 */}
          <circle cx="312" cy="200" r="5" fill="#8B4F16" />
          <text x="326" y="198" fill="#1D2935" fontSize="10" fontWeight="600" fontFamily="sans-serif">
            STATUTORY_SEALED
          </text>
          <text x="326" y="210" fill="#536474" fontSize="8" fontFamily="monospace">
            DUAL-AUTH: DRAFT LOCKED
          </text>
        </g>

        {/* 5. Secure Bus Connectors */}
        <path
          d="M155 240 V270 M405 240 V270"
          stroke="#24536F"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      </svg>
    </div>
  );
};
