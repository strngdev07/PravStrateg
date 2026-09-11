/**
 * Дублирование заявки в Telegram — быстрый канал уведомления.
 * Письмо остаётся основным каналом: если Telegram недоступен,
 * заявка всё равно не теряется.
 */

const API_BASE = "https://api.telegram.org";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function isTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

/**
 * Отправляет уведомление. Возвращает признак успеха и никогда не бросает —
 * сбой мессенджера не должен ломать приём заявки.
 */
export async function sendTelegramNotification(
  lines: readonly string[],
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return false;

  const text = lines.map(escapeHtml).join("\n");

  try {
    const response = await fetch(`${API_BASE}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8000),
    });

    return response.ok;
  } catch {
    // Причину не логируем целиком: в тексте заявки персональные данные (§17).
    console.error("[telegram] не удалось отправить уведомление о заявке");
    return false;
  }
}
