import { NextResponse } from "next/server";
import { leadSchema, categoryLabel, clientTypeLabels, purposeLabels } from "@/lib/validation/lead";
import { prepareAttachments, formatBytes } from "@/lib/files";
import { isMailConfigured, sendMail } from "@/lib/mail";
import { sendTelegramNotification } from "@/lib/telegram";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { POLICY_VERSION } from "@/content/site";

export const runtime = "nodejs";
/** Заявка обрабатывается только на сервере, кэшировать нечего. */
export const dynamic = "force-dynamic";

/** Бот заполняет форму мгновенно; человеку нужно хотя бы несколько секунд. */
const MIN_FILL_MS = 3000;

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

  // 5. След согласия на обработку ПД: что принято, когда и с какого адреса
  const consentTrace = [
    `Согласие на обработку персональных данных: да`,
    `Редакция политики: ${POLICY_VERSION}`,
    `Время (UTC): ${receivedAt.toISOString()}`,
    `IP: ${ip}`,
    `User-Agent: ${request.headers.get("user-agent") ?? "не определён"}`,
  ].join("\n");

  const summary = [
    `Новая заявка с сайта pravstrateg.ru`,
    ``,
    `Цель обращения: ${purposeLabels[data.purpose]}`,
    `Категория: ${categoryLabel(data.category)}`,
    `Статус: ${clientTypeLabels[data.clientType]}`,
    ``,
    `Имя: ${data.name}`,
    `Телефон: ${data.phone}`,
    `Почта: ${data.email || "не указана"}`,
    `Мессенджер: ${data.messenger || "не указан"}`,
    ``,
    `Ситуация:`,
    data.message,
    ``,
    files.length
      ? `Вложения (${files.length}): ${files
          .map((file) => `${file.filename} — ${formatBytes(file.size)}`)
          .join(", ")}`
      : `Вложения: нет`,
    ``,
    `— — —`,
    consentTrace,
  ].join("\n");

  // 6. Письмо — основной канал. Без него заявку принимать нельзя.
  if (!isMailConfigured()) {
    console.error("[lead] SMTP не настроен — заявка не может быть отправлена");
    return badRequest(
      "Форма временно недоступна. Пожалуйста, позвоните нам или напишите на почту.",
      503,
    );
  }

  try {
    await sendMail({
      subject: `Заявка с сайта: ${categoryLabel(data.category)} — ${data.name}`,
      text: summary,
      replyTo: data.email || undefined,
      attachments: files.map((file) => ({
        filename: file.filename,
        content: file.content,
        contentType: file.contentType,
      })),
    });
  } catch {
    // Содержимое заявки в лог не пишем — §17.
    console.error("[lead] не удалось отправить письмо с заявкой");
    return badRequest(
      "Не удалось отправить заявку. Пожалуйста, позвоните нам или напишите на почту.",
      502,
    );
  }

  // 7. Telegram — дублирующий канал, его сбой не влияет на результат.
  await sendTelegramNotification([
    "Новая заявка с сайта",
    "",
    `Цель: ${purposeLabels[data.purpose]}`,
    `Категория: ${categoryLabel(data.category)}`,
    `Статус: ${clientTypeLabels[data.clientType]}`,
    `Имя: ${data.name}`,
    `Телефон: ${data.phone}`,
    `Почта: ${data.email || "не указана"}`,
    `Мессенджер: ${data.messenger || "не указан"}`,
    "",
    data.message.length > 700
      ? `${data.message.slice(0, 700)}…`
      : data.message,
    "",
    files.length ? `Вложений: ${files.length} (в письме)` : "Вложений нет",
  ]);

  return NextResponse.json({ ok: true });
}
