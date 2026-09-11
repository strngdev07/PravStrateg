import type { Metadata } from "next";
import { Hero } from "@/components/blocks/Hero";
import {
  AboutShort,
  AudienceSplit,
  FinalCta,
  Formats,
  LeaderBlock,
  PracticesGrid,
  WorkStages,
} from "@/components/blocks/CommonBlocks";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title:
    "Юридическая компания «ПравСтратег» — комплексная правовая помощь",
  description:
    "Юридическая компания «ПравСтратег» под руководством Ивана Новикова: семейные, наследственные, земельные и административные дела, права военнослужащих, помощь бизнесу. Работаем по всей России.",
  path: "/",
  ogTitle: "ПравСтратег — юридическая помощь для частных клиентов и бизнеса",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <AudienceSplit />
      <PracticesGrid />
      <AboutShort />
      <Formats />
      <WorkStages />
      <LeaderBlock />
      <FinalCta />
    </>
  );
}
