import type { Metadata } from "next";

import {
  ContentSection,
  CtaSection,
  HeroSection,
  StatsSection,
} from "@/components/public/sections/base";
import {
  PartnershipInquirySection,
  WhyPartnerSection,
} from "@/components/public/sections/partnerships";
import type { Locale } from "@/i18n/config";
import { getPublicUiData } from "@/lib/content/public-ui";
import { buildOgImageUrl, createPublicMetadata } from "@/lib/seo";

type PartnershipsPageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 900;

export async function generateMetadata({
  params,
}: PartnershipsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: Locale = locale === "ar" ? "ar" : "en";
  const pageData = getPublicUiData(currentLocale).partnerships;

  const title = pageData.metadata.title;
  const description = pageData.metadata.description;

  return createPublicMetadata({
    locale: currentLocale,
    pathname: "/partnerships",
    title,
    description,
    image: buildOgImageUrl(title, currentLocale),
  });
}

export default async function PartnershipsPage({
  params,
}: PartnershipsPageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === "ar" ? "ar" : "en";
  const pageData = getPublicUiData(currentLocale).partnerships;

  return (
    <>
      <HeroSection data={pageData.hero} />
      <WhyPartnerSection data={pageData.whyPartner} />
      <PartnershipInquirySection
        data={pageData.partnershipForm}
        locale={currentLocale}
      />
      <ContentSection data={pageData.marketAccess} />
      <ContentSection data={pageData.infrastructureStrength} />
      <StatsSection data={pageData.commercialReach} />
      <ContentSection data={pageData.provenSuccess} />
      <CtaSection data={pageData.cta} />
    </>
  );
}
