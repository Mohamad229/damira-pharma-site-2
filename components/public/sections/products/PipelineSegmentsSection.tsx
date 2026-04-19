import {
  CardGrid,
  ServiceCard,
  type CardGridData,
  type ServiceCardData,
} from "@/components/public/sections/base";

interface PipelineSegmentsSectionData extends CardGridData {
  items: ServiceCardData[];
}

interface PipelineSegmentsSectionProps {
  data: PipelineSegmentsSectionData;
}

export function PipelineSegmentsSection({
  data,
}: PipelineSegmentsSectionProps) {
  return (
    <CardGrid
      data={{
        title: data.title,
        description: data.description,
        columns: data.columns || 3,
      }}
    >
      {data.items.map((item) => (
        <ServiceCard key={item.id} data={item} />
      ))}
    </CardGrid>
  );
}
