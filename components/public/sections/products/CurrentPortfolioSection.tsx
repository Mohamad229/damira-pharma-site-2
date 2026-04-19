import {
  CardGrid,
  ProductCard,
  type CardGridData,
  type ProductCardData,
} from "@/components/public/sections/base";

interface CurrentPortfolioSectionData extends CardGridData {
  items: ProductCardData[];
}

interface CurrentPortfolioSectionProps {
  data: CurrentPortfolioSectionData;
}

export function CurrentPortfolioSection({
  data,
}: CurrentPortfolioSectionProps) {
  return (
    <CardGrid
      data={{
        title: data.title,
        description: data.description,
        columns: data.columns || 3,
      }}
    >
      {data.items.map((item) => (
        <ProductCard key={item.id} data={item} />
      ))}
    </CardGrid>
  );
}
