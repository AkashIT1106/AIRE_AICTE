import * as React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Info,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusType =
  | "compliant"
  | "quarantine"
  | "breach"
  | "pending"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "masked";

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
  label?: React.ReactNode;
  showIcon?: boolean;
  size?: "sm" | "default" | "lg";
}

const statusConfigs: Record<
  StatusType,
  {
    defaultLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
    iconClassName: string;
    dotClassName: string;
  }
> = {
  compliant: {
    defaultLabel: "Compliant",
    icon: CheckCircle2,
    className:
      "bg-state-success-bg text-state-success-text border-state-success-border",
    iconClassName: "text-state-success-icon",
    dotClassName: "bg-state-success-icon",
  },
  success: {
    defaultLabel: "Success",
    icon: CheckCircle2,
    className:
      "bg-state-success-bg text-state-success-text border-state-success-border",
    iconClassName: "text-state-success-icon",
    dotClassName: "bg-state-success-icon",
  },
  quarantine: {
    defaultLabel: "Quarantine",
    icon: AlertTriangle,
    className:
      "bg-state-warning-bg text-state-warning-text border-state-warning-border",
    iconClassName: "text-state-warning-icon",
    dotClassName: "bg-state-warning-icon",
  },
  warning: {
    defaultLabel: "Warning",
    icon: AlertTriangle,
    className:
      "bg-state-warning-bg text-state-warning-text border-state-warning-border",
    iconClassName: "text-state-warning-icon",
    dotClassName: "bg-state-warning-icon",
  },
  breach: {
    defaultLabel: "Breach",
    icon: AlertOctagon,
    className:
      "bg-state-danger-bg text-state-danger-text border-state-danger-border",
    iconClassName: "text-state-danger-icon",
    dotClassName: "bg-state-danger-icon",
  },
  danger: {
    defaultLabel: "Danger",
    icon: AlertOctagon,
    className:
      "bg-state-danger-bg text-state-danger-text border-state-danger-border",
    iconClassName: "text-state-danger-icon",
    dotClassName: "bg-state-danger-icon",
  },
  pending: {
    defaultLabel: "Pending",
    icon: Clock,
    className: "bg-surface-card-subdued text-txt-secondary border-line-default",
    iconClassName: "text-txt-muted",
    dotClassName: "bg-txt-muted",
  },
  neutral: {
    defaultLabel: "Neutral",
    icon: Clock,
    className: "bg-surface-card-subdued text-txt-secondary border-line-default",
    iconClassName: "text-txt-muted",
    dotClassName: "bg-txt-muted",
  },
  info: {
    defaultLabel: "Info",
    icon: Info,
    className: "bg-state-info-bg text-state-info-text border-state-info-border",
    iconClassName: "text-state-info-icon",
    dotClassName: "text-state-info-icon",
  },
  masked: {
    defaultLabel: "Protected",
    icon: Shield,
    className:
      "bg-masked-bg text-masked-text border-masked-border font-mono tracking-wider",
    iconClassName: "text-masked-icon",
    dotClassName: "bg-masked-icon",
  },
};

const sizeClasses = {
  sm: "text-[11px] px-1.5 py-0.5 gap-1",
  default: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
};

const iconSizes = {
  sm: "h-3 w-3",
  default: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  showIcon = true,
  size = "default",
  className,
  ...props
}) => {
  const config = statusConfigs[status] || statusConfigs.neutral;
  const IconComponent = config.icon;
  const displayLabel = label ?? config.defaultLabel;

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded border select-none transition-colors",
        config.className,
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {showIcon && (
        <IconComponent
          className={cn("shrink-0", iconSizes[size], config.iconClassName)}
          aria-hidden="true"
        />
      )}
      <span>{displayLabel}</span>
    </span>
  );
};
StatusIndicator.displayName = "StatusIndicator";
