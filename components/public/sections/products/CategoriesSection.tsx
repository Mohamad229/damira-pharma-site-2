import {
  CardGrid,
  ServiceCard,
  type CardGridData,
  type ServiceCardData,
} from "@/components/public/sections/base";

interface CategoriesSectionData extends CardGridData {
  items: ServiceCardData[];
}

interface CategoriesSectionProps {
  data: CategoriesSectionData;
}

export function CategoriesSection({ data }: CategoriesSectionProps) {
  return (
    <CardGrid
      data={{
        title: data.title,
        description: data.description,
        columns: data.columns || 4,
      }}
    >
      {data.items.map((item) => (
        <ServiceCard key={item.id} data={item} />
      ))}
    </CardGrid>
  );
}
