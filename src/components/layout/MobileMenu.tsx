"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { NavItem } from "@/content/site";
import { contacts } from "@/content/site";

type MobileMenuProps = {
  items: readonly NavItem[];
};

export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape закрывает меню, фон не скроллится, фокус уходит в панель — §16.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        className="flex h-11 w-11 items-center justify-center text-ink"
      >
        <span aria-hidden="true" className="relative block h-4 w-6">
          <span
            className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-200 ${
              open ? "top-2 rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute top-2 left-0 block h-px w-6 bg-current transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-200 ${
              open ? "top-2 -rotate-45" : "top-4"
            }`}
          />
        </span>
      </button>

      {open ? (
        <div
          id="mobile-menu"
          ref={panelRef}
          tabIndex={-1}
          className="fixed inset-x-0 top-18 bottom-0 z-50 overflow-y-auto border-t border-line bg-bg px-5 py-8"
        >
          <nav aria-label="Основная навигация">
            <ul className="flex flex-col gap-1">
              {items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`block border-b border-line py-4 text-lg ${
                        active ? "text-accent" : "text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={contacts.phone.href}
              className="text-xl font-medium text-ink"
            >
              {contacts.phone.display}
            </a>
            <a href={contacts.email.href} className="text-ink-soft">
              {contacts.email.display}
            </a>
            <Link
              href="/kontakty#zayavka"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center rounded-[4px] bg-accent px-6 py-3.5 font-medium text-ink-invert"
            >
              Получить консультацию
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
