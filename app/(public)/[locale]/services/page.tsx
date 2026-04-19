import type { Metadata } from "next";

import { HeroSection } from "@/components/public/sections/base";
import {
  ColdChainSection,
  InfrastructureSection,
  LogisticsDistributionSection,
  MarketAccessSection,
  MedicalSupportSection,
  RegulatoryServicesSection,
  SafetyVigilanceSection,
} from "@/components/public/sections/services";
import { getPublicUiData } from "@/lib/content/public-ui";
import { buildOgImageUrl, createPublicMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

type ServicesPageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 900;

export async function generateMetadata({
  params,
}: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: Locale = locale === "ar" ? "ar" : "en";
  const pageData = getPublicUiData(currentLocale).services;

  const title = pageData.metadata.title;
  const description = pageData.metadata.description;

  return createPublicMetadata({
    locale: currentLocale,
    pathname: "/services",
    title,
    description,
    image: buildOgImageUrl(title, currentLocale),
  });
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === "ar" ? "ar" : "en";
  const pageData = getPublicUiData(currentLocale).services;

  return (
    <>
      <HeroSection data={pageData.hero} />
      <InfrastructureSection data={pageData.infrastructure} />
      <ColdChainSection data={pageData.coldChain} />
      <RegulatoryServicesSection data={pageData.regulatory} />
      <SafetyVigilanceSection data={pageData.safetyVigilance} />
      <MedicalSupportSection data={pageData.medicalSupport} />
      <LogisticsDistributionSection data={pageData.logisticsDistribution} />
      <MarketAccessSection data={pageData.marketAccess} />
    </>
  );
}
