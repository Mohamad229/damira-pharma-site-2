import {
  ContentSection,
  type ContentSectionData,
} from "@/components/public/sections/base";

interface MarketAccessSectionProps {
  data: ContentSectionData;
}

export function MarketAccessSection({ data }: MarketAccessSectionProps) {
  return <ContentSection data={data} />;
}
