import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Карточка практики — типографическая, без фотографий.
 * CLAUDE.md §2 прямо запрещает стоковые фото и дешёвые юридические иконки.
 */
type PracticeCardProps = {
  href: string;
  title: string;
  description: string;
  index?: number;
};

export function PracticeCard({
  href,
  title,
  description,
  index,
}: PracticeCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col border border-line bg-bg p-6 transition-colors duration-150 hover:border-accent-soft sm:p-7"
    >
      {typeof index === "number" ? (
        <span className="eyebrow mb-4 block">
          {String(index).padStart(2, "0")}
        </span>
      ) : null}
      <h3 className="text-xl text-ink transition-colors group-hover:text-accent">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">
        {description}
      </p>
      <span
        aria-hidden="true"
        className="mt-5 text-sm font-medium text-accent-soft transition-colors group-hover:text-accent"
      >
        Подробнее →
      </span>
    </Link>
  );
}

type PlainCardProps = {
  title: string;
  children: ReactNode;
  eyebrow?: string;
};

export function PlainCard({ title, children, eyebrow }: PlainCardProps) {
  return (
    <div className="border border-line bg-bg p-6 sm:p-7">
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h3 className="text-lg text-ink">{title}</h3>
      <div className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
        {children}
      </div>
    </div>
  );
}
