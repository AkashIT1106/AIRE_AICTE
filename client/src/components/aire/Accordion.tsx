import React, { useState } from "react";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
  variant?: "bordered" | "default";
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = "",
  variant = "bordered",
}) => {
  const [openIds, setOpenIds] = useState<string[]>([items[0]?.id || ""]);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  const containerClasses = [
    "ux4g-accordion",
    variant === "bordered" ? "ux4g-accordion-bordered" : "",
    "ux4g-accordion-arrow-right flex flex-col gap-3",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const headerId = `accordion-header-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className={`ux4g-accordion__item bg-neutral-0 rounded-card border transition-all duration-150 ${
              isOpen
                ? "ux4g-accordion__item--expanded border-neutral-300 shadow-xs"
                : "border-neutral-200"
            }`}
          >
            <h3 className="ux4g-accordion__header m-0 p-0 text-base">
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className={`ux4g-accordion__button w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-neutral-800 hover:text-brand-primary transition-colors cursor-pointer select-none ${
                  isOpen ? "" : "collapsed"
                }`}
              >
                <span className="ux4g-accordion__button-content flex-grow pr-4">
                  <span className="ux4g-accordion__title text-base">{item.question}</span>
                </span>
                <span
                  className={`inline-block transition-transform duration-200 text-neutral-600 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                  aria-hidden="true"
                >
                  ›
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={`ux4g-accordion__collapse ${isOpen ? "show block" : "hidden"}`}
            >
              <div className="ux4g-accordion__body px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-sm text-neutral-600 border-t border-neutral-150 leading-relaxed">
                {typeof item.answer === "string" ? (
                  <p className="m-0">{item.answer}</p>
                ) : (
                  item.answer
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const AireAccordion = Accordion;
