import {
  ContentSection,
  type ContentSectionData,
} from "@/components/public/sections/base";

interface LogisticsDistributionSectionProps {
  data: ContentSectionData;
}

export function LogisticsDistributionSection({
  data,
}: LogisticsDistributionSectionProps) {
  return <ContentSection data={data} />;
}
