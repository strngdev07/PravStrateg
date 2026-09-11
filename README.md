# Сайт юридической компании «ПравСтратег»

Сайт ИП Новикова И. В. — pravstrateg.ru.
Требования к проекту и правила работы: [CLAUDE.md](./CLAUDE.md).

## Стек

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Zod · Nodemailer.
Базы данных нет: заявки уходят на почту и в Telegram и на сервере не хранятся.

## Локальный запуск (WSL Ubuntu)

```bash
cd ~/PravStrateg
cp .env.example .env      # заполнить значения
npm install
npm run dev               # http://localhost:3000
```

Проверки перед коммитом:

```bash
npm run lint
npm run typecheck
npm run build
```

## Переменные окружения

Все секреты — только в `.env`, который не коммитится. Описание каждой переменной —
в [.env.example](./.env.example).

| Переменная | Назначение |
|---|---|
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASSWORD` | Отправка заявок через smtp.mail.ru |
| `MAIL_TO` `MAIL_FROM` | Куда и от кого приходят заявки |
| `TELEGRAM_BOT_TOKEN` `TELEGRAM_CHAT_ID` | Дублирующее уведомление |
| `NEXT_PUBLIC_YANDEX_METRIKA_ID` | Счётчик Метрики; пусто — аналитика не грузится |

**Пароль для Mail.ru** — не пароль от почты, а отдельный пароль для внешних приложений:
Настройки → Безопасность → Пароли для внешних приложений.

**Telegram**: создать бота у @BotFather, получить токен; написать боту любое сообщение;
узнать свой chat_id у @userinfobot.

## Структура

```
src/
├── app/           маршруты, sitemap, robots, обработчик формы (api/lead)
├── components/    layout/ ui/ blocks/ forms/ analytics/
├── content/       практики, тексты компании, контакты, реквизиты, политика ПД
├── lib/           валидация, почта, telegram, файлы, rate limit, SEO, Schema.org
└── styles/        дизайн-токены и базовые стили
```

## Как добавить новую практику

1. Создать `src/content/practices/<slug>.ts` по образцу соседнего файла.
2. Добавить одну строку в массив в `src/content/practices/index.ts`.

Страница, карточки на главной, список практик, меню формы, sitemap и разметка
Schema.org подхватят её автоматически — верстку менять не нужно.

## Что важно не сломать

- **`/policy`** — адрес закреплён пунктом 12.4 самой политики. Маршрут менять нельзя.
- **Текст политики** (`src/content/legal/policy.ts`) воспроизводит документ дословно.
  Правки вносит только правообладатель документа.
- **Яндекс.Метрика** загружается исключительно после согласия в cookie-баннере —
  этого требует п. 9.2 политики. Не выносить счётчик в layout напрямую.
- **Файлы из формы не сохраняются на диск** — уходят вложением в письмо.
- **Персональные данные не попадают в логи** (§17 CLAUDE.md).

## Деплой

Российский хостинг — требование локализации ПД (п. 10.4 политики, §18 CLAUDE.md).
Порядок развёртывания: [docs/deploy.md](./docs/deploy.md).

## Документы

- [docs/podklyuchenie-servisov.md](./docs/podklyuchenie-servisov.md) — пошагово: почта, Telegram, Метрика
- [docs/uvedomlenie-roskomnadzor.md](./docs/uvedomlenie-roskomnadzor.md) — как подать уведомление оператора ПД
- [docs/oferta-draft.md](./docs/oferta-draft.md) — черновик оферты, требует юридической вычитки
- [docs/deploy.md](./docs/deploy.md) — развёртывание на сервере
