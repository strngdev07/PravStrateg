import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  /** narrow — для текстовых страниц, где важна длина строки. */
  width?: "default" | "narrow" | "wide";
  className?: string;
};

const widths = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
} as const;

export function Container({
  children,
  width = "default",
  className = "",
}: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-5 sm:px-8 ${widths[width]} ${className}`}>
      {children}
    </div>
  );
}
