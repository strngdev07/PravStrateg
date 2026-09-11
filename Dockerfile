# Сборка образа сайта. Многоэтапная: в финальный образ не попадают
# ни исходники, ни devDependencies — только собранное приложение.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Переменные с префиксом NEXT_PUBLIC_ подставляются на этапе сборки,
# а не читаются при запуске. Поэтому номер счётчика Метрики передаётся
# аргументом сборки: без него аналитики в образе просто не будет.
ARG NEXT_PUBLIC_YANDEX_METRIKA_ID=""
ENV NEXT_PUBLIC_YANDEX_METRIKA_ID=$NEXT_PUBLIC_YANDEX_METRIKA_ID
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Приложение работает под непривилегированным пользователем
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
