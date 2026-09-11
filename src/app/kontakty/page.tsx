import type { Metadata } from "next";
import { Suspense } from "react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LeadForm } from "@/components/forms/LeadForm";
import { JsonLd, breadcrumbSchema } from "@/lib/schema-org";
import { pageMetadata } from "@/lib/seo";
import { contacts, requisites, site } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Контакты",
  description:
    "Связаться с юридической компанией «ПравСтратег»: телефон +7 922 625 75 32, почта pravstrateg@mail.ru. Опишите ситуацию через форму и приложите документы.",
  path: "/kontakty",
});

export default function ContactsPage() {
  const messengers = [
    { label: "Telegram", href: contacts.messengers.telegram },
    { label: "WhatsApp", href: contacts.messengers.whatsapp },
    { label: "MAX", href: contacts.messengers.max },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href));

  return (
    <>
      <Section tone="soft">
        <SectionHeading
          as="h1"
          eyebrow="Контакты"
          title="Опишите ситуацию"
          lead="Расскажите, что произошло, и приложите документы, которые есть на руках. Мы изучим их и скажем, чем можем помочь и что реально можно сделать."
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <div className="border border-line bg-bg p-6">
              <p className="eyebrow mb-4">Связаться напрямую</p>

              <a
                href={contacts.phone.href}
                className="block text-2xl font-medium text-ink transition-colors hover:text-accent"
              >
                {contacts.phone.display}
              </a>
              <a
                href={contacts.email.href}
                className="mt-3 block text-ink-soft transition-colors hover:text-accent"
              >
                {contacts.email.display}
              </a>

              {messengers.length > 0 ? (
                <>
                  <p className="eyebrow mt-7 mb-3">Мессенджеры</p>
                  <ul className="flex flex-wrap gap-x-5 gap-y-2">
                    {messengers.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent underline-offset-4 hover:underline"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <p className="mt-7 border-t border-line pt-5 text-sm leading-relaxed text-ink-soft">
                {site.geo}. Документы принимаем в электронном виде, связь по
                телефону и в мессенджерах.
              </p>
            </div>

            <div className="mt-6 border border-line bg-bg p-6">
              <p className="eyebrow mb-3">Реквизиты</p>
              <dl className="space-y-2 text-sm text-ink-soft">
                <div>
                  <dt className="inline text-ink-muted">Наименование: </dt>
                  <dd className="inline">{requisites.legalName}</dd>
                </div>
                <div>
                  <dt className="inline text-ink-muted">ИНН: </dt>
                  <dd className="inline">{requisites.inn}</dd>
                </div>
                <div>
                  <dt className="inline text-ink-muted">ОГРНИП: </dt>
                  <dd className="inline">{requisites.ogrnip}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div id="zayavka" className="scroll-mt-24">
              {/* Форма читает цель обращения из адреса (?cel=...) — нужна граница Suspense. */}
              <Suspense
                fallback={
                  <div className="border border-line bg-bg p-6 sm:p-8">
                    <p className="text-ink-muted">Загружаем форму…</p>
                  </div>
                }
              >
                <LeadForm />
              </Suspense>
            </div>
          </div>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema([{ name: "Контакты", path: "/kontakty" }])} />
    </>
  );
}
