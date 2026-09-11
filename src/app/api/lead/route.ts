import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation/lead";
import { prepareAttachments, formatBytes } from "@/lib/files";
import {
  escapeHtml,
  isTelegramConfigured,
  sendTelegramDocument,
  sendTelegramMessage,
} from "@/lib/telegram";
import { buildLeadCard } from "@/lib/lead-notification";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
/** Заявка обрабатывается только на сервере, кэшировать нечего. */
export const dynamic = "force-dynamic";

/** Бот заполняет форму мгновенно; человеку нужно хотя бы несколько секунд. */
const MIN_FILL_MS = 3000;

const CONTACT_FALLBACK =
  "Не удалось отправить заявку. Пожалуйста, позвоните нам по телефону +7 922 625 75 32 — мы примем обращение по телефону.";

function badRequest(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  const ip = clientIp(request.headers);

  // 1. Частота обращений — §17
  const limit = rateLimit(`lead:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Слишком много обращений подряд. Попробуйте через несколько минут или позвоните нам.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  // 2. Разбор формы
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return badRequest("Не удалось прочитать форму. Попробуйте ещё раз.");
  }

  const parsed = leadSchema.safeParse({
    name: form.get("name") ?? "",
    phone: form.get("phone") ?? "",
    email: form.get("email") ?? "",
    messenger: form.get("messenger") ?? "",
    clientType: form.get("clientType") ?? "",
    category: form.get("category") ?? "",
    purpose: form.get("purpose") ?? "consultation",
    message: form.get("message") ?? "",
    consent: form.get("consent") ?? false,
    website: form.get("website") ?? "",
    renderedAt: form.get("renderedAt") ?? undefined,
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return badRequest(first?.message ?? "Проверьте заполнение формы");
  }

  const data = parsed.data;

  // 3. Ловушки для ботов. Ответ намеренно выглядит как успех,
  //    чтобы автоматика не подбирала обход.
  const filledTooFast =
    typeof data.renderedAt === "number" &&
    Number.isFinite(data.renderedAt) &&
    Date.now() - data.renderedAt < MIN_FILL_MS;

  if (data.website || filledTooFast) {
    return NextResponse.json({ ok: true });
  }

  // 4. Вложения: проверяем сигнатуры, на диск не пишем
  const attachmentsResult = await prepareAttachments(
    form.getAll("files").filter((item): item is File => item instanceof File),
  );

  if (!attachmentsResult.ok) {
    return badRequest(attachmentsResult.error);
  }

  const files = attachmentsResult.files;
  const receivedAt = new Date();

  // 5. Telegram — основной канал уведомлений
  if (!isTelegramConfigured()) {
    console.error("[lead] Telegram не настроен — заявка не может быть доставлена");
    return badRequest(
      "Форма временно недоступна. Пожалуйста, позвоните нам или напишите в мессенджер.",
      503,
    );
  }

  const card = buildLeadCard(data, files.length, receivedAt);
  const messageDelivered = await sendTelegramMessage(card.message, card.buttons);

  if (!messageDelivered) {
    // Резервного канала нет: клиенту сообщаем прямо, чтобы он позвонил,
    // и обращение не пропало молча.
    console.error(`[lead] заявка ${card.leadNumber} не доставлена`);
    return badRequest(CONTACT_FALLBACK, 502);
  }

  // 6. Документы клиента уходят следом за карточкой
  const failed: string[] = [];
  for (const [index, file] of files.entries()) {
    const caption = `Заявка № ${escapeHtml(card.leadNumber)} · документ ${index + 1} из ${files.length} · ${escapeHtml(formatBytes(file.size))}`;
    const sent = await sendTelegramDocument(file, caption);
    if (!sent) failed.push(file.filename);
  }

  // Клиент своё отправил и получит подтверждение; о недошедших файлах
  // предупреждаем получателя, чтобы он запросил их у клиента сам.
  if (failed.length > 0) {
    await sendTelegramMessage(
      [
        `⚠️ <b>Заявка № ${escapeHtml(card.leadNumber)}</b>`,
        `Не удалось передать документов: ${failed.length}.`,
        "Запросите их у клиента при первом контакте.",
      ].join("\n"),
    );
  }

  return NextResponse.json({ ok: true });
}
