import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { contacts, legalNav, mainNav, requisites, site } from "@/content/site";

function messengerLinks() {
  const { whatsapp, telegram, max } = contacts.messengers;
  return [
    { label: "Telegram", href: telegram },
    { label: "WhatsApp", href: whatsapp },
    { label: "MAX", href: max },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href));
}

export function Footer() {
  const year = new Date().getFullYear();
  const messengers = messengerLinks();

  return (
    <footer className="hairline bg-bg-soft">
      <Container width="wide">
        <div className="grid gap-10 py-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <p className="font-display text-xl font-semibold text-ink">
              ПравСтратег
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Юридическая компания под руководством {site.leader.name}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              {site.geo}
            </p>
          </div>

          <nav className="md:col-span-3" aria-label="Разделы сайта">
            <p className="eyebrow mb-4">Разделы</p>
            <ul className="flex flex-col gap-2.5">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-soft transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-5">
            <p className="eyebrow mb-4">Контакты</p>
            <a
              href={contacts.phone.href}
              className="block text-lg font-medium text-ink transition-colors hover:text-accent"
            >
              {contacts.phone.display}
            </a>
            <a
              href={contacts.email.href}
              className="mt-2 block text-sm text-ink-soft transition-colors hover:text-accent"
            >
              {contacts.email.display}
            </a>

            {messengers.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {messengers.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent underline-offset-4 hover:underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="hairline py-8">
          <ul className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-7">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-ink-soft transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-7 space-y-2 text-xs leading-relaxed text-ink-muted">
            <p>
              {requisites.legalName} · ИНН {requisites.inn} · ОГРНИП{" "}
              {requisites.ogrnip}
            </p>
            <p>
              Информация на сайте носит справочный характер, не является
              публичной офертой и не заменяет юридическую консультацию по
              конкретной ситуации.
            </p>
            <p>© {year} ПравСтратег</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
