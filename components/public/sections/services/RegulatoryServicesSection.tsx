import {
  ContentSection,
  type ContentSectionData,
} from "@/components/public/sections/base";

interface RegulatoryServicesSectionProps {
  data: ContentSectionData;
}

export function RegulatoryServicesSection({
  data,
}: RegulatoryServicesSectionProps) {
  return <ContentSection data={data} />;
}
