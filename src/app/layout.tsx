import type { Metadata, Viewport } from "next";
import { Lora, Manrope } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/analytics/CookieConsent";
import { JsonLd, legalServiceSchema, personSchema } from "@/lib/schema-org";
import { SITE_URL, site } from "@/content/site";
import "@/styles/globals.css";

/**
 * Шрифты скачиваются на этапе сборки и раздаются с нашего домена —
 * запросов к внешним сервисам во время работы сайта нет (§18),
 * display: swap убирает скачок текста (§15).
 */
const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const lora = Lora({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Юридическая компания «ПравСтратег» — комплексная правовая помощь",
    template: "%s — ПравСтратег",
  },
  description: site.tagline,
  applicationName: site.shortName,
  authors: [{ name: site.leader.fullName }],
  formatDetection: { telephone: true, email: true, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${lora.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-[4px] focus:bg-accent focus:px-4 focus:py-2 focus:text-ink-invert"
        >
          Перейти к содержанию
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <JsonLd data={legalServiceSchema()} />
        <JsonLd data={personSchema()} />
      </body>
    </html>
  );
}
