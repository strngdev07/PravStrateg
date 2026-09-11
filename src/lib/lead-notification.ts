import { randomBytes } from "node:crypto";
import { escapeHtml, type InlineButton } from "@/lib/telegram";
import {
  categoryLabel,
  clientTypeLabels,
  purposeLabels,
  type LeadData,
} from "@/lib/validation/lead";
import { POLICY_VERSION } from "@/content/site";

const OPERATOR_TIMEZONE = "Europe/Kaliningrad";

export function makeLeadNumber(now: Date): string {
  const day = String(now.getUTCDate()).padStart(2, "0");
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const suffix = randomBytes(2).toString("hex").toUpperCase();
  return `${day}${month}-${suffix}`;
}

function formatMoment(now: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: OPERATOR_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
}

function phoneDigits(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) return `7${digits.slice(1)}`;
  if (digits.length === 11 && digits.startsWith("7")) return digits;
  if (digits.length === 10) return `7${digits}`;
  return digits.length >= 11 ? digits : null;
}

function telegramUsername(messenger: string): string | null {
  const trimmed = messenger.trim();
  const match =
    trimmed.match(/(?:t\.me\/|telegram\.me\/|@)([A-Za-z0-9_]{5,32})/) ?? null;
  return match?.[1] ?? null;
}

export type LeadCard = {
  leadNumber: string;
  message: string;
  buttons: InlineButton[];
};

export function buildLeadCard(
  data: LeadData,
  fileCount: number,
  now: Date,
): LeadCard {
  const leadNumber = makeLeadNumber(now);
  const digits = phoneDigits(data.phone);
  const nick = data.messenger ? telegramUsername(data.messenger) : null;

  const lines: string[] = [
    `<b>Заявка № ${escapeHtml(leadNumber)}</b>`,
    `${escapeHtml(purposeLabels[data.purpose])} · ${escapeHtml(categoryLabel(data.category))}`,
    `${escapeHtml(clientTypeLabels[data.clientType])}`,
    "",
    `<b>${escapeHtml(data.name)}</b>`,
    escapeHtml(data.phone),
  ];

  if (data.email) lines.push(escapeHtml(data.email));
  if (data.messenger) lines.push(escapeHtml(data.messenger));

  lines.push("", "<b>Ситуация</b>", escapeHtml(data.message));

  if (fileCount > 0) {
    lines.push(
      "",
      `📎 Документов: ${fileCount} — приходят следующими сообщениями`,
    );
  }

  lines.push(
    "",
    `<i>Принято ${escapeHtml(formatMoment(now))} (Калининград)</i>`,
    `<i>Согласие на обработку ПД получено, редакция ${escapeHtml(POLICY_VERSION)}</i>`,
  );

  const buttons: InlineButton[] = [];
  if (nick) {
    buttons.push({ text: "Написать в Telegram", url: `https://t.me/${nick}` });
  }
  if (digits) {
    buttons.push({ text: "Написать в WhatsApp", url: `https://wa.me/${digits}` });
  }

  return { leadNumber, message: lines.join("\n"), buttons };
}
