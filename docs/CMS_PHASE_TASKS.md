# CMS Refactor Phase Tasks

Status legend:

- [ ] Not started
- [~] In progress
- [x] Completed

## Phase 0 - Stabilization Baseline

- [x] Fix blocking lint errors in CMS v2 core files
- [x] Re-run build + lint and confirm green baseline
- [x] Record baseline verification notes

## Phase 1 - Data Readiness and Initialization

- [x] Confirm Prisma schema/migration strategy for current environment
- [x] Initialize PageContent for all fixed pages and locales (home/about/services/products/contact x en/ar)
- [x] Validate sections and fields exist per page definition
- [x] Record DB integrity check results

## Phase 2 - Admin Route Migration (Structured Flow)

- [x] Align routes to structured editing flow
- [x] Implement /admin/pages/[pageKey]/edit with locale query support
- [x] Ensure page list maps to fixed page keys

## Phase 3 - Admin Editor Refactor

- [x] Remove dynamic section builder behavior (add/reorder/type picker)
- [x] Implement fixed section field editors by page definition
- [x] Wire save/cancel and locale tabs against v2 server actions

## Phase 4 - Frontend Migration to Static Composition

- [x] Replace dynamic section renderer usage in public pages
- [x] Use page-specific loaders for home/about/services/products/contact
- [x] Validate typed section data mapping in components

## Phase 5 - Compatibility and Cleanup

- [x] Keep legacy v1 tables/query paths intact but deprecated
- [x] Gate old UI paths where needed without destructive removal
- [x] Document compatibility behavior clearly

## Phase 6 - QA and Regression Validation

- [x] Validate EN/AR + RTL rendering paths
- [x] Validate SEO metadata and cache revalidation after updates
- [x] Validate media and JSON field editing workflows

## Phase 7 - Deployment Readiness

- [x] Prepare migration/seed execution checklist
- [x] Verify rollback strategy and production notes
- [x] Final sign-off report

## Current Session Log

- [x] Build now succeeds after previous TypeScript fixes
- [x] Phase 0 lint stabilization completed (0 lint errors)
- [x] Build verification completed after fixes (Next build passes)
- [x] Seed script updated for Prisma 7 adapter-based client initialization
- [x] Seed expanded to include products/contact page content (EN/AR)
- [x] Database seeded successfully: 10 pageContent rows, 32 sections, 86 fields
- [x] Verified page-locale completeness: no missing pairs, no section mismatches
- [x] Migration strategy note: current DB is not Prisma Migrate-managed yet (no baseline migrations folder applied)
- [x] Admin pages list switched to fixed structured pages with EN/AR edit entry points
- [x] Admin edit route now resolves structured pageKey + locale before legacy ID fallback
- [x] Structured page editor implemented with fixed section inputs from page definitions
- [x] Save/Cancel actions wired to v2 server actions (`updatePageContent`, `initializePageContent`)
- [x] Locale tabs wired to EN/AR route switching with unsaved-changes confirmation
- [x] Public home/about/services migrated from dynamic renderer to static section composition
- [x] Public products/contact now consume v2 loaders for metadata and section content
- [x] Build verification passed after frontend migration changes
- [x] Legacy `/admin/pages/new` route now guarded and requires explicit `?legacy=1`
- [x] Quick Actions now direct to structured pages; legacy duplicate flow remains opt-in
- [x] Legacy public-page APIs annotated and runtime-warned in development (`lib/public-pages.ts`)
- [x] Build verification passed after compatibility cleanup changes
- [x] Runtime validation passed: `/en` renders `dir="ltr"`, `/ar` renders `dir="rtl"`
- [x] Runtime validation passed: Open Graph metadata present for EN/AR home responses
- [x] Revalidation wiring verified in v2 content actions (`revalidatePath` on page/admin paths)
- [x] JSON/media validator smoke tests passed (`parseFieldValue`, `serializeFieldValue`, `validateJsonArray/Object`)
- [x] Prisma seed standardized via `prisma.config.ts` (`migrations.seed: npx tsx prisma/seed.ts`)
- [x] Deployment checklist created: `docs/CMS_V2_DEPLOYMENT_CHECKLIST.md`
- [x] Final sign-off report created: `docs/CMS_V2_SIGNOFF_REPORT.md`
- [x] Verified `npx prisma db seed` works with new config
- [x] Final build verification passed after Phase 7 updates
