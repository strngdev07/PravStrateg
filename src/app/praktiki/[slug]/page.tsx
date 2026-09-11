import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { FinalCta } from "@/components/blocks/CommonBlocks";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema-org";
import { pageMetadata } from "@/lib/seo";
import { getPractice, practices, practiceHref } from "@/content/practices";
import { workStages } from "@/content/company";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return practices.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const practice = getPractice(slug);

  if (!practice) {
    return pageMetadata({
      title: "Практика не найдена",
      description: "Запрошенное направление не найдено.",
      path: `/praktiki/${slug}`,
      noindex: true,
    });
  }

  return pageMetadata({
    title: practice.seoTitle,
    description: practice.seoDescription,
    path: practiceHref(practice.slug),
    ogTitle: practice.title,
  });
}

export default async function PracticePage({ params }: PageProps) {
  const { slug } = await params;
  const practice = getPractice(slug);

  if (!practice) notFound();

  const others = practices.filter((item) => item.slug !== practice.slug);

  return (
    <>
      <div className="bg-bg-soft pt-8">
        <Container width="wide">
          <nav aria-label="Хлебные крошки" className="text-sm text-ink-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-accent">
                  Главная
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/praktiki"
                  className="transition-colors hover:text-accent"
                >
                  Практики
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink-soft">
                {practice.navTitle}
              </li>
            </ol>
          </nav>
        </Container>
      </div>

      <Section tone="soft" width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            <h1 className="text-[2rem] sm:text-[2.6rem]">{practice.title}</h1>
            <div className="mt-6 max-w-2xl">
              {practice.intro.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mb-4 text-lg leading-relaxed text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="border border-line bg-bg p-6">
              <p className="eyebrow mb-3">С чего начать</p>
              <p className="text-[0.95rem] leading-relaxed text-ink-soft">
                Опишите ситуацию и приложите документы, которые есть на руках.
                Мы изучим их и скажем, какие есть варианты и что реально можно
                получить.
              </p>
              <ButtonLink
                href="/kontakty?cel=dokumenty#zayavka"
                className="mt-5 w-full"
              >
                Направить документы
              </ButtonLink>
              <ButtonLink
                href="/kontakty#zayavka"
                variant="secondary"
                className="mt-3 w-full"
              >
                Получить консультацию
              </ButtonLink>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="default" divider width="wide">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-2xl sm:text-3xl">С чем к нам обращаются</h2>
            <ul className="mt-6 flex flex-col">
              {practice.problems.map((item) => (
                <li
                  key={item}
                  className="border-b border-line py-4 leading-relaxed text-ink-soft first:border-t"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl">Что мы делаем</h2>
            <ul className="mt-6 flex flex-col">
              {practice.services.map((item) => (
                <li
                  key={item}
                  className="border-b border-line py-4 leading-relaxed text-ink-soft first:border-t"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="soft" width="wide">
        <h2 className="text-2xl sm:text-3xl">Как строится работа</h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {workStages.map((stage, index) => (
            <li key={stage.title} className="border-t border-line-strong pt-5">
              <span className="eyebrow block">
                Шаг {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg text-ink">{stage.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
                {stage.text}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="default" divider width="narrow">
        <h2 className="text-2xl sm:text-3xl">Частые вопросы</h2>
        <div className="mt-8 flex flex-col">
          {practice.faq.map((item) => (
            <details
              key={item.question}
              className="group border-b border-line py-5 first:border-t"
            >
              <summary className="cursor-pointer list-none text-lg font-medium text-ink marker:content-none">
                <span className="flex items-start justify-between gap-4">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-accent-soft transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-ink-soft">{item.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section tone="soft" width="wide">
        <h2 className="text-2xl sm:text-3xl">Другие направления</h2>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          {others.map((item) => (
            <li key={item.slug}>
              <Link
                href={practiceHref(item.slug)}
                className="text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline"
              >
                {item.navTitle}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Практики", path: "/praktiki" },
          { name: practice.navTitle, path: practiceHref(practice.slug) },
        ])}
      />
      <JsonLd data={faqSchema(practice.faq)} />
    </>
  );
}
