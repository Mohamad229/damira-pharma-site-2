import {
  ContentSection,
  type ContentSectionData,
} from "@/components/public/sections/base";

interface ColdChainSectionProps {
  data: ContentSectionData;
}

export function ColdChainSection({ data }: ColdChainSectionProps) {
  return <ContentSection data={data} />;
}
