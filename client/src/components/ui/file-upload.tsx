import * as React from "react";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export interface FileUploadProps {
  accept?: string;
  maxSizeBytes?: number;
  onFileSelect?: (file: File) => void;
  onFileRemove?: () => void;
  selectedFile?: File | null;
  error?: string | null;
  isLoading?: boolean;
  progressPercent?: number;
  disabled?: boolean;
  hint?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  maxSizeBytes,
  onFileSelect,
  onFileRemove,
  selectedFile: externalFile,
  error: externalError,
  isLoading = false,
  progressPercent,
  disabled = false,
  hint,
  className,
}) => {
  const [internalFile, setInternalFile] = React.useState<File | null>(null);
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const dropzoneRef = React.useRef<HTMLDivElement>(null);

  const file = externalFile !== undefined ? externalFile : internalFile;
  const error = externalError !== undefined ? externalError : internalError;

  const validateFile = (candidate: File): boolean => {
    // 1. Size validation
    if (maxSizeBytes && candidate.size > maxSizeBytes) {
      const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(1);
      const fileMb = (candidate.size / (1024 * 1024)).toFixed(1);
      setInternalError(
        `File size (${fileMb} MB) exceeds maximum allowed size (${maxMb} MB).`,
      );
      return false;
    }

    // 2. Format validation
    if (accept) {
      const acceptedExtensions = accept
        .split(",")
        .map((ext) => ext.trim().toLowerCase());
      const fileName = candidate.name.toLowerCase();
      const matches = acceptedExtensions.some((ext) => {
        if (ext.startsWith(".")) {
          return fileName.endsWith(ext);
        }
        if (ext.includes("/*")) {
          const typePrefix = ext.replace("/*", "");
          return candidate.type.startsWith(typePrefix);
        }
        return candidate.type === ext;
      });

      if (!matches) {
        setInternalError(`Invalid file format. Allowed formats: ${accept}`);
        return false;
      }
    }

    setInternalError(null);
    return true;
  };

  const handleFileChange = (newFile: File | null) => {
    if (!newFile) return;
    if (validateFile(newFile)) {
      setInternalFile(newFile);
      onFileSelect?.(newFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled || isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isLoading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalFile(null);
    setInternalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileRemove?.();
  };

  const handleClick = () => {
    if (!disabled && !isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === "Enter" || e.key === " ") && !file) {
      e.preventDefault();
      handleClick();
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        disabled={disabled || isLoading}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileChange(e.target.files[0]);
          }
        }}
        className="sr-only"
        aria-hidden="true"
      />

      <div
        ref={dropzoneRef}
        role="button"
        tabIndex={disabled || isLoading ? -1 : 0}
        aria-disabled={disabled || isLoading}
        aria-label={file ? `Selected file: ${file.name}` : "Upload file"}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "ux4g-upload relative flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed transition-all cursor-pointer select-none text-center",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2",
          isDragOver
            ? "border-brand-primary bg-brand-subtle"
            : "border-line-default bg-surface-card hover:bg-surface-card-subdued",
          error && "border-state-danger-icon bg-state-danger-bg/40",
          (disabled || isLoading) &&
            "cursor-not-allowed opacity-60 pointer-events-none",
        )}
      >
        {file ? (
          <div className="flex items-center justify-between w-full max-w-md bg-surface-card-subdued p-3 rounded border border-line-default">
            <div className="flex items-center gap-3 overflow-hidden text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-brand-subtle text-brand-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-txt-primary truncate">
                  {file.name}
                </p>
                <p className="text-xs text-txt-muted">
                  {formatSize(file.size)}
                </p>
              </div>
            </div>

            {!isLoading && (
              <button
                type="button"
                onClick={handleRemove}
                className="rounded p-1 text-txt-muted hover:text-state-danger-text hover:bg-state-danger-bg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring ml-2"
                aria-label="Remove selected file"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-card-subdued text-txt-muted">
              <UploadCloud className="h-6 w-6 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-sm font-medium text-txt-primary">
                <span className="text-brand-primary hover:underline">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-txt-muted mt-1">
                {hint ||
                  (accept
                    ? `Accepted formats: ${accept}`
                    : "All files supported")}
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="w-full mt-4 max-w-md">
            <div className="flex justify-between text-xs text-txt-muted mb-1 font-tabular">
              <span>Uploading...</span>
              {progressPercent !== undefined && <span>{progressPercent}%</span>}
            </div>
            <Progress
              value={progressPercent}
              indeterminate={progressPercent === undefined}
              size="sm"
            />
          </div>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-1.5 text-xs font-medium text-state-danger-text px-1"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
FileUpload.displayName = "FileUpload";
