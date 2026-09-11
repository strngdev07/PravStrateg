import { FILE_LIMITS } from "@/lib/validation/lead";

/**
 * Безопасная обработка вложений — CLAUDE.md §17.
 *
 * Файлы не сохраняются на диск: они уходят документами в Telegram и живут
 * только в памяти запроса. Это снимает целый класс рисков (перезапись,
 * выполнение, обход webroot) и уменьшает объём хранимых персональных данных.
 */

/** Сигнатуры разрешённых форматов: расширению из имени файла не доверяем. */
const SIGNATURES: ReadonlyArray<{
  mime: string;
  bytes: readonly number[];
  offset?: number;
}> = [
  { mime: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46] },
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  // DOCX — это zip-контейнер
  {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    bytes: [0x50, 0x4b, 0x03, 0x04],
  },
  // Устаревший DOC — составной документ OLE2
  {
    mime: "application/msword",
    bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1],
  },
];

function matchesSignature(buffer: Buffer): string | null {
  for (const signature of SIGNATURES) {
    const offset = signature.offset ?? 0;
    if (buffer.length < offset + signature.bytes.length) continue;

    const matches = signature.bytes.every(
      (byte, index) => buffer[offset + index] === byte,
    );
    if (matches) return signature.mime;
  }
  return null;
}

/** Убирает пути и опасные символы из имени файла. */
function safeFilename(original: string): string {
  const base = original.split(/[\\/]/).pop() ?? "file";
  const cleaned = base
    // управляющие символы и знаки, опасные в путях и заголовках письма
    .replace(/[\x00-\x1f<>:"|?*\\/]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.slice(0, 120) || "file";
}

export type PreparedFile = {
  filename: string;
  content: Buffer;
  contentType: string;
  size: number;
};

export type FilesResult =
  | { ok: true; files: PreparedFile[] }
  | { ok: false; error: string };

export async function prepareAttachments(
  entries: readonly File[],
): Promise<FilesResult> {
  const files = entries.filter((file) => file.size > 0);

  if (files.length === 0) return { ok: true, files: [] };

  if (files.length > FILE_LIMITS.maxFiles) {
    return {
      ok: false,
      error: `Можно приложить не больше ${FILE_LIMITS.maxFiles} файлов`,
    };
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > FILE_LIMITS.maxTotalBytes) {
    return {
      ok: false,
      error: "Суммарный размер файлов больше 10 МБ. Отправьте документы частями или пришлите их на почту.",
    };
  }

  const prepared: PreparedFile[] = [];

  for (const file of files) {
    if (file.size > FILE_LIMITS.maxSingleBytes) {
      return { ok: false, error: `Файл «${safeFilename(file.name)}» больше 10 МБ` };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const detected = matchesSignature(buffer);

    if (!detected) {
      return {
        ok: false,
        error: `Файл «${safeFilename(file.name)}» не похож на PDF, изображение или документ Word. Допустимые форматы: ${FILE_LIMITS.allowedExtensions.join(", ")}`,
      };
    }

    prepared.push({
      filename: safeFilename(file.name),
      content: buffer,
      // Тип берём из сигнатуры, а не из заголовка запроса.
      contentType: detected,
      size: buffer.length,
    });
  }

  return { ok: true, files: prepared };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}
