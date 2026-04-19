# CMS System Migration Guide

## From Dynamic Section Builder (v1) to Structured Pages (v2)

**Purpose**: Help developers understand the refactored CMS and update their code accordingly  
**Read Time**: 10 minutes  
**Status**: Phase 1-3 released, Admin UI coming next

---

## QUICK COMPARISON

| Aspect              | v1 (Old)                          | v2 (New)                                            |
| ------------------- | --------------------------------- | --------------------------------------------------- |
| **Page Model**      | Dynamic sections created by admin | Fixed sections predefined in code                   |
| **Admin UX**        | Section builder/editor            | Page editor with form fields                        |
| **Data Storage**    | PageSection + JSON                | PageContent + PageContentSection + PageContentField |
| **Frontend**        | Dynamic renderer (switch on type) | Static components (direct imports)                  |
| **Type Safety**     | Loosely typed JSON                | Strongly typed TypeScript interfaces                |
| **Validation**      | Runtime only                      | Zod schemas + TypeScript                            |
| **Content Loading** | Generic + type casting            | Page-specific loaders with types                    |

---

## WHAT CHANGED

### Database Schema

**Deprecated (v1)**:

- `PageSection` - Dynamic sections (no longer used)
- `PageSectionTranslation` - Translated section data (no longer used)
- `SectionType` enum - Not needed for v2

**New (v2)**:

- `PageContent` - Page metadata per locale
- `PageContentSection` - Fixed section entries
- `PageContentField` - Individual field values

**Status**: Old tables remain in database for backward compatibility, but new code uses v2 tables only.

### Frontend Code

#### ❌ Old Pattern (v1)

```typescript
// OLD: Generic section renderer
import { renderSection } from '@/components/public/section-renderer';

export default async function HomePage() {
  const page = await getPublishedPageBySlug('home', 'en');

  return (
    <>
      {page.sections.map(section => (
        <div key={section.id}>
          {renderSection(section)}
        </div>
      ))}
    </>
  );
}
```

#### ✅ New Pattern (v2)

```typescript
// NEW: Static component composition
import { getHomePageContent } from '@/lib/content/loaders';
import { HomeHeroSection } from '@/components/public/home/hero-section';
import { HomeTrustMetricsSection } from '@/components/public/home/trust-metrics-section';

export default async function HomePage() {
  const content = await getHomePageContent('en');

  return (
    <>
      <HomeHeroSection data={content.hero} />
      <HomeTrustMetricsSection data={content.trustMetrics} />
    </>
  );
}
```

**Why**: Direct imports = better tree-shaking, type safety, and zero runtime overhead.

### Admin Dashboard Code

#### ❌ Old Pattern (v1)

```typescript
// OLD: Dynamic section builder UI
<SectionTypeSelector onSelect={handleNewSection} />
<SectionList sections={page.sections} onReorder={handleReorder} />
<SectionEditorModal section={selectedSection} />
```

#### ✅ New Pattern (v2)

```typescript
// NEW: Form-based page editor
<PageEditor pageKey="home" locale="en" />
```

**What changed**:

- No more "add section" button
- No more drag-to-reorder sections
- No more section type selector
- Instead: Fixed form with predefined fields

### API/Server Actions

#### ❌ Old Pattern (v1)

```typescript
// OLD: Generic page update
await updatePage({
  id: pageId,
  sections: [
    { id: s1, type: 'HERO', data: {...} },
    { id: s2, type: 'CARDS', data: {...} },
  ]
});
```

#### ✅ New Pattern (v2)

```typescript
// NEW: Field-level updates
await updatePageContentField('home', 'en', 'hero', 'title', 'New Title');

// OR batch update
await updatePageContent({
  pageKey: 'home',
  locale: 'en',
  title: 'Home Page',
  sections: {
    hero: { title: '...', subtitle: '...' },
    trustMetrics: { items: [...] },
  }
});
```

---

## HOW TO UPDATE YOUR CODE

### Step 1: Frontend Pages → Use New Loaders

**Change**: Replace `getPublishedPageBySlug()` with page-specific loaders

```typescript
// BEFORE
const page = await getPublishedPageBySlug("home", locale);

// AFTER
const content = await getHomePageContent(locale);
```

**Available loaders**:

- `getHomePageContent(locale)`
- `getAboutPageContent(locale)`
- `getServicesPageContent(locale)`
- `getProductsPageContent(locale)`
- `getContactPageContent(locale)`
- `getPageContent(pageKey, locale)` - Generic

### Step 2: Section Rendering → Use Static Components

**Change**: Replace dynamic section renderer with direct imports

```typescript
// BEFORE - Dynamic rendering
{page.sections.map(section => renderSection(section))}

// AFTER - Static component composition
<HeroSection data={content.hero} />
<TrustMetricsSection data={content.trustMetrics} />
<CapabilitiesSection data={content.capabilities} />
```

**New components to create**:

- `components/public/home/hero-section.tsx`
- `components/public/home/trust-metrics-section.tsx`
- `components/public/home/capabilities-section.tsx`
- `components/public/home/featured-products-section.tsx`
- `components/public/home/cta-section.tsx`
- (Similar for about, services, etc.)

### Step 3: Admin Dashboard → Use New Components

**Change**: Update admin routes to use new page editor

```typescript
// BEFORE - Old route
/admin/pages/[id]/edit → Dynamic section builder

// AFTER - New route
/admin/pages/[pageKey]/edit → Fixed page editor (form)
```

**Files to update**:

- `app/(admin)/admin/pages/page.tsx` - List view (EXISTING - refactor)
- `app/(admin)/admin/pages/[pageKey]/edit/page.tsx` - Editor (NEW)

### Step 4: Type Safety → Use Page Content Types

**Change**: Use typed page content instead of generic objects

```typescript
// BEFORE - Loosely typed
const hero = page.sections.find((s) => s.type === "HERO")?.data;
const title = hero?.["title"]; // Any type

// AFTER - Strongly typed
const content = await getHomePageContent("en");
const title = content.hero?.title; // string type
```

**Available types**:

- `HomePageContent`
- `AboutPageContent`
- `ServicesPageContent`
- Generic `PageData`

---

## DATA MIGRATION (If Needed)

### Option A: Start Fresh (Recommended for MVP)

```bash
# 1. Run migration to create new tables
npx prisma migrate dev

# 2. Run seed to initialize pages
npm run seed

# 3. Admin fills in content via new UI
# Done! Old data ignored
```

### Option B: Migrate Existing Data (Advanced)

Create a script to convert PageSection → PageContent:

```typescript
// File: scripts/migrate-v1-to-v2.ts
async function migratePages() {
  const oldPages = await db.page.findMany({
    include: { sections: { include: { translations: true } } },
  });

  for (const oldPage of oldPages) {
    await initializePageContent(oldPage.slug, "en");
    // Convert old section data to new format...
  }
}
```

---

## WHAT'S DEPRECATED (Marked for Removal)

### Components to Remove (Not Delete Yet)

- ❌ `components/admin/pages/sections/hero-section-editor.tsx`
- ❌ `components/admin/pages/sections/cards-section-editor.tsx`
- ❌ `components/admin/pages/sections/stats-section-editor.tsx`
- ❌ `components/admin/pages/sections/features-section-editor.tsx`
- ❌ `components/admin/pages/sections/cta-section-editor.tsx`
- ❌ `components/admin/pages/sections/image-text-section-editor.tsx`
- ❌ `components/admin/pages/sections/text-section-editor.tsx`
- ❌ `components/admin/pages/sections/section-type-selector.tsx`
- ❌ `components/admin/pages/sections/section-editor-modal.tsx`
- ❌ `components/admin/pages/sections/section-list.tsx`
- ❌ `components/public/section-renderer.tsx`
- ❌ `lib/public-pages.ts` (old page loaders)

**Action**: Keep for now, but mark as @deprecated in code comments.

### Database Models to Phase Out

- ⚠️ `PageSection` - Stop creating new entries
- ⚠️ `PageSectionTranslation` - Stop creating new entries
- ⚠️ `SectionType` enum - No longer used

**Action**: Models remain in database but unused. Can delete after full migration.

---

## ENVIRONMENT SETUP

### For Development

```bash
# 1. Create/update migration
npx prisma migrate dev --name add_page_content_model

# 2. Seed initial data
npm run seed

# 3. Start dev server
npm run dev

# 4. Test by visiting:
# - Admin: http://localhost:3000/admin/pages
# - Frontend: http://localhost:3000/en
# - Arabic: http://localhost:3000/ar
```

### For Production

```bash
# 1. Deploy migrations
npx prisma migrate deploy

# 2. Seed data (if first deploy)
npm run seed

# 3. Deploy code
git push production main
```

---

## TROUBLESHOOTING

### Q: Old pages still showing?

**A**: The v1 `Page` model still works. To use v2:

1. Ensure `PageContent` is initialized
2. Update page route to use `getHomePageContent()`
3. Old `Page` data doesn't affect v2

### Q: Can I run both systems in parallel?

**A**: Yes! They use different tables:

- Old: Page, PageSection, PageSectionTranslation
- New: PageContent, PageContentSection, PageContentField
  Start with v2 for new pages, keep v1 old pages until migration complete.

### Q: What if a field is missing?

**A**: Check:

```typescript
// 1. Page definition has section
const def = getPageDefinition(pageKey);
const section = def.sections.find(s => s.sectionKey === sectionKey);

// 2. Database has the field
const data = await getPageContent(pageKey, locale);
console.log(data.sections[sectionKey]);

// 3. If missing, initialize with seed
npm run seed
```

### Q: How to add a new field to a section?

**A**:

1. Update `PAGE_DEFINITIONS` in `lib/content/page-definitions.ts`
   ```typescript
   fields: {
     newField: { type: 'text', label: 'New Field' }
   }
   ```
2. Type will auto-update
3. Admin form will auto-add input for it

### Q: How to add a new page?

**A**:

1. Add to `PAGE_DEFINITIONS`:
   ```typescript
   myPage: {
     pageKey: 'myPage',
     label: 'My Page',
     sections: [...]
   }
   ```
2. Run seed or manual initialization:
   ```typescript
   await initializePageContent("myPage", "en");
   await initializePageContent("myPage", "ar");
   ```
3. Create page components
4. Create admin editor

---

## TESTING CHECKLIST

- [ ] `npm run seed` completes successfully
- [ ] `npx prisma studio` shows new PageContent tables with data
- [ ] `getHomePageContent('en')` returns typed data
- [ ] Admin can access `/admin/pages`
- [ ] Admin can edit home page fields
- [ ] Updates appear on `/en` homepage
- [ ] Arabic locale `/ar` shows correct content
- [ ] RTL styling applied to Arabic content
- [ ] Old routes still work (if needed)
- [ ] No TypeScript errors in codebase

---

## TIMELINE

| Phase          | Status      | Tasks                                                    |
| -------------- | ----------- | -------------------------------------------------------- |
| **Phase 1-3**  | ✅ Complete | Schema, types, validators, loaders, server actions, seed |
| **Phase 4-5**  | ⏳ Next     | Admin UI components (list, editor)                       |
| **Phase 6-7**  | ⏳ Next     | Frontend components and pages                            |
| **Phase 8-10** | ⏳ Next     | Testing, deployment, cleanup                             |

---

## SUPPORT

For questions or issues:

1. Read [CMS_IMPLEMENTATION_GUIDE.md](CMS_IMPLEMENTATION_GUIDE.md)
2. Check [CMS_REFACTORING_PLAN.md](CMS_REFACTORING_PLAN.md)
3. Review page-definitions.ts for all available pages/sections
4. Check types.ts for TypeScript interfaces
5. Look at loaders.ts for usage examples

---

**Last Updated**: April 2026  
**Version**: 1.0  
**Status**: Active
