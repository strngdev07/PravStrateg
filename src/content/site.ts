export const SITE_URL = "https://pravstrateg.ru";

export const site = {
  name: "ПравСтратег",
  legalName: "ИП Новиков Иван Владимирович",
  shortName: "Юридическая компания «ПравСтратег»",
  leader: {
    name: "Иван Новиков",
    nameGenitive: "Ивана Новикова",
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
} as const;

export type Messenger = {
  label: string;
  href: string | null;
  note?: string;
};

export const messengers: readonly Messenger[] = [
  { label: "Telegram", href: "https://t.me/IvanNovikov_1" },
  { label: "WhatsApp", href: "https://wa.me/79226257532" },
  { label: "MAX", href: null, note: "по номеру телефона" },
] as const;

export const linkedMessengers = messengers.filter(
  (item): item is Messenger & { href: string } => item.href !== null,
);

export const unlinkedMessengers = messengers.filter(
  (item) => item.href === null,
);

export const requisites = {
  legalName: "Индивидуальный предприниматель Новиков Иван Владимирович",
  shortLegalName: "ИП Новиков Иван Владимирович",
  inn: "560910983072",
  ogrnip: "312565822900079",
  address: "238326, Калининградская область, г. Зеленоградск, ул. Еловая, д. 4а/4",
  addressesMatch: true,
  bank: {
    account: "40802810700810117114",
    name: 'Филиал «Центральный» Банка ВТБ (ПАО)',
    bik: "044525411",
    corrAccount: "30101810145250000411",
  },
} as const;

export const paymentSystems = ["VISA", "MasterCard", "МИР"] as const;

export type NavItem = {
  label: string;
  href: string;
};

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

export const paymentNav: readonly NavItem[] = [
  { label: "Реквизиты", href: "/rekvizity" },
  { label: "Правила оплаты и безопасность платежей", href: "/oplata/pravila" },
  { label: "Возврат средств и отказ от услуг", href: "/oplata/vozvrat" },
] as const;

export const POLICY_VERSION = "04.09.2026";
