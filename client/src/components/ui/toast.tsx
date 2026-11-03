import * as React from "react";
import {
  X,
  Check,
  Copy,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant =
  "default" | "info" | "success" | "warning" | "destructive";

export interface ToastItem {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  correlationId?: string;
  duration?: number;
  action?: React.ReactNode;
}

interface ToastContextType {
  toasts: ToastItem[];
  toast: (toast: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined,
);

// Standalone event-bus listener for global toast() function calls outside React tree
type ToastListener = (toasts: ToastItem[]) => void;
let memoryToasts: ToastItem[] = [];
const listeners = new Set<ToastListener>();

function notify() {
  listeners.forEach((listener) => listener([...memoryToasts]));
}

export function toast(props: Omit<ToastItem, "id">): string {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: ToastItem = { ...props, id };
  memoryToasts = [...memoryToasts, newToast];
  notify();

  // Error/destructive toasts NEVER auto-dismiss per AIRE & UX4G rules
  if (props.variant !== "destructive") {
    const timeout = props.duration ?? 4000;
    setTimeout(() => {
      memoryToasts = memoryToasts.filter((t) => t.id !== id);
      notify();
    }, timeout);
  }

  return id;
}

toast.dismiss = (id: string) => {
  memoryToasts = memoryToasts.filter((t) => t.id !== id);
  notify();
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  const [stateToasts, setStateToasts] =
    React.useState<ToastItem[]>(memoryToasts);

  React.useEffect(() => {
    listeners.add(setStateToasts);
    return () => {
      listeners.delete(setStateToasts);
    };
  }, []);

  if (context) {
    return context;
  }

  return {
    toasts: stateToasts,
    toast,
    dismiss: toast.dismiss,
  };
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>(memoryToasts);

  React.useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  const dismiss = React.useCallback((id: string) => {
    toast.dismiss(id);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

const ToastViewport: React.FC<{
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed top-4 right-4 z-[60] flex flex-col gap-2 max-w-md w-full pointer-events-none"
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} item={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
};

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  default: null,
  info: (
    <Info
      className="h-4 w-4 text-state-info-icon shrink-0"
      aria-hidden="true"
    />
  ),
  success: (
    <CheckCircle2
      className="h-4 w-4 text-state-success-icon shrink-0"
      aria-hidden="true"
    />
  ),
  warning: (
    <AlertTriangle
      className="h-4 w-4 text-state-warning-icon shrink-0"
      aria-hidden="true"
    />
  ),
  destructive: (
    <AlertCircle
      className="h-4 w-4 text-state-danger-icon shrink-0"
      aria-hidden="true"
    />
  ),
};

const ToastCard: React.FC<{ item: ToastItem; onDismiss: () => void }> = ({
  item,
  onDismiss,
}) => {
  const [copied, setCopied] = React.useState(false);
  const variant = item.variant ?? "default";
  const isDestructive = variant === "destructive";

  const handleCopyCorrelationId = () => {
    if (item.correlationId) {
      navigator.clipboard.writeText(item.correlationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      role="alert"
      aria-live={isDestructive ? "assertive" : "polite"}
      className={cn(
        "pointer-events-auto relative flex w-full flex-col gap-2 rounded border p-4 shadow-modal transition-all animate-in slide-in-from-top-2 duration-200",
        variant === "default" &&
          "bg-surface-card border-line-default text-txt-primary",
        variant === "info" &&
          "bg-state-info-bg border-state-info-border text-state-info-text",
        variant === "success" &&
          "bg-state-success-bg border-state-success-border text-state-success-text",
        variant === "warning" &&
          "bg-state-warning-bg border-state-warning-border text-state-warning-text",
        variant === "destructive" &&
          "bg-state-danger-bg border-state-danger-border text-state-danger-text",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          {variantIcons[variant]}
          <div>
            {item.title && (
              <h5 className="font-semibold text-sm leading-tight text-txt-primary">
                {item.title}
              </h5>
            )}
            {item.description && (
              <p className="text-xs opacity-90 mt-1 leading-relaxed text-txt-secondary">
                {item.description}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded p-1 text-txt-muted hover:text-txt-primary hover:bg-black/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {item.correlationId && (
        <div className="mt-1 flex items-center justify-between rounded bg-surface-card/80 border border-line-subtle px-2 py-1 text-xs">
          <span className="font-mono text-[11px] text-txt-secondary select-all">
            Ref: {item.correlationId}
          </span>
          <button
            type="button"
            onClick={handleCopyCorrelationId}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-primary hover:underline ml-2"
            title="Copy Correlation ID"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-state-success-icon" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      {item.action && (
        <div className="mt-1 flex justify-end">{item.action}</div>
      )}
    </div>
  );
};

export const Toast = ToastCard;
export const ToastTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h5
    className={cn(
      "font-semibold text-sm leading-tight text-txt-primary",
      className,
    )}
    {...props}
  />
);
export const ToastDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-xs opacity-90 text-txt-secondary", className)}
    {...props}
  />
);
export const ToastClose = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      "rounded p-1 text-txt-muted hover:text-txt-primary",
      className,
    )}
    {...props}
  />
);
export const ToastAction = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn("text-xs font-semibold underline", className)}
    {...props}
  />
);
