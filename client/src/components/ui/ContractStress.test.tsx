import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Import everything from barrel index
import * as Barrel from "./index";

// Import from individual component files
import * as ButtonModule from "./button";
import * as InputModule from "./input";
import * as SelectModule from "./select";
import * as CheckboxModule from "./checkbox";
import * as RadioGroupModule from "./radio-group";
import * as SwitchModule from "./switch";
import * as TextareaModule from "./textarea";
import * as LabelModule from "./label";
import * as FormFieldModule from "./form-field";
import * as BadgeModule from "./badge";
import * as AlertModule from "./alert";
import * as DialogModule from "./dialog";
import * as DrawerModule from "./drawer";
import * as TooltipModule from "./tooltip";
import * as TabsModule from "./tabs";
import * as BreadcrumbsModule from "./breadcrumbs";
import * as TableModule from "./table";
import * as CardModule from "./card";
import * as PaginationModule from "./pagination";
import * as ProgressModule from "./progress";
import * as SkeletonModule from "./skeleton";
import * as ToastModule from "./toast";
import * as AccordionModule from "./accordion";
import * as DropdownMenuModule from "./dropdown-menu";
import * as SearchInputModule from "./search-input";
import * as FileUploadModule from "./file-upload";
import * as EmptyStateModule from "./empty-state";
import * as ConfirmationDialogModule from "./confirmation-dialog";
import * as ErrorSummaryModule from "./error-summary";
import * as StepperModule from "./stepper";
import * as MetricCardModule from "./metric-card";
import * as TimelineModule from "./timeline";
import * as StatusIndicatorModule from "./status-indicator";
import * as SeparatorModule from "./separator";
import * as SkipLinkModule from "./skip-link";
import * as ButtonGroupModule from "./button-group";

describe("Layer B Contract & Export Stress Harness (challenger_m1_2)", () => {
  // =========================================================================
  // Test 1: Barrel Index Definedness and Non-Nullity
  // =========================================================================
  it("verify all 33 Layer B primitives are defined and non-null in barrel index", () => {
    const primitives33: Array<[string, unknown]> = [
      ["Button", Barrel.Button],
      ["Input", Barrel.Input],
      ["Select", Barrel.Select],
      ["Checkbox", Barrel.Checkbox],
      ["RadioGroup", Barrel.RadioGroup],
      ["Switch", Barrel.Switch],
      ["Textarea", Barrel.Textarea],
      ["Label", Barrel.Label],
      ["FormField", Barrel.FormField],
      ["Badge", Barrel.Badge],
      ["Alert", Barrel.Alert],
      ["Dialog", Barrel.Dialog],
      ["Drawer", Barrel.Drawer],
      ["Tooltip", Barrel.Tooltip],
      ["Tabs", Barrel.Tabs],
      ["Breadcrumb", Barrel.Breadcrumb],
      ["Table", Barrel.Table],
      ["Card", Barrel.Card],
      ["Pagination", Barrel.Pagination],
      ["Progress", Barrel.Progress],
      ["Skeleton", Barrel.Skeleton],
      ["Toast", Barrel.Toast],
      ["Accordion", Barrel.Accordion],
      ["DropdownMenu", Barrel.DropdownMenu],
      ["SearchInput", Barrel.SearchInput],
      ["FileUpload", Barrel.FileUpload],
      ["EmptyState", Barrel.EmptyState],
      ["ConfirmationDialog", Barrel.ConfirmationDialog],
      ["ErrorSummary", Barrel.ErrorSummary],
      ["Stepper", Barrel.Stepper],
      ["MetricCard", Barrel.MetricCard],
      ["Timeline", Barrel.Timeline],
      ["StatusIndicator", Barrel.StatusIndicator],
    ];

    expect(primitives33).toHaveLength(33);

    for (const [name, component] of primitives33) {
      expect(
        component,
        `Expected ${name} to be exported from barrel`,
      ).toBeDefined();
      expect(component, `Expected ${name} not to be null`).not.toBeNull();
      const isRenderable =
        typeof component === "function" ||
        (typeof component === "object" &&
          component !== null &&
          "$$typeof" in component);
      expect(
        isRenderable,
        `Expected ${name} to be a valid React renderable component`,
      ).toBe(true);
    }
  });

  // =========================================================================
  // Test 2: Subcomponents & Compound Primitives Definedness
  // =========================================================================
  it("verify compound subcomponents and auxiliary utilities are cleanly exported", () => {
    // Select subcomponents
    expect(Barrel.SelectTrigger).toBeDefined();
    expect(Barrel.SelectContent).toBeDefined();
    expect(Barrel.SelectItem).toBeDefined();
    expect(Barrel.SelectValue).toBeDefined();
    expect(Barrel.SelectGroup).toBeDefined();
    expect(Barrel.SelectLabel).toBeDefined();
    expect(Barrel.SelectSeparator).toBeDefined();

    // RadioGroup subcomponents
    expect(Barrel.RadioGroupItem).toBeDefined();

    // FormField hook
    expect(typeof Barrel.useFormField).toBe("function");

    // Dialog subcomponents
    expect(Barrel.DialogTrigger).toBeDefined();
    expect(Barrel.DialogContent).toBeDefined();
    expect(Barrel.DialogHeader).toBeDefined();
    expect(Barrel.DialogFooter).toBeDefined();
    expect(Barrel.DialogTitle).toBeDefined();
    expect(Barrel.DialogDescription).toBeDefined();
    expect(Barrel.DialogClose).toBeDefined();

    // Drawer subcomponents
    expect(Barrel.DrawerTrigger).toBeDefined();
    expect(Barrel.DrawerContent).toBeDefined();
    expect(Barrel.DrawerHeader).toBeDefined();
    expect(Barrel.DrawerFooter).toBeDefined();
    expect(Barrel.DrawerTitle).toBeDefined();
    expect(Barrel.DrawerDescription).toBeDefined();
    expect(Barrel.DrawerClose).toBeDefined();

    // Tooltip subcomponents
    expect(Barrel.TooltipTrigger).toBeDefined();
    expect(Barrel.TooltipContent).toBeDefined();
    expect(Barrel.TooltipProvider).toBeDefined();
    expect(Barrel.TooltipArrow).toBeDefined();

    // Tabs subcomponents
    expect(Barrel.TabsList).toBeDefined();
    expect(Barrel.TabsTrigger).toBeDefined();
    expect(Barrel.TabsContent).toBeDefined();

    // Breadcrumb subcomponents
    expect(Barrel.BreadcrumbList).toBeDefined();
    expect(Barrel.BreadcrumbItem).toBeDefined();
    expect(Barrel.BreadcrumbLink).toBeDefined();
    expect(Barrel.BreadcrumbPage).toBeDefined();
    expect(Barrel.BreadcrumbSeparator).toBeDefined();
    expect(Barrel.BreadcrumbEllipsis).toBeDefined();

    // Table subcomponents
    expect(Barrel.TableHeader).toBeDefined();
    expect(Barrel.TableBody).toBeDefined();
    expect(Barrel.TableFooter).toBeDefined();
    expect(Barrel.TableHead).toBeDefined();
    expect(Barrel.TableRow).toBeDefined();
    expect(Barrel.TableCell).toBeDefined();
    expect(Barrel.TableCaption).toBeDefined();
    expect(Barrel.TableEmpty).toBeDefined();
    expect(Barrel.TableSkeleton).toBeDefined();

    // Card subcomponents
    expect(Barrel.CardHeader).toBeDefined();
    expect(Barrel.CardFooter).toBeDefined();
    expect(Barrel.CardTitle).toBeDefined();
    expect(Barrel.CardDescription).toBeDefined();
    expect(Barrel.CardContent).toBeDefined();

    // Pagination subcomponents
    expect(Barrel.PaginationContent).toBeDefined();
    expect(Barrel.PaginationItem).toBeDefined();
    expect(Barrel.PaginationLink).toBeDefined();
    expect(Barrel.PaginationPrevious).toBeDefined();
    expect(Barrel.PaginationNext).toBeDefined();
    expect(Barrel.PaginationEllipsis).toBeDefined();

    // Toast system
    expect(Barrel.ToastProvider).toBeDefined();
    expect(Barrel.ToastTitle).toBeDefined();
    expect(Barrel.ToastDescription).toBeDefined();
    expect(Barrel.ToastClose).toBeDefined();
    expect(Barrel.ToastAction).toBeDefined();
    expect(typeof Barrel.useToast).toBe("function");
    expect(typeof Barrel.toast).toBe("function");

    // Accordion subcomponents
    expect(Barrel.AccordionItem).toBeDefined();
    expect(Barrel.AccordionTrigger).toBeDefined();
    expect(Barrel.AccordionContent).toBeDefined();

    // DropdownMenu subcomponents
    expect(Barrel.DropdownMenuTrigger).toBeDefined();
    expect(Barrel.DropdownMenuContent).toBeDefined();
    expect(Barrel.DropdownMenuItem).toBeDefined();
    expect(Barrel.DropdownMenuCheckboxItem).toBeDefined();
    expect(Barrel.DropdownMenuRadioItem).toBeDefined();
    expect(Barrel.DropdownMenuLabel).toBeDefined();
    expect(Barrel.DropdownMenuSeparator).toBeDefined();
    expect(Barrel.DropdownMenuGroup).toBeDefined();

    // Auxiliary primitives
    expect(Barrel.Separator).toBeDefined();
    expect(Barrel.SkipLink).toBeDefined();
    expect(Barrel.ButtonGroup).toBeDefined();
  });

  // =========================================================================
  // Test 3: Barrel vs Single-Module Parity (Identity Invariance)
  // =========================================================================
  it("verify barrel exports have exact reference identity with individual module exports", () => {
    expect(Barrel.Button).toBe(ButtonModule.Button);
    expect(Barrel.buttonVariants).toBe(ButtonModule.buttonVariants);
    expect(Barrel.Input).toBe(InputModule.Input);
    expect(Barrel.Select).toBe(SelectModule.Select);
    expect(Barrel.SelectTrigger).toBe(SelectModule.SelectTrigger);
    expect(Barrel.Checkbox).toBe(CheckboxModule.Checkbox);
    expect(Barrel.RadioGroup).toBe(RadioGroupModule.RadioGroup);
    expect(Barrel.RadioGroupItem).toBe(RadioGroupModule.RadioGroupItem);
    expect(Barrel.Switch).toBe(SwitchModule.Switch);
    expect(Barrel.Textarea).toBe(TextareaModule.Textarea);
    expect(Barrel.Label).toBe(LabelModule.Label);
    expect(Barrel.FormField).toBe(FormFieldModule.FormField);
    expect(Barrel.Badge).toBe(BadgeModule.Badge);
    expect(Barrel.badgeVariants).toBe(BadgeModule.badgeVariants);
    expect(Barrel.Alert).toBe(AlertModule.Alert);
    expect(Barrel.alertVariants).toBe(AlertModule.alertVariants);
    expect(Barrel.Dialog).toBe(DialogModule.Dialog);
    expect(Barrel.Drawer).toBe(DrawerModule.Drawer);
    expect(Barrel.Tooltip).toBe(TooltipModule.Tooltip);
    expect(Barrel.Tabs).toBe(TabsModule.Tabs);
    expect(Barrel.Breadcrumb).toBe(BreadcrumbsModule.Breadcrumb);
    expect(Barrel.Table).toBe(TableModule.Table);
    expect(Barrel.TableEmpty).toBe(TableModule.TableEmpty);
    expect(Barrel.TableSkeleton).toBe(TableModule.TableSkeleton);
    expect(Barrel.Card).toBe(CardModule.Card);
    expect(Barrel.Pagination).toBe(PaginationModule.Pagination);
    expect(Barrel.Progress).toBe(ProgressModule.Progress);
    expect(Barrel.Skeleton).toBe(SkeletonModule.Skeleton);
    expect(Barrel.Toast).toBe(ToastModule.Toast);
    expect(Barrel.Accordion).toBe(AccordionModule.Accordion);
    expect(Barrel.DropdownMenu).toBe(DropdownMenuModule.DropdownMenu);
    expect(Barrel.SearchInput).toBe(SearchInputModule.SearchInput);
    expect(Barrel.FileUpload).toBe(FileUploadModule.FileUpload);
    expect(Barrel.EmptyState).toBe(EmptyStateModule.EmptyState);
    expect(Barrel.ConfirmationDialog).toBe(
      ConfirmationDialogModule.ConfirmationDialog,
    );
    expect(Barrel.ErrorSummary).toBe(ErrorSummaryModule.ErrorSummary);
    expect(Barrel.Stepper).toBe(StepperModule.Stepper);
    expect(Barrel.MetricCard).toBe(MetricCardModule.MetricCard);
    expect(Barrel.Timeline).toBe(TimelineModule.Timeline);
    expect(Barrel.StatusIndicator).toBe(StatusIndicatorModule.StatusIndicator);
    expect(Barrel.Separator).toBe(SeparatorModule.Separator);
    expect(Barrel.SkipLink).toBe(SkipLinkModule.SkipLink);
    expect(Barrel.ButtonGroup).toBe(ButtonGroupModule.ButtonGroup);
  });

  // =========================================================================
  // Test 4: Render Stress for All 33 Layer B Primitives
  // =========================================================================
  it("verify all 33 Layer B primitives render cleanly without runtime exceptions", () => {
    const { container } = render(
      <div>
        {/* 1. Button */}
        <Barrel.Button variant="default" size="default">
          Test Button
        </Barrel.Button>

        {/* 2. Input */}
        <Barrel.Input
          placeholder="Enter student roll number"
          defaultValue="1001"
        />

        {/* 3. Select */}
        <Barrel.Select defaultValue="ug">
          <Barrel.SelectTrigger aria-label="Programme Select">
            <Barrel.SelectValue placeholder="Select Programme" />
          </Barrel.SelectTrigger>
          <Barrel.SelectContent>
            <Barrel.SelectItem value="ug">Undergraduate</Barrel.SelectItem>
            <Barrel.SelectItem value="pg">Postgraduate</Barrel.SelectItem>
          </Barrel.SelectContent>
        </Barrel.Select>

        {/* 4. Checkbox */}
        <Barrel.Checkbox
          id="test-check"
          defaultChecked
          aria-label="Accept terms"
        />

        {/* 5. Radio Group */}
        <Barrel.RadioGroup defaultValue="opt1" aria-label="Quota Type">
          <Barrel.RadioGroupItem value="opt1" id="r1" />
          <Barrel.RadioGroupItem value="opt2" id="r2" />
        </Barrel.RadioGroup>

        {/* 6. Switch */}
        <Barrel.Switch id="test-switch" aria-label="Toggle feature" />

        {/* 7. Textarea */}
        <Barrel.Textarea placeholder="Remarks" defaultValue="Valid" />

        {/* 8. Label */}
        <Barrel.Label htmlFor="test-check">Accept Terms</Barrel.Label>

        {/* 9. Form Field */}
        <Barrel.FormField
          label="Full Name"
          required
          helperText="As per 10th marksheet"
        >
          <Barrel.Input id="full-name" />
        </Barrel.FormField>

        {/* 10. Badge */}
        <Barrel.Badge variant="success">Verified AEP</Barrel.Badge>

        {/* 11. Alert */}
        <Barrel.Alert variant="info">
          <Barrel.AlertTitle>Regulatory Notice</Barrel.AlertTitle>
          <Barrel.AlertDescription>
            Intake reconciliation in progress.
          </Barrel.AlertDescription>
        </Barrel.Alert>

        {/* 12. Dialog */}
        <Barrel.Dialog open={false}>
          <Barrel.DialogTrigger asChild>
            <Barrel.Button>Open Dialog</Barrel.Button>
          </Barrel.DialogTrigger>
          <Barrel.DialogContent>
            <Barrel.DialogTitle>Dialog Title</Barrel.DialogTitle>
            <Barrel.DialogDescription>
              Dialog Description
            </Barrel.DialogDescription>
          </Barrel.DialogContent>
        </Barrel.Dialog>

        {/* 13. Drawer */}
        <Barrel.Drawer open={false}>
          <Barrel.DrawerTrigger asChild>
            <Barrel.Button>Open Drawer</Barrel.Button>
          </Barrel.DrawerTrigger>
          <Barrel.DrawerContent>
            <Barrel.DrawerTitle>Drawer Title</Barrel.DrawerTitle>
            <Barrel.DrawerDescription>
              Drawer Description
            </Barrel.DrawerDescription>
          </Barrel.DrawerContent>
        </Barrel.Drawer>

        {/* 14. Tooltip */}
        <Barrel.TooltipProvider>
          <Barrel.Tooltip>
            <Barrel.TooltipTrigger asChild>
              <Barrel.Button variant="ghost">Hover me</Barrel.Button>
            </Barrel.TooltipTrigger>
            <Barrel.TooltipContent>Tooltip helper text</Barrel.TooltipContent>
          </Barrel.Tooltip>
        </Barrel.TooltipProvider>

        {/* 15. Tabs */}
        <Barrel.Tabs defaultValue="overview">
          <Barrel.TabsList>
            <Barrel.TabsTrigger value="overview">Overview</Barrel.TabsTrigger>
            <Barrel.TabsTrigger value="details">Details</Barrel.TabsTrigger>
          </Barrel.TabsList>
          <Barrel.TabsContent value="overview">
            Overview Content
          </Barrel.TabsContent>
          <Barrel.TabsContent value="details">
            Details Content
          </Barrel.TabsContent>
        </Barrel.Tabs>

        {/* 16. Breadcrumbs */}
        <Barrel.Breadcrumb>
          <Barrel.BreadcrumbList>
            <Barrel.BreadcrumbItem>
              <Barrel.BreadcrumbLink href="/">Home</Barrel.BreadcrumbLink>
            </Barrel.BreadcrumbItem>
            <Barrel.BreadcrumbSeparator />
            <Barrel.BreadcrumbItem>
              <Barrel.BreadcrumbPage>Institutions</Barrel.BreadcrumbPage>
            </Barrel.BreadcrumbItem>
          </Barrel.BreadcrumbList>
        </Barrel.Breadcrumb>

        {/* 17. Table */}
        <Barrel.Table>
          <Barrel.TableCaption>Intake Summary Table</Barrel.TableCaption>
          <Barrel.TableHeader>
            <Barrel.TableRow>
              <Barrel.TableHead>Course</Barrel.TableHead>
              <Barrel.TableHead>Approved</Barrel.TableHead>
            </Barrel.TableRow>
          </Barrel.TableHeader>
          <Barrel.TableBody>
            <Barrel.TableRow>
              <Barrel.TableCell>Computer Engineering</Barrel.TableCell>
              <Barrel.TableCell>120</Barrel.TableCell>
            </Barrel.TableRow>
          </Barrel.TableBody>
        </Barrel.Table>

        {/* 18. Card */}
        <Barrel.Card>
          <Barrel.CardHeader>
            <Barrel.CardTitle>Card Title</Barrel.CardTitle>
            <Barrel.CardDescription>Card description</Barrel.CardDescription>
          </Barrel.CardHeader>
          <Barrel.CardContent>Card body content</Barrel.CardContent>
          <Barrel.CardFooter>Card footer content</Barrel.CardFooter>
        </Barrel.Card>

        {/* 19. Pagination */}
        <Barrel.Pagination>
          <Barrel.PaginationContent>
            <Barrel.PaginationItem>
              <Barrel.PaginationPrevious href="#prev" />
            </Barrel.PaginationItem>
            <Barrel.PaginationItem>
              <Barrel.PaginationLink href="#1" isActive>
                1
              </Barrel.PaginationLink>
            </Barrel.PaginationItem>
            <Barrel.PaginationItem>
              <Barrel.PaginationNext href="#next" />
            </Barrel.PaginationItem>
          </Barrel.PaginationContent>
        </Barrel.Pagination>

        {/* 20. Progress Indicator */}
        <Barrel.Progress value={75} aria-label="Upload progress" />

        {/* 21. Skeleton */}
        <Barrel.Skeleton className="h-4 w-32" />

        {/* 22. Toast system container */}
        <Barrel.ToastProvider>
          <div>App body</div>
        </Barrel.ToastProvider>

        {/* 23. Accordion */}
        <Barrel.Accordion type="single" collapsible defaultValue="i1">
          <Barrel.AccordionItem value="i1">
            <Barrel.AccordionTrigger>Section 1</Barrel.AccordionTrigger>
            <Barrel.AccordionContent>Panel 1</Barrel.AccordionContent>
          </Barrel.AccordionItem>
        </Barrel.Accordion>

        {/* 24. Dropdown Menu */}
        <Barrel.DropdownMenu open={false}>
          <Barrel.DropdownMenuTrigger asChild>
            <Barrel.Button>Actions</Barrel.Button>
          </Barrel.DropdownMenuTrigger>
          <Barrel.DropdownMenuContent>
            <Barrel.DropdownMenuItem>Export CSV</Barrel.DropdownMenuItem>
          </Barrel.DropdownMenuContent>
        </Barrel.DropdownMenu>

        {/* 25. Search Input */}
        <Barrel.SearchInput
          placeholder="Search students..."
          defaultValue="Rahul"
        />

        {/* 26. File Upload */}
        <Barrel.FileUpload hint="CSV or Excel up to 50MB" />

        {/* 27. Empty State */}
        <Barrel.EmptyState
          title="No Quarantined Records"
          description="All student admission records match approved intake quotas."
        />

        {/* 28. Confirmation Dialog */}
        <Barrel.ConfirmationDialog
          open={false}
          onOpenChange={vi.fn()}
          title="Authorize Entitlement Proofs"
          description="This action is statutory and immutable."
          onConfirm={vi.fn()}
        />

        {/* 29. Error Summary */}
        <Barrel.ErrorSummary
          title="Validation Failure"
          errors={[{ fieldId: "full-name", message: "Full Name is required" }]}
        />

        {/* 30. Stepper */}
        <Barrel.Stepper
          currentStepIndex={1}
          steps={[
            { title: "Upload Batch", state: "completed" },
            { title: "Reconciliation", state: "current" },
            { title: "Statutory Approval", state: "upcoming" },
          ]}
        />

        {/* 31. Metric Card */}
        <Barrel.MetricCard
          title="Total Admissions"
          value="1,420"
          delta="+5.2%"
          trend="up"
          status="success"
        />

        {/* 32. Timeline */}
        <Barrel.Timeline
          items={[
            {
              id: "e1",
              title: "Batch Submitted",
              timestamp: "2026-11-03 10:00",
              status: "completed",
            },
            {
              id: "e2",
              title: "Rules Engine Passed",
              timestamp: "2026-11-03 10:05",
              status: "completed",
            },
          ]}
        />

        {/* 33. Status Indicator */}
        <Barrel.StatusIndicator status="compliant" label="Approved" />

        {/* Auxiliaries */}
        <Barrel.Separator />
        <Barrel.SkipLink />
        <Barrel.ButtonGroup label="Actions group">
          <Barrel.Button>B1</Barrel.Button>
          <Barrel.Button>B2</Barrel.Button>
        </Barrel.ButtonGroup>
      </div>,
    );

    expect(container).toBeDefined();
    expect(screen.getByText("Test Button")).toBeInTheDocument();
    expect(screen.getByText("Total Admissions")).toBeInTheDocument();
    expect(screen.getByText("No Quarantined Records")).toBeInTheDocument();
  });

  // =========================================================================
  // Test 5: Table High-Density and Empty/Skeleton Helpers
  // =========================================================================
  it("verify TableEmpty and TableSkeleton row helpers render inside TableBody", () => {
    const { container: emptyContainer } = render(
      <Barrel.Table>
        <Barrel.TableBody>
          <Barrel.TableEmpty colSpan={4} message="No audit records found" />
        </Barrel.TableBody>
      </Barrel.Table>,
    );

    expect(emptyContainer.querySelector("td")).toHaveAttribute("colspan", "4");
    expect(screen.getByText("No audit records found")).toBeInTheDocument();

    const { container: skeletonContainer } = render(
      <Barrel.Table>
        <Barrel.TableBody>
          <Barrel.TableSkeleton columns={3} rows={5} />
        </Barrel.TableBody>
      </Barrel.Table>,
    );

    const skeletonRows = skeletonContainer.querySelectorAll("tr");
    expect(skeletonRows).toHaveLength(5);
    const skeletonCells = skeletonContainer.querySelectorAll("td");
    expect(skeletonCells).toHaveLength(15);
  });
});
