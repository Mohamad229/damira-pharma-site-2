# Public UI Refactoring Plan - Damira Pharma

Complete task breakdown for refactoring public-facing UI from dynamic section rendering to structured page layouts.

**Source of Truth:** [CONTENT_STRUCTURE.md](CONTENT_STRUCTURE.md)

---

## Overview

**Total Tasks:** 42 (revised based on CONTENT_STRUCTURE.md)  
**Estimated Duration:** 4-5 weeks  
**Phases:** 7 sequential phases  
**No breaking changes to existing architecture**
**CMS/Admin integration moved to final phase**

---

## Task Organization by Phase

### Phase 1: Preparation & Infrastructure (Tasks 1-4)

Foundational setup for the refactoring. **Must complete before other phases.**

| Task | Status      | Description                                         | Dependencies |
| ---- | ----------- | --------------------------------------------------- | ------------ |
| 1    | not-started | Analyze codebase & content structure                | None         |
| 2    | not-started | Create /components/public/sections folder structure | Task 1       |
| 3    | not-started | Create base section component template              | Task 2       |
| 4    | not-started | Set up design tokens & Tailwind config              | Task 1       |

**Goals:**

- Understand current CMS data structure
- Establish folder organization
- Create reusable component templates
- Define design system tokens (colors, spacing, etc.)

**Blockers:** None  
**Verification:**

- [ ] Folder structure created
- [ ] Base template ready for use
- [ ] Design tokens integrated

---

### Phase 2: Reusable Components (Tasks 5-11)

Build foundational UI components that will be used across all pages.

| Task | Status      | Description                    | When to start | Dependencies |
| ---- | ----------- | ------------------------------ | ------------- | ------------ |
| 5    | not-started | Build HeroSection component    | After Phase 1 | Task 3, 4    |
| 6    | not-started | Build StatsSection component   | After Task 5  | Task 3, 4    |
| 7    | not-started | Build CtaSection component     | After Task 5  | Task 3, 4    |
| 8    | not-started | Build ContentSection component | After Task 5  | Task 3, 4    |
| 9    | not-started | Build CardGrid component       | After Task 8  | Task 3, 4    |
| 10   | not-started | Build ProductCard component    | After Task 9  | Task 3, 4    |
| 11   | not-started | Build ServiceCard component    | After Task 9  | Task 3, 4    |

**Goals:**

- Create reusable base sections (hero, stats, CTA, content)
- Build card components for products/services
- Ensure responsive design at this stage
- Accept props for dynamic data

**These can be built in parallel once Phase 1 is complete.**

**Verification:**

- [ ] All 7 component files created
- [ ] Props interfaces defined
- [ ] Responsive on mobile/tablet/desktop
- [ ] Storybook/component preview working

---

### Phase 3: Page-Specific Sections (Tasks 12-19)

Build sections that are specific to each page's content.

| Task | Status      | Description                              | When to start | Dependencies |
| ---- | ----------- | ---------------------------------------- | ------------- | ------------ |
| 12   | not-started | Build home page sections                 | After Phase 2 | Task 5-11    |
| 13   | not-started | Build about page sections                | After Phase 2 | Task 5-11    |
| 14   | not-started | Build services page sections             | After Phase 2 | Task 5-11    |
| 15   | not-started | Build products page sections             | After Phase 2 | Task 5-11    |
| 16   | not-started | Build product detail page layout         | After Phase 2 | Task 5-11    |
| 17   | not-started | Build contact page sections              | After Phase 2 | Task 5-11    |
| 18   | not-started | Build quality & compliance page sections | After Phase 2 | Task 5-11    |
| 19   | not-started | Build partnerships page sections         | After Phase 2 | Task 5-11    |

**Goals:**

- Create reusable sections for each page
- Organize in `/components/public/sections/[page-name]/`
- All sections should be composable
- Accept data via props

**These can be built in parallel.**

**Verification:**

- [ ] All 8 page-specific section groups created
- [ ] Each section has clear prop interface
- [ ] All sections responsive

---

### Phase 4: Page Integration (Tasks 20-27)

Replace existing page implementations with new structured components.

| Task | Status      | Description                        | When to start | Dependencies     |
| ---- | ----------- | ---------------------------------- | ------------- | ---------------- |
| 20   | not-started | Refactor homepage                  | After Task 12 | Task 12 complete |
| 21   | not-started | Refactor about page                | After Task 13 | Task 13 complete |
| 22   | not-started | Refactor services page             | After Task 14 | Task 14 complete |
| 23   | not-started | Refactor products page             | After Task 15 | Task 15 complete |
| 24   | not-started | Refactor product detail page       | After Task 16 | Task 16 complete |
| 25   | not-started | Refactor contact page              | After Task 17 | Task 17 complete |
| 26   | not-started | Refactor quality & compliance page | After Task 18 | Task 18 complete |
| 27   | not-started | Refactor partnerships page         | After Task 19 | Task 19 complete |

**Goals:**

- Remove dynamic section renderer usage
- Use fixed component composition
- Keep pages in existing locations:
  - `app/(public)/[locale]/page.tsx` (home)
  - `app/(public)/[locale]/about/page.tsx`
  - `app/(public)/[locale]/services/page.tsx`
  - etc.
- Add hardcoded data for now (preparation for later CMS integration)

**These tasks must follow their corresponding section build (Task 12, 13, etc.)**

**Verification:**

- [ ] Pages display correctly
- [ ] No console errors
- [ ] All sections rendering

---

### Phase 5: Data Integration (Tasks 28-36)

Connect pages to real CMS data and optimize.

| Task | Status      | Description                             | When to start | Dependencies     |
| ---- | ----------- | --------------------------------------- | ------------- | ---------------- |
| 28   | not-started | Integrate public-pages.ts data fetching | After Phase 4 | Tasks 20-27      |
| 29   | not-started | Integrate products.ts data fetching     | After Phase 4 | Task 23, 24      |
| 30   | not-started | Add dynamic data binding to sections    | After Task 28 | Tasks 28, 29     |
| 31   | not-started | Test responsive design (m/t/d)          | After Task 30 | Task 30 complete |
| 32   | not-started | Add Framer Motion animations            | After Task 31 | Task 31 complete |
| 33   | not-started | Implement scroll reveal animations      | After Task 32 | Task 32 complete |
| 34   | not-started | Optimize performance & bundle size      | After Task 33 | Task 33 complete |
| 35   | not-started | Test CMS data compatibility             | After Task 30 | Task 30 complete |
| 36   | not-started | Add media/image handling                | After Task 30 | Task 30 complete |

**Goals:**

- Replace hardcoded data with fetched data
- Test animations and scroll effects
- Ensure responsive on all devices
- Verify CMS integration works
- Optimize performance

**Some tasks can run in parallel (31, 35, 36) after Task 30.**

**Verification:**

- [ ] Data fetching working
- [ ] Animations smooth (60fps)
- [ ] Mobile/tablet/desktop responsive
- [ ] CMS data displays correctly

---

### Phase 6: Documentation & Polish (Task 37)

Final documentation for the refactoring.

| Task | Status      | Description                           | When to start | Dependencies |
| ---- | ----------- | ------------------------------------- | ------------- | ------------ |
| 37   | not-started | Create comprehensive UI documentation | After Phase 5 | All previous |

**Goals:**

- Document all new components
- Create usage examples
- Document CMS data structure expectations
- Create component gallery/Storybook
- Add troubleshooting guide

**Verification:**

- [ ] Documentation complete
- [ ] Component examples provided
- [ ] Team can use components easily

---

## Folder Structure to Create

```
components/
├── public/
│   ├── sections/
│   │   ├── base/                          # Reusable base components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── CtaSection.tsx
│   │   │   ├── ContentSection.tsx
│   │   │   ├── CardGrid.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── ServiceCard.tsx
│   │   │
│   │   ├── home/                          # Home page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── ServicesSection.tsx
│   │   │   └── CtaSection.tsx
│   │   │
│   │   ├── about/                         # About page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── MissionSection.tsx
│   │   │   ├── TeamSection.tsx
│   │   │   └── ValuesSection.tsx
│   │   │
│   │   ├── services/                      # Services page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ServicesListSection.tsx
│   │   │   └── BenefitsSection.tsx
│   │   │
│   │   ├── products/                      # Products page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CatalogGridSection.tsx
│   │   │   └── FiltersSection.tsx
│   │   │
│   │   ├── product-detail/                # Product detail sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── InfoSection.tsx
│   │   │   ├── SpecificationsSection.tsx
│   │   │   └── RelatedProductsSection.tsx
│   │   │
│   │   ├── contact/                       # Contact page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FormSection.tsx
│   │   │   └── InfoSection.tsx
│   │   │
│   │   ├── quality/                       # Quality & Compliance sections
│   │   │   ├── HeroSection.tsx
│   │   │   └── CertificationsSection.tsx
│   │   │
│   │   └── partnerships/                  # Partnerships page sections
│   │       ├── HeroSection.tsx
│   │       └── PartnersGridSection.tsx
│   │
│   └── ...existing files...
```

---

## Key Principles

### ✅ Do

- Create new components in `/components/public/sections/`
- Use props for all dynamic data
- Keep existing `/components/admin` untouched
- Follow existing folder structure
- Build responsive from the start
- Use Tailwind and design tokens

### ❌ Don't

- Delete `section-renderer.tsx`
- Modify `section-builders.ts`
- Break existing API routes
- Hardcode data permanently (use props)
- Modify Prisma schema
- Touch `/components/admin`

---

## Success Criteria

✓ All 37 tasks completed  
✓ All public pages refactored  
✓ No section-renderer usage in public pages  
✓ Full responsive design (mobile/tablet/desktop)  
✓ Animations smooth and performant  
✓ CMS data integration working  
✓ All components accept dynamic props  
✓ Documentation complete  
✓ No breaking changes to existing code

---

## Task Dependencies Map

```
Phase 1 (Prep)
    ↓
    └─→ Task 1: Analyze
        ↓
        └─→ Task 2: Create folders
            ↓
            └─→ Task 3: Base template
                ↓
                └─→ Phase 2 (Reusable)
                    ↓
                    └─→ Tasks 5-11 (Parallel)
                        ↓
                        └─→ Phase 3 (Page-sections)
                            ↓
                            └─→ Tasks 12-19 (Parallel)
                                ↓
                                └─→ Phase 4 (Integration)
                                    ↓
                                    └─→ Tasks 20-27 (Sequential per page)
                                        ↓
                                        └─→ Phase 5 (Data)
                                            ↓
                                            └─→ Tasks 28-36 (Mix of seq/parallel)
                                                ↓
                                                └─→ Phase 6 (Documentation)
                                                    ↓
                                                    └─→ Task 37: Done
```

---

## Estimated Timeline

| Phase     | Tasks  | Duration      | Notes                       |
| --------- | ------ | ------------- | --------------------------- |
| 1         | 1-4    | 2-3 days      | Foundation                  |
| 2         | 5-11   | 3-4 days      | Can parallelize             |
| 3         | 12-19  | 4-5 days      | Can parallelize             |
| 4         | 20-27  | 5-6 days      | Depends on Tasks 12-19      |
| 5         | 28-36  | 4-5 days      | Mix of sequential/parallel  |
| 6         | 37     | 1-2 days      | Documentation               |
| **Total** | **37** | **3-4 weeks** | Flexible based on team size |

---

## How to Use This Plan

1. **Track Progress:** Use the todo list in VS Code
2. **Follow Phases:** Don't skip ahead
3. **Wait for Dependencies:** Check "When to start" before beginning tasks
4. **Verify Completion:** Use "Verification" checklist before moving on
5. **Document as You Go:** Keep notes in session memory

---

## When to Break a Task Down Further

- If a task takes >1 day, break it into subtasks
- If multiple people working, parallelize tasks within same phase
- If blocked by external factor, move to next available task

---

## Rollback Strategy

If major issues encountered:

1. Git revert to last working commit
2. Document what failed
3. Adjust approach
4. Restart task with new strategy

**Note:** Existing files remain untouched, so rollback is low-risk.
