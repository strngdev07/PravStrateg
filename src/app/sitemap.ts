import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { practices, practiceHref } from "@/content/practices";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/o-kompanii", priority: 0.8, changeFrequency: "yearly" },
    { path: "/praktiki", priority: 0.9, changeFrequency: "monthly" },
    { path: "/biznesu", priority: 0.8, changeFrequency: "monthly" },
    { path: "/oplata", priority: 0.7, changeFrequency: "monthly" },
    { path: "/oplata/pravila", priority: 0.4, changeFrequency: "yearly" },
    { path: "/oplata/vozvrat", priority: 0.4, changeFrequency: "yearly" },
    { path: "/rekvizity", priority: 0.4, changeFrequency: "yearly" },
    { path: "/kontakty", priority: 0.8, changeFrequency: "yearly" },
    { path: "/policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/soglasie", priority: 0.3, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: route.path === "/" ? SITE_URL : `${SITE_URL}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...practices.map((practice) => ({
      url: `${SITE_URL}${practiceHref(practice.slug)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
