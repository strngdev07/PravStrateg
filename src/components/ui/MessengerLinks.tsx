import { contacts, linkedMessengers, unlinkedMessengers } from "@/content/site";

type MessengerLinksProps = {
  /** invert — для тёмного фона финального блока. */
  tone?: "default" | "invert";
  className?: string;
};

/**
 * Список мессенджеров. Каналы со ссылкой выводятся ссылками,
 * каналы без неё (сейчас MAX) — пояснением рядом с номером телефона.
 */
export function MessengerLinks({
  tone = "default",
  className = "",
}: MessengerLinksProps) {
  const linkClass =
    tone === "invert"
      ? "text-sm text-white/80 underline underline-offset-4 hover:text-ink-invert"
      : "text-sm text-accent underline-offset-4 hover:underline";

  const noteClass =
    tone === "invert" ? "text-sm text-white/50" : "text-sm text-ink-muted";

  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className}`}>
      {linkedMessengers.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {item.label}
          </a>
        </li>
      ))}

      {unlinkedMessengers.map((item) => (
        <li key={item.label} className={noteClass}>
          {item.label}
          {item.note ? (
            <>
              {" — "}
              <a
                href={contacts.phone.href}
                className={
                  tone === "invert"
                    ? "underline underline-offset-4 hover:text-ink-invert"
                    : "underline underline-offset-4 hover:text-accent"
                }
              >
                {item.note}
              </a>
            </>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
