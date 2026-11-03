import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormErrorItem {
  fieldId: string;
  message: string;
}

export interface ErrorSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  errors: FormErrorItem[];
  autoFocus?: boolean;
}

export const ErrorSummary = React.forwardRef<HTMLDivElement, ErrorSummaryProps>(
  (
    {
      title = "There is a problem",
      errors,
      autoFocus = false,
      className,
      ...props
    },
    ref,
  ) => {
    const summaryRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => summaryRef.current as HTMLDivElement);

    React.useEffect(() => {
      if (autoFocus && errors.length > 0 && summaryRef.current) {
        summaryRef.current.focus();
      }
    }, [autoFocus, errors]);

    if (!errors || errors.length === 0) {
      return null;
    }

    const handleJumpToField = (fieldId: string, e: React.MouseEvent) => {
      e.preventDefault();
      const target = document.getElementById(fieldId);
      if (target) {
        if (typeof target.scrollIntoView === "function") {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        target.focus();
      }
    };

    return (
      <div
        ref={summaryRef}
        role="alert"
        aria-labelledby="error-summary-title"
        tabIndex={-1}
        className={cn(
          "ux4g-alert ux4g-alert-error rounded border-2 border-state-danger-icon bg-state-danger-bg p-4 mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-2 mb-2 text-state-danger-text">
          <AlertCircle
            className="h-5 w-5 shrink-0 text-state-danger-icon"
            aria-hidden="true"
          />
          <h4
            id="error-summary-title"
            className="text-base font-semibold leading-none"
          >
            {title}
          </h4>
        </div>

        <ul className="list-disc pl-7 space-y-1 text-sm text-state-danger-text">
          {errors.map((item, index) => (
            <li key={`${item.fieldId}-${index}`}>
              <a
                href={`#${item.fieldId}`}
                onClick={(e) => handleJumpToField(item.fieldId, e)}
                className="underline underline-offset-2 hover:text-txt-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 rounded font-medium"
              >
                {item.message}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
ErrorSummary.displayName = "ErrorSummary";
