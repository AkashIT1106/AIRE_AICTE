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
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = "",
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

  return (
    <div className={`ux4g-accordion divide-y divide-[#E2E8F0] border border-[#CBD5E1] rounded-xl bg-white overflow-hidden shadow-xs ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const headerId = `accordion-header-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div key={item.id} className="transition-colors">
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className="w-full py-4.5 px-6 text-left flex items-center justify-between gap-4 font-semibold text-base text-[#0F172A] hover:text-[#2563EB] hover:bg-[#F8FAFC] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#2563EB] transition-colors"
              >
                <span>{item.question}</span>
                <svg
                  className={`w-5 h-5 text-[#64748B] shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[#2563EB]" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </h3>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className="px-6 pb-5 pt-1 text-sm sm:text-base text-[#475569] leading-relaxed bg-[#FFFFFF]"
              >
                {typeof item.answer === "string" ? (
                  <p>{item.answer}</p>
                ) : (
                  item.answer
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
