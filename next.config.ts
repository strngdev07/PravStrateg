import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * 'unsafe-eval' разрешается ТОЛЬКО в разработке: React использует eval()
 * для отладки, в production — никогда. На боевую сборку это послабление
 * переносить нельзя, оно снимает существенную часть защиты от XSS.
 * По той же причине HSTS и upgrade-insecure-requests включаются только
 * в production: на localhost они мешают разработке.
 */
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isDev ? ["'unsafe-eval'"] : []),
  "https://mc.yandex.ru",
  "https://yastatic.net",
].join(" ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
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
  // Самодостаточная сборка: в образ попадают только нужные файлы
  // вместо всего node_modules. Нужна для Docker.
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
