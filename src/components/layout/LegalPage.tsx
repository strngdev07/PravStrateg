import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type LegalPageProps = {
  title: string;
  updatedAt?: string;
  children: ReactNode;
};

export function LegalPage({ title, updatedAt, children }: LegalPageProps) {
  return (
    <>
      <div className="bg-bg-soft py-12 md:py-16">
        <Container width="narrow">
          <p className="eyebrow mb-4">Правовые документы</p>
          <h1 className="text-[1.9rem] sm:text-[2.4rem]">{title}</h1>
          {updatedAt ? (
            <p className="mt-4 text-sm text-ink-muted">
              Редакция от {updatedAt}
            </p>
          ) : null}
        </Container>
      </div>

      <div className="py-12 md:py-16">
        <Container width="narrow">
          <article className="legal-body text-[0.98rem] leading-relaxed text-ink-soft">
            {children}
          </article>
        </Container>
      </div>
    </>
  );
}
