import React from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export interface AlertProps {
  variant?: "info" | "success" | "warning" | "error" | "danger";
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const AireAlert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  dismissible = false,
  onDismiss,
  className = "",
}) => {
  const normalizedVariant = variant === "danger" ? "error" : variant;

  const config = {
    info: {
      ux4gClass: "ux4g-alert-info",
      bgClass: "bg-state-info-bg",
      textClass: "text-state-info",
      borderClass: "border-state-info-border",
      Icon: Info,
    },
    success: {
      ux4gClass: "ux4g-alert-success",
      bgClass: "bg-state-success-bg",
      textClass: "text-state-success",
      borderClass: "border-state-success-border",
      Icon: CheckCircle2,
    },
    warning: {
      ux4gClass: "ux4g-alert-warning",
      bgClass: "bg-state-warning-bg",
      textClass: "text-state-warning",
      borderClass: "border-state-warning-border",
      Icon: AlertTriangle,
    },
    error: {
      ux4gClass: "ux4g-alert-error",
      bgClass: "bg-state-error-bg",
      textClass: "text-state-error",
      borderClass: "border-state-error-border",
      Icon: AlertCircle,
    },
  }[normalizedVariant];

  const { Icon, ux4gClass, bgClass, textClass, borderClass } = config;

  return (
    <div
      role="alert"
      className={`ux4g-alert ${ux4gClass} ${bgClass} ${borderClass} border rounded-card p-4 flex items-start gap-3 transition-colors ${className}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${textClass}`} aria-hidden="true" />
      <div className="flex-grow text-sm">
        {title && <h4 className={`font-semibold mb-1 ${textClass}`}>{title}</h4>}
        <div className="text-neutral-800 leading-relaxed">{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className={`ux4g-alert-close p-1 rounded-control hover:bg-black/5 text-neutral-600 transition-colors ml-2`}
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const Alert = AireAlert;
