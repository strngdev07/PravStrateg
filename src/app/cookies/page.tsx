import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { JsonLd, breadcrumbSchema } from "@/lib/schema-org";
import { pageMetadata } from "@/lib/seo";
import { POLICY_VERSION, contacts, requisites } from "@/content/site";

const TITLE = "Политика использования файлов cookie";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description:
    "Какие файлы cookie использует сайт pravstrateg.ru, для чего они нужны, сколько хранятся и как отказаться от их использования.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <>
      <LegalPage title={TITLE} updatedAt={POLICY_VERSION}>
        <p className="mb-3.5">
          Настоящая Политика разъясняет, какие файлы cookie использует сайт{" "}
          <strong className="font-medium text-ink">pravstrateg.ru</strong> и как
          пользователь может управлять ими. Оператор сайта —{" "}
          {requisites.legalName}, ИНН {requisites.inn}.
        </p>

        <h2 className="mt-10 mb-4 text-xl text-ink">1. Что такое cookie</h2>
        <p className="mb-3.5">
          Cookie — небольшие файлы, которые создаются и сохраняются браузером
          при посещении сайта. Они позволяют сайту работать корректно, запоминать
          выбранные пользователем настройки и оценивать, как используется сайт.
        </p>

        <h2 className="mt-10 mb-4 text-xl text-ink">
          2. Какие cookie мы используем
        </h2>

        <h3 className="mt-6 mb-2.5 text-lg text-ink">
          2.1. Технические и функциональные
        </h3>
        <p className="mb-3.5">
          Необходимы для работы сайта и запоминания выбранных настроек, в том
          числе решения пользователя по настоящему баннеру о cookie. Такие файлы
          используются постоянно, поскольку без них сайт не может работать
          корректно. Решение пользователя о согласии хранится в браузере на его
          устройстве и Оператору не передаётся.
        </p>

        <h3 className="mt-6 mb-2.5 text-lg text-ink">
          2.2. Аналитические и маркетинговые
        </h3>
        <p className="mb-3.5">
          Представлены сервисом Яндекс.Метрика и используются для сбора и
          статистического анализа сведений об использовании сайта. Эти файлы
          устанавливаются <strong className="font-medium text-ink">только
          после того, как пользователь дал согласие</strong> в баннере о cookie.
          До получения согласия сервис веб-аналитики на сайте не загружается.
        </p>

        <h2 className="mt-10 mb-4 text-xl text-ink">3. Сроки хранения</h2>
        <p className="mb-3.5">
          Файлы cookie хранятся на устройстве пользователя не более одного года
          с момента последнего посещения сайта. Сведения, содержащиеся в файлах
          cookie, обрабатываются в течение того же срока.
        </p>

        <h2 className="mt-10 mb-4 text-xl text-ink">
          4. Как отказаться от cookie
        </h2>
        <p className="mb-3.5">
          Отказаться от аналитических cookie можно, выбрав соответствующий
          вариант в баннере при посещении сайта. Кроме того, настройки
          большинства браузеров позволяют запретить приём cookie либо удалить
          уже сохранённые файлы. Соответствующие инструкции приведены в разделе
          помощи используемого браузера.
        </p>
        <p className="mb-3.5">
          Обращаем внимание, что при отказе от файлов cookie отдельные функции
          сайта могут работать некорректно.
        </p>

        <h2 className="mt-10 mb-4 text-xl text-ink">5. Связанные документы</h2>
        <p className="mb-3.5">
          Общие условия обработки персональных данных, включая раздел 9 «Cookie
          и иные средства веб-аналитики», изложены в{" "}
          <Link
            href="/policy"
            className="text-accent underline underline-offset-4"
          >
            Политике в отношении обработки персональных данных
          </Link>
          . Условия обработки данных, направляемых через форму обращения,
          изложены в{" "}
          <Link
            href="/soglasie"
            className="text-accent underline underline-offset-4"
          >
            Согласии на обработку персональных данных
          </Link>
          .
        </p>
        <p className="mb-3.5">
          Вопросы по настоящей Политике направляйте на адрес{" "}
          <a
            href={contacts.email.href}
            className="text-accent underline underline-offset-4"
          >
            {contacts.email.display}
          </a>
          .
        </p>
      </LegalPage>

      <JsonLd data={breadcrumbSchema([{ name: TITLE, path: "/cookies" }])} />
    </>
  );
}
