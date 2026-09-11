import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { PaymentSystems } from "@/components/blocks/PaymentSystems";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema-org";
import { pageMetadata } from "@/lib/seo";
import { contacts, requisites } from "@/content/site";
import { hourlyRate, priceGroups, priceNotes } from "@/content/pricing";
import { deliveryInfo, paymentSteps } from "@/content/payment";

export const metadata: Metadata = pageMetadata({
  title: "Стоимость и оплата услуг",
  description:
    "Стоимость юридических услуг «ПравСтратег», порядок оформления и оплаты банковской картой VISA, MasterCard и МИР, реквизиты для перевода и порядок оказания услуг.",
  path: "/oplata",
  ogTitle: "Стоимость и оплата услуг",
});

const paymentFaq = [
  {
    question: "Почему цены указаны со словом «от»?",
    answer:
      "Потому что дела с одинаковым названием отличаются по объёму в разы: по количеству документов, числу участников, стадии спора и тому, что уже сделано до нас. Указанная цена — это минимальная стоимость работы в данном формате. Точную цену вы получаете после изучения документов и до начала работы.",
  },
  {
    question: "Когда я узнаю окончательную стоимость?",
    answer:
      "После того как мы изучим ситуацию и документы. Вы получаете описание объёма работы, срок и точную стоимость до начала работы и до какой-либо оплаты. Оценка объёма не оплачивается и не обязывает вас продолжать сотрудничество.",
  },
  {
    question: "Как оплатить банковской картой?",
    answer:
      "После согласования объёма мы направляем вам платёжную ссылку на электронную почту или в мессенджер. По ссылке открывается защищённая страница Банка ВТБ, где вводятся реквизиты карты. Сайт данные карты не получает и не хранит. Принимаются карты VISA, MasterCard и МИР.",
  },
  {
    question: "Как оплатить от организации?",
    answer:
      "Мы выставляем счёт на реквизиты вашей организации и заключаем договор. Оплата производится безналичным переводом с расчётного счёта. Закрывающие документы предоставляем.",
  },
  {
    question: "Нужно ли платить за первичное обращение?",
    answer:
      "Нет. Вы описываете ситуацию, мы говорим, относится ли вопрос к нашим направлениям и что можно сделать. Оплачивается уже конкретная согласованная работа.",
  },
  {
    question: "Можно ли вернуть деньги, если я передумал?",
    answer:
      "Да. Вы вправе отказаться от услуги в любое время до её полного оказания, оплатив фактически понесённые расходы и стоимость уже выполненной части работы. Если мы не приступали к работе, сумма возвращается полностью. Порядок описан в разделе «Возврат средств и отказ от услуг».",
  },
] as const;

function RequisiteRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-line py-3.5 sm:grid-cols-[220px_1fr] sm:gap-4">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className="text-[0.95rem] break-words text-ink">{value}</dd>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <>
      <Section tone="soft">
        <SectionHeading
          as="h1"
          eyebrow="Оплата"
          title="Стоимость и оплата услуг"
          lead="Ниже — минимальная стоимость работы по каждому формату. Точную цену вы узнаёте после оценки объёма и до начала работы."
        />
      </Section>

      <Section tone="default" divider id="stoimost">
        <h2 className="text-2xl sm:text-3xl">Стоимость услуг</h2>

        <div className="mt-8 flex flex-col gap-10">
          {priceGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xl text-ink">{group.title}</h3>
              {group.intro ? (
                <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-ink-soft">
                  {group.intro}
                </p>
              ) : null}

              <dl className="mt-5 border-t border-line">
                {group.rows.map((row) => (
                  <div
                    key={row.title}
                    className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                  >
                    <div className="sm:max-w-xl">
                      <dt className="text-ink">{row.title}</dt>
                      {row.note ? (
                        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                          {row.note}
                        </p>
                      ) : null}
                    </div>
                    <dd className="font-medium text-accent sm:whitespace-nowrap">
                      {row.price}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}

          <div className="border-l-2 border-accent-soft bg-bg-soft px-5 py-4">
            <p className="text-ink">
              <span className="font-medium">{hourlyRate.title}</span>
              {" — "}
              <span className="font-medium text-accent">{hourlyRate.price}</span>
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              {hourlyRate.note}
            </p>
          </div>
        </div>

        <ul className="mt-8 max-w-3xl space-y-2">
          {priceNotes.map((note) => (
            <li
              key={note}
              className="text-sm leading-relaxed text-ink-muted before:mr-2 before:text-accent-soft before:content-['—']"
            >
              {note}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="soft" id="poryadok">
        <h2 className="text-2xl sm:text-3xl">Как заказать и оплатить</h2>

        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {paymentSteps.map((step, index) => (
            <li key={step.title} className="border-t border-line-strong pt-5">
              <span className="eyebrow block">
                Шаг {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg text-ink">{step.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
                {step.text}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h3 className="text-xl text-ink">Способы оплаты</h3>
            <ul className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-ink-soft">
              <li>
                <span className="font-medium text-ink">Банковской картой</span> —
                по платёжной ссылке, которую мы направляем после согласования
                стоимости. Оплата проходит на защищённой странице Банка ВТБ.
              </li>
              <li>
                <span className="font-medium text-ink">Переводом по реквизитам</span>{" "}
                — для физических лиц и организаций. Реквизиты указаны ниже.
              </li>
              <li>
                <span className="font-medium text-ink">По счёту</span> — для
                организаций и индивидуальных предпринимателей, с заключением
                договора и закрывающими документами.
              </li>
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/kontakty?cel=schet#zayavka">
                Запросить счёт
              </ButtonLink>
              <ButtonLink href="/oplata/pravila" variant="secondary">
                Правила оплаты
              </ButtonLink>
            </div>
          </div>

          <div>
            <h3 className="text-xl text-ink">Принимаем к оплате</h3>
            <PaymentSystems
              className="mt-4"
              caption="Оплата картой проходит через Банк ВТБ (ПАО). Реквизиты карты вводятся на странице банка — сайт их не получает и не хранит."
            />
          </div>
        </div>
      </Section>

      <Section tone="default" divider id="okazanie">
        <h2 className="text-2xl sm:text-3xl">{deliveryInfo.title}</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-ink-soft">
          {deliveryInfo.intro}
        </p>
        <ul className="mt-6 max-w-3xl">
          {deliveryInfo.points.map((point) => (
            <li
              key={point}
              className="border-b border-line py-4 leading-relaxed text-ink-soft first:border-t"
            >
              {point}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="soft" id="rekvizity">
        <h2 className="text-2xl sm:text-3xl">Реквизиты для оплаты</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
          В назначении платежа указывайте номер счёта или договора — так платёж
          будет верно учтён.
        </p>

        <dl className="mt-8 max-w-3xl border-t border-line">
          <RequisiteRow label="Получатель" value={requisites.legalName} />
          <RequisiteRow label="ИНН" value={requisites.inn} />
          <RequisiteRow label="ОГРНИП" value={requisites.ogrnip} />
          <RequisiteRow label="Расчётный счёт" value={requisites.bank.account} />
          <RequisiteRow label="Банк" value={requisites.bank.name} />
          <RequisiteRow label="БИК" value={requisites.bank.bik} />
          <RequisiteRow
            label="Корреспондентский счёт"
            value={requisites.bank.corrAccount}
          />
        </dl>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Полные сведения об исполнителе — на странице{" "}
          <a
            href="/rekvizity"
            className="text-accent underline underline-offset-4"
          >
            «Реквизиты»
          </a>
          . По вопросам оплаты:{" "}
          <a
            href={contacts.email.href}
            className="text-accent underline underline-offset-4"
          >
            {contacts.email.display}
          </a>{" "}
          или{" "}
          <a
            href={contacts.phone.href}
            className="text-accent underline underline-offset-4"
          >
            {contacts.phone.display}
          </a>
          .
        </p>
      </Section>

      <Section tone="default" divider width="narrow">
        <h2 className="text-2xl sm:text-3xl">Частые вопросы об оплате</h2>
        <div className="mt-8 flex flex-col">
          {paymentFaq.map((item) => (
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

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink href="/oplata/pravila" variant="secondary">
            Правила оплаты и безопасность
          </ButtonLink>
          <ButtonLink href="/oplata/vozvrat" variant="secondary">
            Возврат средств
          </ButtonLink>
          <ButtonLink href="/rekvizity" variant="secondary">
            Реквизиты
          </ButtonLink>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbSchema([{ name: "Стоимость и оплата", path: "/oplata" }])}
      />
      <JsonLd data={faqSchema(paymentFaq)} />
    </>
  );
}
