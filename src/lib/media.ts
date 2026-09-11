import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Фотографии руководителя (CLAUDE.md §4).
 *
 * Пока исходники не положены в public/images, страницы рендерят аккуратную
 * типографическую заглушку вместо битой картинки. Как только файл появится,
 * следующая сборка подхватит его автоматически — правки в коде не нужны.
 */
export const leaderPhotos = {
  portrait: {
    src: "/images/ivan-novikov-portrait.jpg",
    alt: "Иван Новиков, руководитель юридической компании «ПравСтратег»",
    width: 853,
    height: 1280,
  },
  friendly: {
    src: "/images/ivan-novikov.jpg",
    alt: "Иван Новиков, руководитель юридической компании «ПравСтратег»",
    width: 853,
    height: 1280,
  },
} as const;

export type LeaderPhoto = (typeof leaderPhotos)[keyof typeof leaderPhotos];

export function hasPhoto(photo: LeaderPhoto): boolean {
  return existsSync(path.join(process.cwd(), "public", photo.src));
}
