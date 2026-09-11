export type Audience = "person" | "business" | "both";

export type PracticeFaq = {
  question: string;
  answer: string;
};

export type Practice = {
  slug: string;
  title: string;
  navTitle: string;
  audience: Audience;
  order: number;

  seoTitle: string;
  seoDescription: string;

  summary: string;
  intro: readonly string[];
  problems: readonly string[];
  services: readonly string[];
  faq: readonly PracticeFaq[];
};
