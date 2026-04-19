import type { Metadata } from "next";

import { CtaSection, HeroSection } from "@/components/public/sections/base";
import {
  CertificationsSection,
  ComplianceDetailsSection,
} from "@/components/public/sections/quality";
import { getPublicUiData } from "@/lib/content/public-ui";
import { buildOgImageUrl, createPublicMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

type CompliancePageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 900;

export async function generateMetadata({
  params,
}: CompliancePageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: Locale = locale === "ar" ? "ar" : "en";
  const pageData = getPublicUiData(currentLocale).quality;

  const title = pageData.metadata.title;
  const description = pageData.metadata.description;

  return createPublicMetadata({
    locale: currentLocale,
    pathname: "/compliance",
    title,
    description,
    image: buildOgImageUrl(title, currentLocale),
  });
}

export default async function CompliancePage({ params }: CompliancePageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === "ar" ? "ar" : "en";
  const pageData = getPublicUiData(currentLocale).quality;

  return (
    <>
      <HeroSection data={pageData.hero} />
      <CertificationsSection data={pageData.certifications} />
      <ComplianceDetailsSection data={pageData.complianceDetails} />
      <CtaSection data={pageData.cta} />
    </>
  );
}
