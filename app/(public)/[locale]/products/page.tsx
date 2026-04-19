import type { Metadata } from "next";

import { HeroSection } from "@/components/public/sections/base";
import { ProductCatalogFilterSection } from "@/components/public/products/product-catalog-filter-section";
import {
  CategoriesSection,
  CurrentPortfolioSection,
  PipelineSegmentsSection,
} from "@/components/public/sections/products";
import { getPublicUiData } from "@/lib/content/public-ui";
import { buildOgImageUrl, createPublicMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 900;

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: Locale = locale === "ar" ? "ar" : "en";
  const pageData = getPublicUiData(currentLocale).products;

  const title = pageData.metadata.title;
  const description = pageData.metadata.description;

  return createPublicMetadata({
    locale: currentLocale,
    pathname: "/products",
    title,
    description,
    image: buildOgImageUrl(title, currentLocale),
  });
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === "ar" ? "ar" : "en";
  const pageData = getPublicUiData(currentLocale).products;

  return (
    <>
      <HeroSection data={pageData.hero} />
      <CategoriesSection data={pageData.categories} />
      <CurrentPortfolioSection data={pageData.currentPortfolio} />
      <PipelineSegmentsSection data={pageData.pipelineSegments} />
      <ProductCatalogFilterSection
        locale={currentLocale}
        title={pageData.catalog.title}
        description={pageData.catalog.description}
        items={pageData.catalog.items}
        columns={pageData.catalog.columns}
      />
    </>
  );
}
