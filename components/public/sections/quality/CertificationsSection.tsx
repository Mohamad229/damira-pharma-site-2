import {
  CardGrid,
  ServiceCard,
  type CardGridData,
  type ServiceCardData,
} from "@/components/public/sections/base";

interface CertificationsSectionData extends CardGridData {
  items: ServiceCardData[];
}

interface CertificationsSectionProps {
  data: CertificationsSectionData;
}

export function CertificationsSection({ data }: CertificationsSectionProps) {
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
