import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{
  variant: "pill" | "underline" | "line";
}>({
  variant: "pill",
});

export interface TabsProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Root
> {
  variant?: "pill" | "underline" | "line";
}

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ variant = "pill", ...props }, ref) => (
  <TabsContext.Provider value={{ variant }}>
    <TabsPrimitive.Root ref={ref} {...props} />
  </TabsContext.Provider>
));
Tabs.displayName = TabsPrimitive.Root.displayName;

export interface TabsListProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.List
> {
  variant?: "pill" | "underline" | "line";
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant: variantProp, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  const variant = variantProp ?? context.variant;

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        variant === "pill"
          ? "inline-flex h-10 items-center gap-1 rounded border border-line-default bg-surface-card-subdued p-1"
          : "inline-flex h-auto items-center gap-6 border-b border-line-default bg-transparent p-0 rounded-none w-full",
        className,
      )}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
> {
  variant?: "pill" | "underline" | "line";
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant: variantProp, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  const variant = variantProp ?? context.variant;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
        variant === "pill"
          ? "min-h-8 rounded px-3 py-1.5 text-sm text-txt-secondary data-[state=active]:bg-surface-card data-[state=active]:text-txt-primary data-[state=active]:shadow-sm"
          : "min-h-10 rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1 text-sm text-txt-secondary hover:text-txt-primary data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary data-[state=active]:font-semibold bg-transparent shadow-none",
        className,
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
