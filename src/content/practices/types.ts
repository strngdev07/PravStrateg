/**
 * Контентная модель практики.
 *
 * Новая практика добавляется одним файлом в этой папке и одной строкой
 * в index.ts — шаблон страницы, меню, карточки, sitemap и Schema.org
 * подхватывают её автоматически (CLAUDE.md §3).
 */
export type Audience = "person" | "business" | "both";

export type PracticeFaq = {
  question: string;
  answer: string;
};

export type Practice = {
  /** Часть URL: /praktiki/<slug> */
  slug: string;
  /** H1 страницы практики */
  title: string;
  /** Короткое имя для меню, карточек и хлебных крошек */
  navTitle: string;
  /** Кому адресована — определяет колонку в списке практик */
  audience: Audience;
  /** Порядок вывода */
  order: number;

  seoTitle: string;
  seoDescription: string;

  /** Одно предложение для карточки на главной и в хабе */
  summary: string;
  /** Вводные абзацы под заголовком */
  intro: readonly string[];
  /** «С чем обращаются» — формулировки от лица клиента */
  problems: readonly string[];
  /** «Что мы делаем» — конкретные действия */
  services: readonly string[];
  /** Вопросы и ответы: попадают в разметку FAQPage */
  faq: readonly PracticeFaq[];
};
