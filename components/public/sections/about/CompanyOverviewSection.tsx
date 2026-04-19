import {
  ContentSection,
  type ContentSectionData,
} from "@/components/public/sections/base";

interface CompanyOverviewSectionProps {
  data: ContentSectionData;
}

export function CompanyOverviewSection({ data }: CompanyOverviewSectionProps) {
  return <ContentSection data={data} />;
}
