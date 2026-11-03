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
    "ux4g-accordion-arrow-right",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={containerClasses}
      style={
        {
          "--ux4g-accordion-button-padding-y": "18px",
          "--ux4g-accordion-button-padding-x": "22px",
          "--ux4g-accordion-body-padding-x": "22px",
          "--ux4g-accordion-body-padding-y": "20px",
          "--ux4g-accordion-title-size": "16px",
          "--ux4g-accordion-title-line-height": "1.45",
          "--ux4g-accordion-body-size": "15px",
          "--ux4g-accordion-body-line-height": "1.65",
          gap: "12px",
        } as React.CSSProperties
      }
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const headerId = `accordion-header-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className={`ux4g-accordion__item ${
              isOpen ? "ux4g-accordion__item--expanded" : ""
            }`}
            style={{
              borderColor: isOpen ? "#CBD5E1" : "#E2E8F0",
              borderWidth: "1px",
              borderStyle: "solid",
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              boxShadow: isOpen
                ? "0 4px 12px -2px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.03)"
                : "none",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            <h3 className="ux4g-accordion__header">
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className={`ux4g-accordion__button ${isOpen ? "" : "collapsed"}`}
                style={{
                  fontWeight: 600,
                  color: isOpen ? "#0F172A" : "#1E293B",
                  backgroundColor: "#FFFFFF",
                  borderRadius: isOpen ? "12px 12px 0 0" : "12px",
                }}
              >
                <span className="ux4g-accordion__button-content">
                  <span className="ux4g-accordion__title">{item.question}</span>
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={`ux4g-accordion__collapse ${isOpen ? "show" : ""}`}
              style={{
                display: isOpen ? "block" : "none",
              }}
            >
              <div
                className="ux4g-accordion__body"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#475569",
                  borderTop: "1px solid #F1F5F9",
                  paddingTop: "12px",
                }}
              >
                {typeof item.answer === "string" ? (
                  <p style={{ margin: 0 }}>{item.answer}</p>
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
