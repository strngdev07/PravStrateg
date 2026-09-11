import nodemailer, { type Transporter } from "nodemailer";

/**
 * Отправка писем через SMTP — CLAUDE.md §17, §18.
 * Реквизиты доступа только из переменных окружения, в код не попадают.
 * Провайдер российский (Mail.ru), персональные данные страну не покидают.
 */

export type MailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

export type MailMessage = {
  subject: string;
  text: string;
  replyTo?: string;
  attachments?: readonly MailAttachment[];
};

let cached: Transporter | null = null;

function requiredEnv(name: string): string | null {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : null;
}

export function isMailConfigured(): boolean {
  return Boolean(
    requiredEnv("SMTP_HOST") &&
      requiredEnv("SMTP_USER") &&
      requiredEnv("SMTP_PASSWORD") &&
      requiredEnv("MAIL_TO"),
  );
}

function getTransport(): Transporter | null {
  if (cached) return cached;

  const host = requiredEnv("SMTP_HOST");
  const user = requiredEnv("SMTP_USER");
  const pass = requiredEnv("SMTP_PASSWORD");

  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT ?? 465);

  cached = nodemailer.createTransport({
    host,
    port,
    // 465 — неявный TLS; 587 поднимает TLS через STARTTLS.
    secure: port === 465,
    auth: { user, pass },
    requireTLS: port !== 465,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  return cached;
}

/**
 * Отправляет письмо. Бросает исключение при сбое — вызывающий код решает,
 * что показать пользователю. Сообщение об ошибке не содержит содержимого
 * заявки, чтобы персональные данные не попали в логи.
 */
export async function sendMail(message: MailMessage): Promise<void> {
  const transport = getTransport();
  const to = requiredEnv("MAIL_TO");
  const from = requiredEnv("MAIL_FROM") ?? requiredEnv("SMTP_USER");

  if (!transport || !to || !from) {
    throw new Error("SMTP не настроен: проверьте переменные окружения");
  }

  await transport.sendMail({
    from: `"Сайт ПравСтратег" <${from}>`,
    to,
    subject: message.subject,
    text: message.text,
    ...(message.replyTo ? { replyTo: message.replyTo } : {}),
    ...(message.attachments?.length
      ? { attachments: message.attachments as MailAttachment[] }
      : {}),
  });
}
