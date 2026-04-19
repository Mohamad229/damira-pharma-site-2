import type { Metadata } from "next";

import {
  ContentSection,
  CtaSection,
  HeroSection,
} from "@/components/public/sections/base";
import {
  AtAGlanceSection,
  CoverageReachSection,
  KeyStrengthsSection,
  PortfolioPreviewSection,
  StrategicFocusSection,
} from "@/components/public/sections/home";
import { getPublicUiData } from "@/lib/content/public-ui";
import { buildOgImageUrl, createPublicMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 900;

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: Locale = locale === "ar" ? "ar" : "en";
  const pageData = getPublicUiData(currentLocale).home;

  const title = pageData.metadata.title;
  const description = pageData.metadata.description;

  return createPublicMetadata({
    locale: currentLocale,
    pathname: "/",
    title,
    description,
    image: buildOgImageUrl(title, currentLocale),
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === "ar" ? "ar" : "en";
  const pageData = getPublicUiData(currentLocale).home;

  return (
    <>
      <section id="home-overview" className="scroll-mt-32">
        <HeroSection data={pageData.hero} />
      </section>
      <section id="home-at-a-glance" className="scroll-mt-32">
        <AtAGlanceSection data={pageData.atAGlance} />
      </section>
      <section id="home-strategic-focus" className="scroll-mt-32">
        <StrategicFocusSection data={pageData.strategicFocus} />
      </section>
      <section id="home-strengths" className="scroll-mt-32">
        <KeyStrengthsSection data={pageData.keyStrengths} />
      </section>
      <section id="home-coverage" className="scroll-mt-32">
        <CoverageReachSection data={pageData.coverageReach} />
      </section>
      <section id="home-portfolio" className="scroll-mt-32">
        <PortfolioPreviewSection data={pageData.portfolioPreview} />
      </section>
      <section id="home-success-highlight" className="scroll-mt-32">
        <ContentSection data={pageData.successHighlight} />
      </section>
      <section id="home-cta" className="scroll-mt-32">
        <CtaSection data={pageData.cta} />
      </section>
    </>
  );
}
