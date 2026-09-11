import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { LeaderPhotoFrame } from "@/components/blocks/LeaderPhoto";
import { leaderPhotos } from "@/lib/media";
import { FinalCta, WorkStages } from "@/components/blocks/CommonBlocks";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema-org";
import { pageMetadata } from "@/lib/seo";
import { businessCopy, businessFaq, businessServices } from "@/content/business";
import { businessPractices, practiceHref } from "@/content/practices";

export const metadata: Metadata = pageMetadata({
  title: "Для бизнеса",
  description:
    "Юридическое сопровождение бизнеса: договорная работа, взыскание задолженности, споры с контрагентами и госорганами, сделки с недвижимостью, обжалование судебных актов.",
  path: "/biznesu",
  ogTitle: businessCopy.title,
});

export default function BusinessPage() {
  return (
    <>
      <Section tone="soft" width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5">Бизнесу</p>
            <h1 className="text-[2rem] sm:text-[2.6rem]">
              {businessCopy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-ink-soft">
              {businessCopy.lead}
            </p>
            <div className="mt-6 max-w-2xl">
              {businessCopy.intro.map((paragraph) => (
                <p key={paragraph} className="mb-4 leading-relaxed text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <LeaderPhotoFrame
              photo={leaderPhotos.full}
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 100vw"
              className="mx-auto max-w-sm lg:max-w-none"
            />
          </div>
        </div>
      </Section>

      <Section tone="default" divider>
        <h2 className="text-2xl sm:text-3xl">Что мы делаем</h2>
        <ul className="mt-8 grid gap-px bg-line sm:grid-cols-2">
          {businessServices.map((item) => (
            <li key={item.title} className="bg-bg p-6 sm:p-7">
              <h3 className="text-lg text-ink">{item.title}</h3>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <WorkStages />

      <Section tone="soft">
        <h2 className="text-2xl sm:text-3xl">Смежные направления</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
          Часть задач бизнеса пересекается с общими практиками — например, споры
          по земле и недвижимости или обжалование решений ведомств.
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          {businessPractices.map((item) => (
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

      <Section tone="default" divider width="narrow">
        <h2 className="text-2xl sm:text-3xl">Частые вопросы</h2>
        <div className="mt-8 flex flex-col">
          {businessFaq.map((item) => (
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

      <FinalCta />

      <JsonLd
        data={breadcrumbSchema([{ name: "Для бизнеса", path: "/biznesu" }])}
      />
      <JsonLd data={faqSchema(businessFaq)} />
    </>
  );
}
