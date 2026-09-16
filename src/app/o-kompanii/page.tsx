import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LeaderPhotoFrame } from "@/components/blocks/LeaderPhoto";
import { FinalCta, WorkStages } from "@/components/blocks/CommonBlocks";
import { JsonLd, breadcrumbSchema } from "@/lib/schema-org";
import { pageMetadata } from "@/lib/seo";
import { leaderPhotos } from "@/lib/media";
import { aboutCopy, approach, formats } from "@/content/company";
import { practices, practiceHref } from "@/content/practices";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "О компании",
  description:
    "«ПравСтратег» — юридическая компания под руководством Ивана Новикова. Разбираем ситуацию до действий, выстраиваем правовую стратегию и сопровождаем клиента до исполнения решения.",
  path: "/o-kompanii",
});

export default function AboutPage() {
  return (
    <>
      <Section tone="soft" width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5">О компании</p>
            <h1 className="text-[2rem] sm:text-[2.6rem]">
              Компания, которая сначала разбирается, а потом действует
            </h1>
            <div className="mt-6 max-w-2xl">
              {aboutCopy.intro.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mb-4 text-lg leading-relaxed text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <LeaderPhotoFrame
              photo={leaderPhotos.friendly}
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 100vw"
              className="mx-auto max-w-sm lg:max-w-none"
            />
          </div>
        </div>
      </Section>

      <Section tone="default" divider>
        <SectionHeading
          eyebrow="Подход"
          title={aboutCopy.principlesTitle}
          lead="Четыре принципа, по которым мы ведём дела. Они определяют, за что мы берёмся и что говорим клиенту в самом начале."
        />
        <ul className="grid gap-px bg-line sm:grid-cols-2">
          {approach.map((item) => (
            <li key={item.title} className="bg-bg p-6 sm:p-7">
              <h3 className="text-lg text-ink">{item.title}</h3>
              <p className="mt-2.5 leading-relaxed text-ink-soft">{item.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="soft" width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <LeaderPhotoFrame
              photo={leaderPhotos.portrait}
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              className="mx-auto max-w-xs lg:max-w-none"
            />
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow mb-3">Руководитель</p>
            <h2 className="text-3xl sm:text-4xl">{site.leader.fullName}</h2>
            <div className="mt-5 max-w-2xl">
              {aboutCopy.leaderText.map((paragraph) => (
                <p key={paragraph} className="mb-4 leading-relaxed text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="default" divider>
        <h2 className="text-2xl sm:text-3xl">Направления</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
          {site.geo}.
        </p>
        <ul className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {practices.map((item) => (
            <li key={item.slug} className="border-b border-line pb-3">
              <Link
                href={practiceHref(item.slug)}
                className="text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline"
              >
                {item.navTitle}
              </Link>
            </li>
          ))}
          <li className="border-b border-line pb-3">
            <Link
              href="/biznesu"
              className="text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline"
            >
              Сопровождение бизнеса
            </Link>
          </li>
        </ul>
      </Section>

      <Section tone="soft">
        <h2 className="text-2xl sm:text-3xl">{aboutCopy.formatsTitle}</h2>
        <ul className="mt-8 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {formats.map((item) => (
            <li key={item.title} className="bg-bg-soft p-6">
              <h3 className="text-lg text-ink">{item.title}</h3>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <WorkStages />

      <FinalCta />

      <JsonLd
        data={breadcrumbSchema([{ name: "О компании", path: "/o-kompanii" }])}
      />
    </>
  );
}
