# Public UI Refactoring Plan - Damira Pharma (V2)

Complete task breakdown for refactoring public-facing UI from dynamic section rendering to structured page layouts.

**Source of Truth:** [CONTENT_STRUCTURE.md](CONTENT_STRUCTURE.md)

---

## Overview

**Total Tasks:** 46  
**Estimated Duration:** 4-5 weeks  
**Phases:** 7 sequential phases  
**No breaking changes to existing architecture**  
**CMS/Admin integration moved to final phase (Phase 7)**

---

## Progress Snapshot (Updated: 2026-04-16)

### Completed

- [x] Phase 1 completed (Tasks 1-4)
- [x] Phase 2 completed (Tasks 5-11)
- [x] Phase 3 completed (Tasks 12-34)
- [x] Phase 4 completed (Tasks 35-42)
- [x] Public pages are composed with fixed section components and typed mock data
- [x] Public pages no longer rely on dynamic section rendering (`section-renderer.tsx`)
- [x] Added `/quality` page route and kept `/compliance` compatibility route
- [x] Added Framer Motion dependency and implemented section reveal animation
- [x] Redesigned public navbar and footer with responsive behavior and improved language switch placement
- [x] Added dedicated Partnerships request form section in public page flow
- [x] Updated Contact form to support configurable inquiry-type selection (future admin-driven options)
- [x] Added placeholder public media assets for all mock-data image paths to prevent runtime `next/image` 400 errors during QA
- [x] Build passes successfully

### In Progress

- [ ] Phase 5 responsive QA across full device matrix (Tasks 43-45)
- [x] Phase 5 started: responsive navigation UX upgrade (top-bar removal, text-only active state, section dropdown links)
- [x] Phase 5 started: responsive form QA for Partnerships and Contact (EN/AR, desktop/tablet/mobile checks)
- [x] Phase 5 started: initial responsive QA run across all EN public routes (home/about/services/products/product-detail/quality/partnerships/contact)
- [ ] Full animation polish and consistency review (Tasks 44-45)

### Remaining

- [ ] Phase 6 performance optimization and Lighthouse validation (Task 46)
- [ ] Phase 7 CMS/admin data integration (Tasks 47-48)

### Immediate Next Steps

1. Complete Arabic full-route responsive QA matrix (mobile/tablet/desktop) for all public pages.
2. Finalize Phase 5 animation consistency and interaction polish (cards, section transitions, navigation interactions).
3. Run Lighthouse and optimize LCP/CLS and bundle size where needed.
4. Start CMS binding only after UI sign-off is complete.

---

## Pages to Build (From CONTENT_STRUCTURE.md)

1. **Home** - Hero, At-a-Glance, Strategic Focus, Key Strengths, Coverage, Portfolio, Success, CTA
2. **About Us** - Hero, Company Overview, Vision, Mission, Core Values, Focus Verticals, Legacy, Success Story
3. **Services** - Hero, Infrastructure, Cold Chain, Regulatory, Safety, Medical Support, Logistics, Market Access
4. **Products** - Hero, Categories, Current Portfolio, Pipeline, Catalog
5. **Quality & Compliance** - Hero, QMS, Certifications, Regulatory, Cold Chain, Ethics
6. **Partnerships** - Hero, Why Partner, Market Access, Infrastructure, Commercial Reach, Success, CTA
7. **Contact Us** - Hero, Contact Info, Contact Form, Company Identity
8. **Product Detail** - Hero, Product Info, Specifications, Related Products, CTA

---

## Task Organization by Phase

### Phase 1: Preparation & Infrastructure (Tasks 1-4)

Foundational setup. **Must complete before other phases.**

| Task | Description                                                                | Dependencies |
| ---- | -------------------------------------------------------------------------- | ------------ |
| 1    | Analyze CONTENT_STRUCTURE.md & map all pages/sections                      | None         |
| 2    | Create /components/public/sections folder structure                        | Task 1       |
| 3    | Create base section component template                                     | Task 2       |
| 4    | Set up design tokens & Tailwind config (colors: #0097dc, #f58238, #4cb748) | Task 1       |

**Goals:**

- Read and fully understand CONTENT_STRUCTURE.md
- Map each section to its page location
- Establish consistent folder organization
- Create TypeScript interfaces for section props
- Define design system tokens

**Verification:**

- [x] CONTENT_STRUCTURE.md fully mapped to component list
- [x] Folder structure created: `/components/public/sections/[page]/`
- [x] Base template ready for component creation
- [x] Design tokens in Tailwind/globals.css

---

### Phase 2: Reusable Base Components (Tasks 5-11)

Build foundational UI components used across ALL pages.

| Task | Description                                             | Dependencies |
| ---- | ------------------------------------------------------- | ------------ |
| 5    | Build HeroSection component                             | Task 3, 4    |
| 6    | Build StatsSection component                            | Task 3, 4    |
| 7    | Build CtaSection component                              | Task 3, 4    |
| 8    | Build ContentSection component (text + image layout)    | Task 3, 4    |
| 9    | Build CardGrid component (generic grid container)       | Task 8       |
| 10   | Build ProductCard component (for products/portfolio)    | Task 9       |
| 11   | Build ServiceCard component (for services/capabilities) | Task 9       |

**Goals:**

- **HeroSection:** Title, subtitle, tagline, CTA buttons (used on all 8 pages)
- **StatsSection:** Display metrics/facts (used on Home, About, Services)
- **CtaSection:** Call-to-action sections (used on Home, Partnerships, Contact)
- **ContentSection:** Text + image/icon sections (reused throughout)
- **CardGrid:** Generic grid layout for displaying cards
- **ProductCard:** Product name, category, description, image, price
- **ServiceCard:** Service/capability name, description, icon, features

All components must accept props for dynamic data.

**Verification:**

- [x] All 7 components exist in `/components/public/sections/base/`
- [x] TypeScript interfaces for all props
- [ ] Mobile/tablet/desktop responsive
- [x] No hardcoded data in components

---

### Phase 3: Page-Specific Section Components (Tasks 12-32)

Build sections specific to each page from CONTENT_STRUCTURE.md.

#### 3.1: Home Page Components (Tasks 12-16)

Located: `/components/public/sections/home/`

| Task | Component               | Purpose                                                                            |
| ---- | ----------------------- | ---------------------------------------------------------------------------------- |
| 12   | AtAGlanceSection        | Display: Founded 2025, Al Ahlam 1974, 1.5k m², 9k m³ storage, 10+ years expertise  |
| 13   | StrategicFocusSection   | Display 4 focus areas: Oncology, Critical Care, Nutrition, Diagnostics             |
| 14   | KeyStrengthsSection     | Display 5 key strengths: Audit-ready, cold chain, regulatory, distribution, legacy |
| 15   | CoverageReachSection    | Display: 100+ hospitals, 35k+ POS, 15k+ pharmacies, nationwide                     |
| 16   | PortfolioPreviewSection | Display product cards: Rinolac®, Rino Plus, Ausnutria + pipeline                   |

#### 3.2: About Us Page Components (Tasks 17-21)

Located: `/components/public/sections/about/`

| Task | Component              | Purpose                                                                 |
| ---- | ---------------------- | ----------------------------------------------------------------------- |
| 17   | CompanyOverviewSection | Founded 2025, Al Ahlam legacy, ISO/FDA certified, nationwide            |
| 18   | VisionMissionSection   | Display vision and mission statements side-by-side                      |
| 19   | CoreValuesSection      | Display 5 core values: Quality, Excellence, Ethics, Team, Patient       |
| 20   | FocusVerticalsSection  | Display 4 focus areas with descriptions                                 |
| 21   | LegacySuccessSection   | Display: 50+ years history, network, Rinolac® success story, 20% growth |

#### 3.3: Services Page Components (Tasks 22-28)

Located: `/components/public/sections/services/`

Each service section should display technical details with icons and descriptions.

| Task | Component                    | Purpose                                                                    |
| ---- | ---------------------------- | -------------------------------------------------------------------------- |
| 22   | InfrastructureSection        | Display: 1.5k m² facility, 9k m³ storage, segregated zones, HVAC, security |
| 23   | ColdChainSection             | Display: 2-8°C rooms, -80°C ultra-low, monitoring, 72hr backup, validation |
| 24   | RegulatoryServicesSection    | Display: Dossier, registration, authorization, continuous monitoring       |
| 25   | SafetyVigilanceSection       | Display: PV, MV, 24-hr reporting, safety officer details                   |
| 26   | MedicalSupportSection        | Display: Clinical education, KOL engagement, scientific communication      |
| 27   | LogisticsDistributionSection | Display: Nationwide network, multi-zone vehicles, traceability             |
| 28   | MarketAccessSection          | Display: Hospital relationships, tender management, scientific events      |

#### 3.4: Products Page Components (Tasks 29-31)

Located: `/components/public/sections/products/`

| Task | Component               | Purpose                                                               |
| ---- | ----------------------- | --------------------------------------------------------------------- |
| 29   | CategoriesSection       | Display 4 categories: Oncology, Critical Care, Nutrition, Diagnostics |
| 30   | CurrentPortfolioSection | Display product cards for: Rinolac®, Rino Plus, Ausnutria             |
| 31   | PipelineSegmentsSection | Display pipeline: Oncology, ICU, Nutrition, Pediatric, Diagnostic     |

#### 3.5: Quality & Compliance Page Components (Tasks 32-33)

Located: `/components/public/sections/quality/`

| Task | Component                | Purpose                                                       |
| ---- | ------------------------ | ------------------------------------------------------------- |
| 32   | CertificationsSection    | Display certification badges: GDP, GSP, ISO, FDA              |
| 33   | ComplianceDetailsSection | Display: QMS, SOP, CAPA, audits, cold chain integrity, ethics |

#### 3.6: Partnerships Page Components (Task 34)

Located: `/components/public/sections/partnerships/`

| Task | Component         | Purpose                                     |
| ---- | ----------------- | ------------------------------------------- |
| 34   | WhyPartnerSection | Display 6 reasons with icons & descriptions |

**Note:** Other partnership sections reuse base components (Hero, Stats, CTA, Content, CardGrid)

**Verification for Phase 3:**

- [x] All 22 page-specific components created
- [x] Each component has TypeScript interfaces for props
- [x] Organized in `/components/public/sections/[page]/` folders
- [ ] All components responsive and styled consistently

---

### Phase 4: Page Integration & Hardcoding (Tasks 35-42)

Replace existing pages with new structured components. Use HARDCODED DATA from CONTENT_STRUCTURE.md.

| Task | Page           | Location                                         | Sections to Compose                                                                                          |
| ---- | -------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| 35   | Home           | `app/(public)/[locale]/page.tsx`                 | Hero + AtAGlance + StrategicFocus + KeyStrengths + CoverageReach + PortfolioPreview + SuccessHighlight + CTA |
| 36   | About Us       | `app/(public)/[locale]/about/page.tsx`           | Hero + CompanyOverview + VisionMission + CoreValues + FocusVerticals + LegacySuccess                         |
| 37   | Services       | `app/(public)/[locale]/services/page.tsx`        | Hero + Infrastructure + ColdChain + Regulatory + Safety + MedicalSupport + Logistics + MarketAccess          |
| 38   | Products       | `app/(public)/[locale]/products/page.tsx`        | Hero + Categories + CurrentPortfolio + PipelineSegments + ProductCatalog (using CardGrid + ProductCards)     |
| 39   | Product Detail | `app/(public)/[locale]/products/[slug]/page.tsx` | Hero + ProductInfo + Specifications + RelatedProducts + CTA                                                  |
| 40   | Quality        | `app/(public)/[locale]/quality/page.tsx`         | Hero + Certifications + ComplianceDetails + CTA                                                              |
| 41   | Partnerships   | `app/(public)/[locale]/partnerships/page.tsx`    | Hero + WhyPartner + MarketAccess + Infrastructure + CommercialReach + ProvenSuccess + CTA                    |
| 42   | Contact        | `app/(public)/[locale]/contact/page.tsx`         | Hero + ContactInfoSection + ContactForm + CompanyIdentity                                                    |

**Goals for Phase 4:**

- Remove ALL usage of `section-renderer.tsx` from public pages
- Use fixed component composition (no dynamic section rendering)
- Reference hardcoded data from CONTENT_STRUCTURE.md
- All pages fully functional and displayed
- No reliance on Prisma/CMS data yet

**Important:** All data is hardcoded at this stage. CMS integration happens in Phase 7.

**Verification:**

- [x] All 8 pages created/refactored
- [x] All sections display correctly
- [x] No console errors
- [x] Navigation works between pages
- [ ] Mobile layout correct (testing for now, polishing later)

---

### Phase 5: Responsive Design & Animations (Tasks 43-45)

Cross-page testing and animation enhancements.

| Task | Description                                                                  | Scope                           |
| ---- | ---------------------------------------------------------------------------- | ------------------------------- |
| 43   | Test & fix responsive design (mobile/tablet/desktop)                         | All 8 pages, all sections       |
| 44   | Add Framer Motion animations (scroll triggers, page transitions, hover)      | All pages, smooth interactions  |
| 45   | Implement scroll reveal animations (enhance scroll-reveal.tsx or create new) | All sections, staggered reveals |

**Goals:**

- Ensure perfect responsive layout on all breakpoints
- Smooth animations at 60fps (no jank)
- Scroll reveals on section elements
- Page transition effects (fade in/slide)
- Hover interactions on buttons, cards, links
- Parallax effects where appropriate
- Loading states

**Verification:**

- [ ] Mobile (320px+) looks perfect
- [ ] Tablet (768px+) looks perfect
- [ ] Desktop (1200px+) looks perfect
- [ ] Animations smooth (DevTools shows 60fps)
- [ ] No animation lag or stutters
- [x] Scroll reveals triggered at correct points

---

### Phase 6: Performance & Optimization (Task 46)

Optimize bundle size and performance metrics.

| Task | Description                                                                         |
| ---- | ----------------------------------------------------------------------------------- |
| 46   | Optimize performance & bundle size (images, code-splitting, lazy loading, Tailwind) |

**Goals:**

- Remove unused imports and CSS
- Lazy-load components below fold
- Code-split heavy components
- Optimize all images (next/image)
- Optimize Tailwind CSS output
- Check Core Web Vitals

**Verification:**

- [ ] Lighthouse score >90
- [ ] Bundle size acceptable (<300KB gzipped)
- [ ] Images optimized
- [ ] No unused CSS
- [ ] Core Web Vitals: LCP <2.5s, CLS <0.1, FID <100ms

---

### Phase 7: Admin/CMS Integration (Tasks 47-48) — FINAL PHASE

Connect pages to real CMS data. **This happens LAST after UI is production-ready.**

| Task | Description                                                          | Dependencies         |
| ---- | -------------------------------------------------------------------- | -------------------- |
| 47   | Integrate public-pages.ts data fetching & replace hardcoded data     | Tasks 35-42 complete |
| 48   | Integrate products.ts & build dynamic data bindings for all sections | Tasks 35-42 complete |

**Goals:**

- Replace ALL hardcoded data with CMS fetched data
- Connect admin dashboard changes to page display
- Test that CMS updates immediately reflect on frontend
- Add media/image handling from `/public/uploads/`
- Verify section components accept all data from CMS
- Test with actual Prisma models

**"Ready for Admin" Checklist (to start Phase 7):**

- [x] All 8 pages displaying with hardcoded data
- [ ] All sections responsive and animated
- [ ] Performance optimized
- [ ] No console errors
- [ ] All UI complete and polished

**Verification (end of Phase 7):**

- [ ] Data fetching working correctly
- [ ] CMS edits display on pages
- [ ] All sections accept dynamic data correctly
- [ ] Media uploads display properly
- [ ] No hardcoded data remains
- [ ] All pages pull from CMS

---

## Critical Folder Structure

```
components/public/sections/
├── base/                              # Reusable across all pages
│   ├── HeroSection.tsx
│   ├── StatsSection.tsx
│   ├── CtaSection.tsx
│   ├── ContentSection.tsx
│   ├── CardGrid.tsx
│   ├── ProductCard.tsx
│   └── ServiceCard.tsx
│
├── home/                              # Home page (Tasks 12-16)
│   ├── AtAGlanceSection.tsx
│   ├── StrategicFocusSection.tsx
│   ├── KeyStrengthsSection.tsx
│   ├── CoverageReachSection.tsx
│   └── PortfolioPreviewSection.tsx
│
├── about/                             # About page (Tasks 17-21)
│   ├── CompanyOverviewSection.tsx
│   ├── VisionMissionSection.tsx
│   ├── CoreValuesSection.tsx
│   ├── FocusVerticalsSection.tsx
│   └── LegacySuccessSection.tsx
│
├── services/                          # Services page (Tasks 22-28)
│   ├── InfrastructureSection.tsx
│   ├── ColdChainSection.tsx
│   ├── RegulatoryServicesSection.tsx
│   ├── SafetyVigilanceSection.tsx
│   ├── MedicalSupportSection.tsx
│   ├── LogisticsDistributionSection.tsx
│   └── MarketAccessSection.tsx
│
├── products/                          # Products page (Tasks 29-31)
│   ├── CategoriesSection.tsx
│   ├── CurrentPortfolioSection.tsx
│   └── PipelineSegmentsSection.tsx
│
├── quality/                           # Quality & Compliance page (Tasks 32-33)
│   ├── CertificationsSection.tsx
│   └── ComplianceDetailsSection.tsx
│
├── partnerships/                      # Partnerships page (Task 34)
│   └── WhyPartnerSection.tsx
│
└── product-detail/                    # Product detail page
    └── ProductInfoSection.tsx
    └── SpecificationsSection.tsx
```

---

## Timeline

| Phase     | Tasks  | Duration      | Notes                                        |
| --------- | ------ | ------------- | -------------------------------------------- |
| 1         | 1-4    | 2-3 days      | Foundation & analysis                        |
| 2         | 5-11   | 3-4 days      | Reusable components (can parallelize)        |
| 3         | 12-34  | 5-7 days      | Page sections (can parallelize within phase) |
| 4         | 35-42  | 5-6 days      | Page integration (depends on Phase 3)        |
| 5         | 43-45  | 3-4 days      | Animations & responsive                      |
| 6         | 46     | 2 days        | Performance optimization                     |
| 7         | 47-48  | 3-4 days      | CMS integration (LAST)                       |
| **Total** | **48** | **4-5 weeks** | Flexible per team size                       |

---

## Key Principles

### ✅ Do

- Build UI purely from CONTENT_STRUCTURE.md
- Create components in `/components/public/sections/[page]/`
- Use TypeScript interfaces for all props
- Build responsive from start
- Use Tailwind + design tokens
- Keep existing `/components/admin` untouched
- Hardcode data until Phase 7

### ❌ Don't

- Delete `section-renderer.tsx` (just stop using it)
- Modify `section-builders.ts`
- Use dynamic section rendering in public pages
- Touch `/components/admin` or `/lib/actions`
- Modify Prisma schema
- Add CMS data until Phase 7
- Modify existing API routes

---

## Success Criteria (Final Checklist)

✓ All 48 tasks completed  
✓ All 8 pages built from CONTENT_STRUCTURE.md  
✓ No section-renderer usage in public pages  
✓ Full responsive design (mobile/tablet/desktop)  
✓ Smooth animations (60fps)  
✓ Performance optimized (Lighthouse >90)  
✓ All components accept dynamic props  
✓ CMS integration working  
✓ No hardcoded data after Phase 7  
✓ No breaking changes to existing code

---

## Migration from Phases

```
Phase 1 ─→ Phase 2 ─→ Phase 3 ─┐
                               ├─→ Phase 4 ─→ Phase 5 ─→ Phase 6 ─→ Phase 7
                            (can parallelize within)
```

**Rule: All tasks in a phase must complete before moving to next phase.**

---

## How to Use This Plan

1. **Start Phase 1:** Analyze and prepare
2. **Complete Phase 1 FULLY** before starting Phase 2
3. **Parallelize Phase 2 & 3** if multiple developers
4. **Follow the dependency chain** - don't skip ahead
5. **Mark tasks complete** as you finish them
6. **Reference CONTENT_STRUCTURE.md** constantly
7. **Move CMS integration to end** (Phase 7)

---

## Notes

- **CMS data comes last** - UI is built and polished first
- **Uses hardcoded data** - Makes testing easier in early phases
- **No breaking changes** - Existing admin/backend untouched
- **Production-ready UI** - Before connecting to CMS
- **Flexible timeline** - Can parallelize tasks within phases
