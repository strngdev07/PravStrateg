import type { ReactNode } from "react";
import { Container } from "./Container";

type SectionProps = {
  children: ReactNode;
  tone?: "default" | "soft" | "muted" | "deep";
  width?: "default" | "narrow" | "wide";
  divider?: boolean;
  id?: string;
  className?: string;
};

const tones = {
  default: "bg-bg",
  soft: "bg-bg-soft",
  muted: "bg-bg-muted",
  deep: "bg-bg-deep text-ink-invert",
} as const;

export function Section({
  children,
  tone = "default",
  width = "default",
  divider = false,
  id,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`section-y ${tones[tone]} ${divider ? "hairline" : ""} ${className}`}
    >
      <Container width={width}>{children}</Container>
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Tag = "h2",
  align = "left",
}: SectionHeadingProps) {
  return (
    <header
      className={`mb-10 max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <Tag className="text-3xl sm:text-4xl">{title}</Tag>
      {lead ? (
        <p className="mt-4 text-lg text-ink-soft">{lead}</p>
      ) : null}
    </header>
  );
}
