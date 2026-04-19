# Project Milestones & Tasks - Damira Pharma Website & CMS

## Overview

This document outlines the major milestones and tasks for building the Damira Pharma corporate website with integrated CMS. The project uses a single Next.js 16 application for both public website and admin dashboard.

> **Note:** For all UI-related tasks, use the `frontend-design` skill to generate distinctive, production-grade interfaces that align with Damira's corporate pharmaceutical brand identity.

> **Company Profile Assets:** Reference images and content for company information are located at `docs/profile/`:
>
> - `1-Big Picture.png` - Company overview
> - `2-Positioning.png` - Market positioning
> - `3-Core Business Areas.png` - Business divisions
> - `4-Vision & Mission.png` - Vision and mission statements
> - `5-Core Values.png` - Company values
> - `6-Infrastructure.png` - Facilities and infrastructure
> - `7-Cold Chain.png` - Cold chain capabilities
> - `8-Quality & Compliance.png` - Quality standards
> - `9-Regulatory.png` - Regulatory information
> - `10-Logistics Distribution & Last-Mile Control.png` - Distribution network
> - `11-Market Reach.png` - Geographic coverage
> - `12-Market Access.png` - Market access strategy
> - `13-Strategic Portfolio Current.png` - Product portfolio
> - `14-Case Study.png` - Success stories
> - `15-Why Partner.png` - Partnership benefits
> - `16-Ethics & Compliance Commitment.png` - Ethics statement
> - `17-Let's Build the Future.png` - Call to action / contact

---

## Milestone 1: Project Foundation & Infrastructure

**Goal:** Establish the technical foundation with all core dependencies and project structure.

**UI Skill:** Use `frontend-design` skill for design tokens and base component styling.

### Tasks

- [x] **1.1** Install and configure all dependencies (Prisma, Auth.js, next-intl, shadcn/ui, Zod, Tiptap, TanStack Table, Lucide React)
- [x] **1.2** Set up PostgreSQL database and initialize Prisma with connection
- [x] **1.3** Design and implement complete Prisma schema (User, Product, ProductTranslation, ProductAdvancedDetails, ProductAttachment, Page, PageTranslation, PageSection, PageSectionTranslation, Category, TherapeuticArea, Manufacturer, Media, FormSubmission)
- [x] **1.4** Run initial migration and create seed script (admin user, categories, therapeutic areas, manufacturers)
- [x] **1.5** Set up project folder structure with route groups (`(public)`, `(admin)`) and configure next-intl middleware for locale routing
- [x] **1.6** Configure RTL support and set up bilingual typography (Inter/Plus Jakarta Sans for EN, Cairo for AR)
- [x] **1.7** Create design tokens and configure Tailwind theme with Damira brand colors (Primary Blue/Cyan, Green, Orange accents) - Reference `docs/profile/` for brand direction
- [x] **1.8** Set up file storage abstraction (local dev, S3/R2 production) and environment variables structure

**Deliverables:**

- Fully configured development environment
- Database schema and initial migrations with seed data
- Base routing structure with i18n support
- Design system tokens and brand configuration

---

## Milestone 2: Authentication & User Management

**Goal:** Implement secure authentication for admin dashboard access.

**UI Skill:** Use `frontend-design` skill for login page design.

### Tasks

- [x] **2.1** Configure Auth.js with credentials provider, session strategy, and password hashing
- [x] **2.2** Create authentication server actions (login, logout) with Zod validation
- [x] **2.3** Build admin login page UI (`/admin/login`) with form, error handling, and loading states
- [x] **2.4** Create auth middleware for protecting admin routes and session provider wrapper
- [x] **2.5** Implement user CRUD server actions with role-based access (Admin, Internal User)

**Deliverables:**

- Working `/admin/login` page
- Protected admin routes with session-based authentication
- User management in database

---

## Milestone 3: Admin Dashboard Shell & Navigation

**Goal:** Build the admin dashboard layout and navigation structure.

**UI Skill:** Use `frontend-design` skill for dashboard layout, sidebar, and navigation components with corporate pharmaceutical aesthetic.

### Tasks

- [x] **3.1** Create admin root layout with sidebar navigation, top header bar (user info, logout), and mobile-responsive collapsible sidebar
- [x] **3.2** Build navigation components (sidebar items, breadcrumbs, page headers) for all modules (Dashboard, Products, Pages, Sections, Forms, Media, Settings, Users)
- [x] **3.3** Create dashboard overview page with placeholder stats cards (products count, submissions count, etc.)
- [x] **3.4** Build reusable admin UI components (Card, Button variants, Input/Form fields, Modal/Dialog, Toast/Notification)
- [x] **3.5** Create admin error boundaries (loading.tsx, error.tsx, not-found.tsx) and apply Damira brand color scheme

**Deliverables:**

- Complete admin shell with navigation
- Dashboard overview page
- Consistent, responsive admin UI components

---

## Milestone 4: Media Library & File Management

**Goal:** Enable file uploads and media management for the CMS.

**UI Skill:** Use `frontend-design` skill for media library grid, upload UI, and media picker modal.

### Tasks

- [x] **4.1** Create media upload API route with file validation, storage integration, and database record creation
- [x] **4.2** Build media CRUD server actions (listing with pagination, deletion)
- [x] **4.3** Create media library page with grid/list views, drag-and-drop upload zone, and progress indicator
- [x] **4.4** Implement media search/filter (by name, type), image preview modal, and file metadata display
- [x] **4.5** Build reusable MediaPicker modal component with single/multi select modes and copy URL functionality

**Deliverables:**

- `/admin/media` page with full upload functionality
- Media library with search, filtering, and preview
- Reusable MediaPicker component for other modules

---

## Milestone 5: Product Catalog Management (Admin)

**Goal:** Build complete product management system in admin dashboard.

**UI Skill:** Use `frontend-design` skill for product listing table, create/edit forms, and product type selection UI.

### Tasks

- [x] **5.1** Create product CRUD server actions (list with filters/pagination, fetch single, create, update, delete, status toggle) with Zod validation
- [x] **5.2** Build products listing page with TanStack Table (columns: name, category, status, therapeutic area, actions; sorting, filtering, pagination)
- [x] **5.3** Create product create/edit pages with type selector (Simple/Advanced) and dynamic form fields
- [x] **5.4** Build product form with all fields: base info, advanced fields (storage conditions, regulatory), dropdowns (category, therapeutic area, manufacturer), status selector
- [x] **5.5** Integrate MediaPicker for cover image and attachments, implement bilingual tabs (EN/AR) for ProductTranslation
- [x] **5.6** Add form validation display, submission loading states, success/error toasts, and delete confirmation modal

**Deliverables:**

- `/admin/products` listing page with filtering/sorting
- Product create/edit pages with full form support
- Bilingual content management and media integration

---

## Milestone 6: Page & Content Management (Admin)

**Goal:** Build CMS functionality for managing website pages and sections.

**UI Skill:** Use `frontend-design` skill for page editor, section management UI, and rich text editor styling.

### Tasks

- [x] **6.1** Create page and section CRUD server actions (list, fetch with sections, create, update, delete, reorder sections)
- [x] **6.2** Build pages listing page and page edit page with metadata form (title, slug, SEO)
- [x] **6.3** Create section management UI with drag-and-drop reordering, type selector, add/delete flows
- [x] **6.4** Define and build section type editors (hero, text/content, cards, stats, features, cta, image-text) - Reference `docs/profile/` images for section content examples
- [x] **6.5** Configure and style Tiptap editor with toolbar and MediaPicker image embedding
- [x] **6.6** Implement bilingual content tabs for page and section translations

**Deliverables:**

- `/admin/pages` listing and editor pages
- Section-based content management with rich text
- Bilingual content editing workflow

---

## Milestone 7: Form Submissions Management (Admin)

**Goal:** Build system for managing contact and partnership form submissions.

**UI Skill:** Use `frontend-design` skill for submissions table and detail view.

### Tasks

- [x] **7.1** Create form submission server actions (list with filters, fetch single, update status, delete)
- [x] **7.2** Build submissions listing page with TanStack Table (columns: name, email, type, status, date; sorting, filtering by type/status/date, pagination)
- [x] **7.3** Create submission detail page with all fields display, status change dropdown, and delete confirmation
- [x] **7.4** Add quick actions (mark as reviewed), new submission indicator, and optional CSV export

**Deliverables:**

- `/admin/forms` listing and detail pages
- Status management workflow with filtering

---

## Milestone 8: Settings & User Administration

**Goal:** Complete admin dashboard with settings and user management.

**UI Skill:** Use `frontend-design` skill for settings pages and user management UI.

### Tasks

- [x] **8.1** Create CRUD server actions for lookup tables (therapeutic areas, categories, manufacturers) and site settings
- [x] **8.2** Build settings page with tabs: lookup tables management (inline edit/delete), site settings (name, contact, SEO defaults)
- [x] **8.3** Create user CRUD server actions and build users listing page with table and role display
- [x] **8.4** Build user create/edit forms with role assignment, password management, and current user profile edit

**Deliverables:**

- `/admin/settings` page with lookup table and site configuration
- `/admin/users` management page

---

## Milestone 9: Public Website - Core Pages

**Goal:** Build the public-facing website pages with CMS-driven content.

**UI Skill:** Use `frontend-design` skill for all public pages with corporate pharmaceutical aesthetic - modern, trust-focused, clean layout with bold typography. Reference `docs/profile/` for content and visual direction.

### Tasks

- [x] **9.1** Create public layout with header, footer, language switcher (EN/AR), and navigation links
- [x] **9.2** Build dynamic section renderer and all section components (Hero, Stats, Cards, Features, CTA, Image+Text, Text/Content)
- [x] **9.3** Build homepage with CMS-driven sections - Reference: `1-Big Picture.png`, `2-Positioning.png`, `3-Core Business Areas.png`
- [x] **9.4** Build About Us page - Reference: `4-Vision & Mission.png`, `5-Core Values.png`, `14-Case Study.png`
- [x] **9.5** Build Services page - Reference: `3-Core Business Areas.png`, `6-Infrastructure.png`, `10-Logistics Distribution & Last-Mile Control.png`
- [x] **9.6** Build Quality & Compliance page - Reference: `8-Quality & Compliance.png`, `9-Regulatory.png`, `16-Ethics & Compliance Commitment.png`
- [x] **9.7** Build Partnerships page - Reference: `15-Why Partner.png`, `12-Market Access.png`, `17-Let's Build the Future.png`
- [x] **9.8** Implement RTL layout and styling for Arabic, scroll animations, and public error pages (loading, not-found, error)

**Deliverables:**

- Responsive public website layout with language switching
- All core pages with CMS-managed, bilingual content
- RTL support for Arabic

---

## Milestone 10: Public Website - Product Catalog

**Goal:** Build the public product catalog with search and filtering.

**UI Skill:** Use `frontend-design` skill for product cards, listing page, and product detail page. Reference `13-Strategic Portfolio Current.png` for portfolio presentation style.

### Tasks

- [x] **10.1** Create public product server actions (listing published only, single fetch, search)
- [x] **10.2** Build products listing page with grid layout, product cards, and grid/list view toggle
- [x] **10.3** Implement search input, filter sidebar (therapeutic area, category, status), URL state management, and pagination
- [x] **10.4** Build product detail page with cover image, full info, advanced details, attachments download, and related products
- [x] **10.5** Implement product page SEO metadata and test catalog in both languages

**Deliverables:**

- `/products` listing page with search and filters
- Product detail pages with SEO optimization

---

## Milestone 11: Public Website - Contact & Forms

**Goal:** Implement public-facing forms with server-side processing.

**UI Skill:** Use `frontend-design` skill for contact page and form components. Reference `17-Let's Build the Future.png` for CTA styling.

### Tasks

- [x] **11.1** Create form submission server action with Zod schemas (contact, partnership, product inquiry)
- [x] **11.2** Build Contact Us page with form, company contact information, and optional map - Reference: `11-Market Reach.png`
- [x] **11.3** Create form components with validation display, loading states, success/error feedback, and honeypot spam protection
- [x] **11.4** Add partnership form to Partnerships page with inquiry type dropdown

**Deliverables:**

- Contact page with working forms
- Form validation, error handling, and database storage

---

## Milestone 12: SEO, Performance & Production Readiness

**Goal:** Optimize for search engines and production deployment.

### Tasks

- [x] **12.1** Implement dynamic metadata generation for all pages and products, create sitemap.ts and robots.ts
- [x] **12.2** Add Open Graph/Twitter card metadata and optional OG image generation
- [x] **12.3** Implement structured data (JSON-LD) for organization and products
- [x] **12.4** Configure ISR revalidation for public and product pages, optimize all images with next/image
- [x] **12.5** Build custom 404/500 error pages, add loading skeletons throughout, review Core Web Vitals
- [x] **12.6** Configure production environment (database, file storage, env variables), set up deployment pipeline, create deployment documentation

**Deliverables:**

- Complete SEO implementation
- Optimized performance metrics
- Production-ready configuration and documentation

---

## Milestone 13: Polish & Launch Readiness

**Goal:** Final polish, testing, and preparation for production launch.

**UI Skill:** Use `frontend-design` skill for any final UI refinements and micro-interactions.

### Tasks

- [ ] **13.1** Conduct UI/UX review: typography consistency, spacing, hover states, animations, loading states (EN and AR)
- [ ] **13.2** Cross-browser and device testing (Chrome, Firefox, Safari, Edge; iOS, Android; tablet responsiveness)
- [ ] **13.3** Full RTL testing for Arabic and accessibility audit (WCAG compliance, keyboard nav, screen readers)
- [ ] **13.4** Complete workflow testing: form validation, admin dashboard flows, content entry with real data
- [ ] **13.5** Security review (authentication, data validation) and error handling audit
- [ ] **13.6** Create documentation: admin user guide, content entry guidelines
- [ ] **13.7** Final review: all text/copy, links, staging review with stakeholders
- [ ] **13.8** Production deployment, smoke testing, post-launch monitoring setup, and handoff to admin team

**Deliverables:**

- Polished, production-ready website
- Comprehensive testing completed
- Admin documentation and successful launch

---

## Milestone Summary

| #   | Milestone                           | Tasks  | Focus Area                     |
| --- | ----------------------------------- | ------ | ------------------------------ |
| 1   | Project Foundation & Infrastructure | 8      | Setup, Database, Config        |
| 2   | Authentication & User Management    | 5      | Auth.js, Sessions, Protection  |
| 3   | Admin Dashboard Shell & Navigation  | 5      | Layout, Navigation, UI         |
| 4   | Media Library & File Management     | 5      | Uploads, Storage, Media Picker |
| 5   | Product Catalog Management (Admin)  | 6      | Products CRUD, Translations    |
| 6   | Page & Content Management (Admin)   | 6      | CMS, Rich Text, Sections       |
| 7   | Form Submissions Management (Admin) | 4      | Leads, Status, Filtering       |
| 8   | Settings & User Administration      | 4      | Config, Users, Lookups         |
| 9   | Public Website - Core Pages         | 8      | Homepage, About, Services      |
| 10  | Public Website - Product Catalog    | 5      | Products, Search, Filters      |
| 11  | Public Website - Contact & Forms    | 4      | Forms, Validation, Submissions |
| 12  | SEO, Performance & Production       | 6      | Optimization, Deployment       |
| 13  | Polish & Launch Readiness           | 8      | Testing, Documentation, Launch |
|     | **Total**                           | **74** |                                |

---

## Notes

- Milestones are designed to be completed sequentially, with each building on the previous
- Admin dashboard (Milestones 2-8) is built before public site (Milestones 9-11) to enable content creation
- Use `frontend-design` skill for all UI generation to ensure distinctive, brand-aligned interfaces
- Reference `docs/profile/` images for company content, visual direction, and section examples
