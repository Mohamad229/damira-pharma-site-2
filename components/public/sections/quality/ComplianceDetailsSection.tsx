import {
  ContentSection,
  type ContentSectionData,
} from "@/components/public/sections/base";

interface ComplianceDetailsSectionProps {
  data: ContentSectionData;
}

export function ComplianceDetailsSection({
  data,
}: ComplianceDetailsSectionProps) {
  return <ContentSection data={data} />;
}
