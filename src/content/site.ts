/**
 * Единая точка правды по контактам, реквизитам и навигации.
 * Меняется здесь — подхватывается во всём сайте (шапка, подвал, контакты,
 * страница оплаты, Schema.org, письма по заявкам).
 */

export const SITE_URL = "https://pravstrateg.ru";

export const site = {
  name: "ПравСтратег",
  legalName: "ИП Новиков Иван Владимирович",
  shortName: "Юридическая компания «ПравСтратег»",
  leader: {
    name: "Иван Новиков",
    fullName: "Новиков Иван Владимирович",
    role: "Руководитель компании",
  },
  tagline: "Комплексная юридическая помощь для частных клиентов и бизнеса",
  geo: "Работаем по всей России — дистанционно и с выездом при необходимости",
} as const;

export const contacts = {
  phone: {
    display: "+7 922 625 75 32",
    href: "tel:+79226257532",
    raw: "+79226257532",
  },
  email: {
    display: "pravstrateg@mail.ru",
    href: "mailto:pravstrateg@mail.ru",
    raw: "pravstrateg@mail.ru",
  },
  /**
   * Мессенджеры. WhatsApp собирается из номера телефона и работает сразу.
   * Telegram и MAX включаются, как только будут известны аккаунты:
   * достаточно подставить ссылку вместо null — в интерфейсе появятся сами.
   */
  messengers: {
    whatsapp: "https://wa.me/79226257532" as string | null,
    telegram: null as string | null,
    max: null as string | null,
  },
} as const;

/** Реквизиты ИП — подвал, страница оплаты, счета. */
export const requisites = {
  legalName: "Индивидуальный предприниматель Новиков Иван Владимирович",
  shortLegalName: "ИП Новиков Иван Владимирович",
  inn: "560910983072",
  ogrnip: "312565822900079",
  address: "238326, Калининградская область, г. Зеленоградск, ул. Еловая, д. 4а/4",
  bank: {
    account: "40802810700810117114",
    name: 'Филиал «Центральный» Банка ВТБ (ПАО)',
    bik: "044525411",
    corrAccount: "30101810145250000411",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
};

/** Основная навигация. Кейсы и публикации появятся вместе с контентом. */
export const mainNav: readonly NavItem[] = [
  { label: "О компании", href: "/o-kompanii" },
  { label: "Практики", href: "/praktiki" },
  { label: "Для бизнеса", href: "/biznesu" },
  { label: "Оплата", href: "/oplata" },
  { label: "Контакты", href: "/kontakty" },
] as const;

export const legalNav: readonly NavItem[] = [
  { label: "Политика обработки персональных данных", href: "/policy" },
  { label: "Согласие на обработку персональных данных", href: "/soglasie" },
  { label: "Политика cookies", href: "/cookies" },
] as const;

/** Версия политики ПД — попадает в след согласия при отправке формы. */
export const POLICY_VERSION = "04.09.2026";
