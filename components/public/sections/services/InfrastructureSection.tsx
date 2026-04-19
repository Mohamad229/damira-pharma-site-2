import {
  ContentSection,
  type ContentSectionData,
} from "@/components/public/sections/base";

interface InfrastructureSectionProps {
  data: ContentSectionData;
}

export function InfrastructureSection({ data }: InfrastructureSectionProps) {
  return <ContentSection data={data} />;
}
