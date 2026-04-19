import { notFound } from "next/navigation";

import { PageEditorClient } from "./page-editor-client";
import { StructuredPageEditorClient } from "./structured-page-editor-client";
import { getPageContent } from "@/lib/content/loaders";
import { getPageDefinition } from "@/lib/content/page-definitions";
import type { Locale } from "@/i18n/config";

/**
 * Edit Page
 *
 * Server component that fetches page data and passes it to the editor.
 * Uses async params per Next.js 16+ requirements.
 */
export const metadata = {
  title: "Edit Page | Damira Admin",
  description: "Edit website page content and sections",
};

interface EditPagePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ locale?: string | string[] }>;
}

export default async function EditPagePage({
  params,
  searchParams,
}: EditPagePageProps) {
  const { id } = await params;
  const query = await searchParams;

  const localeParam = Array.isArray(query.locale)
    ? query.locale[0]
    : query.locale;
  const locale: Locale = localeParam === "ar" ? "ar" : "en";

  const pageDef = getPageDefinition(id);

  if (pageDef) {
    const content = await getPageContent(id, locale);

    return (
      <StructuredPageEditorClient
        pageKey={id}
        locale={locale}
        pageDefinition={pageDef}
        initialContent={content}
      />
    );
  }

  // Dynamically import to avoid Prisma initialization at build time
  const { getPageById } = await import("@/lib/actions/pages");
  const result = await getPageById(id);

  if (result.error || !result.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageEditorClient page={result.data} />
    </div>
  );
}
