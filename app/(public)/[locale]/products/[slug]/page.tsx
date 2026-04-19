import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CtaSection, HeroSection } from "@/components/public/sections/base";
import {
  ProductInfoSection,
  RelatedProductsSection,
  SpecificationsSection,
} from "@/components/public/sections/product-detail";
import {
  getMockProductSlugs,
  getProductDetailPageData,
} from "@/lib/content/public-ui";
import { buildOgImageUrl, createPublicMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

type ProductDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 900;

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale: Locale = locale === "ar" ? "ar" : "en";
  const pageData = getProductDetailPageData(currentLocale, slug);

  if (!pageData) {
    return createPublicMetadata({
      locale: currentLocale,
      pathname: `/products/${slug}`,
      title: "Product not found",
      description: "The requested product could not be found.",
    });
  }

  const title = pageData.metadata.title;
  const description = pageData.metadata.description;

  return createPublicMetadata({
    locale: currentLocale,
    pathname: `/products/${slug}`,
    title,
    description,
    image:
      pageData.hero.backgroundImage?.src ||
      buildOgImageUrl(title, currentLocale),
    type: "article",
  });
}

export async function generateStaticParams() {
  return getMockProductSlugs().map((slug) => ({ slug }));
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { locale, slug } = await params;
  const currentLocale: Locale = locale === "ar" ? "ar" : "en";
  const pageData = getProductDetailPageData(currentLocale, slug);

  if (!pageData) {
    notFound();
  }

  return (
    <>
      <HeroSection data={pageData.hero} />
      <ProductInfoSection data={pageData.productInfo} />
      <SpecificationsSection data={pageData.specifications} />
      <RelatedProductsSection data={pageData.relatedProducts} />
      <CtaSection data={pageData.cta} />
    </>
  );
}
