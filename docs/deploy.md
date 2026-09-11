# Развёртывание сайта

Требование к площадке: сервер в России. Это не предпочтение, а следствие п. 10.4
политики обработки ПД («Оператор обеспечивает локализацию персональных данных на
территории Российской Федерации») и §18 CLAUDE.md. Vercel, Netlify, Supabase и
подобные площадки по этой причине не подходят.

## Выбор хостинга

| Провайдер | Ориентир по цене | Комментарий |
|---|---|---|
| **Timeweb Cloud** | ~900–1500 ₽/мес | Рекомендуется: быстро разворачивается, простая панель, оплата картой РФ |
| Beget | от ~600 ₽/мес | Дешевле, панель проще, ресурсов меньше |
| Selectel | от ~1200 ₽/мес | Надёжнее и дороже, разумно при росте нагрузки |

Конфигурация под этот сайт: **2 vCPU, 2–4 ГБ RAM, 30–40 ГБ NVMe, Ubuntu 24.04**.
База данных не нужна — заявки не хранятся на сервере.

## Порядок

### 1. Домен

Регистратор — **reg.ru**. Домен зарегистрирован 03.09.2026, оплачен до 03.09.2027.
DNS уже обслуживается серверами `ns1.hosting.reg.ru` и `ns2.hosting.reg.ru`, поэтому
менять NS-серверы не нужно — достаточно отредактировать зону в панели reg.ru.

**Путь в панели:** Личный кабинет → «Домены» → `pravstrateg.ru` → «Управление зоной»
(раздел может называться «DNS-серверы и управление зоной»).

Добавить две записи, подставив IP сервера:

```
@      A     <IP сервера>
www    A     <IP сервера>
```

Если в зоне уже есть A-записи `@` и `www`, ведущие на парковку или хостинг reg.ru —
отредактировать их, а не добавлять вторые: две A-записи на одно имя будут отдавать
посетителей то на один адрес, то на другой.

Обновление DNS занимает от нескольких минут до нескольких часов. Проверить,
куда сейчас указывает домен:

```bash
dig +short pravstrateg.ru
dig +short www.pravstrateg.ru
```

Сертификат выпускать (шаг 6) только после того, как обе команды вернут IP сервера,
иначе Let's Encrypt не сможет подтвердить владение доменом.

> **Статус домена `UNVERIFIED`.** Регистратор ещё не подтвердил данные владельца.
> Для доменов `.ru` это обязательная процедура: reg.ru запрашивает подтверждение
> письмом. Пока данные не подтверждены, делегирование домена могут снять — тогда
> сайт перестанет открываться независимо от того, как настроен сервер.
> Проверить статус: `whois pravstrateg.ru`, поле `state`.

### 2. Подготовка сервера

```bash
ssh root@<IP>

adduser deploy && usermod -aG sudo deploy
apt update && apt upgrade -y
apt install -y nginx git curl ufw

ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw enable

# Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
```

### 3. Код и сборка

```bash
su - deploy
git clone <репозиторий> ~/pravstrateg
cd ~/pravstrateg

cp .env.example .env
nano .env                 # заполнить токен бота, получателей, Метрику

npm ci
npm run build
```

### 4. Автозапуск через systemd

`/etc/systemd/system/pravstrateg.service`:

```ini
[Unit]
Description=PravStrateg website
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/home/deploy/pravstrateg
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/home/deploy/pravstrateg/.env
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now pravstrateg
sudo systemctl status pravstrateg
```

### 5. Nginx

`/etc/nginx/sites-available/pravstrateg`:

```nginx
# www → основной домен. Canonical на страницах указывает на адрес без www,
# поэтому обслуживать сайт на обоих именах нельзя: получится дублирование
# для поисковиков и расхождение в статистике Метрики.
server {
    listen 80;
    server_name www.pravstrateg.ru;
    return 301 https://pravstrateg.ru$request_uri;
}

server {
    listen 80;
    server_name pravstrateg.ru;

    # Заявки с вложениями — до 10 МБ плюс запас на служебные поля
    client_max_body_size 12M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

`X-Forwarded-For` обязателен: по нему работает ограничение частоты обращений
и фиксируется IP в следе согласия на обработку ПД.

```bash
sudo ln -s /etc/nginx/sites-available/pravstrateg /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### 6. HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d pravstrateg.ru -d www.pravstrateg.ru
```

Certbot сам добавит редирект с HTTP на HTTPS и настроит автопродление.

Заголовок `Strict-Transport-Security` отдаёт приложение — до выпуска сертификата
сайт по HTTP открывать не нужно, иначе браузер запомнит требование HTTPS.

### 7. Проверка после запуска

```bash
curl -sI https://pravstrateg.ru | grep -iE "content-security|strict-transport|x-frame"
curl -s https://pravstrateg.ru/robots.txt
curl -s https://pravstrateg.ru/sitemap.xml | head
```

- отправить тестовую заявку с файлом — карточка и документ должны прийти
  в Telegram всем получателям из `TELEGRAM_CHAT_ID`;
- открыть сайт в приватном окне: до нажатия «Принять» в панели Network не должно
  быть запросов к `mc.yandex.ru`;
- проверить, что `/policy` открывается ровно по адресу из п. 12.4 политики.

### 8. Обновление сайта

```bash
cd ~/pravstrateg
git pull
npm ci
npm run build
sudo systemctl restart pravstrateg
```

## Что настроить после запуска

- Яндекс.Вебмастер: подтвердить права, отправить sitemap
- Яндекс.Метрика: создать счётчик, вписать номер в `.env`, задать цели
  (отправка формы, клик по телефону)
- Резервное копирование конфигурации и `.env` (в репозиторий `.env` не попадает)
- Мониторинг доступности
