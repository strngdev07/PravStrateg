import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { PracticeCard } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { MessengerLinks } from "@/components/ui/MessengerLinks";
import { LeaderPhotoFrame } from "./LeaderPhoto";
import { leaderPhotos } from "@/lib/media";
import { practices, practiceHref } from "@/content/practices";
import {
  approach,
  audienceEntries,
  aboutCopy,
  formats,
  workStages,
} from "@/content/company";
import { contacts, site } from "@/content/site";

/** Два входа для разной аудитории — сразу под первым экраном. */
export function AudienceSplit() {
  return (
    <Section tone="default" divider>
      <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
        {audienceEntries.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="group flex flex-col bg-bg p-8 transition-colors hover:bg-bg-soft sm:p-10"
          >
            <h2 className="text-2xl text-ink transition-colors group-hover:text-accent">
              {entry.title}
            </h2>
            <p className="mt-4 flex-1 leading-relaxed text-ink-soft">
              {entry.text}
            </p>
            <span
              aria-hidden="true"
              className="mt-6 text-sm font-medium text-accent"
            >
              {entry.linkLabel} →
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

/** Сетка практик. limit — сколько показать (на главной меньше, чем в хабе). */
export function PracticesGrid({ limit }: { limit?: number }) {
  const items = typeof limit === "number" ? practices.slice(0, limit) : practices;

  return (
    <Section tone="soft">
      <SectionHeading
        eyebrow="Направления"
        title="Основные практики"
        lead="Каждое направление — это не список услуг, а понимание того, как такие дела разворачиваются на практике и где в них решается исход."
      />

      <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <PracticeCard
            key={item.slug}
            href={practiceHref(item.slug)}
            title={item.navTitle}
            description={item.summary}
            index={index + 1}
          />
        ))}
      </div>

      {typeof limit === "number" && limit < practices.length ? (
        <div className="mt-8">
          <ButtonLink href="/praktiki" variant="secondary">
            Все практики
          </ButtonLink>
        </div>
      ) : null}
    </Section>
  );
}

/** Короткий блок «О компании» вместе с принципами работы. */
export function AboutShort() {
  return (
    <Section tone="default" divider>
      <SectionHeading eyebrow="О компании" title={aboutCopy.principlesTitle} />

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          {aboutCopy.intro.map((paragraph) => (
            <p key={paragraph} className="mb-4 leading-relaxed text-ink-soft">
              {paragraph}
            </p>
          ))}
          <ButtonLink href="/o-kompanii" variant="ghost" className="mt-2">
            Подробнее о компании →
          </ButtonLink>
        </div>

        <ul className="grid gap-px self-start bg-line sm:grid-cols-2 lg:col-span-7">
          {approach.map((item) => (
            <li key={item.title} className="bg-bg p-6">
              <h3 className="text-lg text-ink">{item.title}</h3>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/** Форматы юридической помощи. Цены не указываем — стоимость индивидуальна. */
export function Formats() {
  return (
    <Section tone="soft">
      <SectionHeading
        eyebrow="Форматы работы"
        title="Чем мы можем помочь"
        lead="Стоимость рассчитывается индивидуально: она зависит от объёма документов, сложности спора и того, какой результат нужен. Оценку объёма вы получаете до оплаты."
      />

      <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
        {formats.map((item) => (
          <li key={item.title} className="bg-bg-soft p-6">
            <h3 className="text-lg text-ink">{item.title}</h3>
            <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
              {item.text}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <ButtonLink href="/oplata" variant="secondary">
          Как рассчитывается стоимость
        </ButtonLink>
      </div>
    </Section>
  );
}

/** Этапы работы — снимает тревогу «что будет после обращения». */
export function WorkStages() {
  return (
    <Section tone="default" divider>
      <SectionHeading eyebrow="Порядок работы" title="Как строится работа" />

      <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
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
  );
}

/** Блок руководителя. */
export function LeaderBlock() {
  return (
    <Section tone="soft">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <LeaderPhotoFrame
            photo={leaderPhotos.friendly}
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="mx-auto max-w-xs lg:max-w-none"
          />
        </div>

        <div className="lg:col-span-8">
          <p className="eyebrow mb-3">Руководитель</p>
          <h2 className="text-3xl sm:text-4xl">{site.leader.fullName}</h2>
          <div className="mt-5 max-w-2xl">
            {aboutCopy.leaderText.map((paragraph) => (
              <p key={paragraph} className="mb-4 leading-relaxed text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>
          <ButtonLink href="/o-kompanii" variant="secondary" className="mt-3">
            О компании и подходе
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}

/** Финальный призыв вместе с контактами — один блок вместо двух. */
export function FinalCta() {
  return (
    <Section tone="deep">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <h2 className="text-3xl text-ink-invert sm:text-4xl">
            Опишите ситуацию — скажем прямо, чем можем помочь
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-white/70">
            {aboutCopy.closing}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/kontakty#zayavka" variant="invert" size="lg">
              Получить консультацию
            </ButtonLink>
            <ButtonLink
              href="/kontakty?cel=dokumenty#zayavka"
              size="lg"
              className="border border-white/25 bg-transparent text-ink-invert hover:bg-white/10"
            >
              Направить документы
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-5">
          <p className="eyebrow mb-4 text-white/45">Связаться напрямую</p>
          <a
            href={contacts.phone.href}
            className="block text-2xl font-medium text-ink-invert transition-opacity hover:opacity-80"
          >
            {contacts.phone.display}
          </a>
          <a
            href={contacts.email.href}
            className="mt-3 block text-white/70 transition-opacity hover:opacity-80"
          >
            {contacts.email.display}
          </a>

          <MessengerLinks tone="invert" className="mt-5" />

          <p className="mt-6 text-sm leading-relaxed text-white/50">
            {site.geo}
          </p>
        </div>
      </div>
    </Section>
  );
}
