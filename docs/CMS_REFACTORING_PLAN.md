# CMS Architecture Refactoring Plan

## From Dynamic Section Builder to Structured Page-Based System

**Project**: Damira Pharma Website & CMS  
**Version**: 2.0  
**Date**: 2025  
**Status**: Planning Phase  
**Scope**: Transform CMS from dynamic section creation to fixed page structures

---

## EXECUTIVE SUMMARY

This refactoring transforms the Damira Pharma CMS from a **flexible but complex dynamic section builder** into a **structured, maintainable page-based content management system** while maintaining full backward compatibility.

### Key Changes

- ❌ **Remove**: Dynamic section CRUD interface from admin
- ❌ **Remove**: Section type selector and builder UI
- ✅ **Add**: Fixed page and section definitions (hardcoded in code)
- ✅ **Add**: Structured content database model
- ✅ **Add**: Page-specific editors (Home, About, Services, etc.)

### Benefits

- **Simpler Admin UX**: Admin edits predefined fields, not arbitrary sections
- **Better Frontend**: Static component composition, no dynamic rendering
- **Data Clarity**: Clear schema for what each page contains
- **Performance**: No dynamic section type switching
- **Maintainability**: Easier to understand and modify

---

## 1. ARCHITECTURE OVERVIEW

### Current System (v1)

```
Admin Page Editor
  ↓
Dynamic Section Builder (add/remove/reorder)
  ↓
PageSection + PageSectionTranslation (JSON data)
  ↓
Frontend Dynamic Renderer (switch on section.type)
```

### New System (v2)

```
Admin Page Editor (Page-Specific)
  ↓
Fixed Section Editors (predefined sections only)
  ↓
Structured Content Tables (page_contents, etc.)
  ↓
Frontend Static Components (direct component import)
```

---

## 2. NEW DATA MODEL

### Database Tables (New)

#### 2.1 `page_contents`

Stores the main content entry for each page (one per locale per page).

```prisma
model PageContent {
  id          String   @id @default(cuid())
  pageKey     String   // "home", "about", "services", etc.
  locale      String   // "en", "ar"

  // Metadata
  title       String
  metaTitle   String?
  metaDescription String?

  // Relationships
  sections    PageContentSection[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([pageKey, locale])
}
```

#### 2.2 `page_content_sections`

Stores data for each predefined section within a page.

```prisma
model PageContentSection {
  id              String   @id @default(cuid())
  contentId       String
  content         PageContent @relation(fields: [contentId], references: [id], onDelete: Cascade)

  sectionKey      String   // "hero", "trustMetrics", "capabilities", etc.
  order           Int      // For rendering order (1, 2, 3...)

  // Generic field storage
  fields          PageContentField[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([contentId, sectionKey])
  @@index([contentId])
}
```

#### 2.3 `page_content_fields`

Stores individual values for section fields.

```prisma
model PageContentField {
  id              String   @id @default(cuid())
  sectionId       String
  section         PageContentSection @relation(fields: [sectionId], references: [id], onDelete: Cascade)

  fieldKey        String   // "title", "subtitle", "buttonText", etc.
  fieldType       String   // "text", "textarea", "json", "number", "boolean"
  value           String?  @db.Text  // Serialized value

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([sectionId, fieldKey])
  @@index([sectionId])
}
```

### Legacy Tables (v1 - Kept but Disabled)

These tables remain in the database but are NOT used in the new system:

- `PageSection` → Deprecated (no new entries)
- `PageSectionTranslation` → Deprecated (no new entries)

**Strategy**: Keep intact for potential data migration or rollback.

---

## 3. PAGE STRUCTURE DEFINITIONS

### 3.1 Home Page Structure

**File**: `lib/content/page-definitions.ts`

```typescript
export const PAGE_DEFINITIONS = {
  home: {
    pageKey: "home",
    label: "Home Page",
    sections: [
      {
        sectionKey: "hero",
        label: "Hero Section",
        fields: {
          title: { type: "text", label: "Main Title" },
          subtitle: { type: "text", label: "Subtitle" },
          buttonText: { type: "text", label: "Button Text" },
          buttonLink: { type: "text", label: "Button Link" },
          imageId: { type: "media", label: "Hero Image" },
        },
      },
      {
        sectionKey: "trustMetrics",
        label: "Trust Metrics",
        fields: {
          items: { type: "json", label: "Metrics (JSON array)" },
        },
      },
      {
        sectionKey: "capabilities",
        label: "Capabilities",
        fields: {
          title: { type: "text", label: "Section Title" },
          cards: { type: "json", label: "Capability Cards (JSON)" },
        },
      },
      {
        sectionKey: "featuredProducts",
        label: "Featured Products",
        fields: {
          title: { type: "text", label: "Section Title" },
          productIds: { type: "json", label: "Product IDs (JSON array)" },
        },
      },
      {
        sectionKey: "cta",
        label: "Call to Action",
        fields: {
          title: { type: "text", label: "CTA Title" },
          description: { type: "textarea", label: "Description" },
          buttonText: { type: "text", label: "Button Text" },
          buttonLink: { type: "text", label: "Button Link" },
        },
      },
    ],
  },

  about: {
    pageKey: "about",
    label: "About Page",
    sections: [
      {
        sectionKey: "hero",
        label: "Hero Section",
        fields: {
          title: { type: "text", label: "Page Title" },
          subtitle: { type: "text", label: "Subtitle" },
          imageId: { type: "media", label: "Background Image" },
        },
      },
      {
        sectionKey: "story",
        label: "Company Story",
        fields: {
          title: { type: "text", label: "Section Title" },
          content: { type: "textarea", label: "Story Content" },
        },
      },
      {
        sectionKey: "missionVision",
        label: "Mission & Vision",
        fields: {
          missionTitle: { type: "text", label: "Mission Title" },
          missionContent: { type: "textarea", label: "Mission" },
          visionTitle: { type: "text", label: "Vision Title" },
          visionContent: { type: "textarea", label: "Vision" },
        },
      },
      {
        sectionKey: "values",
        label: "Core Values",
        fields: {
          values: { type: "json", label: "Values (JSON array)" },
        },
      },
    ],
  },

  services: {
    pageKey: "services",
    label: "Services Page",
    sections: [
      {
        sectionKey: "hero",
        label: "Hero Section",
        fields: {
          title: { type: "text", label: "Page Title" },
          subtitle: { type: "text", label: "Subtitle" },
          imageId: { type: "media", label: "Hero Image" },
        },
      },
      {
        sectionKey: "serviceBlocks",
        label: "Service Blocks",
        fields: {
          services: { type: "json", label: "Services (JSON array)" },
        },
      },
      {
        sectionKey: "infrastructure",
        label: "Infrastructure Highlights",
        fields: {
          title: { type: "text", label: "Section Title" },
          highlights: {
            type: "json",
            label: "Infrastructure Highlights (JSON)",
          },
        },
      },
    ],
  },
};
```

---

## 4. SCHEMA CHANGE STRATEGY

### 4.1 Migration Plan

**Phase 1: Add New Tables** (non-breaking)

```bash
# Create new tables alongside existing ones
npx prisma migrate dev --name add_page_content_model
```

**Phase 2: Implement New System** (parallel)

- New admin pages use new tables
- Old pages disabled but still present
- No data deleted or modified

**Phase 3: Migration Script** (optional)

- Script to migrate v1 pages to v2 (if needed)
- Keep old data for reference

**Phase 4: Cleanup** (future)

- After confirming all works, optionally remove old tables
- But keep disabled in code for now

---

## 5. ADMIN DASHBOARD REFACTORING

### 5.1 Old Structure (v1)

**Routes**:

- `/admin/pages` - List all pages
- `/admin/pages/new` - Create new page
- `/admin/pages/[id]/edit` - Edit page → **Dynamic section builder**
  - Section type selector
  - Add section button
  - Reorder sections (drag & drop)
  - Section editors (hero-section-editor.tsx, etc.)

**Components**:

- `section-type-selector.tsx` - ❌ Remove
- `section-editor-modal.tsx` - ❌ Disable
- `section-list.tsx` - ❌ Disable
- `pages-table-client.tsx` - ✅ Keep (repurpose)

### 5.2 New Structure (v2)

**Routes**:

- `/admin/pages` - List all pages (updated design)
- `/admin/pages/[pageKey]/edit` - Edit specific page with predefined sections

**Components**:

- `page-editor-client.tsx` - ✅ New (page-specific editor)
- `page-section-editor.tsx` - ✅ New (edit predefined section)
- `page-content-renderer.tsx` - ✅ New (render all sections)

**Example Flow**:

```
Admin → Pages List
  ↓ (click "Edit Home")
Home Page Editor
  ├── Hero Section Editor
  │   ├── Title input
  │   ├── Subtitle input
  │   ├── Button Text input
  │   └── Media Picker
  ├── Trust Metrics Section Editor
  │   └── JSON Editor for metrics array
  ├── Capabilities Section Editor
  │   └── JSON Editor for cards
  └── Featured Products Section
      └── Multi-select Product picker
```

### 5.3 New Admin Pages

#### Page 1: `/admin/pages/page.tsx` (Updated)

- List all available pages (Home, About, Services, etc.)
- Show publication status
- Edit button for each page

#### Page 2: `/admin/pages/[pageKey]/edit/page.tsx` (New)

- Page-specific editor
- Renders sections for that page
- Shows all locales (EN/AR tabs)

#### Page 3: `/admin/pages/[pageKey]/sections/[sectionKey]/page.tsx` (Optional)

- Individual section editor (if sections are complex)
- Can also inline in main page editor

---

## 6. FRONTEND REFACTORING

### 6.1 Old Pattern (v1 - Dynamic Rendering)

**File**: `components/public/section-renderer.tsx`

```typescript
export function SectionRenderer({ section }: { section: PublicPageSection }) {
  switch (section.type) {
    case 'HERO':
      return <HeroSection data={section.content} />;
    case 'CARDS':
      return <CardsSection data={section.content} />;
    case 'STATS':
      return <StatsSection data={section.content} />;
    // ... more cases
    default:
      return null;
  }
}
```

### 6.2 New Pattern (v2 - Static Composition)

**File**: `app/(public)/[locale]/page.tsx` (Home Page)

```typescript
import { HomeHeroSection } from '@/components/public/home/hero-section';
import { HomeTrustMetricsSection } from '@/components/public/home/trust-metrics-section';
import { HomeCapabilitiesSection } from '@/components/public/home/capabilities-section';
import { getHomePageContent } from '@/lib/content/loaders';

export default async function HomePage() {
  const content = await getHomePageContent('en');

  if (!content) return <NotFound />;

  return (
    <>
      <HomeHeroSection data={content.hero} />
      <HomeTrustMetricsSection data={content.trustMetrics} />
      <HomeCapabilitiesSection data={content.capabilities} />
      <HomeFeaturedProductsSection data={content.featuredProducts} />
      <HomeCtaSection data={content.cta} />
    </>
  );
}
```

### 6.3 Content Loader Functions

**File**: `lib/content/loaders.ts`

```typescript
export async function getHomePageContent(locale: Locale) {
  const content = await db.pageContent.findUnique({
    where: { pageKey_locale: { pageKey: "home", locale } },
    include: { sections: { include: { fields: true } } },
  });

  if (!content) return null;

  return {
    hero: extractSectionData(content, "hero"),
    trustMetrics: extractSectionData(content, "trustMetrics"),
    capabilities: extractSectionData(content, "capabilities"),
    featuredProducts: extractSectionData(content, "featuredProducts"),
    cta: extractSectionData(content, "cta"),
  };
}

function extractSectionData(content: PageContent, sectionKey: string) {
  const section = content.sections.find((s) => s.sectionKey === sectionKey);
  if (!section) return null;

  const fields: Record<string, any> = {};
  for (const field of section.fields) {
    fields[field.fieldKey] = parseFieldValue(field.value, field.fieldType);
  }
  return fields;
}

function parseFieldValue(value: string | null, type: string) {
  if (!value) return null;
  if (type === "json") return JSON.parse(value);
  if (type === "number") return parseFloat(value);
  if (type === "boolean") return value === "true";
  return value;
}
```

---

## 7. PHASE-BY-PHASE IMPLEMENTATION

### Phase 1: Database Setup (Week 1)

- ✅ Create Prisma migration for new tables
- ✅ Seed initial page_content entries for each page/locale
- ✅ Create TypeScript types for page structures

### Phase 2: Server Layer (Week 1-2)

- ✅ Create page loaders (`lib/content/loaders.ts`)
- ✅ Create server actions for content updates
- ✅ Add Zod validation schemas
- ✅ Update frontend data fetching

### Phase 3: Admin Dashboard (Week 2-3)

- ✅ Create `/admin/pages` list page (new design)
- ✅ Create `/admin/pages/[pageKey]/edit` page
- ✅ Build section editors
- ✅ Implement form state management
- ✅ Add hero section editor
- ✅ Add JSON editors for complex sections
- ✅ Add media picker integration

### Phase 4: Frontend Refactoring (Week 3-4)

- ✅ Create static page components (Home, About, Services)
- ✅ Build section components (HeroSection, etc.)
- ✅ Update loaders for each page
- ✅ Test rendering with new data model
- ✅ Implement RTL support

### Phase 5: Testing & Polish (Week 4)

- ✅ Test admin editing workflows
- ✅ Test frontend rendering
- ✅ Test multi-locale support
- ✅ Test RTL rendering
- ✅ Performance optimization

### Phase 6: Disable Old System (Week 5)

- ✅ Remove section type selector from UI
- ✅ Disable old admin routes
- ✅ Hide legacy components
- ✅ Document migration path
- ✅ Prepare rollback strategy

---

## 8. IMPLEMENTATION ROADMAP

### File Structure After Refactoring

```
lib/
├── content/
│   ├── page-definitions.ts     # NEW: Page & section definitions
│   ├── loaders.ts               # NEW: Content loaders for frontend
│   ├── types.ts                 # NEW: TypeScript types
│   └── validators.ts            # NEW: Zod schemas
├── actions/
│   ├── pages.ts                 # REFACTOR: Use new model
│   └── content.ts               # NEW: Content CRUD operations
└── ...

components/
├── admin/
│   ├── pages/
│   │   ├── page-list.tsx        # NEW: Show all pages
│   │   ├── page-editor.tsx      # NEW: Edit specific page
│   │   └── section-editor.tsx   # NEW: Edit section within page
│   └── ... (keep existing)
└── public/
    ├── home/
    │   ├── hero-section.tsx     # NEW: Static hero section
    │   ├── trust-metrics-section.tsx  # NEW
    │   ├── capabilities-section.tsx   # NEW
    │   └── ...
    └── ... (other pages)

app/
├── (admin)/admin/
│   ├── pages/
│   │   ├── page.tsx             # REFACTOR: List pages
│   │   ├── [pageKey]/
│   │   │   └── edit/page.tsx    # NEW: Page editor
│   │   └── ... (remove old routes)
│   └── ...
└── (public)/[locale]/
    ├── page.tsx                 # REFACTOR: Use new loaders
    ├── about/page.tsx           # REFACTOR
    ├── services/page.tsx        # REFACTOR
    └── ...
```

---

## 9. DATA MIGRATION STRATEGY

### Option A: Manual Seeding (Recommended for MVP)

1. Create page_content entries manually via admin
2. Edit sections via new admin interface
3. Publish when ready
4. Keep old PageSection data for reference

### Option B: Automated Migration (if needed)

```typescript
// Script: scripts/migrate-pages.ts
// Reads old PageSection data
// Converts to new PageContent structure
// Can be run once to bulk import
```

### Option C: Hybrid Approach

- Use new system for all new pages
- Keep old system running in parallel
- Gradually migrate existing pages

---

## 10. BACKWARD COMPATIBILITY CHECKLIST

- ✅ Old `PageSection` table: KEEP (no new entries)
- ✅ Old `PageSectionTranslation` table: KEEP (no new entries)
- ✅ Old routes: Hide from UI but keep code
- ✅ Existing URLs: Map to new system
- ✅ Frontend rendering: Updated to use new loaders
- ✅ Admin UI: Updated to use new models
- ✅ Database: Only add new tables, don't delete old ones

---

## 11. DISABLED FEATURES

After refactoring, the following features will be **disabled** (not deleted):

### Admin UI

- ❌ `+ Add Section` button (in section list)
- ❌ `Reorder Sections` (drag & drop)
- ❌ Section Type Selector dropdown
- ❌ Delete Section button
- ❌ `section-type-selector.tsx` component
- ❌ `section-editor-modal.tsx` component
- ❌ Old `/admin/pages/[id]/edit` route (dynamic sections)

### Frontend

- ❌ `SectionRenderer` component (dynamic switching)
- ❌ `renderSection()` function
- ❌ Section type-based rendering

### Database (but kept for reference)

- ⚠️ `PageSection` model (no new entries)
- ⚠️ `PageSectionTranslation` model (no new entries)
- ⚠️ `SectionType` enum (deprecated but kept)

---

## 12. TESTING STRATEGY

### Unit Tests

- Content loaders return correct data shapes
- Zod validators reject invalid data
- Field value parsing handles all types

### Integration Tests

- Admin can Create/Read/Update content
- Frontend receives correct data
- Multi-locale switching works
- RTL rendering works

### E2E Tests

- Complete admin workflow: Edit home page → See changes on frontend
- Multi-locale workflow
- Media picker integration

---

## 13. ROLLBACK STRATEGY

If issues occur:

1. Keep old code commented out (not deleted)
2. New tables remain but unused
3. Frontend can switch back to old renderers
4. Admin can revert to old UI routes

To rollback:

```bash
# Restore old imports/routes
# Old PageSection data is still available
# Users see old content again
```

---

## 14. SUCCESS CRITERIA

✅ Project is considered successfully refactored when:

1. **Admin Dashboard**
   - Page list shows all available pages
   - Edit page works for at least Home page
   - All section editors render correctly
   - Can save and see updates
   - Multi-locale editing works

2. **Frontend**
   - Home page renders correctly with new loader
   - About page renders correctly
   - Services page renders correctly
   - No dynamic rendering logic (static composition only)
   - RTL rendering works

3. **Performance**
   - No waterfalls in data fetching
   - Frontend components are leaf-level (no nested fetches)
   - Server components used for data fetching

4. **Backward Compatibility**
   - Old tables preserved (no data loss)
   - Old code still present (not deleted)
   - Clear deprecation markers

5. **Documentation**
   - This file updated with actual implementation notes
   - Page definitions documented
   - Admin workflow documented
   - Frontend component structure documented

---

## APPENDIX A: FILE CHECKLIST

### Files to Create

- [ ] `lib/content/page-definitions.ts`
- [ ] `lib/content/loaders.ts`
- [ ] `lib/content/types.ts`
- [ ] `lib/content/validators.ts`
- [ ] `lib/actions/content.ts`
- [ ] `components/admin/pages/page-list.tsx`
- [ ] `components/admin/pages/page-editor.tsx`
- [ ] `components/admin/pages/section-editor.tsx`
- [ ] `components/public/home/hero-section.tsx`
- [ ] `components/public/home/trust-metrics-section.tsx`
- [ ] ... (more section components)
- [ ] Prisma migration file

### Files to Refactor

- [ ] `app/(admin)/admin/pages/page.tsx`
- [ ] `app/(admin)/admin/pages/[id]/edit/page.tsx` → Comment out or redirect
- [ ] `app/(public)/[locale]/page.tsx` (home)
- [ ] `app/(public)/[locale]/about/page.tsx`
- [ ] `app/(public)/[locale]/services/page.tsx`
- [ ] `lib/actions/pages.ts`
- [ ] `lib/public-pages.ts`

### Files to Disable (not delete)

- [ ] `section-type-selector.tsx`
- [ ] `section-editor-modal.tsx`
- [ ] `section-list.tsx`
- [ ] Section editors in `/pages/sections/`
- [ ] `components/public/section-renderer.tsx`

---

## APPENDIX B: QUICK REFERENCE

### Page Keys

- `home` - Homepage
- `about` - About page
- `services` - Services page
- `products` - Product catalog (optional)
- `contact` - Contact page (optional)

### Section Keys (Home Page)

- `hero` - Hero banner
- `trustMetrics` - Trust indicators/stats
- `capabilities` - Capabilities overview
- `featuredProducts` - Featured product showcase
- `cta` - Call to action

### Field Types

- `text` - Single line text
- `textarea` - Multi-line text
- `json` - JSON array/object
- `media` - Image/document reference
- `number` - Numeric value
- `boolean` - True/false

---

**Document Version**: 1.0  
**Last Updated**: April 2026  
**Next Review**: After Phase 1 completion
