import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  Layers,
  ShieldCheck,
  FileUp,
} from "lucide-react";
import { Badge } from "./Badge";

export type AdmissionRecordStatus =
  | "UPLOADED"
  | "INGESTED"
  | "STAGED"
  | "QUARANTINED"
  | "SEALED"
  | "RECONCILED"
  | "APPROVED";

export interface StatusIndicatorProps {
  status: AdmissionRecordStatus;
  size?: "sm" | "md";
  className?: string;
}

const statusConfig: Record<
  AdmissionRecordStatus,
  {
    label: string;
    variant:
      | "primary"
      | "brand"
      | "success"
      | "warning"
      | "error"
      | "info"
      | "neutral"
      | "teal";
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }
> = {
  UPLOADED: {
    label: "Uploaded",
    variant: "info",
    icon: FileUp,
    description:
      "Raw batch intake received; awaiting pre-flight format validation",
  },
  INGESTED: {
    label: "Ingested",
    variant: "neutral",
    icon: Layers,
    description:
      "Schema normalized and mapped to internal institutional roster tables",
  },
  STAGED: {
    label: "Staged",
    variant: "brand",
    icon: Clock,
    description:
      "Staged in tenant schema; awaiting deterministic rule engine evaluation",
  },
  QUARANTINED: {
    label: "Quarantined",
    variant: "warning",
    icon: AlertTriangle,
    description:
      "Discrepancy detected (intake quota breach or invalid APAAR identifier)",
  },
  SEALED: {
    label: "Statutory Sealed",
    variant: "primary",
    icon: Lock,
    description:
      "Cryptographically locked by Registrar with SHA-256 Merkle root digest",
  },
  RECONCILED: {
    label: "Reconciled",
    variant: "teal",
    icon: CheckCircle2,
    description:
      "Zero discrepancy verified against AICTE sanctioned intake limits",
  },
  APPROVED: {
    label: "AICTE Approved",
    variant: "success",
    icon: ShieldCheck,
    description:
      "Formally endorsed by Council Regulatory Authority (Dual Sign-Off)",
  },
};

export const AireStatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = "md",
  className = "",
}) => {
  const config = statusConfig[status] || statusConfig.UPLOADED;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center ${className}`}
      title={`${config.label}: ${config.description}`}
    >
      <Badge
        variant={config.variant}
        size={size}
        icon={<Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />}
      >
        {config.label}
      </Badge>
    </span>
  );
};

export const StatusIndicator = AireStatusIndicator;
