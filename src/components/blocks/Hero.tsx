import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { LeaderPhotoFrame } from "./LeaderPhoto";
import { leaderPhotos } from "@/lib/media";
import { heroCopy } from "@/content/company";
import { contacts, site } from "@/content/site";

export function Hero() {
  return (
    <section className="bg-bg-soft">
      <Container width="wide">
        <div className="grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5">Юридическая компания</p>

            <h1 className="text-[2rem] leading-[1.15] sm:text-[2.6rem] lg:text-[3.1rem]">
              {heroCopy.title}
            </h1>

            <p className="mt-6 max-w-xl text-lg text-ink-soft sm:text-xl">
              {heroCopy.lead}
            </p>

            <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
              {heroCopy.description}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/kontakty#zayavka" size="lg">
                Получить консультацию
              </ButtonLink>
              <ButtonLink
                href="/kontakty?cel=dokumenty#zayavka"
                variant="secondary"
                size="lg"
              >
                Направить документы на анализ
              </ButtonLink>
            </div>

            <p className="mt-8 text-sm text-ink-muted">
              {site.geo} ·{" "}
              <a
                href={contacts.phone.href}
                className="font-medium text-ink transition-colors hover:text-accent"
              >
                {contacts.phone.display}
              </a>
            </p>
          </div>

          <div className="lg:col-span-5">
            <LeaderPhotoFrame
              photo={leaderPhotos.portrait}
              priority
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 100vw"
              className="mx-auto max-w-sm lg:max-w-none"
            />
            <p className="mt-4 text-center text-sm text-ink-muted lg:text-left">
              <span className="font-medium text-ink">{site.leader.name}</span>
              {" — "}
              {site.leader.role.toLowerCase()}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
