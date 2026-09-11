import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { JsonLd, breadcrumbSchema } from "@/lib/schema-org";
import { pageMetadata } from "@/lib/seo";
import { refundRules } from "@/content/payment";
import { contacts, requisites } from "@/content/site";

const TITLE = "Возврат средств и отказ от услуг";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description:
    "Порядок отказа от юридических услуг, возврата денежных средств и отмены платежа, совершённого банковской картой. Сроки рассмотрения заявления и зачисления средств.",
  path: "/oplata/vozvrat",
});

function NumberedList({ items }: { items: readonly string[] }) {
  return (
    <ol className="mb-4 list-decimal space-y-2.5 pl-6">
      {items.map((item) => (
        <li key={item} className="pl-1">
          {item}
        </li>
      ))}
    </ol>
  );
}

export default function RefundPage() {
  return (
    <>
      <LegalPage title={TITLE}>
        {refundRules.intro.map((paragraph) => (
          <p key={paragraph} className="mb-3.5">
            {paragraph}
          </p>
        ))}

        <h2 className="mt-10 mb-4 text-xl text-ink">
          1. {refundRules.rightTitle}
        </h2>
        <NumberedList items={refundRules.right} />

        <h2 className="mt-10 mb-4 text-xl text-ink">
          2. {refundRules.procedureTitle}
        </h2>
        <NumberedList items={refundRules.procedure} />

        <h2 className="mt-10 mb-4 text-xl text-ink">
          3. {refundRules.cancelTitle}
        </h2>
        <NumberedList items={refundRules.cancel} />

        <h2 className="mt-10 mb-4 text-xl text-ink">4. Куда обращаться</h2>
        <p className="mb-3.5">
          Заявление об отказе от услуги и о возврате денежных средств
          направляйте на адрес электронной почты{" "}
          <a
            href={contacts.email.href}
            className="text-accent underline underline-offset-4"
          >
            {contacts.email.display}
          </a>{" "}
          либо по почтовому адресу: {requisites.address}.
        </p>
        <p className="mb-3.5">
          Для срочной связи — телефон{" "}
          <a
            href={contacts.phone.href}
            className="text-accent underline underline-offset-4"
          >
            {contacts.phone.display}
          </a>
          .
        </p>
        <p className="mb-3.5">
          Исполнитель: {requisites.legalName}, ИНН {requisites.inn}, ОГРНИП{" "}
          {requisites.ogrnip}. Полные сведения — на странице{" "}
          <Link
            href="/rekvizity"
            className="text-accent underline underline-offset-4"
          >
            «Реквизиты»
          </Link>
          .
        </p>
        <p className="mb-3.5">
          Порядок оплаты и меры безопасности платежей изложены в документе{" "}
          <Link
            href="/oplata/pravila"
            className="text-accent underline underline-offset-4"
          >
            «Правила оплаты и безопасность платежей»
          </Link>
          .
        </p>
      </LegalPage>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Стоимость и оплата", path: "/oplata" },
          { name: TITLE, path: "/oplata/vozvrat" },
        ])}
      />
    </>
  );
}
