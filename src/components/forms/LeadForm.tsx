"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import {
  FILE_LIMITS,
  PURPOSES,
  categoryOptions,
  purposeLabels,
  type Purpose,
} from "@/lib/validation/lead";
import { contacts } from "@/content/site";

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full border border-line-strong bg-bg px-3.5 py-2.5 text-[0.95rem] text-ink " +
  "outline-none transition-colors placeholder:text-ink-muted focus:border-accent";

const labelClass = "mb-1.5 block text-sm font-medium text-ink";

function isPurpose(value: string | null): value is Purpose {
  return value !== null && (PURPOSES as readonly string[]).includes(value);
}

export function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileNote, setFileNote] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /**
   * Момент отрисовки формы. Записываем в эффекте, а не в инициализаторе ref:
   * во время рендера обращаться к текущему времени нельзя.
   */
  const renderedAt = useRef<number | null>(null);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  /**
   * Цель обращения приходит ссылкой вида /kontakty?cel=dokumenty.
   * Значение из адреса — начальное, выбор пользователя его перекрывает.
   */
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get("cel");
  const [chosenPurpose, setChosenPurpose] = useState<Purpose | null>(null);
  const purpose: Purpose =
    chosenPurpose ?? (isPurpose(fromUrl) ? fromUrl : "consultation");

  function onFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      setFileNote(null);
      return;
    }

    const total = files.reduce((sum, file) => sum + file.size, 0);
    const mb = (total / (1024 * 1024)).toFixed(1);

    if (files.length > FILE_LIMITS.maxFiles) {
      setFileNote(`Выбрано ${files.length} файлов — максимум ${FILE_LIMITS.maxFiles}.`);
      return;
    }
    if (total > FILE_LIMITS.maxTotalBytes) {
      setFileNote(`Выбрано ${mb} МБ — максимум 10 МБ.`);
      return;
    }

    setFileNote(`Выбрано файлов: ${files.length} (${mb} МБ)`);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setError(null);

    const formData = new FormData(event.currentTarget);
    if (renderedAt.current !== null) {
      formData.set("renderedAt", String(renderedAt.current));
    }

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        body: formData,
      });

      const result: { ok?: boolean; error?: string } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || !result.ok) {
        setError(result.error ?? "Не удалось отправить заявку. Попробуйте ещё раз.");
        setStatus("error");
        return;
      }

      formRef.current?.reset();
      setFileNote(null);
      setStatus("sent");
    } catch {
      setError(
        "Не удалось связаться с сервером. Проверьте соединение или позвоните нам.",
      );
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="border border-line bg-bg p-8 text-center sm:p-10"
      >
        <h3 className="text-2xl text-ink">Заявка отправлена</h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-soft">
          Мы получили обращение и свяжемся с вами в рабочее время. Если вопрос
          срочный — позвоните по телефону{" "}
          <a
            href={contacts.phone.href}
            className="font-medium text-accent underline-offset-4 hover:underline"
          >
            {contacts.phone.display}
          </a>
          .
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Отправить ещё одно обращение
        </Button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="border border-line bg-bg p-6 sm:p-8"
    >
      <fieldset disabled={status === "sending"} className="contents">
        {/* Ловушка для ботов: поле скрыто от людей и не должно заполняться. */}
        <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
          <label htmlFor="website">Не заполняйте это поле</label>
          <input
            id="website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <span className={labelClass}>Цель обращения</span>
            <div className="flex flex-wrap gap-2">
              {PURPOSES.map((value) => (
                <label
                  key={value}
                  className={`cursor-pointer border px-4 py-2 text-sm transition-colors ${
                    purpose === value
                      ? "border-accent bg-accent-wash text-accent"
                      : "border-line-strong text-ink-soft hover:border-accent-soft"
                  }`}
                >
                  <input
                    type="radio"
                    name="purpose"
                    value={value}
                    checked={purpose === value}
                    onChange={() => setChosenPurpose(value)}
                    className="sr-only"
                  />
                  {purposeLabels[value]}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="name">
              Имя <span className="text-danger">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              maxLength={120}
              className={fieldClass}
              placeholder="Как к вам обращаться"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="phone">
              Телефон <span className="text-danger">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              maxLength={25}
              className={fieldClass}
              placeholder="+7 900 000 00 00"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="email">
              Электронная почта
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={180}
              className={fieldClass}
              placeholder="Для ответа письмом"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="messenger">
              Telegram, WhatsApp или MAX
            </label>
            <input
              id="messenger"
              name="messenger"
              type="text"
              maxLength={120}
              className={fieldClass}
              placeholder="Ник или номер"
            />
          </div>

          <div>
            <span className={labelClass}>
              Вы обращаетесь как <span className="text-danger">*</span>
            </span>
            <div className="flex gap-5 pt-1.5">
              <label className="flex cursor-pointer items-center gap-2 text-[0.95rem] text-ink-soft">
                <input
                  type="radio"
                  name="clientType"
                  value="person"
                  defaultChecked
                  className="accent-accent"
                />
                Физическое лицо
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-[0.95rem] text-ink-soft">
                <input
                  type="radio"
                  name="clientType"
                  value="org"
                  className="accent-accent"
                />
                Организация или ИП
              </label>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="category">
              Категория вопроса <span className="text-danger">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue="drugoe"
              className={fieldClass}
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="message">
              Опишите ситуацию <span className="text-danger">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              minLength={20}
              maxLength={5000}
              className={`${fieldClass} resize-y`}
              placeholder="Что произошло, чего вы хотите добиться, какие сроки уже идут. Чем конкретнее — тем точнее будет ответ."
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="files">
              Документы
            </label>
            <input
              id="files"
              name="files"
              type="file"
              multiple
              accept={FILE_LIMITS.allowedExtensions.join(",")}
              onChange={onFilesChange}
              className="w-full text-[0.95rem] text-ink-soft file:mr-4 file:cursor-pointer file:border file:border-line-strong file:bg-bg-muted file:px-4 file:py-2 file:text-sm file:text-ink hover:file:border-accent-soft"
            />
            <p className="mt-2 text-xs text-ink-muted">
              До {FILE_LIMITS.maxFiles} файлов, суммарно до 10 МБ. Форматы:
              PDF, JPG, PNG, DOC, DOCX. Файлы уходят вложением в письмо и на
              сайте не хранятся.
            </p>
            {fileNote ? (
              <p className="mt-1.5 text-xs text-accent">{fileNote}</p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
              <input
                type="checkbox"
                name="consent"
                required
                className="mt-1 h-4 w-4 shrink-0 accent-accent"
              />
              <span>
                Я даю{" "}
                <Link
                  href="/soglasie"
                  className="text-accent underline underline-offset-4"
                >
                  согласие на обработку персональных данных
                </Link>{" "}
                и ознакомлен с{" "}
                <Link
                  href="/policy"
                  className="text-accent underline underline-offset-4"
                >
                  политикой их обработки
                </Link>
                . <span className="text-danger">*</span>
              </span>
            </label>
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-5 border-l-2 border-danger bg-bg-soft px-4 py-3 text-sm text-danger"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg">
            {status === "sending" ? "Отправляем…" : "Отправить обращение"}
          </Button>
          <p className="text-xs text-ink-muted">
            Обращение не создаёт обязательств и не является договором.
          </p>
        </div>
      </fieldset>
    </form>
  );
}
