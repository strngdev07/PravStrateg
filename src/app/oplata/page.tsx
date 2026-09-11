import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema-org";
import { pageMetadata } from "@/lib/seo";
import { contacts, requisites } from "@/content/site";
import { formats } from "@/content/company";

export const metadata: Metadata = pageMetadata({
  title: "Оплата услуг",
  description:
    "Как рассчитывается стоимость юридических услуг «ПравСтратег», порядок оплаты и реквизиты для перевода. Стоимость определяется индивидуально после оценки объёма работы.",
  path: "/oplata",
});

const paymentFaq = [
  {
    question: "Почему на сайте нет прайс-листа?",
    answer:
      "Потому что честную цену нельзя назвать до того, как понятен объём. Два дела с одинаковым названием могут отличаться в разы: по количеству документов, числу участников, стадии спора и тому, что уже сделано до нас. Фиксированный прайс на сайте в такой ситуации вводил бы в заблуждение.",
  },
  {
    question: "Когда я узнаю стоимость?",
    answer:
      "После того как мы изучим ситуацию и документы. Вы получаете описание объёма работы и её стоимость до начала работы и до какой-либо оплаты. Оценка объёма не обязывает вас продолжать сотрудничество.",
  },
  {
    question: "Как оплатить, если я физическое лицо?",
    answer:
      "Переводом по реквизитам, указанным ниже, или по счёту, который мы направим на почту. В назначении платежа указывается номер счёта или договора. Оплата картой прямо на сайте сейчас не подключена.",
  },
  {
    question: "Как оплатить от организации?",
    answer:
      "Мы выставляем счёт на реквизиты вашей организации и заключаем договор. Оплата производится безналичным переводом с расчётного счёта. Закрывающие документы предоставляем.",
  },
  {
    question: "Нужно ли платить за первичное обращение?",
    answer:
      "Нет. Вы описываете ситуацию, мы говорим, относится ли вопрос к нашим направлениям и что можно сделать. Оплачивается уже конкретная работа — консультация, анализ документов, подготовка документов или ведение дела.",
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
          title="Оплата услуг"
          lead="Стоимость рассчитывается индивидуально под конкретную задачу. Вы узнаёте её до начала работы и до оплаты."
        />
      </Section>

      <Section tone="default" divider>
        <h2 className="text-2xl sm:text-3xl">Как это устроено</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Вы описываете задачу",
              text: "Через форму на сайте, по телефону или в мессенджере. Прикладываете документы, если они есть.",
            },
            {
              title: "Мы оцениваем объём",
              text: "Изучаем ситуацию и определяем, какая работа нужна и сколько времени она займёт.",
            },
            {
              title: "Согласуем стоимость",
              text: "Вы получаете описание работы и её цену. На этом этапе вы ещё ничего не платите.",
            },
            {
              title: "Оплата и работа",
              text: "После согласования выставляем счёт. Для сложных дел — заключаем договор и начинаем работу.",
            },
          ].map((step, index) => (
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

        <div className="mt-10 border-l-2 border-accent-soft bg-bg-soft px-5 py-4">
          <p className="text-[0.95rem] leading-relaxed text-ink-soft">
            <strong className="font-medium text-ink">
              По сложным делам оплата — только после согласования.
            </strong>{" "}
            Предмет работы, её объём, стоимость и условия фиксируются до начала
            работы. Мы не берём оплату за задачу, границы которой ещё не
            определены.
          </p>
        </div>
      </Section>

      <Section tone="soft">
        <h2 className="text-2xl sm:text-3xl">Что можно заказать</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
          Стоимость каждого формата зависит от объёма документов и сложности
          ситуации, поэтому указывается индивидуально.
        </p>
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
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/kontakty?cel=schet#zayavka" size="lg">
            Запросить счёт
          </ButtonLink>
          <ButtonLink
            href="/kontakty#zayavka"
            variant="secondary"
            size="lg"
          >
            Обсудить задачу
          </ButtonLink>
        </div>
      </Section>

      <Section tone="default" divider>
        <h2 className="text-2xl sm:text-3xl">Реквизиты для оплаты</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
          Оплата производится переводом по реквизитам ниже или по счёту, который
          мы направим на вашу почту. В назначении платежа указывайте номер счёта
          или договора — так платёж будет верно учтён.
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
          Оплата банковской картой на сайте сейчас не подключена. Если вам
          удобнее оплатить картой или через СБП — напишите нам, и мы направим
          платёжную ссылку. По вопросам оплаты:{" "}
          <a
            href={contacts.email.href}
            className="text-accent underline underline-offset-4"
          >
            {contacts.email.display}
          </a>
          .
        </p>
      </Section>

      <Section tone="soft" width="narrow">
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
      </Section>

      <JsonLd data={breadcrumbSchema([{ name: "Оплата услуг", path: "/oplata" }])} />
      <JsonLd data={faqSchema(paymentFaq)} />
    </>
  );
}
