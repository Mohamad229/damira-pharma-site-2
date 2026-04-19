# CMS Architecture Changes - PRD Update

**Added**: April 2026  
**Status**: Refactoring Phase 1-3 Complete  
**Scope**: CMS improvements - from dynamic to structured pages

---

## KEY CHANGE SUMMARY

The **Damira Pharma CMS** has been refactored from a **flexible dynamic section builder** into a **structured, maintainable page-based content system** while maintaining full backward compatibility.

### What This Means

**Before**: Admin could create unlimited sections in any order using a dynamic builder UI.

- Complex but flexible
- Hard to maintain and type
- Loosely validated data (JSON)
- Dynamic frontend rendering

**After**: Each page has predefined sections with fixed layouts, admin edits the data within those sections.

- Simpler and clearer
- Easier to maintain and type
- Strong validation with Zod schemas
- Static component composition

---

## ARCHITECTURE CHANGE

### Current Page Types Defined

The system now supports **5 core pages** with **predefined sections** each:

#### 1. **Home Page** (`home`)

Sections:

- `hero` - Main banner with title, subtitle, CTA
- `trustMetrics` - Trust indicators/statistics
- `capabilities` - Core strengths overview
- `featuredProducts` - Product showcase
- `cta` - Final call to action

#### 2. **About Page** (`about`)

Sections:

- `hero` - Page header
- `story` - Company history
- `missionVision` - Mission and vision statements
- `values` - Core company values

#### 3. **Services Page** (`services`)

Sections:

- `hero` - Page header
- `serviceBlocks` - Service offerings
- `infrastructure` - Infrastructure highlights

#### 4. **Products Page** (`products`)

Sections:

- `hero` - Page header
- `introduction` - Intro text

#### 5. **Contact Page** (`contact`)

Sections:

- `hero` - Page header
- `contactInfo` - Contact details

### All Pages Support

- ✅ Multi-locale (English, Arabic)
- ✅ RTL rendering for Arabic
- ✅ Meta tags (title, description)
- ✅ Editable fields per section
- ✅ JSON data for complex fields
- ✅ Media picker integration

---

## DATA MODEL CHANGE

### New Tables (v2)

```
PageContent
├── pageKey: "home" | "about" | "services" | "products" | "contact"
├── locale: "en" | "ar"
├── title: string
├── metaTitle?: string
├── metaDescription?: string
└── sections: PageContentSection[]
   └── PageContentSection
      ├── sectionKey: "hero" | "trustMetrics" | etc.
      ├── order: number (1,2,3...)
      └── fields: PageContentField[]
         └── PageContentField
            ├── fieldKey: "title" | "subtitle" | etc.
            ├── fieldType: "text" | "textarea" | "json" | "media" | etc.
            └── value: string (serialized)
```

### Legacy Tables (v1 - Preserved)

- `PageSection` - Deprecated (no new entries)
- `PageSectionTranslation` - Deprecated (no new entries)
- `SectionType` enum - No longer used

**Status**: Tables remain in database but are NOT used by the new system.

---

## ADMIN DASHBOARD CHANGES

### Removed

- ❌ Section type selector dropdown
- ❌ "Add Section" button
- ❌ Drag-to-reorder sections
- ❌ Dynamic section builder modal

### Added

- ✅ Pages list view (home, about, services, etc.)
- ✅ Fixed page editor form
- ✅ Field editors per section
- ✅ Locale tabs (EN/AR)
- ✅ Save/Cancel buttons

### New Routes

- `/admin/pages` - List all pages
- `/admin/pages/[pageKey]/edit` - Edit specific page
- `/admin/pages/[pageKey]/edit?locale=ar` - Edit in Arabic

---

## FRONTEND CHANGES

### Component Composition Pattern

```typescript
// BEFORE: Dynamic rendering
<SectionRenderer section={section} />

// AFTER: Static composition
<HeroSection data={content.hero} />
<TrustMetricsSection data={content.trustMetrics} />
<CapabilitiesSection data={content.capabilities} />
```

### Data Loading Pattern

```typescript
// BEFORE: Generic loader
const page = await getPublishedPageBySlug("home", locale);

// AFTER: Page-specific loaders
const content = await getHomePageContent(locale);
const content = await getAboutPageContent(locale);
const content = await getServicesPageContent(locale);
```

### Type Safety

```typescript
// BEFORE: Any type
const title = page.sections[0].data?.["title"];

// AFTER: Strongly typed
const title: string | undefined = content.hero?.title;
```

---

## BREAKING CHANGES

### For Admin Users

- ❌ Old section builder UI no longer available
- ✅ New page-based editor provided
- ✅ Migration guide: [CMS_MIGRATION_GUIDE.md](docs/CMS_MIGRATION_GUIDE.md)

### For Developers

- ❌ `getPublishedPageBySlug()` deprecated (but still works with old pages)
- ❌ `SectionRenderer` component deprecated
- ✅ Use new loaders: `getHomePageContent()`, `getAboutPageContent()`, etc.
- ✅ Use new component imports (no dynamic switching)
- [Full migration guide](docs/CMS_MIGRATION_GUIDE.md)

### For Database

- ✅ No data loss - old tables preserved
- ✅ No breaking schema changes to existing tables
- ✅ Additive only - 3 new tables created

---

## BACKWARD COMPATIBILITY

### Preserved

- ✅ Old `Page` model still queryable
- ✅ Old `PageSection` model unchanged
- ✅ Existing URLs work
- ✅ Can run both v1 and v2 in parallel
- ✅ No migrations forced on existing data

### Migration Path

1. **Short-term**: Use old system for existing pages, v2 for new pages
2. **Medium-term**: Gradually migrate pages to v2
3. **Long-term**: Remove old system (future version)

---

## FILES CREATED/CHANGED

### New Files (Content System)

- ✅ `lib/content/page-definitions.ts` - Page structures
- ✅ `lib/content/types.ts` - TypeScript interfaces
- ✅ `lib/content/validators.ts` - Zod schemas
- ✅ `lib/content/loaders.ts` - Data fetching
- ✅ `lib/actions/content.ts` - Server actions

### Updated Files

- ✅ `prisma/schema.prisma` - Added 3 new models
- ✅ `prisma/seed.ts` - Initialize page content

### Documentation Created

- ✅ `docs/CMS_REFACTORING_PLAN.md` - Full refactoring strategy
- ✅ `docs/CMS_IMPLEMENTATION_GUIDE.md` - Implementation details
- ✅ `docs/CMS_MIGRATION_GUIDE.md` - Developer migration guide

### Next Steps

- ⏳ Admin dashboard components (list, editor)
- ⏳ Frontend section components
- ⏳ Full system testing

---

## TECHNICAL BENEFITS

1. **Type Safety**
   - Zod validation for all inputs
   - TypeScript interfaces for all content types
   - Runtime + compile-time checks

2. **Performance**
   - Static component composition
   - Eliminated dynamic renderer overhead
   - Better tree-shaking and bundle size
   - No runtime type checking

3. **Maintainability**
   - Clear page structure definitions
   - Centralized content schema
   - Easier to understand and modify
   - Self-documenting code

4. **Consistency**
   - Fixed layouts prevent design drift
   - Predefined sections ensure structure
   - Standardized field types

5. **DX (Developer Experience)**
   - Autocomplete for page sections
   - Type hints for field values
   - Clear error messages
   - Easier debugging

---

## MIGRATION TIMELINE

| Phase                      | Status         | Timeframe | Tasks                              |
| -------------------------- | -------------- | --------- | ---------------------------------- |
| **1-3: Infrastructure**    | ✅ Complete    | Done      | Schema, types, validation, loaders |
| **4-5: Admin UI**          | ⏳ In Progress | 1-2 weeks | Page list, editor, components      |
| **6-7: Frontend**          | ⏳ Planned     | 1-2 weeks | Page components, integration       |
| **8-10: Testing & Deploy** | ⏳ Planned     | 1 week    | QA, documentation, production      |

---

## HOW TO APPLY THESE CHANGES

### For Frontend Developers

1. Read: [CMS_MIGRATION_GUIDE.md](docs/CMS_MIGRATION_GUIDE.md)
2. Update page routes to use new loaders
3. Create static section components
4. Test with new content loader data

### For Admin/CMS Developers

1. Build admin pages from [CMS_IMPLEMENTATION_GUIDE.md](docs/CMS_IMPLEMENTATION_GUIDE.md)
2. Create page list view
3. Create page editor form
4. Test admin workflows

### For DevOps

1. Run migrations: `npx prisma migrate deploy`
2. Run seed: `npm run seed`
3. Monitor for errors
4. Document deployment process

---

## ROLLBACK STRATEGY

If issues found:

1. Old code still exists (not deleted)
2. Old tables still available (not dropped)
3. Can revert to v1 loaders/renderers
4. No data loss or corruption

To rollback:

```bash
# Option A: Database rollback
npx prisma migrate resolve --rolled-back add_page_content_model

# Option B: Code rollback
git revert <commit>
npm run dev
```

---

## RELATED DOCUMENTATION

- [Full Refactoring Plan](docs/CMS_REFACTORING_PLAN.md) - Strategy & architecture
- [Implementation Guide](docs/CMS_IMPLEMENTATION_GUIDE.md) - Technical details
- [Migration Guide](docs/CMS_MIGRATION_GUIDE.md) - For developers using the CMS

---

## QUESTIONS?

Refer to documentation in order of specificity:

1. **Getting Started**: [CMS_MIGRATION_GUIDE.md](docs/CMS_MIGRATION_GUIDE.md)
2. **Implementation Details**: [CMS_IMPLEMENTATION_GUIDE.md](docs/CMS_IMPLEMENTATION_GUIDE.md)
3. **Architecture Design**: [CMS_REFACTORING_PLAN.md](docs/CMS_REFACTORING_PLAN.md)

---

**Status**: Phase 1-3 Complete, Ready for Admin UI Implementation  
**Last Updated**: April 2026
