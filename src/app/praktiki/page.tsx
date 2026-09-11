import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { PracticeCard } from "@/components/ui/Card";
import { FinalCta } from "@/components/blocks/CommonBlocks";
import { JsonLd, breadcrumbSchema } from "@/lib/schema-org";
import { pageMetadata } from "@/lib/seo";
import {
  businessPractices,
  personPractices,
  practices,
  practiceHref,
} from "@/content/practices";

export const metadata: Metadata = pageMetadata({
  title: "Практики",
  description:
    "Направления работы «ПравСтратег»: семейные и имущественные дела, наследство, земля и недвижимость, административные споры, права военнослужащих, апелляция и кассация.",
  path: "/praktiki",
});

function PracticeLinkList({
  title,
  items,
  extra,
}: {
  title: string;
  items: typeof practices;
  extra?: { label: string; href: string };
}) {
  return (
    <div>
      <h2 className="text-2xl text-ink">{title}</h2>
      <ul className="mt-5 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={practiceHref(item.slug)}
              className="text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline"
            >
              {item.navTitle}
            </Link>
          </li>
        ))}
        {extra ? (
          <li>
            <Link
              href={extra.href}
              className="text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline"
            >
              {extra.label}
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default function PracticesPage() {
  return (
    <>
      <Section tone="soft">
        <SectionHeading
          as="h1"
          eyebrow="Направления"
          title="Практики"
          lead="Мы ведём дела в тех областях, где хорошо понимаем, как они разворачиваются на практике. Если ваш вопрос не попадает ни в одно направление — напишите, мы скажем прямо, берёмся ли за него."
        />

        <div className="grid gap-10 border-t border-line pt-10 sm:grid-cols-2 sm:gap-14">
          <PracticeLinkList title="Физическим лицам" items={personPractices} />
          <PracticeLinkList
            title="Юридическим лицам"
            items={businessPractices}
            extra={{ label: "Сопровождение бизнеса", href: "/biznesu" }}
          />
        </div>
      </Section>

      <Section tone="default" divider>
        <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {practices.map((item, index) => (
            <PracticeCard
              key={item.slug}
              href={practiceHref(item.slug)}
              title={item.navTitle}
              description={item.summary}
              index={index + 1}
            />
          ))}
        </div>
      </Section>

      <FinalCta />

      <JsonLd data={breadcrumbSchema([{ name: "Практики", path: "/praktiki" }])} />
    </>
  );
}
