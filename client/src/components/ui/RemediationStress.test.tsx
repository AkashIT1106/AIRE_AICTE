import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  ErrorSummary,
} from "./index";

describe("Remediation Adversarial Stress Harness (challenger_m1_r2_1)", () => {
  // =========================================================================
  // 1. Keyboard Activation on Interactive Badge
  // =========================================================================
  describe("Adversarial Stress 1: Badge Keyboard Activation & Isolation", () => {
    it("activates onClick on Enter key when interactive", () => {
      const handleClick = vi.fn();
      render(
        <Badge interactive onClick={handleClick}>
          Interactive Badge
        </Badge>,
      );
      const badge = screen.getByRole("button", { name: "Interactive Badge" });
      expect(badge).toHaveAttribute("tabindex", "0");

      fireEvent.keyDown(badge, { key: "Enter" });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("activates onClick and calls preventDefault on Space key to block window scroll", () => {
      const handleClick = vi.fn();
      render(
        <Badge interactive onClick={handleClick}>
          Space Badge
        </Badge>,
      );
      const badge = screen.getByRole("button", { name: "Space Badge" });

      const spaceEvent = new KeyboardEvent("keydown", {
        key: " ",
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(spaceEvent, "preventDefault");
      badge.dispatchEvent(spaceEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("ignores non-activation keys (Tab, Escape, ArrowDown, Shift)", () => {
      const handleClick = vi.fn();
      render(
        <Badge interactive onClick={handleClick}>
          Key Test
        </Badge>,
      );
      const badge = screen.getByRole("button", { name: "Key Test" });

      fireEvent.keyDown(badge, { key: "Escape" });
      fireEvent.keyDown(badge, { key: "Tab" });
      fireEvent.keyDown(badge, { key: "ArrowDown" });
      fireEvent.keyDown(badge, { key: "Shift" });

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("does not fire badge onClick when dismiss button receives Enter or Space", () => {
      const handleBadgeClick = vi.fn();
      const handleDismiss = vi.fn();
      render(
        <Badge interactive onClick={handleBadgeClick} onDismiss={handleDismiss}>
          Tag With Dismiss
        </Badge>,
      );

      const dismissBtn = screen.getByRole("button", { name: "Remove badge" });
      expect(dismissBtn).toBeInTheDocument();

      fireEvent.keyDown(dismissBtn, { key: "Enter" });
      expect(handleBadgeClick).not.toHaveBeenCalled();

      fireEvent.keyDown(dismissBtn, { key: " " });
      expect(handleBadgeClick).not.toHaveBeenCalled();

      fireEvent.click(dismissBtn);
      expect(handleDismiss).toHaveBeenCalledTimes(1);
      expect(handleBadgeClick).not.toHaveBeenCalled();
    });

    it("does not trigger keyboard activation if onKeyDown already prevented default", () => {
      const handleClick = vi.fn();
      render(
        <Badge
          interactive
          onClick={handleClick}
          onKeyDown={(e) => e.preventDefault()}
        >
          Pre-prevented
        </Badge>,
      );
      const badge = screen.getByRole("button", { name: "Pre-prevented" });

      fireEvent.keyDown(badge, { key: "Enter" });
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("does not assign role=button or tabIndex when non-interactive", () => {
      render(<Badge>Static Label</Badge>);
      const badge = screen.getByText("Static Label").closest("div");
      expect(badge).not.toHaveAttribute("role");
      expect(badge).not.toHaveAttribute("tabindex");
    });
  });

  // =========================================================================
  // 2. Keyboard Activation on Interactive Card
  // =========================================================================
  describe("Adversarial Stress 2: Card Keyboard Activation & Nested Control Containment", () => {
    it("activates Card onClick on Enter key when interactive", () => {
      const handleClick = vi.fn();
      render(
        <Card interactive onClick={handleClick}>
          <CardTitle>Interactive Card</CardTitle>
        </Card>,
      );
      const card = screen.getByRole("button");
      expect(card).toHaveAttribute("tabindex", "0");

      fireEvent.keyDown(card, { key: "Enter" });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("activates Card onClick and calls preventDefault on Space key", () => {
      const handleClick = vi.fn();
      render(
        <Card interactive onClick={handleClick}>
          <CardTitle>Card Title</CardTitle>
        </Card>,
      );
      const card = screen.getByRole("button");

      const spaceEvent = new KeyboardEvent("keydown", {
        key: " ",
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(spaceEvent, "preventDefault");
      card.dispatchEvent(spaceEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not activate Card when nested input receives Space (preserves typing)", () => {
      const handleCardClick = vi.fn();
      render(
        <Card interactive onClick={handleCardClick}>
          <CardHeader>
            <CardTitle>Form Inside Card</CardTitle>
          </CardHeader>
          <CardContent>
            <input data-testid="card-nested-input" type="text" />
          </CardContent>
        </Card>,
      );

      const input = screen.getByTestId("card-nested-input");
      const spaceEvent = new KeyboardEvent("keydown", {
        key: " ",
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(spaceEvent, "preventDefault");
      input.dispatchEvent(spaceEvent);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(handleCardClick).not.toHaveBeenCalled();
    });

    it("does not activate Card when nested button receives Enter or Space", () => {
      const handleCardClick = vi.fn();
      const handleBtnClick = vi.fn();
      render(
        <Card interactive onClick={handleCardClick}>
          <CardContent>
            <button data-testid="card-nested-btn" onClick={handleBtnClick}>
              Action
            </button>
          </CardContent>
        </Card>,
      );

      const nestedBtn = screen.getByTestId("card-nested-btn");

      fireEvent.keyDown(nestedBtn, { key: "Enter" });
      expect(handleCardClick).not.toHaveBeenCalled();

      fireEvent.keyDown(nestedBtn, { key: " " });
      expect(handleCardClick).not.toHaveBeenCalled();
    });

    it("does not assign role=button or tabIndex when Card is not interactive", () => {
      const { container } = render(
        <Card>
          <CardTitle>Static Card</CardTitle>
        </Card>,
      );
      const card = container.firstChild;
      expect(card).not.toHaveAttribute("role");
      expect(card).not.toHaveAttribute("tabindex");
    });
  });

  // =========================================================================
  // 3. Focus Rings on Readonly Controls (Input & Textarea)
  // =========================================================================
  describe("Adversarial Stress 3: Readonly Controls Focus Ring Preservation", () => {
    it("Input maintains visible 2px focus ring classes on readOnly=true", () => {
      render(
        <Input
          readOnly
          data-testid="ro-input"
          value="Institutional Ref 4981"
        />,
      );
      const input = screen.getByTestId("ro-input");

      expect(input).toHaveClass("focus-visible:ring-2");
      expect(input).toHaveClass("focus-visible:ring-focus-ring");
      expect(input).toHaveClass("focus-visible:ring-offset-2");
      expect(input).toHaveClass("bg-surface-card-subdued");
      expect(input).toHaveClass("text-txt-secondary");

      // Adversarial check: verify suppression classes are strictly ABSENT
      expect(input.className).not.toContain("focus-visible:ring-0");
      expect(input.className).not.toContain("focus-visible:ring-offset-0");

      // Verify element can receive programmatic and tab focus
      input.focus();
      expect(document.activeElement).toBe(input);
    });

    it("Textarea maintains visible 2px focus ring classes on readOnly=true", () => {
      render(
        <Textarea
          readOnly
          data-testid="ro-textarea"
          value="Fixed audit notes cannot be altered."
        />,
      );
      const textarea = screen.getByTestId("ro-textarea");

      expect(textarea).toHaveClass("focus-visible:ring-2");
      expect(textarea).toHaveClass("focus-visible:ring-focus-ring");
      expect(textarea).toHaveClass("focus-visible:ring-offset-2");
      expect(textarea).toHaveClass("bg-surface-card-subdued");
      expect(textarea).toHaveClass("text-txt-secondary");

      // Adversarial check: verify suppression classes are strictly ABSENT
      expect(textarea.className).not.toContain("focus-visible:ring-0");
      expect(textarea.className).not.toContain("focus-visible:ring-offset-0");

      textarea.focus();
      expect(document.activeElement).toBe(textarea);
    });
  });

  // =========================================================================
  // 4. Touch Target Classes (Checkbox, RadioGroupItem, Switch)
  // =========================================================================
  describe("Adversarial Stress 4: Touch Target Hit-Box Classes (44px Minimum)", () => {
    it("Checkbox includes 44px hit-box pseudo-element (before:-inset-[14px]) without wrapping span", () => {
      const { container } = render(<Checkbox aria-label="Touch Checkbox" />);
      const btn = container.querySelector("button");

      expect(btn).not.toBeNull();
      expect(btn).toHaveClass("h-4"); // 16px
      expect(btn).toHaveClass("w-4"); // 16px
      expect(btn).toHaveClass("relative");
      expect(btn).toHaveClass("before:content-['']");
      expect(btn).toHaveClass("before:absolute");
      expect(btn).toHaveClass("before:-inset-[14px]");

      // Verify NO wrapping <span> that would break peer-* sibling selectors
      expect(container.firstElementChild?.tagName.toLowerCase()).toBe("button");
    });

    it("Checkbox works with sibling peer-* selectors without wrapping span", () => {
      const { container } = render(
        <div className="flex items-center">
          <Checkbox id="peer-cb" />
          <label
            htmlFor="peer-cb"
            className="peer-disabled:opacity-50 text-sm"
            data-testid="peer-label"
          >
            Agree to Terms
          </label>
        </div>,
      );

      const cb = container.querySelector("button#peer-cb");
      expect(cb).not.toBeNull();
      expect(cb).toHaveClass("peer");
      // The direct next sibling must be the label
      expect(cb?.nextElementSibling).toBe(screen.getByTestId("peer-label"));
    });

    it("RadioGroupItem includes 44px hit-box pseudo-element (before:-inset-[14px])", () => {
      const { container } = render(
        <RadioGroup defaultValue="opt1">
          <RadioGroupItem value="opt1" id="r-opt1" aria-label="Opt 1" />
        </RadioGroup>,
      );
      const item = container.querySelector("button#r-opt1");

      expect(item).not.toBeNull();
      expect(item).toHaveClass("size-4"); // 16px
      expect(item).toHaveClass("relative");
      expect(item).toHaveClass("peer");
      expect(item).toHaveClass("before:content-['']");
      expect(item).toHaveClass("before:absolute");
      expect(item).toHaveClass("before:-inset-[14px]");

      // Direct parent is radiogroup root
      expect(item?.parentElement).toHaveAttribute("role", "radiogroup");
    });

    it("Switch includes 44px hit-box pseudo-elements for default variant (20x36px -> 44x44px)", () => {
      const { container } = render(<Switch aria-label="Default Switch" />);
      const sw = container.querySelector("button");

      expect(sw).not.toBeNull();
      expect(sw).toHaveClass("h-5"); // 20px
      expect(sw).toHaveClass("w-9"); // 36px
      expect(sw).toHaveClass("relative");
      expect(sw).toHaveClass("before:content-['']");
      expect(sw).toHaveClass("before:absolute");
      // 20px + 2*12px = 44px height; 36px + 2*4px = 44px width
      expect(sw).toHaveClass("before:-inset-y-[12px]");
      expect(sw).toHaveClass("before:-inset-x-1");
    });

    it("Switch includes 44px hit-box pseudo-elements for sm variant (16x28px -> 44x44px)", () => {
      const { container } = render(
        <Switch size="sm" aria-label="Small Switch" />,
      );
      const sw = container.querySelector("button");

      expect(sw).not.toBeNull();
      expect(sw).toHaveClass("h-4"); // 16px
      expect(sw).toHaveClass("w-7"); // 28px
      expect(sw).toHaveClass("relative");
      expect(sw).toHaveClass("before:content-['']");
      expect(sw).toHaveClass("before:absolute");
      // 16px + 2*14px = 44px height; 28px + 2*8px = 44px width
      expect(sw).toHaveClass("before:-inset-y-[14px]");
      expect(sw).toHaveClass("before:-inset-x-2");
    });
  });

  // =========================================================================
  // 5. Breadcrumb & ErrorSummary Uniform Focus Ring Checks
  // =========================================================================
  describe("Adversarial Stress 5: Focus Ring Standard Uniformity", () => {
    it("BreadcrumbLink uses 2px focus ring and 2px offset", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/test" data-testid="b-link">
                Test
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

    it("ErrorSummary links use 2px focus ring and 2px offset", () => {
      render(
        <ErrorSummary
          errors={[{ fieldId: "quota", message: "Quota mismatch" }]}
        />,
      );
      const link = screen.getByRole("link", { name: "Quota mismatch" });
      expect(link).toHaveClass("focus-visible:ring-2");
      expect(link).toHaveClass("focus-visible:ring-focus-ring");
      expect(link).toHaveClass("focus-visible:ring-offset-2");
    });
  });
});
