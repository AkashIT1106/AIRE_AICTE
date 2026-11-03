import * as React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  loading?: boolean;
  debounceMs?: number;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue = "",
      onChange,
      onClear,
      loading = false,
      debounceMs = 0,
      placeholder = "Search...",
      disabled,
      ...props
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = React.useState<string>(
      (isControlled ? valueProp : defaultValue) || "",
    );

    const currentValue = isControlled ? valueProp : internalValue;

    // Internal input ref for programmatic clearing and focusing
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    // Debounce timer
    const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
      if (isControlled && valueProp !== undefined) {
        setInternalValue(valueProp);
      }
    }, [isControlled, valueProp]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (!isControlled) {
        setInternalValue(newValue);
      }

      if (debounceMs > 0) {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
          onChange?.(newValue);
        }, debounceMs);
      } else {
        onChange?.(newValue);
      }
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }
      onChange?.("");
      onClear?.();
      innerRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape" && currentValue) {
        e.preventDefault();
        handleClear();
      }
    };

    const hasContent = Boolean(currentValue && currentValue.length > 0);

    return (
      <div className={cn("relative flex items-center w-full", className)}>
        <Search
          className="pointer-events-none absolute left-3 h-4 w-4 text-txt-muted shrink-0"
          aria-hidden="true"
        />

        <input
          ref={innerRef}
          type="search"
          role="searchbox"
          value={currentValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex h-9 w-full rounded border border-line-default bg-surface-card pl-9 pr-9 py-1 text-sm text-txt-primary shadow-sm transition-colors",
            "placeholder:text-txt-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-card-subdued",
            "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
          )}
          {...props}
        />

        <div className="absolute right-2.5 flex items-center">
          {loading ? (
            <Loader2
              className="h-4 w-4 animate-spin text-txt-muted"
              aria-label="Searching..."
            />
          ) : hasContent && !disabled ? (
            <button
              type="button"
              onClick={handleClear}
              className="rounded p-0.5 text-txt-muted hover:text-txt-primary hover:bg-black/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring"
              aria-label="Clear search query"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
