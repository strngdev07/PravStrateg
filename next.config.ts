import type { NextConfig } from "next";

/**
 * Security headers — CLAUDE.md §17.
 * CSP собран под текущий состав сайта: своя статика, Яндекс.Метрика
 * (грузится только после согласия в cookie-баннере, см. политику ПД п. 9.2).
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
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://mc.yandex.ru https://yastatic.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://mc.yandex.ru https://mc.yandex.com",
      "font-src 'self' data:",
      "connect-src 'self' https://mc.yandex.ru https://mc.yandex.com",
      "frame-src https://mc.yandex.ru",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
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
