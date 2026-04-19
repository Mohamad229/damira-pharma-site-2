import {
  ContentSection,
  type ContentSectionData,
} from "@/components/public/sections/base";

interface MedicalSupportSectionProps {
  data: ContentSectionData;
}

export function MedicalSupportSection({ data }: MedicalSupportSectionProps) {
  return <ContentSection data={data} />;
}
