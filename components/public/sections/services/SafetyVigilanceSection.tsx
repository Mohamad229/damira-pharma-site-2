import {
  ContentSection,
  type ContentSectionData,
} from "@/components/public/sections/base";

interface SafetyVigilanceSectionProps {
  data: ContentSectionData;
}

export function SafetyVigilanceSection({ data }: SafetyVigilanceSectionProps) {
  return <ContentSection data={data} />;
}
