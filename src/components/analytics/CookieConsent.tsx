"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useSyncExternalStore } from "react";

/**
 * Баннер согласия на cookie и подключение Яндекс.Метрики.
 *
 * Пункт 9.2.2 политики называет согласие в cookie-баннере правовым основанием
 * обработки аналитических cookie. Поэтому счётчик не загружается до тех пор,
 * пока пользователь явно не согласился: до этого момента на mc.yandex.ru
 * не уходит ни одного запроса.
 *
 * Решение хранится в localStorage на устройстве пользователя и на сервер
 * не передаётся. Читаем его через useSyncExternalStore: на сервере снимок
 * равен "unknown", поэтому баннер не попадает в разметку и не мигает
 * у тех, кто уже сделал выбор.
 */

const STORAGE_KEY = "pravstrateg:cookie-consent";
const ACCEPTED = "accepted";
const DECLINED = "declined";
/** Выбор ещё не прочитан — состояние до гидратации. */
const UNKNOWN = "unknown";

type Decision = typeof ACCEPTED | typeof DECLINED | null;
type Snapshot = Decision | typeof UNKNOWN;

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Синхронизация между вкладками.
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
    // Приватный режим или запрет хранения — считаем, что выбор не сделан.
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
    // Не смогли запомнить — баннер покажется снова. Это допустимо.
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

  const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const analyticsAllowed = decision === ACCEPTED;

  return (
    <>
      {analyticsAllowed && metrikaId ? (
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(${JSON.stringify(metrikaId)}, "init", {
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
