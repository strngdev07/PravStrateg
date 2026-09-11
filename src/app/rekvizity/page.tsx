import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd, breadcrumbSchema } from "@/lib/schema-org";
import { pageMetadata } from "@/lib/seo";
import { contacts, requisites, site } from "@/content/site";

const TITLE = "Реквизиты";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description:
    "Полные сведения об исполнителе: ИП Новиков Иван Владимирович, ИНН 560910983072, ОГРНИП 312565822900079, юридический и фактический адрес, банковские реквизиты, телефон и электронная почта.",
  path: "/rekvizity",
  ogTitle: "Реквизиты — ИП Новиков Иван Владимирович",
});

type Row = {
  label: string;
  value: string;
  href?: string;
};

function RequisiteTable({ rows }: { rows: readonly Row[] }) {
  return (
    <dl className="border-t border-line">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid gap-1 border-b border-line py-4 sm:grid-cols-[260px_1fr] sm:gap-6"
        >
          <dt className="text-sm text-ink-muted">{row.label}</dt>
          <dd className="text-[0.98rem] break-words text-ink">
            {row.href ? (
              <a
                href={row.href}
                className="text-accent underline-offset-4 hover:underline"
              >
                {row.value}
              </a>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function RequisitesPage() {
  const company: readonly Row[] = [
    { label: "Полное наименование", value: requisites.legalName },
    { label: "Сокращённое наименование", value: requisites.shortLegalName },
    { label: "ИНН", value: requisites.inn },
    { label: "ОГРНИП", value: requisites.ogrnip },
    { label: "Юридический адрес", value: requisites.address },
    { label: "Фактический адрес", value: requisites.address },
    {
      label: "Телефон",
      value: contacts.phone.display,
      href: contacts.phone.href,
    },
    {
      label: "Электронная почта",
      value: contacts.email.display,
      href: contacts.email.href,
    },
    { label: "Сайт", value: "pravstrateg.ru", href: "/" },
  ];

  const bank: readonly Row[] = [
    { label: "Получатель", value: requisites.legalName },
    { label: "Расчётный счёт", value: requisites.bank.account },
    { label: "Банк", value: requisites.bank.name },
    { label: "БИК", value: requisites.bank.bik },
    { label: "Корреспондентский счёт", value: requisites.bank.corrAccount },
  ];

  return (
    <>
      <Section tone="soft" width="narrow">
        <SectionHeading
          as="h1"
          eyebrow="Сведения об исполнителе"
          title={TITLE}
          lead={`Юридические услуги оказывает ${requisites.shortLegalName} под коммерческим обозначением «ПравСтратег». ${site.geo}.`}
        />
      </Section>

      <Section tone="default" divider width="narrow">
        <h2 className="text-2xl sm:text-3xl">Сведения об исполнителе</h2>
        <div className="mt-6">
          <RequisiteTable rows={company} />
        </div>
        {requisites.addressesMatch ? (
          <p className="mt-4 text-sm text-ink-muted">
            Фактический адрес совпадает с юридическим.
          </p>
        ) : null}
      </Section>

      <Section tone="soft" width="narrow">
        <h2 className="text-2xl sm:text-3xl">Банковские реквизиты</h2>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Для оплаты переводом. В назначении платежа укажите номер счёта или
          договора — так платёж будет верно учтён.
        </p>
        <div className="mt-6">
          <RequisiteTable rows={bank} />
        </div>
      </Section>

      <Section tone="default" divider width="narrow">
        <h2 className="text-2xl sm:text-3xl">Связанные документы</h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink href="/oplata" variant="secondary">
            Стоимость и оплата
          </ButtonLink>
          <ButtonLink href="/oplata/pravila" variant="secondary">
            Правила оплаты
          </ButtonLink>
          <ButtonLink href="/oplata/vozvrat" variant="secondary">
            Возврат средств
          </ButtonLink>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema([{ name: TITLE, path: "/rekvizity" }])} />
    </>
  );
}
