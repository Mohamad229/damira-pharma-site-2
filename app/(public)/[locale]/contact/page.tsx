import type { Metadata } from "next";

import { HeroSection } from "@/components/public/sections/base";
import {
  CompanyIdentitySection,
  ContactFormSection,
  ContactInfoSection,
} from "@/components/public/sections/contact";
import type { Locale } from "@/i18n/config";
import { getPublicUiData } from "@/lib/content/public-ui";
import { buildOgImageUrl, createPublicMetadata } from "@/lib/seo";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 900;

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: Locale = locale === "ar" ? "ar" : "en";
  const pageData = getPublicUiData(currentLocale).contact;

  const title = pageData.metadata.title;
  const description = pageData.metadata.description;

  return createPublicMetadata({
    locale: currentLocale,
    pathname: "/contact",
    title,
    description,
    image: buildOgImageUrl(title, currentLocale),
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === "ar" ? "ar" : "en";
  const pageData = getPublicUiData(currentLocale).contact;

  return (
    <>
      <HeroSection data={pageData.hero} />
      <ContactInfoSection data={pageData.contactInfo} />
      <ContactFormSection data={pageData.contactForm} locale={currentLocale} />
      <CompanyIdentitySection data={pageData.companyIdentity} />
    </>
  );
}
