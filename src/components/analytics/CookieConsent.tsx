"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useSyncExternalStore } from "react";
import { metrikaCounterId } from "@/lib/analytics";

/**
 * Яндекс.Метрика загружается только после согласия в баннере: пункт 9.2.2
 * политики называет это согласие правовым основанием обработки аналитических
 * cookie. До согласия на mc.yandex.ru не уходит ни одного запроса —
 * счётчик не выносить в layout напрямую.
 *
 * Решение читается через useSyncExternalStore: на сервере снимок «unknown»,
 * поэтому баннер не мигает у тех, кто уже сделал выбор.
 */
const STORAGE_KEY = "pravstrateg:cookie-consent";
const ACCEPTED = "accepted";
const DECLINED = "declined";
const UNKNOWN = "unknown";

type Decision = typeof ACCEPTED | typeof DECLINED | null;
type Snapshot = Decision | typeof UNKNOWN;

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Snapshot {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === ACCEPTED || value === DECLINED ? value : null;
  } catch {
    return null;
  }
}

function getServerSnapshot(): Snapshot {
  return UNKNOWN;
}

function persist(decision: Exclude<Decision, null>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, decision);
  } catch {
  }
  for (const listener of listeners) listener();
}

export function CookieConsent() {
  const decision = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const decide = useCallback((value: Exclude<Decision, null>) => {
    persist(value);
  }, []);

  const counterId = metrikaCounterId();
  const analyticsAllowed = decision === ACCEPTED;

  return (
    <>
      {analyticsAllowed && counterId ? (
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(${counterId}, "init", {
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: false
            });
          `}
        </Script>
      ) : null}

      {decision === null ? (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Использование файлов cookie"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-bg shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <p className="text-sm leading-relaxed text-ink-soft">
              Мы используем файлы cookie: технические — чтобы сайт работал, и
              аналитические — чтобы понимать, какими разделами пользуются.
              Аналитические подключаются только с вашего согласия. Подробнее — в{" "}
              <Link
                href="/cookies"
                className="text-accent underline underline-offset-4"
              >
                политике cookie
              </Link>{" "}
              и{" "}
              <Link
                href="/policy"
                className="text-accent underline underline-offset-4"
              >
                политике обработки персональных данных
              </Link>
              .
            </p>

            <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={() => decide(ACCEPTED)}
                className="rounded-[4px] bg-accent px-5 py-2.5 text-sm font-medium text-ink-invert transition-colors hover:bg-accent-hover"
              >
                Принять
              </button>
              <button
                type="button"
                onClick={() => decide(DECLINED)}
                className="rounded-[4px] border border-line-strong px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Только необходимые
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
