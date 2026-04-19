import {
  ContentSection,
  type ContentSectionData,
} from "@/components/public/sections/base";

interface ProductInfoSectionProps {
  data: ContentSectionData;
}

export function ProductInfoSection({ data }: ProductInfoSectionProps) {
  return <ContentSection data={data} />;
}
