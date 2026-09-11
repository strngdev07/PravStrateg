const API_BASE = "https://api.telegram.org";

const MAX_MESSAGE_LENGTH = 3800;

export type InlineButton = {
  text: string;
  url: string;
};

export function isTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

function credentials(): { token: string; chatIds: string[] } | null {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatIds = (process.env.TELEGRAM_CHAT_ID ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return token && chatIds.length > 0 ? { token, chatIds } : null;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function splitMessage(
  text: string,
  limit = MAX_MESSAGE_LENGTH,
): string[] {
  if (text.length <= limit) return [text];

  const chunks: string[] = [];
  let rest = text;

  while (rest.length > limit) {
    const window = rest.slice(0, limit);
    let cut = window.lastIndexOf("\n\n");
    if (cut < limit * 0.4) cut = window.lastIndexOf("\n");
    if (cut < limit * 0.4) cut = window.lastIndexOf(" ");
    if (cut < limit * 0.4) cut = limit;

    chunks.push(rest.slice(0, cut).trimEnd());
    rest = rest.slice(cut).trimStart();
  }

  if (rest) chunks.push(rest);
  return chunks;
}

type TelegramCallResult = { ok: boolean };

async function callApi(
  method: string,
  body: BodyInit,
  headers?: HeadersInit,
): Promise<TelegramCallResult> {
  const creds = credentials();
  if (!creds) return { ok: false };

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(
        `${API_BASE}/bot${creds.token}/${method}`,
        {
          method: "POST",
          body,
          ...(headers ? { headers } : {}),
          signal: AbortSignal.timeout(20_000),
        },
      );

      if (response.ok) return { ok: true };

      if (response.status < 500 && response.status !== 429) {
        console.error(`[telegram] ${method}: отказ ${response.status}`);
        return { ok: false };
      }
    } catch {
    }

    if (attempt === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
  }

  console.error(`[telegram] ${method}: не удалось отправить`);
  return { ok: false };
}

export async function sendTelegramMessage(
  html: string,
  buttons: readonly InlineButton[] = [],
): Promise<boolean> {
  const creds = credentials();
  if (!creds) return false;

  const parts = splitMessage(html);
  let deliveredToAnyone = false;

  for (const chatId of creds.chatIds) {
    let chatOk = true;

    for (const [index, part] of parts.entries()) {
      const payload: Record<string, unknown> = {
        chat_id: chatId,
        text: part,
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      };

      if (index === 0 && buttons.length > 0) {
        payload.reply_markup = {
          inline_keyboard: [buttons.map((b) => ({ text: b.text, url: b.url }))],
        };
      }

      const result = await callApi("sendMessage", JSON.stringify(payload), {
        "Content-Type": "application/json",
      });

      if (!result.ok) chatOk = false;
    }

    if (chatOk) deliveredToAnyone = true;
  }

  return deliveredToAnyone;
}

export type TelegramDocument = {
  filename: string;
  content: Buffer;
  contentType: string;
};

export async function sendTelegramDocument(
  file: TelegramDocument,
  caption: string,
): Promise<boolean> {
  const creds = credentials();
  if (!creds) return false;

  let deliveredToAnyone = false;

  for (const chatId of creds.chatIds) {
    const form = new FormData();
    form.append("chat_id", chatId);
    form.append("caption", caption);
    form.append("parse_mode", "HTML");
    form.append(
      "document",
      new Blob([new Uint8Array(file.content)], { type: file.contentType }),
      file.filename,
    );

    const result = await callApi("sendDocument", form);
    if (result.ok) deliveredToAnyone = true;
  }

  return deliveredToAnyone;
}
