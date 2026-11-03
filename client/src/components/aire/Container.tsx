import React from "react";

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "main" | "header" | "footer" | "nav";
  id?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  as: Component = "div",
  id,
}) => {
  return (
    <Component
      id={id}
      className={`ux4g-container w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </Component>
  );
};
