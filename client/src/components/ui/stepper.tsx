import * as React from "react";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepState = "completed" | "current" | "upcoming" | "error";

export interface StepItem {
  id?: string;
  title: string;
  description?: string;
  state?: StepState;
}

export interface StepperProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: StepItem[];
  currentStepIndex?: number;
  orientation?: "horizontal" | "vertical";
  onStepClick?: (index: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStepIndex,
  orientation = "horizontal",
  onStepClick,
  className,
  ...props
}) => {
  return (
    <nav aria-label="Progress" className="ux4g-w-100 w-full">
      <ol
        className={cn(
          "ux4g-stepper flex w-full",
          orientation === "horizontal"
            ? "flex-row items-center justify-between"
            : "flex-col space-y-4",
          className,
        )}
        {...props}
      >
        {steps.map((step, index) => {
          // Determine effective state
          let state: StepState = step.state ?? "upcoming";
          if (currentStepIndex !== undefined && !step.state) {
            if (index < currentStepIndex) state = "completed";
            else if (index === currentStepIndex) state = "current";
            else state = "upcoming";
          }

          const isClickable = Boolean(onStepClick);
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.id || index}
              aria-current={state === "current" ? "step" : undefined}
              className={cn(
                "relative flex items-center",
                orientation === "horizontal"
                  ? "flex-1 last:flex-none"
                  : "w-full",
              )}
            >
              <div
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onClick={() => onStepClick?.(index)}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onStepClick?.(index);
                  }
                }}
                aria-current={state === "current" ? "step" : undefined}
                className={cn(
                  "group flex items-center gap-3 select-none",
                  isClickable &&
                    "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded p-1",
                )}
              >
                {/* Step indicator circle */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    state === "completed" &&
                      "bg-state-success-bg text-state-success-text border-2 border-state-success-border",
                    state === "current" &&
                      "bg-brand-primary text-txt-inverted ring-4 ring-brand-subtle",
                    state === "upcoming" &&
                      "bg-surface-card border-2 border-line-default text-txt-muted",
                    state === "error" &&
                      "bg-state-danger-bg text-state-danger-text border-2 border-state-danger-icon",
                  )}
                >
                  {state === "completed" ? (
                    <Check
                      className="h-4 w-4 stroke-[2.5]"
                      aria-hidden="true"
                    />
                  ) : state === "error" ? (
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step title and description */}
                <div className="flex flex-col text-left">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      state === "current" && "text-txt-primary font-semibold",
                      state === "completed" && "text-txt-primary",
                      state === "upcoming" && "text-txt-muted",
                      state === "error" &&
                        "text-state-danger-text font-semibold",
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="text-xs text-txt-secondary line-clamp-1">
                      {step.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Connector line for horizontal orientation */}
              {orientation === "horizontal" && !isLast && (
                <div
                  className={cn(
                    "mx-4 h-0.5 flex-1 transition-colors",
                    state === "completed"
                      ? "bg-state-success-border"
                      : "bg-line-default",
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
Stepper.displayName = "Stepper";
