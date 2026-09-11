import { z } from "zod";
import { practices } from "@/content/practices";

/**
 * Схема заявки — CLAUDE.md §7.
 * Используется и на клиенте (подсказки), и на сервере (§17: серверная
 * валидация обязательна, клиентской доверять нельзя).
 */

export const CLIENT_TYPES = ["person", "org"] as const;
export type ClientType = (typeof CLIENT_TYPES)[number];

export const PURPOSES = ["consultation", "dokumenty", "schet"] as const;
export type Purpose = (typeof PURPOSES)[number];

export const purposeLabels: Record<Purpose, string> = {
  consultation: "Консультация",
  dokumenty: "Анализ документов",
  schet: "Запрос счёта на оплату",
};

/** Категории вопроса собираются из практик — новая практика попадает сюда сама. */
export const categoryOptions = [
  ...practices.map((item) => ({ value: item.slug, label: item.navTitle })),
  { value: "biznes", label: "Вопрос для бизнеса" },
  { value: "drugoe", label: "Другое / затрудняюсь определить" },
] as const;

const categoryValues = categoryOptions.map((item) => item.value);

export const FILE_LIMITS = {
  maxFiles: 5,
  maxTotalBytes: 10 * 1024 * 1024,
  maxSingleBytes: 10 * 1024 * 1024,
  allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"],
  allowedMimeTypes: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;

/** Телефон: цифры, пробелы, скобки, плюс и дефисы; 10–18 знаков по существу. */
const phonePattern = /^[+\d][\d\s()\-]{9,24}$/;

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Укажите имя")
    .max(120, "Слишком длинное имя"),

  phone: z
    .string()
    .trim()
    .min(1, "Укажите телефон")
    .max(25, "Слишком длинный номер")
    .regex(phonePattern, "Проверьте номер телефона"),

  email: z
    .string()
    .trim()
    .max(180, "Слишком длинный адрес")
    .pipe(z.email("Проверьте адрес электронной почты"))
    .optional()
    .or(z.literal("")),

  messenger: z
    .string()
    .trim()
    .max(120, "Слишком длинное значение")
    .optional()
    .or(z.literal("")),

  clientType: z.enum(CLIENT_TYPES, {
    message: "Выберите, обращаетесь вы как физическое лицо или организация",
  }),

  category: z
    .string()
    .refine((value) => categoryValues.includes(value as never), {
      message: "Выберите категорию вопроса",
    }),

  purpose: z.enum(PURPOSES).default("consultation"),

  message: z
    .string()
    .trim()
    .min(20, "Опишите ситуацию хотя бы в паре предложений")
    .max(5000, "Слишком длинное описание — сократите до 5000 символов"),

  consent: z
    .union([z.boolean(), z.literal("on"), z.literal("true")])
    .transform((value) => value === true || value === "on" || value === "true")
    .refine((value) => value, {
      message: "Без согласия на обработку данных мы не сможем принять обращение",
    }),

  /** Honeypot: настоящий человек это поле не видит и не заполняет. */
  website: z.string().max(0).optional().or(z.literal("")),

  /** Время отрисовки формы — отсекает мгновенную отправку ботом. */
  renderedAt: z.coerce.number().optional(),
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema>;

export const clientTypeLabels: Record<ClientType, string> = {
  person: "Физическое лицо",
  org: "Организация или ИП",
};

export function categoryLabel(value: string): string {
  return categoryOptions.find((item) => item.value === value)?.label ?? value;
}
