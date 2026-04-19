import type { Metadata } from "next";

import { HeroSection } from "@/components/public/sections/base";
import {
  CompanyOverviewSection,
  CoreValuesSection,
  FocusVerticalsSection,
  LegacySuccessSection,
  VisionMissionSection,
} from "@/components/public/sections/about";
import { getPublicUiData } from "@/lib/content/public-ui";
import { buildOgImageUrl, createPublicMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 900;

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: Locale = locale === "ar" ? "ar" : "en";
  const pageData = getPublicUiData(currentLocale).about;

  const title = pageData.metadata.title;
  const description = pageData.metadata.description;

  return createPublicMetadata({
    locale: currentLocale,
    pathname: "/about",
    title,
    description,
    image: buildOgImageUrl(title, currentLocale),
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === "ar" ? "ar" : "en";
  const pageData = getPublicUiData(currentLocale).about;

  return (
    <>
      <section id="about-overview" className="scroll-mt-32">
        <HeroSection data={pageData.hero} />
      </section>
      <section id="about-company-overview" className="scroll-mt-32">
        <CompanyOverviewSection data={pageData.companyOverview} />
      </section>
      <section id="about-vision-mission" className="scroll-mt-32">
        <VisionMissionSection data={pageData.visionMission} />
      </section>
      <section id="about-values" className="scroll-mt-32">
        <CoreValuesSection data={pageData.coreValues} />
      </section>
      <section id="about-focus-verticals" className="scroll-mt-32">
        <FocusVerticalsSection data={pageData.focusVerticals} />
      </section>
      <section id="about-legacy-success" className="scroll-mt-32">
        <LegacySuccessSection data={pageData.legacySuccess} />
      </section>
    </>
  );
}
