import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "invert";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[4px] font-medium " +
  "transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-ink-invert hover:bg-accent-hover",
  secondary:
    "border border-line-strong bg-transparent text-ink hover:border-accent hover:text-accent",
  ghost: "text-accent underline-offset-4 hover:underline",
  invert: "bg-bg text-accent hover:bg-bg-soft",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

function classes(variant: Variant, size: Size, extra: string) {
  const sizing = variant === "ghost" ? "-mx-1 px-1 py-2.5" : sizes[size];
  return `${base} ${variants[variant]} ${sizing} ${extra}`.trim();
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ButtonLinkProps) {
  const isExternal = /^(https?:|tel:|mailto:)/.test(href);

  if (isExternal) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes(variant, size, className)}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & ComponentProps<"button">;

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
