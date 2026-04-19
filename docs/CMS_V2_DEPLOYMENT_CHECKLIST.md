# CMS v2 Deployment Checklist

Status: Production readiness checklist for structured CMS (PageContent/PageContentSection/PageContentField)
Date: April 2026

## 1. Scope

This checklist covers deployment of the structured CMS v2 system while preserving legacy v1 compatibility.

v2 primary:

- lib/content/page-definitions.ts
- lib/content/loaders.ts
- lib/actions/content.ts
- app/(admin)/admin/pages/page.tsx
- app/(admin)/admin/pages/[id]/edit/page.tsx

v1 compatibility retained:

- lib/public-pages.ts
- app/(admin)/admin/pages/new/page.tsx (legacy guarded via ?legacy=1)

## 2. Pre-Deploy Gates

Run and pass locally or in CI:

```bash
npm ci
npm run lint
npm run build
```

Validate seed command wiring:

```bash
npx prisma db seed
```

## 3. Database Readiness

### 3.1 If database is already managed by Prisma Migrate

```bash
npx prisma migrate deploy
npx prisma db seed
```

### 3.2 If database is NOT managed by Prisma Migrate (current known state)

Create and apply a baseline once:

```bash
mkdir prisma/migrations/0001_baseline
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0001_baseline/migration.sql
npx prisma migrate resolve --applied 0001_baseline
```

Then standard deploy flow:

```bash
npx prisma migrate deploy
npx prisma db seed
```

## 4. Data Integrity Validation

After deploy and seed, validate v2 records:

Expected:

- pageContent: 10 rows (5 pages x 2 locales)
- pageContentSection: 32 rows
- pageContentField: 86 rows

Check coverage of page/locale pairs:

- home/en, home/ar
- about/en, about/ar
- services/en, services/ar
- products/en, products/ar
- contact/en, contact/ar

## 5. Runtime Smoke Tests

### Public

- /en -> 200 and dir="ltr"
- /ar -> 200 and dir="rtl"
- /en/about, /ar/about
- /en/services, /ar/services
- /en/products, /ar/products
- /en/contact, /ar/contact
- /robots.txt
- /sitemap.xml

### Admin

- /admin/pages (structured list)
- /admin/pages/home/edit?locale=en
- /admin/pages/home/edit?locale=ar
- Save in editor and verify content persists after refresh

### Legacy compatibility

- /admin/pages/new -> structured guard page
- /admin/pages/new?legacy=1 -> legacy editor opens

## 6. Cache and Revalidation Checks

On save in structured editor, verify:

- admin page list reflects updates
- public page reflects changes after revalidation path execution

Relevant actions:

- updatePageContentField()
- updatePageContent()

## 7. Rollback Plan

## 7.1 Application rollback

Rollback to previous deployment artifact/release in your hosting platform.

## 7.2 Database rollback

Current v2 schema changes are additive and legacy-safe.

If migration bookkeeping needs correction:

```bash
npx prisma migrate resolve --rolled-back <migration_name>
```

If emergency fallback needed:

- keep v2 tables intact
- continue serving via legacy v1 routes/utilities where applicable
- disable structured routes at application level if required

## 8. Operational Notes

- Keep /admin protected by Auth.js session checks.
- Keep DATABASE_URL and storage credentials in secret manager only.
- Keep daily DB backups before and during rollout window.
- Monitor server logs for:
  - structured content validation errors
  - JSON parse failures in content fields
  - revalidation path warnings

## 9. Sign-off Criteria

Deployment is signed-off when:

- build and lint pass
- migrate + seed complete
- page/locale content coverage is complete
- EN/AR smoke tests pass
- structured admin save workflow passes
- legacy compatibility checks pass
