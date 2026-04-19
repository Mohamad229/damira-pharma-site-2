import {
  ContentSection,
  StatsSection,
  type ContentSectionData,
  type StatsSectionData,
} from "@/components/public/sections/base";

interface LegacySuccessSectionProps {
  data: {
    content: ContentSectionData;
    stats: StatsSectionData;
  };
}

export function LegacySuccessSection({ data }: LegacySuccessSectionProps) {
  return (
    <>
      <ContentSection data={data.content} />
      <StatsSection data={data.stats} className="pt-0" />
    </>
  );
}
