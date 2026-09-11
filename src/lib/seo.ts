import type { Metadata } from "next";
import { SITE_URL, site } from "@/content/site";

const OG_IMAGE = "/og/pravstrateg.jpg";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  noindex?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  noindex = false,
}: PageMetaInput): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url,
      siteName: site.shortName,
      title: ogTitle ?? title,
      description,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${site.shortName} — ${site.leader.name}`,
        },
      ],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
