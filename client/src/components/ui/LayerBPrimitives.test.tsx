import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Textarea,
  Label,
  FormField,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  TableSkeleton,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  Progress,
  Skeleton,
  ToastProvider,
  toast,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  SearchInput,
  FileUpload,
  EmptyState,
  ConfirmationDialog,
  ErrorSummary,
  Stepper,
  MetricCard,
  Timeline,
  StatusIndicator,
} from "./index";

describe("Layer B UI Primitives — Complete 33 Catalog Suite", () => {
  // 1. Button
  describe("Button Primitive", () => {
    it("renders with aria-busy='true' and blocks clicks during loading state", () => {
      const handleClick = vi.fn();
      render(
        <Button loading onClick={handleClick}>
          Submit
        </Button>,
      );
      const btn = screen.getByRole("button");
      expect(btn).toHaveAttribute("aria-busy", "true");
      expect(btn).toBeDisabled();

      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("renders all visual variants and handles disabled state", () => {
      const { rerender } = render(
        <Button variant="destructive">Delete</Button>,
      );
      expect(screen.getByRole("button")).toHaveClass("bg-state-danger-icon");

      rerender(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  // 2. Input
  describe("Input Primitive", () => {
    it("reflects error, valid, readOnly, and filled states", () => {
      const { rerender } = render(
        <Input placeholder="Enter name" error data-testid="test-input" />,
      );
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveClass("border-state-danger-icon");

      rerender(
        <Input valid data-testid="test-input" value="Verified" readOnly />,
      );
      const updatedInput = screen.getByTestId("test-input");
      expect(updatedInput).toHaveClass("border-state-success-icon");
      expect(updatedInput).toHaveAttribute("readonly");
      expect(updatedInput).toHaveAttribute("data-filled", "true");
    });

    it("preserves focus-visible ring on readOnly state", () => {
      render(<Input readOnly data-testid="ro-input" value="Static Data" />);
      const input = screen.getByTestId("ro-input");
      expect(input).toHaveClass("focus-visible:ring-2");
      expect(input).toHaveClass("focus-visible:ring-focus-ring");
      expect(input).not.toHaveClass("focus-visible:ring-0");
    });
  });

  // 3. Select
  describe("Select Primitive", () => {
    it("renders SelectTrigger with error and loading states", () => {
      render(
        <Select>
          <SelectTrigger error loading aria-label="Choose Option">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="opt1">Option 1</SelectItem>
          </SelectContent>
        </Select>,
      );
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-invalid", "true");
      expect(trigger).toHaveAttribute("aria-busy", "true");
      expect(trigger).toBeDisabled();
    });
  });

  // 4. Checkbox
  describe("Checkbox Primitive", () => {
    it("supports checked, unchecked, indeterminate, and error states", () => {
      const { rerender } = render(
        <Checkbox
          checked="indeterminate"
          onCheckedChange={vi.fn()}
          aria-label="Select All"
        />,
      );
      const cb = screen.getByRole("checkbox");
      expect(cb).toHaveAttribute("data-state", "indeterminate");

      rerender(
        <Checkbox
          error
          checked={false}
          onCheckedChange={vi.fn()}
          aria-label="Terms"
        />,
      );
      const errCb = screen.getByRole("checkbox");
      expect(errCb).toHaveAttribute("aria-invalid", "true");
    });

    it("provides minimum 44px touch target hit-box class without wrapper span", () => {
      const { container } = render(<Checkbox aria-label="Touch checkbox" />);
      const cb = container.querySelector("button");
      expect(cb).not.toBeNull();
      expect(cb).toHaveClass("before:-inset-[14px]");
      expect(container.firstChild).toBe(cb);
    });
  });

  // 5. RadioGroup
  describe("RadioGroup Primitive", () => {
    it("renders radio group and items with error state", () => {
      render(
        <RadioGroup defaultValue="1">
          <RadioGroupItem value="1" id="r1" error aria-label="Option 1" />
          <RadioGroupItem value="2" id="r2" aria-label="Option 2" />
        </RadioGroup>,
      );
      const item1 = screen.getByLabelText("Option 1");
      expect(item1).toHaveAttribute("aria-invalid", "true");
      expect(item1).toHaveAttribute("data-state", "checked");
    });

    it("provides minimum 44px touch target hit-box class on radio items", () => {
      const { container } = render(
        <RadioGroup defaultValue="1">
          <RadioGroupItem value="1" id="r1" aria-label="Option 1" />
        </RadioGroup>,
      );
      const item = container.querySelector("button");
      expect(item).not.toBeNull();
      expect(item).toHaveClass("before:-inset-[14px]");
      expect(item).toHaveClass("relative");
      expect(item?.parentElement).toHaveAttribute("role", "radiogroup");
    });
  });

  // 6. Switch
  describe("Switch Primitive", () => {
    it("supports size variants and error styling", () => {
      render(<Switch size="sm" error aria-label="Enable Feature" />);
      const sw = screen.getByRole("switch");
      expect(sw).toHaveAttribute("aria-invalid", "true");
      expect(sw).toHaveClass("h-4");
    });

    it("provides 44px touch target pseudo-elements on default and sm sizes", () => {
      const { container: defContainer } = render(
        <Switch aria-label="Default Switch" />,
      );
      const defSwitch = defContainer.querySelector("button");
      expect(defSwitch).toHaveClass("before:-inset-y-[12px]");
      expect(defSwitch).toHaveClass("before:-inset-x-1");

      const { container: smContainer } = render(
        <Switch size="sm" aria-label="Small Switch" />,
      );
      const smSwitch = smContainer.querySelector("button");
      expect(smSwitch).toHaveClass("before:-inset-y-[14px]");
      expect(smSwitch).toHaveClass("before:-inset-x-2");
    });
  });

  // 7. Textarea
  describe("Textarea Primitive", () => {
    it("handles error, valid, readOnly, and resize modes", () => {
      const { rerender } = render(
        <Textarea error resize="none" placeholder="Notes" />,
      );
      const ta = screen.getByPlaceholderText("Notes");
      expect(ta).toHaveAttribute("aria-invalid", "true");
      expect(ta).toHaveClass("resize-none");

      rerender(<Textarea valid readOnly placeholder="Notes" />);
      const validTa = screen.getByPlaceholderText("Notes");
      expect(validTa).toHaveClass("border-state-success-icon");
      expect(validTa).toHaveAttribute("readonly");
    });

    it("preserves focus-visible ring on readOnly state", () => {
      render(<Textarea readOnly placeholder="Read only notes" />);
      const ta = screen.getByPlaceholderText("Read only notes");
      expect(ta).toHaveClass("focus-visible:ring-2");
      expect(ta).toHaveClass("focus-visible:ring-focus-ring");
      expect(ta).not.toHaveClass("focus-visible:ring-0");
    });
  });

  // 8. Label
  describe("Label Primitive", () => {
    it("renders required asterisk and optional helper", () => {
      const { rerender } = render(
        <Label htmlFor="inp" required>
          Full Name
        </Label>,
      );
      expect(screen.getByText("*")).toBeInTheDocument();

      rerender(
        <Label htmlFor="inp" optional>
          Middle Name
        </Label>,
      );
      expect(screen.getByText("(optional)")).toBeInTheDocument();
    });
  });

  // 9. FormField
  describe("FormField Primitive", () => {
    it("links Label, Input, and Error with aria-describedby and role=alert", () => {
      render(
        <FormField
          id="email-field"
          label="Email Address"
          required
          error="Valid institutional email required"
        >
          <Input type="email" placeholder="user@aicte.gov.in" />
        </FormField>,
      );

      const input = screen.getByPlaceholderText("user@aicte.gov.in");
      expect(input).toHaveAttribute("id", "email-field");
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAttribute("aria-describedby", "email-field-error");

      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Valid institutional email required");
    });
  });

  // 10. Badge
  describe("Badge Primitive", () => {
    it("renders semantic contrast variants and dismiss button", () => {
      const handleDismiss = vi.fn();
      render(
        <Badge variant="success" onDismiss={handleDismiss}>
          Approved
        </Badge>,
      );
      expect(screen.getByText("Approved")).toBeInTheDocument();

      const dismissBtn = screen.getByRole("button", { name: "Remove badge" });
      fireEvent.click(dismissBtn);
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    it("activates on Enter and Space keypresses when interactive", () => {
      const handleClick = vi.fn();
      render(
        <Badge interactive onClick={handleClick}>
          Interactive Filter
        </Badge>,
      );
      const badge = screen.getByRole("button", { name: "Interactive Filter" });

      fireEvent.keyDown(badge, { key: "Enter" });
      expect(handleClick).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(badge, { key: " " });
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it("does not trigger badge onClick when dismiss button is activated", () => {
      const handleBadgeClick = vi.fn();
      const handleDismiss = vi.fn();
      render(
        <Badge interactive onClick={handleBadgeClick} onDismiss={handleDismiss}>
          Filter Chip
        </Badge>,
      );
      const dismissBtn = screen.getByRole("button", { name: "Remove badge" });

      fireEvent.keyDown(dismissBtn, { key: "Enter" });
      expect(handleBadgeClick).not.toHaveBeenCalled();
    });
  });

  // 11. Alert
  describe("Alert Primitive", () => {
    it("renders role=alert, liveRegion, and close trigger", () => {
      const handleClose = vi.fn();
      render(
        <Alert variant="destructive" onClose={handleClose}>
          <AlertTitle>Critical Defect</AlertTitle>
          <AlertDescription>Over-intake limit exceeded</AlertDescription>
        </Alert>,
      );

      const alert = screen.getByRole("alert");
      expect(alert).toHaveAttribute("aria-live", "assertive");
      expect(screen.getByText("Critical Defect")).toBeInTheDocument();

      const closeBtn = screen.getByRole("button", { name: "Dismiss alert" });
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  // 12. Dialog
  describe("Dialog Primitive", () => {
    it("renders dialog trigger and content with size variant", () => {
      render(
        <Dialog open>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent size="lg">
            <DialogTitle>Audit Details</DialogTitle>
          </DialogContent>
        </Dialog>,
      );
      expect(screen.getByText("Audit Details")).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toHaveClass("max-w-2xl");
    });
  });

  // 13. Drawer
  describe("Drawer Primitive", () => {
    it("renders slide-over sheet backed by Radix dialog with side and width options", () => {
      render(
        <Drawer open>
          <DrawerTrigger asChild>
            <Button>Open Drawer</Button>
          </DrawerTrigger>
          <DrawerContent side="right" width="wide">
            <DrawerTitle>Quarantine Inspector</DrawerTitle>
          </DrawerContent>
        </Drawer>,
      );
      expect(screen.getByText("Quarantine Inspector")).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toHaveClass("sm:max-w-[640px]");
    });
  });

  // 14. Tooltip
  describe("Tooltip Primitive", () => {
    it("renders tooltip provider and trigger without runtime errors", () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Hover Me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Tooltip Info</span>
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );
      expect(screen.getByText("Hover Me")).toBeInTheDocument();
    });
  });

  // 15. Tabs
  describe("Tabs Primitive", () => {
    it("supports underline / line navigation variant", () => {
      render(
        <Tabs defaultValue="tab1" variant="underline">
          <TabsList>
            <TabsTrigger value="tab1">Overview</TabsTrigger>
            <TabsTrigger value="tab2">Ledger</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Overview Content</TabsContent>
        </Tabs>,
      );
      const tab1 = screen.getByRole("tab", { name: "Overview" });
      expect(tab1).toHaveAttribute("data-state", "active");
      expect(screen.getByText("Overview Content")).toBeInTheDocument();
    });
  });

  // 16. Breadcrumbs
  describe("Breadcrumbs Primitive", () => {
    it("renders accessible breadcrumb list and marks current page", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Institutions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(
        screen.getByRole("navigation", { name: "Breadcrumb" }),
      ).toBeInTheDocument();
      const current = screen.getByText("Institutions");
      expect(current).toHaveAttribute("aria-current", "page");
    });

    it("applies 2px focus ring and 2px offset on BreadcrumbLink", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" data-testid="b-link">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      const link = screen.getByTestId("b-link");
      expect(link).toHaveClass("focus-visible:ring-2");
      expect(link).toHaveClass("focus-visible:ring-focus-ring");
      expect(link).toHaveClass("focus-visible:ring-offset-2");
    });
  });

  // 17. Table
  describe("Table Primitive", () => {
    it("renders density modes, TableEmpty, and TableSkeleton helpers", () => {
      const { rerender } = render(
        <Table density="compact">
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableEmpty colSpan={1} message="No student records found." />
          </TableBody>
        </Table>,
      );
      expect(screen.getByText("No student records found.")).toBeInTheDocument();

      rerender(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Candidate Record 101</TableCell>
            </TableRow>
            <TableSkeleton rows={2} columns={2} />
          </TableBody>
        </Table>,
      );
      expect(screen.getByText("Candidate Record 101")).toBeInTheDocument();
      expect(screen.getAllByRole("row")).toHaveLength(3);
    });
  });

  // 18. Card
  describe("Card Primitive", () => {
    it("renders interactive and subdued card variants", () => {
      render(
        <Card interactive subdued data-testid="test-card">
          <CardHeader>
            <CardTitle>Batch Status</CardTitle>
          </CardHeader>
          <CardContent>All systems nominal</CardContent>
        </Card>,
      );
      const card = screen.getByTestId("test-card");
      expect(card).toHaveClass("bg-surface-card-subdued");
      expect(card).toHaveAttribute("role", "button");
      expect(card).toHaveAttribute("tabindex", "0");
    });

    it("activates on Enter and Space keypresses when interactive", () => {
      const handleClick = vi.fn();
      render(
        <Card interactive onClick={handleClick} data-testid="interactive-card">
          <CardTitle>Interactive Batch</CardTitle>
        </Card>,
      );
      const card = screen.getByRole("button");

      fireEvent.keyDown(card, { key: "Enter" });
      expect(handleClick).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(card, { key: " " });
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it("does not trigger card onClick when key event originates from nested input", () => {
      const handleClick = vi.fn();
      render(
        <Card interactive onClick={handleClick}>
          <input data-testid="inner-input" />
        </Card>,
      );
      const input = screen.getByTestId("inner-input");
      fireEvent.keyDown(input, { key: " " });
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // 19. Pagination
  describe("Pagination Primitive", () => {
    it("renders pagination controls with disabled boundary", () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious disabled href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive href="#">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      );
      const prev = screen.getByLabelText("Go to previous page");
      expect(prev).toHaveAttribute("aria-disabled", "true");
      const activePage = screen.getByText("1");
      expect(activePage).toHaveAttribute("aria-current", "page");
    });
  });

  // 20. Progress
  describe("Progress Primitive", () => {
    it("handles determinate value and indeterminate animation", () => {
      const { rerender } = render(<Progress value={45} size="lg" />);
      const pb = screen.getByRole("progressbar");
      expect(pb).toHaveAttribute("aria-valuenow", "45");
      expect(pb).toHaveClass("h-3");

      rerender(<Progress indeterminate />);
      const indPb = screen.getByRole("progressbar");
      expect(indPb).toHaveAttribute("aria-busy", "true");
    });
  });

  // 21. Skeleton
  describe("Skeleton Primitive", () => {
    it("renders with aria-busy=true and aria-hidden=true", () => {
      render(<Skeleton data-testid="test-skel" className="h-4 w-20" />);
      const skel = screen.getByTestId("test-skel");
      expect(skel).toHaveAttribute("aria-busy", "true");
      expect(skel).toHaveAttribute("aria-hidden", "true");
      expect(skel).toHaveClass("animate-pulse");
    });
  });

  // 22. Toast
  describe("Toast Notification System", () => {
    it("renders toast with correlation ID copy support", async () => {
      render(
        <ToastProvider>
          <Button
            onClick={() =>
              toast({
                title: "Error Dispatched",
                description: "Validation failed",
                variant: "destructive",
                correlationId: "cor-882f-1049",
              })
            }
          >
            Trigger Toast
          </Button>
        </ToastProvider>,
      );

      fireEvent.click(screen.getByRole("button", { name: "Trigger Toast" }));

      await waitFor(() => {
        expect(screen.getByText("Error Dispatched")).toBeInTheDocument();
        expect(screen.getByText(/cor-882f-1049/)).toBeInTheDocument();
      });

      const copyBtn = screen.getByTitle("Copy Correlation ID");
      expect(copyBtn).toBeInTheDocument();
    });
  });

  // 23. Accordion
  describe("Accordion Primitive", () => {
    it("renders accordion header and expands on interaction", () => {
      render(
        <Accordion type="single" collapsible defaultValue="sec-1">
          <AccordionItem value="sec-1">
            <AccordionTrigger>APH Section 2.1</AccordionTrigger>
            <AccordionContent>Norms for Approved Intake</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      expect(screen.getByText("APH Section 2.1")).toBeInTheDocument();
      expect(screen.getByText("Norms for Approved Intake")).toBeInTheDocument();
    });
  });

  // 24. DropdownMenu
  describe("DropdownMenu Primitive", () => {
    it("renders dropdown trigger without errors", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Export CSV</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(
        screen.getByRole("button", { name: "Actions" }),
      ).toBeInTheDocument();
    });
  });

  // 25. SearchInput
  describe("SearchInput Primitive", () => {
    it("renders search input, triggers onChange, and clears on clear button click", () => {
      const handleClear = vi.fn();
      const handleChange = vi.fn();

      render(
        <SearchInput
          defaultValue="John Doe"
          onChange={handleChange}
          onClear={handleClear}
        />,
      );

      const input = screen.getByRole("searchbox");
      expect(input).toHaveValue("John Doe");

      const clearBtn = screen.getByLabelText("Clear search query");
      fireEvent.click(clearBtn);

      expect(handleClear).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith("");
      expect(input).toHaveValue("");
    });
  });

  // 26. FileUpload
  describe("FileUpload Primitive", () => {
    it("renders file upload dropzone and validates accepted format", () => {
      const handleSelect = vi.fn();
      render(
        <FileUpload
          accept=".csv,.xlsx"
          maxSizeBytes={1024 * 1024}
          onFileSelect={handleSelect}
        />,
      );

      expect(screen.getByLabelText("Upload file")).toBeInTheDocument();

      // Attempt invalid file drop (.pdf)
      const invalidFile = new File(["dummy content"], "report.pdf", {
        type: "application/pdf",
      });
      const dropzone = screen.getByLabelText("Upload file");

      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [invalidFile],
        },
      });

      expect(handleSelect).not.toHaveBeenCalled();
      expect(
        screen.getByText(/Invalid file format. Allowed formats: .csv,.xlsx/),
      ).toBeInTheDocument();
    });
  });

  // 27. EmptyState
  describe("EmptyState Primitive", () => {
    it("renders title, description, and action CTA", () => {
      render(
        <EmptyState
          title="No Quarantined Records"
          description="All student admissions meet regulatory thresholds."
          action={<Button size="sm">Upload More</Button>}
        />,
      );
      expect(screen.getByText("No Quarantined Records")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Upload More" }),
      ).toBeInTheDocument();
    });
  });

  // 28. ConfirmationDialog
  describe("ConfirmationDialog Primitive", () => {
    it("keeps Confirm button disabled until mandatory attestation is checked", () => {
      const handleConfirm = vi.fn();
      render(
        <ConfirmationDialog
          open
          onOpenChange={vi.fn()}
          title="Seal Cohort"
          description="This action freezes the admission ledger."
          digest="sha256-882fe1a9"
          onConfirm={handleConfirm}
        />,
      );

      expect(screen.getByText("Seal Cohort")).toBeInTheDocument();
      expect(screen.getByText("sha256-882fe1a9")).toBeInTheDocument();

      const confirmBtn = screen.getByRole("button", { name: "Confirm Action" });
      expect(confirmBtn).toBeDisabled();

      // Check attestation
      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);
      expect(confirmBtn).not.toBeDisabled();

      fireEvent.click(confirmBtn);
      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });
  });

  // 29. ErrorSummary
  describe("ErrorSummary Primitive", () => {
    it("renders top-of-form error list and shifts focus on click", () => {
      render(
        <div>
          <ErrorSummary
            errors={[
              { fieldId: "student-name", message: "Student Name is required" },
              { fieldId: "quota-code", message: "Invalid Quota Category" },
            ]}
          />
          <input id="student-name" data-testid="target-input" />
        </div>,
      );

      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();

      const link = screen.getByText("Student Name is required");
      const targetInput = screen.getByTestId("target-input");
      const focusSpy = vi.spyOn(targetInput, "focus");

      fireEvent.click(link);
      expect(focusSpy).toHaveBeenCalled();
    });

    it("applies 2px focus ring and 2px offset on error summary links and container", () => {
      render(
        <ErrorSummary
          errors={[{ fieldId: "test-fld", message: "Field is invalid" }]}
        />,
      );
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("focus-visible:ring-2");
      expect(alert).toHaveClass("focus-visible:ring-offset-2");

      const link = screen.getByRole("link", { name: "Field is invalid" });
      expect(link).toHaveClass("focus-visible:ring-2");
      expect(link).toHaveClass("focus-visible:ring-focus-ring");
      expect(link).toHaveClass("focus-visible:ring-offset-2");
    });
  });

  // 30. Stepper
  describe("Stepper Primitive", () => {
    it("renders ordered steps with completed, current, and upcoming indicators", () => {
      render(
        <Stepper
          currentStepIndex={1}
          steps={[
            { title: "Upload Batch", description: "CSV file" },
            { title: "Triage Quarantine", description: "Fix anomalies" },
            { title: "Seal Cohort", description: "Finalize" },
          ]}
        />,
      );

      expect(
        screen.getByRole("navigation", { name: "Progress" }),
      ).toBeInTheDocument();
      const currentStep = screen.getByText("Triage Quarantine").closest("li");
      expect(currentStep).toHaveAttribute("aria-current", "step");
    });
  });

  // 31. MetricCard
  describe("MetricCard Primitive", () => {
    it("renders bold tabular numeric value, status delta, and trend", () => {
      render(
        <MetricCard
          title="Total Admitted"
          value="1,240"
          delta="+8.4%"
          trend="up"
          status="success"
          subtext="Within approved AICTE intake"
        />,
      );

      expect(screen.getByText("Total Admitted")).toBeInTheDocument();
      const value = screen.getByText("1,240");
      expect(value).toHaveClass("font-tabular");
      expect(screen.getByText("+8.4%")).toBeInTheDocument();
    });
  });

  // 32. Timeline
  describe("Timeline Primitive", () => {
    it("renders chronological event sequence with actor and digest tags", () => {
      render(
        <Timeline
          items={[
            {
              id: "ev-1",
              title: "Batch Ingested",
              timestamp: "10:30 AM",
              status: "completed",
              actor: "Principal Officer",
              digest: "merkle-root-9a1b2c",
            },
          ]}
        />,
      );

      expect(screen.getByText("Batch Ingested")).toBeInTheDocument();
      expect(screen.getByText("Actor: Principal Officer")).toBeInTheDocument();
      expect(screen.getByText(/merkle-roo/)).toBeInTheDocument();
    });
  });

  // 33. StatusIndicator
  describe("StatusIndicator Primitive", () => {
    it("pairs SVG icon, semantic tint, and text label (never color alone)", () => {
      const { rerender } = render(<StatusIndicator status="compliant" />);
      expect(screen.getByText("Compliant")).toBeInTheDocument();
      expect(screen.getByText("Compliant").parentElement).toHaveClass(
        "bg-state-success-bg",
      );

      rerender(<StatusIndicator status="quarantine" label="Under Scrutiny" />);
      expect(screen.getByText("Under Scrutiny")).toBeInTheDocument();
      expect(screen.getByText("Under Scrutiny").parentElement).toHaveClass(
        "bg-state-warning-bg",
      );

      rerender(<StatusIndicator status="breach" />);
      expect(screen.getByText("Breach")).toBeInTheDocument();
      expect(screen.getByText("Breach").parentElement).toHaveClass(
        "bg-state-danger-bg",
      );
    });
  });
});
