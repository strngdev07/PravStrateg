import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Источники скриптов. Своя статика плюс Яндекс.Метрика — она грузится
 * только после согласия в cookie-баннере (политика ПД, п. 9.2).
 *
 * 'unsafe-eval' добавляется ТОЛЬКО в режиме разработки: React использует
 * eval() для отладки (восстановление стека вызовов, обновление без
 * перезагрузки). В production React eval() не применяет, и разрешать его
 * там нельзя — это снимает существенную часть защиты от XSS.
 */
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isDev ? ["'unsafe-eval'"] : []),
  "https://mc.yandex.ru",
  "https://yastatic.net",
].join(" ");

/**
 * Security headers — CLAUDE.md §17.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Только для боевого сайта: на localhost принуждение к HTTPS
  // ломает локальную разработку и ничего не защищает.
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://mc.yandex.ru https://mc.yandex.com",
      "font-src 'self' data:",
      "connect-src 'self' https://mc.yandex.ru https://mc.yandex.com",
      "frame-src https://mc.yandex.ru",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      ...(isDev ? [] : ["upgrade-insecure-requests"]),
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
