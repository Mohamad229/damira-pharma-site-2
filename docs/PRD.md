# Product Requirements Document (PRD)

## Damira Pharma Website & CMS Platform

## 1. Project Overview

**Project Name:** Damira Pharma Website & CMS  
**Type:** Corporate Website + Content Management System (CMS)  
**Primary Goal:** Build a professional pharmaceutical company website with a powerful admin dashboard that allows full content and product management without developer dependency.

This PRD is based on:

- the company sitemap, which defines the public information architecture and core audience groups fileciteturn0file0L1-L20
- the company profile, which establishes the brand direction, strategic focus areas, infrastructure, compliance positioning, and visual identity across pages 2–17 fileciteturn0file1L1-L1
- the project AGENTS file, which confirms the current technical baseline: Next.js 16.2.2, React 19, TypeScript strict mode, Tailwind CSS 4, App Router, ESLint, and a separate admin/dashboard concept inside the same application stack fileciteturn1file0L1-L175

---

## 2. Objectives

- Present Damira Pharma as a trusted, compliant, and specialized healthcare company
- Showcase products in a structured catalog
- Highlight services, infrastructure, and compliance capabilities
- Generate partnership leads
- Provide full control to admin users via CMS
- Use a single full-stack Next.js architecture for both frontend and backend because the platform is content-centric and does not require a separate frontend/backend split

---

## 3. Target Users

### External Users

- Healthcare Professionals (HCPs)
- Pharmacy Owners / Managers
- Global Manufacturers / Partners

### Internal Users

- Admin
- Internal User

> Note: Multiple admin accounts may exist, but with the same permission level.

---

## 4. Confirmed Technical Baseline

The current project file indicates the following stack and conventions are already expected:

### Core Framework

- **Next.js 16.2.2** with App Router fileciteturn1file0L22-L41
- **React 19.2.4** with Server Components by default fileciteturn1file0L33-L36
- **TypeScript** with strict mode enabled fileciteturn1file0L56-L73
- **Tailwind CSS 4** for styling fileciteturn1file0L135-L141
- **ESLint** for linting and code quality fileciteturn1file0L8-L18

### Architectural Conventions

- App Router file conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts` fileciteturn1file0L42-L55
- Server Components by default; Client Components only where interaction is needed fileciteturn1file0L96-L115
- Direct database access should happen only in Server Components / Server Functions fileciteturn1file0L171-L175
- EN/AR multilingual support with RTL for Arabic is already expected fileciteturn1file0L151-L155
- Image optimization should use `next/image` fileciteturn1file0L162-L167
- All forms must be validated server-side fileciteturn1file0L156-L160

### Already-Implied Libraries / Patterns

The AGENTS file explicitly demonstrates or references:

- `zod` for schema validation in examples fileciteturn1file0L74-L95
- `useActionState` for form handling in React 19 style flows fileciteturn1file0L33-L36
- `fetch(..., { next: { revalidate } })` for caching / incremental revalidation fileciteturn1file0L143-L149

---

## 5. Recommended Project Architecture

### Recommended Approach

Use **one Next.js application** for:

- public website
- admin dashboard
- server actions / API routes
- authentication
- CMS logic
- form processing

This is aligned with your stated direction and is suitable because:

- the project is a website with CMS, not a large distributed platform
- there is no e-commerce checkout, payment, or highly complex transactional logic
- content, product catalog, and form handling are moderate in complexity
- keeping one codebase reduces deployment and maintenance overhead

### High-Level Architecture

- **Frontend:** Next.js App Router pages and components
- **Backend logic:** Server Actions + Route Handlers (`route.ts`)
- **Database access:** ORM from server-only modules
- **Auth:** admin/user login for dashboard
- **Storage:** local or cloud object storage for product files and images
- **CMS:** custom admin dashboard built inside the same Next.js app

### Route Strategy

Recommended route structure:

- `/` public website
- `/en/...` English pages
- `/ar/...` Arabic pages
- `/admin/login` admin access
- `/admin/...` protected dashboard routes

### Rendering Strategy

- **Static / ISR** for most public pages such as Home, About, Services, Compliance
- **Dynamic server rendering** for dashboard pages and frequently changing form data
- **Hybrid rendering** for product catalog pages depending on update frequency

---

## 6. Recommended Additional Technologies

The AGENTS file defines the base stack, but several project-critical pieces are still missing and should be added.

### Must-Add Technologies

#### 6.1 Database ORM

**Recommended:** Prisma

Why Prisma:

- Strong fit with TypeScript and strict typing
- Fast setup with Next.js
- Clean schema definition for CMS-style relational data
- Easy admin/product/form data modeling
- Developer-friendly migrations
- Good long-term maintainability for a small-to-medium business platform

Alternative:

- Drizzle ORM is also valid, but Prisma is more suitable here because the data model is straightforward and the team likely benefits from faster productivity and schema readability.

#### 6.2 Database

**Recommended:** PostgreSQL

Why PostgreSQL:

- Best fit for relational CMS data
- Handles multilingual content, products, forms, users, media metadata, and page sections well
- Mature, stable, scalable
- Better long-term flexibility than SQLite for multi-user admin usage
- Better structured querying than NoSQL for this project

Do **not** use MongoDB here unless there is a strong existing organizational preference, because the platform is clearly relational.

#### 6.3 Authentication

**Recommended:** Auth.js (NextAuth successor) with credentials-based auth

Why:

- Works naturally with Next.js
- Supports session handling for admin routes
- Appropriate for internal admin/user accounts
- Sufficient because login is limited to dashboard users

#### 6.4 Validation

**Recommended:** Zod

Use it for:

- product forms
- page content forms
- partnership submissions
- login credentials
- media metadata validation

#### 6.5 Rich Text Editing

**Recommended:** Tiptap or Lexical

Need:

- simple but professional page/content editing
- formatted product descriptions
- bilingual content blocks
- manageable editor UX for non-technical admins

Preferred:

- **Tiptap**, because it integrates well in modern React apps and is easier for modular CMS editing.

#### 6.6 File Storage

**Recommended options:**

- Local storage for development
- Cloud object storage in production such as **AWS S3** or **Cloudflare R2**

Reason:

- product PDFs and images should not live only inside the codebase
- admin uploads need reliable storage and clean URLs
- storage should support public files and protected admin management

#### 6.7 Image & Media Handling

- `next/image` for frontend optimization
- metadata stored in PostgreSQL
- actual file binary stored in object storage

#### 6.8 Data Tables in Admin

**Recommended:** TanStack Table

Why:

- Ideal for product lists
- good filtering/search/sorting UX
- fits admin dashboard tables for forms and products

#### 6.9 UI Components

**Recommended:** shadcn/ui + Tailwind CSS 4

Why:

- excellent fit with Next.js + Tailwind
- supports clean dashboards and form-heavy interfaces
- flexible enough to match the company profile style
- avoids building all interface primitives from scratch

#### 6.10 Icons

**Recommended:** Lucide React

#### 6.11 Form State / Mutations

Use:

- **Server Actions** for most admin mutations
- **Route Handlers** where external integrations or upload endpoints are cleaner

#### 6.12 Internationalization

**Recommended:** `next-intl`

Why:

- clean localized routing
- good Next.js App Router support
- manageable EN/AR translations
- helps with RTL and content separation

---

## 7. Recommended Database Strategy

### Selected Database

**PostgreSQL + Prisma**

### Why This Combination Fits the Project

This project needs:

- users and roles
- products with two types (simple / advanced)
- pages and reusable content sections
- multilingual fields
- form submissions
- media/file attachments
- product filtering and search
- clear admin control

This is classic relational CMS behavior, so PostgreSQL is the strongest fit.

### Hosting Options

Recommended production options:

- **Supabase Postgres**
- **Neon Postgres**
- **Railway Postgres**
- traditional managed PostgreSQL

Best practical recommendation:

- **Neon or Supabase** for easier setup with Next.js deployment workflows

### Search Strategy

For the first version:

- standard database search using indexed fields (`name`, `slug`, `category`, `therapeuticArea`, `status`)
- optional PostgreSQL full-text search for products later

No need for Elasticsearch / Algolia in phase 1.

---

## 8. Database Relationship Summary

- one **Page** has many **PageTranslations**
- one **Page** has many **PageSections**
- one **PageSection** has many **PageSectionTranslations**
- one **Product** has many **ProductTranslations**
- one **Product** may have one **ProductAdvancedDetails**
- one **Product** may have many **ProductAttachments**
- one **Product** belongs to one **Category**
- one **Product** belongs to one **TherapeuticArea**
- one **Product** may belong to one **Manufacturer**
- one **Media** may be attached to many products/pages depending on implementation
- one **User** may upload many **Media** items

---

## 9. Admin Dashboard Requirements

### Core Principles

The dashboard must:

- be fully separate from the user-facing website in access flow
- allow non-technical management of content
- support multiple admin accounts
- remain simple, clean, and fast
- visually feel aligned with the Damira brand and company profile style

### Main Dashboard Modules

- Dashboard Home
- Products
- Pages
- Sections / Content Blocks
- Forms / Leads
- Media Library
- Settings
- Users

### Product Management

Admin should be able to:

- create product
- choose `simple` or `advanced`
- see dynamic fields based on selected type
- upload cover image
- upload product files
- assign therapeutic area
- assign category
- assign manufacturer
- set product status
- publish / unpublish
- edit / delete

### Form Management

Admin should be able to:

- view all partnership submissions
- filter by form type and date
- open details
- mark status (`new`, `reviewed`, `archived`)
- delete if needed

### Content Management

Admin should be able to:

- edit each page by section
- manage bilingual content
- update homepage cards, stats, service blocks, trust signals
- upload and replace imagery/files without developer involvement

---

## 10. Frontend Style Direction Based on Company Profile

The company profile strongly suggests the visual direction of the website. The site should inherit that same brand language instead of introducing a disconnected style.

### Visual Style Observed in the Profile

Across the company profile pages, the design consistently uses:

- large bold typography for headings
- clean corporate spacing
- medical/corporate color palette
- soft cards with light backgrounds
- section-based storytelling
- data points and KPI blocks
- icon-supported feature cards
- strong use of white space
- professional image panels showing healthcare, logistics, storage, and infrastructure
- high trust / compliance tone rather than consumer retail tone fileciteturn0file1L1-L1

### Recommended Website Style Principles

- modern corporate healthcare look
- editorial section layouts
- clean card-based UI
- subtle gradients inspired by the profile
- trust-first design language
- product readability over visual clutter

### Color Direction

Based on the profile, recommended core colors:

- **Primary Blue / Cyan** for corporate trust and medical tone
- **Supporting Green** for health/compliance messaging
- **Accent Orange** for highlights, metrics, and CTAs
- **Neutral White / Light Gray** backgrounds for clarity

### Typography Direction

Use strong modern sans-serif typography with:

- bold headline weight
- clear hierarchy for section titles
- comfortable body text for bilingual reading
- slightly condensed/compact feel for major headings if brand-appropriate

Suggested practical fonts:

- **Inter** or **Plus Jakarta Sans** for English
- **Cairo** or **IBM Plex Sans Arabic** for Arabic

### Component Style

Recommended component language:

- rounded cards with soft shadow
- large metric blocks
- compliance badges
- image + text split sections
- structured icon cards for services, values, and capabilities
- clean tables/cards for products
- subtle hover states, not flashy animation

### Animation Style

Use minimal motion:

- fade / slide reveal
- smooth hover transitions
- no excessive motion or decorative effects

The profile style supports authority and trust; the site should preserve that.

---

## 11. Frontend Technology Decisions

### Recommended Frontend/UI Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- shadcn/ui
- Lucide React
- next-intl
- next/image

### Styling System Recommendation

Use:

- Tailwind utility classes
- CSS variables for design tokens
- theme tokens for brand colors
- reusable UI primitives for cards, forms, tables, badges, and sections

Suggested design tokens:

- `--color-primary`
- `--color-secondary`
- `--color-accent`
- `--color-success`
- `--color-muted`
- `--radius-card`
- `--shadow-soft`

---

## 12. Backend Technology Decisions

### Recommended Backend Stack Inside Next.js

- Next.js Route Handlers
- Next.js Server Actions
- Prisma ORM
- PostgreSQL
- Auth.js
- Zod
- object storage for uploads

### Server Strategy

Use:

- Server Actions for dashboard form submissions and CRUD
- Route Handlers for file upload endpoints or structured APIs where needed
- server-only utilities for database and secret-dependent logic

---

## 13. SEO and Performance Requirements

### SEO

- localized URLs for EN/AR
- metadata per page
- metadata per product
- sitemap generation
- Open Graph tags
- semantic headings
- optimized internal linking

### Performance

- image optimization using `next/image` fileciteturn1file0L162-L167
- ISR/revalidation for public content
- minimal client-side JavaScript
- client components only where needed
- dashboard tables paginated where appropriate

---

## 14. Final Recommended Stack

### Final Stack Selection

- **Framework:** Next.js 16.2.2
- **UI:** React 19
- **Language:** TypeScript strict mode
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Auth.js
- **Validation:** Zod
- **i18n:** next-intl
- **Tables:** TanStack Table
- **Rich Text Editor:** Tiptap
- **Storage:** S3-compatible object storage
- **Icons:** Lucide React
- **Deployment:** Vercel or equivalent Node-compatible host

---

## 15. Why This Stack Is the Best Fit

This stack is recommended because it:

- matches the existing AGENTS technical baseline instead of fighting it fileciteturn1file0L1-L175
- keeps frontend and backend in one maintainable codebase
- is ideal for a website + CMS platform
- supports multilingual content cleanly
- handles dashboard CRUD efficiently
- allows scalable product and page management
- supports a polished corporate UI that can mirror the Damira company profile
- avoids unnecessary complexity such as separate frontend/backend services

---

## 16. Deliverable Update

This PRD now includes:

- product and CMS requirements
- admin dashboard requirements
- recommended project architecture
- recommended technologies to add
- database selection
- logical database model
- style direction based on company profile
- final recommended stack for implementation
