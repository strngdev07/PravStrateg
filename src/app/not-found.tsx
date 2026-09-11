import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { practices, practiceHref } from "@/content/practices";
import { contacts } from "@/content/site";

export default function NotFound() {
  return (
    <Section tone="soft" width="narrow">
      <p className="eyebrow mb-4">Ошибка 404</p>
      <h1 className="text-[2rem] sm:text-[2.5rem]">Страница не найдена</h1>
      <p className="mt-5 leading-relaxed text-ink-soft">
        Возможно, адрес введён с опечаткой или страница была перемещена. Ниже —
        основные разделы сайта. Если вы искали ответ на конкретный вопрос,
        напишите нам: подскажем, куда смотреть.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">На главную</ButtonLink>
        <ButtonLink href="/kontakty#zayavka" variant="secondary">
          Задать вопрос
        </ButtonLink>
      </div>

      <h2 className="mt-12 text-xl text-ink">Направления работы</h2>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
        {practices.map((item) => (
          <li key={item.slug}>
            <Link
              href={practiceHref(item.slug)}
              className="text-accent underline-offset-4 hover:underline"
            >
              {item.navTitle}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-ink-muted">
        Или позвоните:{" "}
        <a
          href={contacts.phone.href}
          className="font-medium text-ink hover:text-accent"
        >
          {contacts.phone.display}
        </a>
      </p>
    </Section>
  );
}
