import {
  CardGrid,
  ServiceCard,
  type CardGridData,
  type ServiceCardData,
} from "@/components/public/sections/base";

interface CoreValuesSectionData extends CardGridData {
  items: ServiceCardData[];
}

interface CoreValuesSectionProps {
  data: CoreValuesSectionData;
}

export function CoreValuesSection({ data }: CoreValuesSectionProps) {
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
