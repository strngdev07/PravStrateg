import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { PaymentSystems } from "@/components/blocks/PaymentSystems";
import { JsonLd, breadcrumbSchema } from "@/lib/schema-org";
import { pageMetadata } from "@/lib/seo";
import { paymentRules } from "@/content/payment";
import { contacts, requisites } from "@/content/site";

const TITLE = "Правила оплаты и безопасность платежей";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description:
    "Порядок оплаты юридических услуг банковской картой VISA, MasterCard и МИР, меры безопасности платежей, защита конфиденциальной информации и передача данных по защищённым каналам.",
  path: "/oplata/pravila",
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

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mb-4 list-disc space-y-2.5 pl-6">
      {items.map((item) => (
        <li key={item} className="pl-1">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PaymentRulesPage() {
  return (
    <>
      <LegalPage title={TITLE}>
        {paymentRules.intro.map((paragraph) => (
          <p key={paragraph} className="mb-3.5">
            {paragraph}
          </p>
        ))}

        <PaymentSystems className="my-7" />

        <h2 className="mt-10 mb-4 text-xl text-ink">
          1. {paymentRules.orderTitle}
        </h2>
        <NumberedList items={paymentRules.order} />

        <h2 className="mt-10 mb-4 text-xl text-ink">
          2. {paymentRules.securityTitle}
        </h2>
        <BulletList items={paymentRules.security} />

        <PaymentSystems
          variant="secure"
          className="my-7"
          caption="Дополнительная аутентификация держателя карты по технологии 3-D Secure."
        />

        <h2 className="mt-10 mb-4 text-xl text-ink">
          3. {paymentRules.cautionTitle}
        </h2>
        <BulletList items={paymentRules.caution} />

        <h2 className="mt-10 mb-4 text-xl text-ink">4. Возврат средств</h2>
        <p className="mb-3.5">
          Порядок отказа от услуг, возврата денежных средств и отмены платежа
          изложен в отдельном документе —{" "}
          <Link
            href="/oplata/vozvrat"
            className="text-accent underline underline-offset-4"
          >
            «Возврат средств и отказ от услуг»
          </Link>
          .
        </p>

        <h2 className="mt-10 mb-4 text-xl text-ink">5. Исполнитель</h2>
        <p className="mb-3.5">
          {requisites.legalName}, ИНН {requisites.inn}, ОГРНИП{" "}
          {requisites.ogrnip}, адрес: {requisites.address}. Телефон:{" "}
          <a
            href={contacts.phone.href}
            className="text-accent underline underline-offset-4"
          >
            {contacts.phone.display}
          </a>
          , электронная почта:{" "}
          <a
            href={contacts.email.href}
            className="text-accent underline underline-offset-4"
          >
            {contacts.email.display}
          </a>
          . Полные сведения — на странице{" "}
          <Link
            href="/rekvizity"
            className="text-accent underline underline-offset-4"
          >
            «Реквизиты»
          </Link>
          .
        </p>
        <p className="mb-3.5">
          Обработка персональных данных осуществляется в соответствии с{" "}
          <Link
            href="/policy"
            className="text-accent underline underline-offset-4"
          >
            Политикой в отношении обработки персональных данных
          </Link>
          .
        </p>
      </LegalPage>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Стоимость и оплата", path: "/oplata" },
          { name: TITLE, path: "/oplata/pravila" },
        ])}
      />
    </>
  );
}
