# Project Structure & File Guide

Complete overview of Damira Pharma website codebase with one-line descriptions.

---

## Directory Tree

```
damira-pharma-site/
├── AGENTS.md                              # Framework requirements & code style guidelines
├── CLAUDE.md                              # AI coding assistance reference
├── package.json                           # Dependencies and scripts
├── next.config.ts                         # Next.js configuration
├── tsconfig.json                          # TypeScript configuration
├── eslint.config.mjs                      # ESLint rules
├── postcss.config.mjs                     # PostCSS and Tailwind config
├── prisma.config.ts                       # Prisma configuration
├── middleware.ts                          # Next.js middleware
├── components.json                        # UI component library config
├── docker-compose.yml                     # Docker services setup
├── README.md                              # Project overview
│
├── app/                                   # App Router - All routes & pages
│   ├── layout.tsx                         # Root layout wrapper
│   ├── page.tsx                           # Homepage
│   ├── globals.css                        # Global styles
│   ├── robots.ts                          # SEO robots file
│   ├── sitemap.ts                         # SEO sitemap
│   ├── middleware.ts                      # Request middleware
│   │
│   ├── (admin)/
│   │   └── admin/
│   │       ├── layout.tsx                 # Admin layout with sidebar
│   │       ├── page.tsx                   # Admin dashboard
│   │       └── [...slug]/page.tsx         # Nested admin pages
│   │
│   ├── (public)/
│   │   └── [locale]/
│   │       ├── layout.tsx                 # Public site layout
│   │       ├── page.tsx                   # Public homepage
│   │       ├── [slug]/page.tsx            # Dynamic CMS pages
│   │       ├── products/
│   │       │   ├── page.tsx               # Product catalog
│   │       │   └── [id]/page.tsx          # Product detail
│   │       └── about/page.tsx             # About us page
│   │
│   ├── api/
│   │   ├── route.ts                       # API gateway/health check
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts     # NextAuth endpoints
│   │   ├── admin/
│   │   │   └── [route]/route.ts           # Admin API endpoints
│   │   └── media/
│   │       └── route.ts                   # Media management API
│   │
│   └── og/
│       └── route.tsx                      # Dynamic OG image generation
│
├── components/                            # Reusable React components
│   ├── index.ts                           # Component barrel export
│   │
│   ├── admin/
│   │   ├── admin-header.tsx               # Admin header bar
│   │   ├── admin-sidebar.tsx              # Admin sidebar navigation
│   │   ├── page-header.tsx                # Section header
│   │   ├── section-card.tsx               # Content section card
│   │   ├── nav-item.tsx                   # Nav menu item
│   │   ├── stats-card.tsx                 # Statistics display
│   │   ├── quick-actions.tsx              # Quick action buttons
│   │   ├── recent-activity.tsx            # Activity feed
│   │   ├── skeletons.tsx                  # Loading placeholders
│   │   ├── breadcrumbs.tsx                # Breadcrumb navigation
│   │   ├── language-tabs.tsx              # EN/AR tab switcher
│   │   ├── dynamic-array-field.tsx        # Dynamic array form field
│   │   ├── media-field.tsx                # Media selection field
│   │   ├── media-picker.tsx               # Media browser modal
│   │   ├── tiptap-editor.tsx              # Rich text editor
│   │   ├── tiptap-toolbar.tsx             # Editor toolbar
│   │   ├── tiptap-link-modal.tsx          # Link insertion modal
│   │   ├── tiptap-image-modal.tsx         # Image insertion modal
│   │   └── media/                         # Media components
│   │       ├── media-upload.tsx           # Media upload component
│   │       └── media-browser.tsx          # Media browser
│   │
│   ├── public/
│   │   ├── site-header.tsx                # Website header
│   │   ├── site-footer.tsx                # Website footer
│   │   ├── page-content.tsx               # Page content wrapper
│   │   ├── language-switcher.tsx          # Language selector
│   │   ├── section-renderer.tsx           # CMS section renderer
│   │   ├── scroll-reveal.tsx              # Scroll animation
│   │   ├── forms/
│   │   │   ├── contact-form.tsx           # Contact form
│   │   │   └── newsletter-signup.tsx      # Newsletter subscription
│   │   ├── loading/
│   │   │   ├── page-skeleton.tsx          # Page loading skeleton
│   │   │   └── product-skeleton.tsx       # Product skeleton loader
│   │   └── products/
│   │       ├── product-card.tsx           # Product card
│   │       ├── product-grid.tsx           # Product grid layout
│   │       └── product-filter.tsx         # Product filtering
│   │
│   ├── providers/
│   │   └── auth-provider.tsx              # Authentication context
│   │
│   └── ui/                                # Base UI components (shadcn/ui)
│       ├── button.tsx                     # Button component
│       ├── input.tsx                      # Text input
│       ├── label.tsx                      # Form label
│       ├── card.tsx                       # Card container
│       ├── dialog.tsx                     # Modal/dialog
│       ├── badge.tsx                      # Badge/tag
│       ├── dropdown.tsx                   # Dropdown menu
│       ├── tabs.tsx                       # Tab navigation
│       └── index.ts                       # UI export barrel
│
├── lib/                                   # Business logic & utilities
│   ├── utils.ts                           # General utilities
│   ├── auth.ts                            # Authentication logic
│   ├── auth-utils.ts                      # Auth utility functions
│   ├── db.ts                              # Database/Prisma client
│   ├── storage.ts                         # File storage helpers
│   ├── seo.ts                             # SEO helpers
│   ├── fonts.ts                           # Font configuration
│   ├── milestones.ts                      # Milestone calculations
│   ├── public-pages.ts                    # Public page data access
│   ├── public-page-fallbacks.ts           # Default page content
│   ├── tiptap-extensions.ts               # Editor extensions
│   │
│   ├── actions/
│   │   ├── page-actions.ts                # Page CRUD server actions
│   │   ├── media-actions.ts               # Media management actions
│   │   └── product-actions.ts             # Product management actions
│   │
│   ├── content/
│   │   ├── section-builders.ts            # Section builder functions
│   │   └── validators.ts                  # Content validation
│   │
│   ├── catalog/
│   │   └── products.ts                    # Product data access
│   │
│   └── schemas/
│       ├── page.ts                        # Page Zod schema
│       ├── section.ts                     # Section Zod schema
│       └── product.ts                     # Product Zod schema
│
├── types/                                 # TypeScript definitions
│   ├── index.ts                           # Types barrel export
│   ├── product.ts                         # Product types
│   ├── page.ts                            # Page types
│   ├── section.ts                         # Section types
│   ├── media.ts                           # Media types
│   └── user.ts                            # User & role types
│
├── i18n/                                  # Internationalization
│   ├── config.ts                          # i18n configuration
│   ├── routing.ts                         # Locale-based routing
│   ├── request.ts                         # Locale from request
│   └── navigation.ts                      # Navigation helpers
│
├── messages/                              # Translations
│   ├── en.json                            # English translations
│   └── ar.json                            # Arabic translations (RTL)
│
├── prisma/                                # Database
│   ├── schema.prisma                      # Prisma data model
│   └── seed.ts                            # Database seeding
│
├── public/                                # Static assets
│   └── uploads/                           # User uploaded files
│
└── generated/
    └── prisma/                            # Auto-generated Prisma types

```

---

## Root Level Files

| File                 | Purpose                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| `AGENTS.md`          | Framework requirements, build commands, code style guidelines, and Next.js 16 breaking changes documentation |
| `CLAUDE.md`          | References AGENTS.md for AI coding assistance context                                                        |
| `package.json`       | Project dependencies, scripts, and metadata for npm/Node.js                                                  |
| `next.config.ts`     | Next.js configuration including build settings and feature flags                                             |
| `tsconfig.json`      | TypeScript compiler configuration with strict mode and path aliases                                          |
| `eslint.config.mjs`  | ESLint configuration in flat config format for code linting                                                  |
| `postcss.config.mjs` | PostCSS configuration for CSS processing and Tailwind CSS integration                                        |
| `prisma.config.ts`   | Prisma ORM configuration file (likely for database schema if in use)                                         |
| `middleware.ts`      | Next.js middleware for request interception (auth, locale detection, redirects)                              |
| `next-env.d.ts`      | Auto-generated TypeScript definitions for Next.js                                                            |
| `components.json`    | UI component library configuration (likely for shadcn/ui)                                                    |
| `docker-compose.yml` | Docker services configuration for local development (database, services)                                     |
| `README.md`          | Project overview and setup instructions                                                                      |

## App Directory (`/app`)

**App Router structure for Next.js 16 - all routes and layouts**

| File          | Purpose                                                                     |
| ------------- | --------------------------------------------------------------------------- |
| `layout.tsx`  | Root layout wrapper for entire application with providers and global styles |
| `page.tsx`    | Homepage landing page component                                             |
| `globals.css` | Global styles with Tailwind CSS imports and theme CSS variables             |
| `robots.ts`   | SEO robots.txt configuration                                                |
| `sitemap.ts`  | SEO sitemap.xml dynamic generation                                          |

### Admin Routes (`/(admin)/admin/`)

| File                 | Purpose                                                              |
| -------------------- | -------------------------------------------------------------------- |
| `page.tsx`           | Admin dashboard main page                                            |
| `[...slug]/page.tsx` | Catch-all route for nested admin pages (products, content, settings) |
| `layout.tsx`         | Admin layout with sidebar and header structure                       |

### Public Routes (`/(public)/[locale]/`)

| File                     | Purpose                                                    |
| ------------------------ | ---------------------------------------------------------- |
| `layout.tsx`             | Public site layout with header, footer, and locale support |
| `page.tsx`               | Public homepage                                            |
| `[slug]/page.tsx`        | Dynamic page route for CMS pages                           |
| `products/page.tsx`      | Product catalog listing page                               |
| `products/[id]/page.tsx` | Individual product detail page                             |
| `about/page.tsx`         | About us page                                              |

### API Routes (`/api`)

| File                          | Purpose                                            |
| ----------------------------- | -------------------------------------------------- |
| `route.ts`                    | API gateway or health check endpoint               |
| `auth/[...nextauth]/route.ts` | NextAuth.js authentication endpoints               |
| `admin/[route]`               | Admin API endpoints for CRUD operations on content |
| `media/...`                   | Media upload and management endpoints              |

### OG Image Generation (`/og`)

| File        | Purpose                                                      |
| ----------- | ------------------------------------------------------------ |
| `route.tsx` | Dynamic Open Graph image generation for social media sharing |

## Components Directory (`/components`)

**Reusable React components organized by feature**

| File       | Purpose                                   |
| ---------- | ----------------------------------------- |
| `index.ts` | Component barrel export for clean imports |

### Admin Components (`/admin`)

| File                      | Purpose                                               |
| ------------------------- | ----------------------------------------------------- |
| `admin-header.tsx`        | Header bar for admin dashboard with navigation        |
| `admin-sidebar.tsx`       | Left sidebar navigation menu for admin panel          |
| `breadcrumbs.tsx`         | Navigation breadcrumb component                       |
| `page-header.tsx`         | Section header for admin pages with title and actions |
| `section-card.tsx`        | Card component for grouping admin content sections    |
| `nav-item.tsx`            | Sidebar navigation item component                     |
| `stats-card.tsx`          | Statistics display card (metrics, counts)             |
| `quick-actions.tsx`       | Component for quick action buttons on dashboard       |
| `recent-activity.tsx`     | Feed component showing recent CMS updates             |
| `skeletons.tsx`           | Loading skeleton placeholder components               |
| `language-tabs.tsx`       | Tab switcher for EN/AR language editing               |
| `dynamic-array-field.tsx` | Form field component for managing array data          |
| `media-field.tsx`         | Form field for selecting/uploading media files        |
| `media-picker.tsx`        | Modal component for browsing and selecting media      |
| `tiptap-editor.tsx`       | Rich text editor component using Tiptap               |
| `tiptap-toolbar.tsx`      | Toolbar for Tiptap editor with formatting options     |
| `tiptap-link-modal.tsx`   | Modal for adding/editing links in rich text           |
| `tiptap-image-modal.tsx`  | Modal for inserting images in rich text               |

### Media Sub-components (`/admin/media`)

| File                | Purpose                              |
| ------------------- | ------------------------------------ |
| `media-upload.tsx`  | Component for uploading media files  |
| `media-browser.tsx` | Component for browsing media library |

### Public Components (`/public`)

| File                    | Purpose                                            |
| ----------------------- | -------------------------------------------------- |
| `site-header.tsx`       | Public website header with navigation and branding |
| `site-footer.tsx`       | Public website footer with links and info          |
| `page-content.tsx`      | Wrapper component for page content rendering       |
| `language-switcher.tsx` | Language selection dropdown (EN/AR)                |
| `section-renderer.tsx`  | Dynamic section renderer for CMS content blocks    |
| `scroll-reveal.tsx`     | Scroll animation component for page elements       |

### Form Components (`/public/forms`)

| File                    | Purpose                                     |
| ----------------------- | ------------------------------------------- |
| `contact-form.tsx`      | Contact form with validation and submission |
| `newsletter-signup.tsx` | Newsletter subscription form                |

### Loading Components (`/public/loading`)

| File                   | Purpose                       |
| ---------------------- | ----------------------------- |
| `page-skeleton.tsx`    | Page loading skeleton         |
| `product-skeleton.tsx` | Product card loading skeleton |

### Product Components (`/public/products`)

| File                 | Purpose                         |
| -------------------- | ------------------------------- |
| `product-card.tsx`   | Product card display component  |
| `product-grid.tsx`   | Grid layout for product listing |
| `product-filter.tsx` | Product filtering sidebar       |

### UI Components (`/ui`)

**Shadcn/ui and custom base components**

| File           | Purpose                        |
| -------------- | ------------------------------ |
| `button.tsx`   | Reusable button component      |
| `input.tsx`    | Text input form control        |
| `label.tsx`    | Form label component           |
| `card.tsx`     | Card container component       |
| `dialog.tsx`   | Modal/dialog overlay component |
| `badge.tsx`    | Badge/tag display component    |
| `dropdown.tsx` | Dropdown menu component        |
| `tabs.tsx`     | Tab navigation component       |
| `index.ts`     | UI component barrel export     |

### Providers (`/providers`)

| File                | Purpose                                                |
| ------------------- | ------------------------------------------------------ |
| `auth-provider.tsx` | Authentication context provider for session management |

## Type Definitions (`/types`)

| File         | Purpose                                               |
| ------------ | ----------------------------------------------------- |
| `index.ts`   | Central export of all TypeScript types and interfaces |
| `product.ts` | Product entity types                                  |
| `page.ts`    | CMS page content types                                |
| `section.ts` | Section/block content types                           |
| `media.ts`   | Media asset types                                     |
| `user.ts`    | User and role types                                   |

## Internationalization (`/i18n`)

**Multi-language support (EN/AR)**

| File            | Purpose                                        |
| --------------- | ---------------------------------------------- |
| `config.ts`     | i18n configuration with supported locales      |
| `routing.ts`    | Locale-based routing configuration             |
| `request.ts`    | Helper to get locale from request              |
| `navigation.ts` | Navigation translation keys and locale helpers |

## Messages (`/messages`)

**Translation JSON files**

| File      | Purpose                                      |
| --------- | -------------------------------------------- |
| `en.json` | English translations for all UI strings      |
| `ar.json` | Arabic translations for all UI strings (RTL) |

## Library Functions (`/lib`)

**Utility functions and business logic**

| File                       | Purpose                                              |
| -------------------------- | ---------------------------------------------------- |
| `utils.ts`                 | General utility functions (formatting, validation)   |
| `auth.ts`                  | Authentication logic and session helpers             |
| `auth-utils.ts`            | Auth utility functions (role checking, permissions)  |
| `db.ts`                    | Database connection and Prisma client initialization |
| `storage.ts`               | File storage and media handling functions            |
| `seo.ts`                   | SEO helpers (metadata generation, structured data)   |
| `fonts.ts`                 | Font loading and configuration                       |
| `milestones.ts`            | Milestone/timeline calculation functions             |
| `public-pages.ts`          | Functions for retrieving public page data            |
| `public-page-fallbacks.ts` | Default content fallbacks for public pages           |
| `tiptap-extensions.ts`     | Custom Tiptap editor extensions                      |

### Action Sub-modules (`/lib/actions/`)

| File                 | Purpose                                |
| -------------------- | -------------------------------------- |
| `page-actions.ts`    | Server actions for CMS page CRUD       |
| `media-actions.ts`   | Server actions for media upload/delete |
| `product-actions.ts` | Server actions for product management  |

### Content Sub-modules (`/lib/content/`)

| File                  | Purpose                            |
| --------------------- | ---------------------------------- |
| `section-builders.ts` | Functions to build section content |
| `validators.ts`       | Content validation functions       |

### Database/Catalog Sub-modules (`/lib/catalog/`)

| File          | Purpose                       |
| ------------- | ----------------------------- |
| `products.ts` | Product data access functions |

### Schema Sub-modules (`/lib/schemas/`)

| File         | Purpose                           |
| ------------ | --------------------------------- |
| `page.ts`    | Zod schema for page validation    |
| `section.ts` | Zod schema for section validation |
| `product.ts` | Zod schema for product validation |

## Database (`/prisma`)

**Prisma ORM configuration and migrations**

| File            | Purpose                                                  |
| --------------- | -------------------------------------------------------- |
| `schema.prisma` | Prisma schema defining database models and relationships |
| `seed.ts`       | Database seeding script for initial data population      |

## Generated Files (`/generated/prisma/`)

| File                                                       | Purpose |
| ---------------------------------------------------------- | ------- |
| Client code and types auto-generated by Prisma from schema |

## Public Assets (`/public`)

| File          | Purpose                                                |
| ------------- | ------------------------------------------------------ |
| `uploads/`    | Directory for uploaded media files (images, documents) |
| `favicon.ico` | Website favicon                                        |
| `robots.txt`  | SEO robots file                                        |

---

## Key Directory Purposes Summary

```
damira-pharma-site/
├── app/                    # App Router - All routes and pages
├── components/             # Reusable React components by feature
├── lib/                    # Business logic, utilities, and actions
├── types/                  # TypeScript type definitions
├── i18n/                   # Internationalization (EN/AR)
├── messages/               # Translation JSON files
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets and uploads
├── docs/                   # Project documentation
└── generated/              # Auto-generated files (do not edit)
```

## Development Workflow

1. **Adding a Page**: Create file in `app/[feature]/page.tsx`
2. **Adding a Component**: Create in `/components/[category]/component-name.tsx`
3. **Adding API**: Create in `app/api/[route]/route.ts`
4. **Database Operations**: Use `/lib/actions/` server actions
5. **Translation**: Add keys to `messages/en.json` and `messages/ar.json`
6. **Types**: Export from `types/index.ts`
