import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AlertTriangle, AlertOctagon, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  attestationText?: string;
  digest?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  attestationText = "I confirm and attest that I have verified the evidence and understand this action is final and auditable.",
  digest,
  confirmLabel = "Confirm Action",
  cancelLabel = "Cancel",
  isDestructive = false,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const [attested, setAttested] = React.useState(false);
  const attestationId = React.useId();

  // Reset attestation checkbox when dialog closes
  React.useEffect(() => {
    if (!open) {
      setAttested(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!attested || loading) return;
    await onConfirm();
  };

  const handleCancel = () => {
    if (loading) return;
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-surface-overlay/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          // Prevent backdrop dismissal for high-friction safety (DD-006 / UX4G)
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => {
            if (loading) e.preventDefault();
          }}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-line-default bg-surface-card p-6 shadow-modal duration-200 sm:rounded-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            isDestructive && "border-state-danger-border",
          )}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                isDestructive
                  ? "bg-state-danger-bg text-state-danger-icon"
                  : "bg-state-warning-bg text-state-warning-icon",
              )}
            >
              {isDestructive ? (
                <AlertOctagon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              )}
            </div>

            <div className="space-y-1">
              <DialogPrimitive.Title className="text-base font-semibold text-txt-primary">
                {title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-sm text-txt-secondary leading-relaxed">
                {description}
              </DialogPrimitive.Description>
            </div>
          </div>

          {digest && (
            <div className="rounded border border-line-subtle bg-surface-card-subdued p-3 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-txt-secondary mb-1">
                <Hash
                  className="h-3.5 w-3.5 text-brand-primary"
                  aria-hidden="true"
                />
                <span>Verification Digest</span>
              </div>
              <code className="block font-mono text-[11px] text-txt-primary break-all select-all">
                {digest}
              </code>
            </div>
          )}

          {/* Mandatory Attestation Checkbox */}
          <div className="rounded border border-line-default bg-surface-card-subdued/50 p-3 mt-1">
            <div className="flex items-start space-x-2.5">
              <Checkbox
                id={attestationId}
                checked={attested}
                onCheckedChange={(checked) => setAttested(checked === true)}
                disabled={loading}
                className="mt-0.5"
              />
              <Label
                htmlFor={attestationId}
                className="text-xs font-normal text-txt-primary leading-normal cursor-pointer select-none"
              >
                {attestationText}
              </Label>
            </div>
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-3 border-t border-line-subtle">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant={isDestructive ? "destructive" : "default"}
              onClick={handleConfirm}
              disabled={!attested || loading}
              loading={loading}
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
ConfirmationDialog.displayName = "ConfirmationDialog";
