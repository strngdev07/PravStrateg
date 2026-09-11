import type { Practice } from "./types";

import { practice as semejnye } from "./semejnye-i-imushchestvennye";
import { practice as nasledstvennye } from "./nasledstvennye";
import { practice as zemelnye } from "./zemelnye-i-nedvizhimost";
import { practice as administrativnye } from "./administrativnye";
import { practice as voennosluzhashchie } from "./prava-voennosluzhashchih";
import { practice as apellyaciya } from "./apellyaciya-i-kassaciya";

/** Новая практика: добавить файл рядом и одну строку сюда. */
export const practices: readonly Practice[] = [
  semejnye,
  nasledstvennye,
  zemelnye,
  administrativnye,
  voennosluzhashchie,
  apellyaciya,
]
  .slice()
  .sort((a, b) => a.order - b.order);

export function getPractice(slug: string): Practice | undefined {
  return practices.find((item) => item.slug === slug);
}

export function practiceHref(slug: string): string {
  return `/praktiki/${slug}`;
}

/** Практики для частных клиентов (включая универсальные). */
export const personPractices = practices.filter(
  (item) => item.audience === "person" || item.audience === "both",
);

/** Практики, актуальные для организаций и предпринимателей. */
export const businessPractices = practices.filter(
  (item) => item.audience === "business" || item.audience === "both",
);

export type { Practice } from "./types";
