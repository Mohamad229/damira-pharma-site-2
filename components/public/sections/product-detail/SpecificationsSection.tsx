import { SectionReveal } from "@/components/public/sections/base";

interface SpecificationItem {
  label: string;
  value: string;
}

interface SpecificationsSectionProps {
  data: {
    title: string;
    description?: string;
    items: SpecificationItem[];
  };
}

export function SpecificationsSection({ data }: SpecificationsSectionProps) {
  return (
    <SectionReveal>
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {data.title}
        </h2>
        {data.description ? (
          <p className="mt-3 max-w-3xl text-base text-muted-foreground sm:text-lg">
            {data.description}
          </p>
        ) : null}
        <div className="mt-6 overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
          <dl className="divide-y divide-border/70">
            {data.items.map((item) => (
              <div
                key={item.label}
                className="grid gap-2 px-5 py-4 sm:grid-cols-[14rem_minmax(0,1fr)]"
              >
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {item.label}
                </dt>
                <dd className="text-sm text-foreground/90">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </SectionReveal>
  );
}
