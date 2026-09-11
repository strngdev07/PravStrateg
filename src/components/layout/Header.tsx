import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";
import { contacts, mainNav } from "@/content/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <Container width="wide">
        <div className="flex h-18 items-center justify-between gap-6">
          <Link
            href="/"
            className="flex shrink-0 flex-col leading-none"
            aria-label="ПравСтратег — на главную"
          >
            <span className="font-display text-xl font-semibold tracking-tight text-ink">
              ПравСтратег
            </span>
            <span className="mt-1 text-[0.68rem] tracking-[0.14em] text-ink-muted uppercase">
              Юридическая компания
            </span>
          </Link>

          <nav
            aria-label="Основная навигация"
            className="hidden lg:block"
          >
            <ul className="flex items-center gap-7">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.95rem] text-ink-soft transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={contacts.phone.href}
              className="text-[0.95rem] font-medium whitespace-nowrap text-ink transition-colors hover:text-accent"
            >
              {contacts.phone.display}
            </a>
            <ButtonLink href="/kontakty#zayavka" size="md">
              Получить консультацию
            </ButtonLink>
          </div>

          <MobileMenu items={mainNav} />
        </div>
      </Container>
    </header>
  );
}
