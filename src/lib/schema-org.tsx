import { SITE_URL, contacts, requisites, site } from "@/content/site";

/**
 * Разметка Schema.org — CLAUDE.md §14.
 * LegalService + Person для организации и руководителя,
 * BreadcrumbList для вложенных страниц, FAQPage для блоков вопросов.
 */

export function legalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${SITE_URL}/#organization`,
    name: site.shortName,
    legalName: requisites.legalName,
    url: SITE_URL,
    description: site.tagline,
    telephone: contacts.phone.raw,
    email: contacts.email.raw,
    taxID: requisites.inn,
    priceRange: "Стоимость рассчитывается индивидуально",
    areaServed: { "@type": "Country", name: "Россия" },
    availableLanguage: { "@type": "Language", name: "Русский" },
    founder: { "@id": `${SITE_URL}/#leader` },
    image: `${SITE_URL}/og/pravstrateg.jpg`,
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#leader`,
    name: site.leader.name,
    alternateName: site.leader.fullName,
    jobTitle: site.leader.role,
    worksFor: { "@id": `${SITE_URL}/#organization` },
    url: `${SITE_URL}/o-kompanii`,
    telephone: contacts.phone.raw,
    email: contacts.email.raw,
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: readonly Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Главная", path: "/" }, ...crumbs].map(
      (crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.path === "/" ? SITE_URL : `${SITE_URL}${crumb.path}`,
      }),
    ),
  };
}

export type FaqItem = { question: string; answer: string };

export function faqSchema(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Безопасный вывод JSON-LD в разметку. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
