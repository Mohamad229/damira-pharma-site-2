# Damira Pharma Website - Complete Codebase Analysis

**Project**: Next.js 16 + React 19 Pharmaceutical CMS with Multi-language Support (EN/AR)  
**Total Files Analyzed**: 173 TypeScript/TSX files  
**Analysis Date**: April 2026

---

## TABLE OF CONTENTS

1. [PROJECT OVERVIEW](#project-overview)
2. [ARCHITECTURE SUMMARY](#architecture-summary)
3. [BUSINESS LOGIC - SERVER ACTIONS](#business-logic---server-actions)
4. [VALIDATION SCHEMAS](#validation-schemas)
5. [SHARED UTILITIES](#shared-utilities)
6. [ADMIN SYSTEM COMPONENTS & PAGES](#admin-system-components--pages)
7. [PUBLIC WEBSITE COMPONENTS & PAGES](#public-website-components--pages)
8. [BASE UI COMPONENTS](#base-ui-components)
9. [CONFIGURATION & I18N](#configuration--i18n)
10. [API ROUTES](#api-routes)
11. [DATABASE & PRISMA](#database--prisma)
12. [FILE INVENTORY BY CATEGORY](#file-inventory-by-category)

---

## PROJECT OVERVIEW

**Type**: Pharmaceutical CMS website with admin dashboard  
**Stack**: Next.js 16.2.2, React 19.2.4, TypeScript, Prisma 5, Zod validation  
**Features**:

- Bilingual content (English/Arabic with RTL support)
- Admin dashboard for content, users, media, and forms management
- Public website with product catalog, pages, and forms
- NextAuth for authentication
- Tiptap rich text editor
- Server-side rendering with streaming
- Dynamic page builder with customizable sections

---

## ARCHITECTURE SUMMARY

### Layer Structure

```
┌─────────────────────────────────────────────────┐
│         PRESENTATION LAYER (Components)         │
│  Admin UI │ Public UI │ Base UI │ Providers    │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│        ROUTING LAYER (App Router)               │
│  /admin/* │ /[locale]/* │ /api/*              │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│    BUSINESS LOGIC LAYER (Server Actions)       │
│  actions/ - CRUD operations, validations      │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│    PERSISTENCE LAYER (Database)                 │
│  Prisma Client → PostgreSQL via PrismaPg      │
└─────────────────────────────────────────────────┘

Cross-cutting Concerns:
├─ Authentication (NextAuth + JWT)
├─ Internationalization (next-intl)
├─ Validation (Zod schemas)
├─ Storage (Local file + S3 support)
└─ Rich Text (Tiptap editor)
```

### Key Design Patterns

1. **Server Components by Default** - React 19 Server Components for data fetching
2. **Client Components Where Needed** - Marked with `'use client'` for interactivity
3. **Server Actions** - `'use server'` for mutations and form submissions
4. **Action State Pattern** - Standardized `ActionState<T>` return types
5. **Zod Validation** - All inputs validated before database operations
6. **Role-Based Access Control** - `ADMIN` and `INTERNAL_USER` roles

---

## BUSINESS LOGIC - SERVER ACTIONS

### Summary

All server-side business logic is implemented as server actions in `/lib/actions/`. Each action:

- Uses `'use server'` directive
- Validates input with Zod schemas
- Checks authentication/authorization
- Returns consistent `ActionState<T>` types
- Handles errors gracefully

### 1. Authentication Actions

**FILE**: `lib/actions/auth.ts`  
**PURPOSE**: Handle user login and logout  
**EXPORTS**:

- `login(prevState, formData)` - Validates credentials, signs in user
- `logout()` - Signs out current user

**IMPORTS**: NextAuth, Zod  
**LINKED_TO**: `lib/auth.ts`, authentication pages  
**CATEGORY**: SHARED

---

### 2. User Management Actions

**FILE**: `lib/actions/users.ts`  
**PURPOSE**: Manage admin users (CRUD operations with role-based access)  
**EXPORTS**:

- `getUsers(page, limit)` - Paginated user list (ADMIN only)
- `getUserById(id)` - Fetch single user (ADMIN only)
- `createUser(data)` - Create new user (ADMIN only)
- `updateUser(id, data)` - Update user details (ADMIN only)
- `deleteUser(id)` - Delete user (ADMIN only)
- `updateCurrentUser(data)` - Update own profile

**IMPORTS**: Zod, bcrypt, Prisma, auth-utils  
**LINKED_TO**: User pages, settings management  
**CATEGORY**: ADMIN

**Key Features**:

- Password hashing with bcrypt (12 salt rounds)
- Passwords excluded from responses
- Pagination support
- Role validation for ADMIN operations

---

### 3. Product Management Actions

**FILE**: `lib/actions/products.ts`  
**PURPOSE**: Complete product CRUD with filtering, search, and bulk operations  
**EXPORTS**:

- `getProducts(options)` - Filtered/searchable product list with pagination
- `getProductById(id)` - Full product detail with translations and attachments
- `createProduct(data)` - Create simple or advanced product
- `updateProduct(id, data)` - Update product details
- `deleteProduct(id)` - Delete product with usage check
- `publishProduct(id)` - Make product public
- `unpublishProduct(id)` - Make product private

**IMPORTS**: Prisma, Zod, Tailwind utilities  
**LINKED_TO**: Product pages, product form components  
**CATEGORY**: ADMIN

**Key Features**:

- Auto-generates URL slugs
- Prevents duplicate slugs
- Tracks product usage (forms, pages)
- Supports bilingual translations
- Handles media attachments
- Filters by type (SIMPLE/ADVANCED), status (AVAILABLE/PIPELINE), category

---

### 4. Page Management Actions

**FILE**: `lib/actions/pages.ts`  
**PURPOSE**: Manage dynamic pages with sections and translations  
**EXPORTS**:

- `getPages(page, pageSize)` - Paginated list of pages
- `getPageById(id)` - Page detail with sections and translations
- `createPage(data)` - Create new page
- `updatePage(id, data)` - Update page metadata and publishing
- `deletePage(id)` - Delete page with all sections
- `getPageSections(pageId)` - Get sections of specific page
- `createSection(data)` - Add section to page
- `updateSection(id, data)` - Update section content
- `deleteSection(id)` - Remove section from page
- `reorderSections(pageId, sections)` - Reorder page sections

**IMPORTS**: Prisma, Zod, page-form schemas  
**LINKED_TO**: Page editor components, section editors  
**CATEGORY**: ADMIN

**Key Features**:

- Slug auto-generation and uniqueness validation
- Section type validation (HERO, TEXT, CARDS, STATS, FEATURES, CTA, IMAGE_TEXT)
- Multi-language translations per section
- Ordered sections within pages
- Bilingual content editing

---

### 5. Form Submission Management

**FILE**: `lib/actions/forms.ts`  
**PURPOSE**: Track and manage form submissions (contact, partnership, inquiries)  
**EXPORTS**:

- `getFormSubmissions(options)` - Search/filter submissions with pagination
- `getFormSubmissionById(id)` - Single submission detail
- `updateSubmissionStatus(id, status)` - Change status (NEW/REVIEWED/ARCHIVED)
- `deleteFormSubmission(id)` - Remove submission
- `getFormSubmissionStats()` - Dashboard statistics
- `exportFormSubmissions(format)` - Export to CSV/JSON

**IMPORTS**: Prisma, Zod, date utilities  
**LINKED_TO**: Forms dashboard, form analytics  
**CATEGORY**: ADMIN

**Key Features**:

- Filters by type (CONTACT, PARTNERSHIP, PRODUCT_INQUIRY)
- Status tracking (NEW/REVIEWED/ARCHIVED)
- Search by name, email, company
- Date range filtering
- Sorting by multiple fields
- Statistics aggregation

---

### 6. Media Management

**FILE**: `lib/actions/media.ts`  
**PURPOSE**: Manage uploaded media files (images, documents)  
**EXPORTS**:

- `getMedia(options)` - Paginated media list with search and type filter
- `getMediaById(id)` - Single media file detail
- `updateMediaName(id, name)` - Rename media file
- `deleteMedia(id)` - Remove media file
- `deleteMultipleMedia(ids)` - Batch delete media
- `getMediaStats()` - Storage usage statistics

**IMPORTS**: Prisma, Zod, storage module  
**LINKED_TO**: Media library, media picker, upload dialog  
**CATEGORY**: ADMIN

**Key Features**:

- Search by filename
- Filter by type (image/document)
- Tracks uploader information
- Stores dimensions for images
- File size and MIME type data

---

### 7. Settings Management

**FILE**: `lib/actions/settings.ts`  
**PURPOSE**: Manage global site settings and lookups (categories, manufacturers, therapeutic areas)  
**EXPORTS**:

- **Categories**:
  - `getCategories()` - List all categories
  - `createCategory(data)` - Create category
  - `updateCategory(id, data)` - Update category
  - `deleteCategory(id)` - Delete category
- **Therapeutic Areas**:
  - `getTherapeuticAreas()` - List therapeutic areas
  - `createTherapeuticArea(data)` - Create area
  - `updateTherapeuticArea(id, data)` - Update area
  - `deleteTherapeuticArea(id)` - Delete area
- **Manufacturers**:
  - `getManufacturers()` - List manufacturers
  - `createManufacturer(data)` - Create manufacturer
  - `updateManufacturer(id, data)` - Update manufacturer
  - `deleteManufacturer(id)` - Delete manufacturer
- **Site Settings**:
  - `getSiteSetting(key)` - Get setting value
  - `updateSiteSetting(key, value)` - Update site setting

**IMPORTS**: Prisma, Zod, auth-utils  
**LINKED_TO**: Settings page, product forms, select components  
**CATEGORY**: ADMIN

---

### 8. Public Form Submissions

**FILE**: `lib/actions/public-forms.ts`  
**PURPOSE**: Handle public form submissions from website visitors  
**EXPORTS**:

- `submitPublicForm(prevState, formData)` - Validate and save form submission

**IMPORTS**: Zod, Prisma, form types  
**LINKED_TO**: Public inquiry form, contact/partnership pages  
**CATEGORY**: PUBLIC

**Key Features**:

- Form type discrimination (CONTACT, PARTNERSHIP, PRODUCT_INQUIRY)
- Honeypot spam protection
- Localized success/error messages (EN/AR)
- Type-specific inquiry fields
- All submissions stored in database

---

### 9. Public Product Catalog

**FILE**: `lib/actions/public-products.ts`  
**PURPOSE**: Query published products for public catalog display  
**EXPORTS**:

- `getPublicProducts(locale, query)` - Get published products with filters
- `getPublicProductBySlug(locale, slug)` - Get single product detail
- `getPublishedProductSlugs()` - Get all published product slugs for sitemap
- `getRelatedProducts(locale, productId, limit)` - Get similar products

**IMPORTS**: Prisma, locale types  
**LINKED_TO**: Products page, product detail page  
**CATEGORY**: PUBLIC

---

## VALIDATION SCHEMAS

### Summary

All input validation is centralized in `/lib/schemas/`. Zod schemas provide:

- Type-safe validation at runtime
- Automatic TypeScript type inference
- Clear error messages
- Consistent API across actions

### 1. Page Form Schema

**FILE**: `lib/schemas/page-form.ts`  
**PURPOSE**: Validate page and section creation/editing  
**EXPORTS**:

- `PageCreateSchema` - Validate new page creation
- `PageUpdateSchema` - Validate page updates
- `SectionCreateSchema` - Validate section creation
- `SectionUpdateSchema` - Validate section updates
- `SectionReorderSchema` - Validate section reordering
- `generateSlug(title)` - Auto-generate URL-safe slugs
- Constants: `SECTION_TYPE_OPTIONS` - Available section types

**SCHEMA DETAILS**:

```typescript
Page Fields:
├─ title (1-255 chars, required)
├─ slug (lowercase, hyphens, auto-generated)
├─ metaTitle (0-60 chars for SEO)
├─ metaDescription (0-160 chars for SEO)
├─ isPublished (boolean)
└─ translations (EN/AR metadata)

Section Types:
├─ HERO - Hero banner with CTA
├─ TEXT - Rich text content
├─ CARDS - Card grid layout
├─ STATS - Statistics display
├─ FEATURES - Features list
├─ CTA - Call-to-action section
└─ IMAGE_TEXT - Image + text layout
```

**LINKED_TO**: Page actions, page editor components  
**CATEGORY**: SHARED

---

### 2. Product Form Schema

**FILE**: `lib/schemas/product-form.ts`  
**PURPOSE**: Validate product creation/editing with media and translations  
**EXPORTS**:

- `ProductFormSchema` - Base product validation
- `CreateProductFormSchema` - With required fields for creation
- `UpdateProductFormSchema` - Optional fields for updates
- Type exports: `ProductFormInput`, `ProductFormFieldValues`

**SCHEMA DETAILS**:

```typescript
Product Fields:
├─ name (1-200 chars)
├─ shortDescription (0-150 chars)
├─ fullDescription (0-5000 chars)
├─ type (SIMPLE | ADVANCED)
├─ status (AVAILABLE | PIPELINE)
├─ categoryId (required)
├─ therapeuticAreaId (optional)
├─ manufacturerId (required)
├─ coverImageId (optional)
├─ attachmentIds (array)
└─ advancedDetails (conditional on type)
    ├─ storageConditions
    └─ regulatoryInfo
```

**LINKED_TO**: Product actions, product form components  
**CATEGORY**: SHARED

---

## SHARED UTILITIES

### 1. Authentication Utilities

**FILE**: `lib/auth-utils.ts`  
**PURPOSE**: Auth helpers for server components and actions  
**EXPORTS**:

- `getCurrentUser()` - Get current authenticated user or undefined
- `requireAuth()` - Require authentication, redirect to login if not
- `requireRole(allowedRoles)` - Require specific role, redirect if not authorized
- `hasRole(allowedRoles)` - Check if user has role (returns boolean)
- `isAdmin()` - Check if user is admin

**CATEGORY**: SHARED

---

### 2. Authentication Configuration

**FILE**: `lib/auth.ts`  
**PURPOSE**: NextAuth configuration and session setup  
**EXPORTS**:

- `handlers` - GET/POST handlers for auth routes
- `auth()` - Get current session
- `signIn(provider, ...)` - Sign in user
- `signOut(...)` - Sign out user

**CONFIGURATION**:

- Provider: Credentials (email/password)
- Session: JWT-based, 30-day expiration
- Database: Lazy-loads Prisma only during authorization
- Password: bcrypt hashing validation

**CATEGORY**: SHARED

---

### 3. Database Client

**FILE**: `lib/db.ts`  
**PURPOSE**: Singleton Prisma client with PostgreSQL adapter  
**EXPORTS**:

- `prisma` - Configured Prisma client
- `default` - Alias for prisma

**FEATURES**:

- Uses PrismaPg adapter for PostgreSQL
- Singleton pattern for Node.js
- Development logging (warn, error)
- Production logging (error only)

**CATEGORY**: CONFIG

---

### 4. Storage Module

**FILE**: `lib/storage.ts`  
**PURPOSE**: Abstraction layer for file storage (local or S3)  
**EXPORTS**:

- `uploadLocal(file, filename, mimeType, config)` - Upload to local filesystem
- `deleteLocal(key, config)` - Delete local file
- `generateFilename(originalName)` - Create unique filename
- Types: `StorageProvider`, `UploadResult`, `StorageConfig`

**PROVIDERS**:

- Local: `public/uploads` directory
- S3: Configurable S3 or S3-compatible (R2, Wasabi)

**CATEGORY**: SHARED

---

### 5. SEO Utilities

**FILE**: `lib/seo.ts`  
**PURPOSE**: Generate metadata and SEO-optimized content  
**EXPORTS**:

- `getSiteUrl()` - Get absolute site URL from env or fallback
- `getAbsoluteUrl(pathname)` - Convert relative path to absolute
- `getLocalizedPath(locale, pathname)` - Get locale-prefixed path
- `buildLocaleAlternates(pathname)` - Generate hreflang alternates
- `createPublicMetadata(input)` - Build Next.js Metadata object
- `buildOgImageUrl(title, locale)` - Generate OG image URL

**CATEGORY**: SHARED

---

### 6. Font Configuration

**FILE**: `lib/fonts.ts`  
**PURPOSE**: Load and configure fonts for the application  
**EXPORTS**:

- `geistSans` - Geist font for English
- `geistMono` - Geist Mono for code
- `cairo` - Cairo font for Arabic
- `fontVariables` - CSS variable declarations

**CATEGORY**: CONFIG

---

### 7. Utility Functions

**FILE**: `lib/utils.ts`  
**PURPOSE**: Common utility functions  
**EXPORTS**:

- `cn(...inputs)` - Merge classNames with Tailwind merge
- `formatFileSize(bytes)` - Convert bytes to readable format (B, KB, MB, GB, TB)
- `formatDate(date)` - Format date as "Jan 15, 2024"
- `formatDateTime(date)` - Format as "Jan 15, 2024 10:30 AM"
- `copyToClipboard(text)` - Copy to clipboard (browser only)

**CATEGORY**: SHARED

---

### 8. Tiptap Editor Extensions

**FILE**: `lib/tiptap-extensions.ts`  
**PURPOSE**: Configure Tiptap rich text editor with extensions  
**EXPORTS**:

- `getTiptapExtensions()` - Get configured extensions array
- `getTiptapEditorProps()` - Get editor styling props

**EXTENSIONS**:

- StarterKit (core formatting, history, lists)
- Link (auto-linking with protocol handling)
- Image (inline images with resize)
- CodeBlockLowlight (syntax highlighting)
- Placeholder (empty state text)

**CATEGORY**: SHARED

---

### 9. Milestones Tracking

**FILE**: `lib/milestones.ts`  
**PURPOSE**: Track project development milestones  
**EXPORTS**:

- `milestoneTen` - Product Catalog milestone
- `milestoneEleven` - Contact & Forms milestone
- `milestoneTwelve` - SEO & Production milestone

**CATEGORY**: CONFIG

---

### 10. Catalog Query Parser

**FILE**: `lib/catalog/catalog-query.ts`  
**PURPOSE**: Parse and build product catalog URLs with filters  
**EXPORTS**:

- `parseCatalogSearchParams(query)` - Parse URL params into structured filter object
- `buildCatalogUrl(pathname, current, updates)` - Build updated URL with new filters
- `buildCatalogPaginationHref(pathname, searchParams, nextPage)` - Build pagination URL

**CATEGORY**: PUBLIC

---

### 11. Public Pages Queries

**FILE**: `lib/public-pages.ts`  
**PURPOSE**: Query published pages and their content  
**EXPORTS**:

- `getPublishedPageBySlug(slug, locale)` - Get page with all sections and translations
- `getPublishedPageSeoBySlug(slug, locale)` - Get minimal SEO metadata for page

**FEATURES**:

- Locale-aware fallback to default language
- Combines base data with locale-specific translations

**CATEGORY**: PUBLIC

---

### 12. Public Page Fallbacks

**FILE**: `lib/public-page-fallbacks.ts`  
**PURPOSE**: Provide fallback content when pages aren't published  
**EXPORTS**:

- `getFallbackPublicPage(slug, locale)` - Get fallback page with sections
- `getFallbackPublicPageSeo(slug, locale)` - Get fallback SEO metadata

**CONTENT**:

- Default home page with hero, stats, cards, CTA sections
- Default about, services, products pages (EN/AR)

**CATEGORY**: PUBLIC

---

## ADMIN SYSTEM COMPONENTS & PAGES

### Admin Layout & Navigation

#### 1. Main Admin Layout

**FILE**: `app/(admin)/admin/layout.tsx`  
**PURPOSE**: Main wrapper for all admin pages with sidebar and header  
**STRUCTURE**:

```
SidebarProvider
├─ AdminSidebar (collapsible navigation)
├─ AdminHeader (breadcrumbs, user menu)
└─ main (content area)
```

**CATEGORY**: ADMIN

---

#### 2. Admin Sidebar

**FILE**: `components/admin/admin-sidebar.tsx`  
**PURPOSE**: Collapsible sidebar with navigation menu  
**FEATURES**:

- Responsive collapse on desktop/mobile
- Navigation items with icons
- Active route highlighting
- User profile section
- Logout button
- localStorage persistence of collapse state

**NAVIGATION ITEMS**:

- Dashboard
- Products
- Pages
- Media
- Forms
- Settings
- Users

**CATEGORY**: ADMIN

---

#### 3. Admin Header

**FILE**: `components/admin/admin-header.tsx`  
**PURPOSE**: Top navigation bar with user menu and notifications  
**COMPONENTS**:

- Menu toggle for mobile sidebar
- Breadcrumb navigation
- Search component
- Notification bell
- User dropdown with avatar

**CATEGORY**: ADMIN

---

#### 4. Sidebar Provider

**FILE**: `components/admin/sidebar-provider.tsx`  
**PURPOSE**: Context provider for sidebar state management  
**STATE**:

- `isCollapsed` - Desktop collapse state
- `isMobileOpen` - Mobile sidebar visibility
- `toggleCollapse()` - Toggle desktop state
- `toggleMobile()` - Toggle mobile state
- `closeMobile()` - Close mobile sidebar

**FEATURES**:

- localStorage persistence
- Escape key to close on mobile
- Body scroll lock when mobile open

**CATEGORY**: ADMIN

---

### Admin Dashboard

**FILE**: `app/(admin)/admin/page.tsx`  
**PURPOSE**: Main dashboard with quick stats and recent activity  
**SECTIONS**:

- Stats cards (Products, Pages, Media, Forms, Users, Health)
- Quick actions (Create product, Create page, Upload media)
- Recent activity feed

**CATEGORY**: ADMIN

---

### Product Management

#### 1. Products List Page

**FILE**: `app/(admin)/admin/products/page.tsx`  
**PURPOSE**: Display products with filters and bulk actions  
**FEATURES**:

- Pagination
- Search by name
- Filter by type (SIMPLE/ADVANCED)
- Filter by status (AVAILABLE/PIPELINE)
- Filter by category
- Bulk actions (publish, delete)

**CATEGORY**: ADMIN

---

#### 2. Product Form Client

**FILE**: `app/(admin)/admin/products/product-form-client.tsx`  
**PURPOSE**: Client-side product creation/editing form  
**FEATURES**:

- Bilingual input tabs (EN/AR)
- Product classification (type, status)
- Category and manufacturer selection
- Cover image picker
- Attachment management
- Advanced details for ADVANCED products
- Form validation with Zod

**CATEGORY**: ADMIN

---

#### 3. Create Product Page

**FILE**: `app/(admin)/admin/products/new/page.tsx`  
**PURPOSE**: Route for creating new products  
**CATEGORY**: ADMIN

---

#### 4. Edit Product Page

**FILE**: `app/(admin)/admin/products/[id]/edit/page.tsx`  
**PURPOSE**: Route for editing existing products  
**CATEGORY**: ADMIN

---

### Page Management

#### 1. Pages List Page

**FILE**: `app/(admin)/admin/pages/page.tsx`  
**PURPOSE**: Display all pages with management options  
**FEATURES**:

- Pagination
- Sort by creation date
- Publish/unpublish toggle
- Delete pages

**CATEGORY**: ADMIN

---

#### 2. Page Form Client

**FILE**: `app/(admin)/admin/pages/page-form-client.tsx`  
**PURPOSE**: Page metadata and section management form  
**FEATURES**:

- Bilingual title and metadata
- Section ordering and management
- Section type selector
- Section detail editor
- Preview/publish controls

**CATEGORY**: ADMIN

---

#### 3. Create Page Route

**FILE**: `app/(admin)/admin/pages/new/page.tsx`  
**PURPOSE**: New page creation interface  
**CATEGORY**: ADMIN

---

#### 4. Edit Page Route

**FILE**: `app/(admin)/admin/pages/[id]/edit/page.tsx`  
**PURPOSE**: Page editing with full section management  
**CATEGORY**: ADMIN

---

#### 5. Section Editors

Multiple specialized editors for different section types:

**FILE**: `app/(admin)/admin/pages/sections/hero-section-editor.tsx`  
**PURPOSE**: Edit hero banners with title, subtitle, CTA

**FILE**: `app/(admin)/admin/pages/sections/text-section-editor.tsx`  
**PURPOSE**: Edit rich text content with Tiptap editor

**FILE**: `app/(admin)/admin/pages/sections/image-text-section-editor.tsx`  
**PURPOSE**: Edit sections with image + text layout

**FILE**: `app/(admin)/admin/pages/sections/stats-section-editor.tsx`  
**PURPOSE**: Manage statistics cards and displays

**FILE**: `app/(admin)/admin/pages/sections/features-section-editor.tsx`  
**PURPOSE**: Edit feature lists and grids

**FILE**: `app/(admin)/admin/pages/sections/cards-section-editor.tsx`  
**PURPOSE**: Manage card grids with customizable layouts

**FILE**: `app/(admin)/admin/pages/sections/cta-section-editor.tsx`  
**PURPOSE**: Create call-to-action sections

**CATEGORY**: ADMIN

---

#### 6. Section Management Components

**FILE**: `app/(admin)/admin/pages/[id]/edit/section-list.tsx`  
**PURPOSE**: Display ordered list of page sections with drag reorder

**FILE**: `app/(admin)/admin/pages/[id]/edit/section-editor-modal.tsx`  
**PURPOSE**: Modal for editing section content

**FILE**: `app/(admin)/admin/pages/[id]/edit/section-type-selector.tsx`  
**PURPOSE**: Dropdown to select new section type

**CATEGORY**: ADMIN

---

### Media Management

#### 1. Media Library Page

**FILE**: `app/(admin)/admin/media/page.tsx`  
**PURPOSE**: Main media management interface  
**FEATURES**:

- Grid/list view toggle
- Search and type filtering
- Upload dialog
- Batch operations
- File preview

**CATEGORY**: ADMIN

---

#### 2. Media Library Client

**FILE**: `app/(admin)/admin/media/media-library-client.tsx`  
**PURPOSE**: Client-side media management with state  
**FEATURES**:

- View mode switching
- Pagination and lazy loading
- Drag-drop upload
- Selection tools
- Delete confirmation

**CATEGORY**: ADMIN

---

### Form Management

#### 1. Forms Dashboard

**FILE**: `app/(admin)/admin/forms/page.tsx`  
**PURPOSE**: Display form submissions with filtering  
**FEATURES**:

- Filter by submission type
- Filter by status (NEW/REVIEWED/ARCHIVED)
- Search by contact name/email
- Pagination
- Export options

**CATEGORY**: ADMIN

---

#### 2. Form Detail Page

**FILE**: `app/(admin)/admin/forms/[id]/page.tsx`  
**PURPOSE**: View single form submission details  
**FEATURES**:

- Full submission content
- Status management
- Reply/follow-up notes
- Attachment downloads

**CATEGORY**: ADMIN

---

### User Management

#### 1. Users List

**FILE**: `app/(admin)/admin/users/page.tsx`  
**PURPOSE**: Display all admin users  
**FEATURES**:

- Pagination
- Search by email/name
- Role badge display

**CATEGORY**: ADMIN

---

#### 2. User Form Client

**FILE**: `app/(admin)/admin/users/user-form-client.tsx`  
**PURPOSE**: Create/edit user form with role assignment  
**FEATURES**:

- Email, name, password fields
- Role selection (ADMIN/INTERNAL_USER)
- Password update (optional for existing users)

**CATEGORY**: ADMIN

---

#### 3. User Profile Page

**FILE**: `app/(admin)/admin/users/profile/page.tsx`  
**PURPOSE**: Current user profile editing  
**FEATURES**:

- Update own password
- Update own profile

**CATEGORY**: ADMIN

---

### Settings Page

**FILE**: `app/(admin)/admin/settings/page.tsx`  
**PURPOSE**: Global site settings management  
**SECTIONS**:

- Site metadata (name, tagline, contact info)
- SEO defaults
- Category management
- Manufacturer management
- Therapeutic area management

**CATEGORY**: ADMIN

---

### Editor Components

#### 1. Tiptap Editor

**FILE**: `components/admin/tiptap-editor.tsx`  
**PURPOSE**: Rich text editor for content editing  
**FEATURES**:

- Toolbar with formatting options
- Link and image insertion dialogs
- Code block with syntax highlighting
- Bilingual support (EN/AR with RTL)
- Placeholder text

**CATEGORY**: SHARED

---

#### 2. Tiptap Toolbar

**FILE**: `components/admin/tiptap-toolbar.tsx`  
**PURPOSE**: Editor toolbar buttons and controls  
**BUTTONS**:

- Text formatting (bold, italic, underline, strikethrough)
- Lists (ordered, unordered)
- Code block
- Blockquote
- Links
- Images
- Undo/Redo

**CATEGORY**: ADMIN

---

#### 3. Tiptap Link Modal

**FILE**: `components/admin/tiptap-link-modal.tsx`  
**PURPOSE**: Dialog for inserting/editing links

**CATEGORY**: ADMIN

---

#### 4. Tiptap Image Modal

**FILE**: `components/admin/tiptap-image-modal.tsx`  
**PURPOSE**: Dialog for inserting/editing images

**CATEGORY**: ADMIN

---

### Input Components

#### 1. Language Tabs

**FILE**: `components/admin/language-tabs.tsx`  
**PURPOSE**: Bilingual content switcher (EN/AR tabs)  
**FEATURES**:

- Active tab highlighting
- Unsaved changes indicators
- Reusable for any bilingual form

**CATEGORY**: ADMIN

---

#### 2. Media Picker

**FILE**: `components/admin/media-picker.tsx`  
**PURPOSE**: Modal for selecting media from library  
**FEATURES**:

- Search and filter
- Single/multiple selection
- Type filtering (image/document)
- Pagination

**CATEGORY**: ADMIN

---

#### 3. Media Field

**FILE**: `components/admin/media-field.tsx`  
**PURPOSE**: Wrapper for single media selection in forms  
**FEATURES**:

- Preview display
- Clear/replace buttons
- Aspect ratio display

**CATEGORY**: ADMIN

---

#### 4. Dynamic Array Field

**FILE**: `components/admin/dynamic-array-field.tsx`  
**PURPOSE**: Manage dynamic arrays of items (stats, cards, features)  
**FEATURES**:

- Add/remove items
- Edit items
- Max items limit
- Custom render function

**CATEGORY**: ADMIN

---

### Media Components

#### 1. Media Library Component

**FILE**: `components/admin/media/media-library.tsx`  
**PURPOSE**: Standalone media management library

**CATEGORY**: ADMIN

---

#### 2. Media Card

**FILE**: `components/admin/media/media-card.tsx`  
**PURPOSE**: Individual media file card in grid/list  
**FEATURES**:

- Thumbnail preview
- Selection checkbox
- File info badge
- Action buttons (view, edit, delete)

**CATEGORY**: ADMIN

---

#### 3. Upload Dialog

**FILE**: `components/admin/media/upload-dialog.tsx`  
**PURPOSE**: Modal for uploading new files  
**FEATURES**:

- Drag-drop upload area
- File selection dialog
- Progress tracking
- Multiple file upload
- Error handling

**CATEGORY**: ADMIN

---

### Utility Components

#### 1. Breadcrumbs

**FILE**: `components/admin/breadcrumbs.tsx`  
**PURPOSE**: Admin navigation breadcrumb trail  
**FEATURES**:

- Auto-generates from pathname
- Custom items support
- Active markers

**CATEGORY**: ADMIN

---

#### 2. Page Header

**FILE**: `components/admin/page-header.tsx`  
**PURPOSE**: Standardized page title and description  
**PROPS**:

- title
- description
- actions (buttons)

**CATEGORY**: ADMIN

---

#### 3. Stats Card

**FILE**: `components/admin/stats-card.tsx`  
**PURPOSE**: Dashboard stat card component  
**FEATURES**:

- Icon, label, value
- Color accents
- Loading state

**CATEGORY**: ADMIN

---

#### 4. Quick Actions

**FILE**: `components/admin/quick-actions.tsx`  
**PURPOSE**: Dashboard quick navigation buttons  
**CATEGORY**: ADMIN

---

#### 5. Recent Activity

**FILE**: `components/admin/recent-activity.tsx`  
**PURPOSE**: Dashboard activity feed  
**CATEGORY**: ADMIN

---

#### 6. Skeletons

**FILE**: `components/admin/skeletons.tsx`  
**PURPOSE**: Loading skeleton placeholders  
**CATEGORY**: ADMIN

---

#### 7. Section Card

**FILE**: `components/admin/section-card.tsx`  
**PURPOSE**: Card component for page sections  
**CATEGORY**: ADMIN

---

#### 8. Navigation Item

**FILE**: `components/admin/nav-item.tsx`  
**PURPOSE**: Reusable sidebar navigation item  
**CATEGORY**: ADMIN

---

## PUBLIC WEBSITE COMPONENTS & PAGES

### Public Layout

**FILE**: `app/(public)/[locale]/layout.tsx`  
**PURPOSE**: Main layout for all public pages  
**FEATURES**:

- Locale-based routing
- SiteHeader and SiteFooter
- Organization schema markup
- NextIntl provider for translations
- RTL support based on locale

**CATEGORY**: PUBLIC

---

### Public Pages

#### 1. Homepage

**FILE**: `app/(public)/[locale]/page.tsx`  
**PURPOSE**: Homepage with dynamic sections from database  
**FEATURES**:

- Dynamic section rendering
- Metadata generation
- Fallback content

**CATEGORY**: PUBLIC

---

#### 2. Products Catalog

**FILE**: `app/(public)/[locale]/products/page.tsx`  
**PURPOSE**: Product listing with filters and search  
**FEATURES**:

- Grid/list view toggle
- Category filter
- Therapeutic area filter
- Status filter (AVAILABLE/PIPELINE)
- Search
- Pagination
- Sort options

**CATEGORY**: PUBLIC

---

#### 3. Product Detail

**FILE**: `app/(public)/[locale]/products/[slug]/page.tsx`  
**PURPOSE**: Individual product page  
**FEATURES**:

- Full product information
- Attachments section
- Related products
- SEO metadata

**CATEGORY**: PUBLIC

---

#### 4. Contact Page

**FILE**: `app/(public)/[locale]/contact/page.tsx`  
**PURPOSE**: Contact form and company information  
**FEATURES**:

- Contact information display
- Contact form with validation
- Business hours
- Office location

**CATEGORY**: PUBLIC

---

#### 5. Services Page

**FILE**: `app/(public)/[locale]/services/page.tsx`  
**PURPOSE**: Services overview page

**CATEGORY**: PUBLIC

---

#### 6. About Page

**FILE**: `app/(public)/[locale]/about/page.tsx`  
**PURPOSE**: Company information and mission

**CATEGORY**: PUBLIC

---

#### 7. Partnerships Page

**FILE**: `app/(public)/[locale]/partnerships/page.tsx`  
**PURPOSE**: Partnership opportunities page  
**FEATURES**:

- Partnership form
- Inquiry type selector

**CATEGORY**: PUBLIC

---

#### 8. Compliance Page

**FILE**: `app/(public)/[locale]/compliance/page.tsx`  
**PURPOSE**: Regulatory compliance information

**CATEGORY**: PUBLIC

---

#### 9. Loading States

**FILE**: `app/(public)/[locale]/loading.tsx`  
**PURPOSE**: General page loading skeleton

**FILE**: `app/(public)/[locale]/products/loading.tsx`  
**FILE**: `app/(public)/[locale]/products/[slug]/loading.tsx`  
**FILE**: `app/(public)/[locale]/contact/loading.tsx`  
**PURPOSE**: Route-specific loading skeletons

**CATEGORY**: PUBLIC

---

#### 10. Error Handling

**FILE**: `app/(public)/[locale]/error.tsx`  
**PURPOSE**: Error boundary for public pages

**FILE**: `app/(public)/[locale]/not-found.tsx`  
**PURPOSE**: 404 page

**CATEGORY**: PUBLIC

---

### Public Components

#### 1. Site Header

**FILE**: `components/public/site-header.tsx`  
**PURPOSE**: Navigation bar for public site  
**FEATURES**:

- Logo/branding
- Navigation menu
- Language switcher
- Responsive mobile menu

**CATEGORY**: PUBLIC

---

#### 2. Site Footer

**FILE**: `components/public/site-footer.tsx`  
**PURPOSE**: Footer with links and copyright  
**FEATURES**:

- Quick links
- Copyright notice
- Bilingual support

**CATEGORY**: PUBLIC

---

#### 3. Language Switcher

**FILE**: `components/public/language-switcher.tsx`  
**PURPOSE**: Toggle between EN/AR with persist  
**FEATURES**:

- Language toggle buttons
- Current locale highlighting
- Path preservation on switch

**CATEGORY**: PUBLIC

---

#### 4. Section Renderer

**FILE**: `components/public/section-renderer.tsx`  
**PURPOSE**: Render dynamic page sections  
**SUPPORTED TYPES**:

- HERO - Banner sections
- TEXT - Rich text content
- CARDS - Card grids
- STATS - Statistics display
- FEATURES - Feature lists
- CTA - Call-to-action
- IMAGE_TEXT - Image + text layouts

**FEATURES**:

- Scroll reveal animations
- Responsive layouts
- Mobile optimization
- Image optimization with Next.js Image

**CATEGORY**: PUBLIC

---

#### 5. Page Content

**FILE**: `components/public/page-content.tsx`  
**PURPOSE**: Wrapper for page content with layout  
**FEATURES**:

- Fetch page data
- Render sections
- Handle 404s

**CATEGORY**: PUBLIC

---

#### 6. Page Loading Skeleton

**FILE**: `components/public/loading/public-page-skeleton.tsx`  
**PURPOSE**: Skeleton loader for content pages

**CATEGORY**: PUBLIC

---

#### 7. Scroll Reveal

**FILE**: `components/public/scroll-reveal.tsx`  
**PURPOSE**: Intersection observer animation on scroll  
**FEATURES**:

- Fade-in animations
- Configurable delay
- Smooth entrances

**CATEGORY**: PUBLIC

---

#### 8. Product Card

**FILE**: `components/public/products/product-card.tsx`  
**PURPOSE**: Individual product card in catalog  
**FEATURES**:

- Product image
- Name and category
- Status badge
- Hover effects
- Link to detail page

**CATEGORY**: PUBLIC

---

#### 9. Catalog Controls

**FILE**: `components/public/products/catalog-controls.tsx`  
**PURPOSE**: Filter sidebar for product catalog  
**FILTERS**:

- Search by name
- Category selection
- Therapeutic area selection
- Status filter
- Sort options

**CATEGORY**: PUBLIC

---

#### 10. Product Pagination

**FILE**: `components/public/products/product-pagination.tsx`  
**PURPOSE**: Pagination controls for product listing  
**FEATURES**:

- Previous/next buttons
- Page number display
- State preservation

**CATEGORY**: PUBLIC

---

#### 11. Public Inquiry Form

**FILE**: `components/public/forms/public-inquiry-form.tsx`  
**PURPOSE**: Generic form for contact/partnership/product inquiry  
**FEATURES**:

- Form type discrimination
- Bilingual support
- Honeypot spam protection
- Loading state
- Validation feedback
- Success/error messages

**CATEGORY**: PUBLIC

---

## BASE UI COMPONENTS

All base UI components are in `/components/ui/` and follow shadcn-style patterns.

### 1. Button

**FILE**: `components/ui/button.tsx`  
**VARIANTS**:

- default - Primary action
- outline - Secondary action
- secondary - Alternative action
- ghost - Minimal style
- destructive - Danger action
- link - Text link

**SIZES**:

- xs, sm, default, lg
- icon variants (icon, icon-xs, icon-sm, icon-lg)

**CATEGORY**: SHARED

---

### 2. Card

**FILE**: `components/ui/card.tsx`  
**EXPORTS**:

- Card - Main container
- CardHeader - Header section
- CardTitle - Title element
- CardDescription - Subtitle
- CardContent - Content area
- CardFooter - Footer section

**VARIANTS**:

- default - Standard border
- bordered - Bold border
- elevated - Shadow elevation

**CATEGORY**: SHARED

---

### 3. Input

**FILE**: `components/ui/input.tsx`  
**FEATURES**:

- Error state styling
- Icon support (prefix/suffix)
- Placeholder text
- Auto-resize option

**CATEGORY**: SHARED

---

### 4. Label

**FILE**: `components/ui/label.tsx`  
**FEATURES**:

- Required indicator (\*)
- Disabled state
- Font sizing

**CATEGORY**: SHARED

---

### 5. Textarea

**FILE**: `components/ui/textarea.tsx`  
**FEATURES**:

- Auto-resize option
- Character counter
- Error state
- Max length validation

**CATEGORY**: SHARED

---

### 6. Select

**FILE**: `components/ui/select.tsx`  
**FEATURES**:

- Placeholder option
- Error state
- Chevron icon
- Native select element

**CATEGORY**: SHARED

---

### 7. Badge

**FILE**: `components/ui/badge.tsx`  
**VARIANTS**:

- default, success, warning, error, info, destructive, outline

**CATEGORY**: SHARED

---

### 8. Dialog

**FILE**: `components/ui/dialog.tsx`  
**EXPORTS**:

- Dialog - Provider
- DialogTrigger - Trigger button
- DialogContent - Modal container
- DialogHeader - Title area
- DialogTitle - Title text
- DialogDescription - Description
- DialogFooter - Action buttons
- DialogClose - Close button

**FEATURES**:

- Controlled/uncontrolled modes
- Overlay
- Keyboard handling (ESC to close)

**CATEGORY**: SHARED

---

### 9. Toast

**FILE**: `components/ui/toast.tsx`  
**EXPORTS**:

- ToastProvider - Provider component
- useToast - Hook to trigger toasts
- ToastItem - Individual toast component

**FEATURES**:

- Success, error, warning, default variants
- Auto-dismiss with timeout
- Custom duration
- Manual dismissal

**CATEGORY**: SHARED

---

### 10. Toaster

**FILE**: `components/ui/toaster.tsx`  
**PURPOSE**: Render toast notifications  
**POSITIONS**:

- top-right, top-left, bottom-right, bottom-left
- top-center, bottom-center

**CATEGORY**: SHARED

---

## CONFIGURATION & I18N

### 1. Internationalization Config

**FILE**: `i18n/config.ts`  
**EXPORTS**:

- `locales` - ['en', 'ar']
- `defaultLocale` - 'en'
- `localeNames` - Display names for each locale
- `localeDirection` - LTR/RTL for each locale

**CATEGORY**: CONFIG

---

### 2. I18n Request

**FILE**: `i18n/request.ts`  
**PURPOSE**: Server-side i18n configuration  
**FEATURES**:

- Loads locale-specific messages
- Validates locale
- Falls back to default locale

**CATEGORY**: CONFIG

---

### 3. I18n Routing

**FILE**: `i18n/routing.ts`  
**PURPOSE**: Define routing configuration for next-intl  
**CONFIG**:

- Locales: en, ar
- Default locale: en
- Locale prefix: as-needed (en is default, ar is prefixed)

**CATEGORY**: CONFIG

---

### 4. I18n Navigation

**FILE**: `i18n/navigation.ts`  
**PURPOSE**: Localized navigation helpers  
**EXPORTS**:

- `Link` - Next.js Link with locale support
- `redirect` - Navigate with locale support
- `usePathname` - Get current pathname without locale
- `useRouter` - Localized router
- `getPathname` - Get path for specific locale

**CATEGORY**: CONFIG

---

### 5. Middleware

**FILE**: `middleware.ts`  
**PURPOSE**: Handle admin auth and i18n routing  
**LOGIC**:

1. Admin routes → Check authentication → Redirect to login if needed
2. Public routes → Apply next-intl middleware
3. Login page → Allow unless authenticated (redirect to /admin)

**CATEGORY**: CONFIG

---

### 6. Next.js Config

**FILE**: `next.config.ts`  
**CONFIG**:

- Image optimization (formats, sizes, remote patterns)
- NextIntl plugin
- Internationalization setup

**CATEGORY**: CONFIG

---

### 7. Prisma Config

**FILE**: `prisma.config.ts`  
**PURPOSE**: Prisma configuration

**CATEGORY**: CONFIG

---

### 8. Types

**FILE**: `types/index.ts`  
**EXPORTS**:

- `BaseEntity` - Common entity interface
  - id: string
  - createdAt: Date
  - updatedAt: Date

**CATEGORY**: CONFIG

---

## API ROUTES

### 1. NextAuth Routes

**FILE**: `app/api/auth/[...nextauth]/route.ts`  
**PURPOSE**: Authentication endpoints  
**EXPORTS**:

- `GET` - Session/provider info
- `POST` - Login/logout

**CATEGORY**: SHARED

---

### 2. Media Upload (Public)

**FILE**: `app/api/media/upload/route.ts`  
**PURPOSE**: File upload endpoint (public access)  
**METHOD**: POST  
**VALIDATION**:

- File type (images, documents, videos)
- File size limits (10MB images, 25MB documents, 50MB videos)
- MIME type checking

**FEATURES**:

- Stores in configured storage (local/S3)
- Persists metadata in database
- Returns upload result with URL

**CATEGORY**: PUBLIC

---

### 3. Admin Media Upload

**FILE**: `app/api/admin/media/upload/route.ts`  
**PURPOSE**: File upload endpoint (admin only)  
**AUTH**: Requires admin session  
**ADVANCED FEATURES**:

- Image dimension extraction via Sharp
- Multiple MIME type validation
- Advanced file validation
- Database integration

**CATEGORY**: ADMIN

---

## DATABASE & PRISMA

### Prisma Schema

**FILE**: `prisma/schema.prisma`  
**PURPOSE**: Database schema definition  
**MODELS** (Generated in `generated/prisma/models/`):

- User - Admin users
- Category - Product categories
- TherapeuticArea - Medical areas
- Manufacturer - Product manufacturers
- Product - Products (main)
- ProductTranslation - Translations for products
- ProductAdvancedDetails - Advanced product metadata
- ProductAttachment - Product files/attachments
- Page - Website pages
- PageTranslation - Page translations
- PageSection - Page content sections
- PageSectionTranslation - Section translations
- FormSubmission - Form submission records
- Media - Uploaded media files
- SiteSetting - Global settings

### Generated Files

**LOCATION**: `generated/prisma/`

**FILES**:

- `client.ts` - Prisma client main
- `browser.ts` - Browser client stub
- `commonInputTypes.ts` - Shared input types
- `enums.ts` - Prisma enums
- `models.ts` - Model type definitions
- `models/*.ts` - Individual model types
- `internal/` - Internal Prisma classes

**CATEGORY**: CONFIG

---

## Seed Script

**FILE**: `prisma/seed.ts`  
**PURPOSE**: Populate database with initial data  
**CATEGORY**: CONFIG

---

## ROOT APP FILES

### 1. Root Layout

**FILE**: `app/layout.tsx`  
**PURPOSE**: Global HTML structure  
**PROVIDERS**:

- AuthProvider (NextAuth SessionProvider)
- ToastProvider (Toast notifications)
- Toaster (Toast renderer)

**GLOBALS**:

- Fonts (Geist, Cairo)
- Metadata
- Global CSS

**CATEGORY**: CONFIG

---

### 2. Home Page

**FILE**: `app/page.tsx`  
**PURPOSE**: Root domain redirect/placeholder  
**CURRENT**: Placeholder page (should redirect to [locale])

**CATEGORY**: CONFIG

---

### 3. Robots

**FILE**: `app/robots.ts`  
**PURPOSE**: SEO robots.txt generation  
**EXPORTS**:

- `rules` - Crawl rules for bots
- `sitemap` - Link to sitemap

**CATEGORY**: CONFIG

---

### 4. Sitemap

**FILE**: `app/sitemap.ts`  
**PURPOSE**: XML sitemap generation  
**INCLUDES**:

- All public pages
- All published products
- Locale alternates

**CATEGORY**: CONFIG

---

### 5. OG Image Generator

**FILE**: `app/og/route.tsx`  
**PURPOSE**: Dynamic Open Graph image generation  
**PARAMS**:

- title - Page title
- locale - Language (en/ar)

**FEATURES**:

- Gradient background
- Localized layout (RTL for Arabic)
- Consistent branding

**CATEGORY**: CONFIG

---

### 6. Global CSS

**FILE**: `app/globals.css`  
**INCLUDES**:

- Tailwind CSS
- CSS variables for theming
- Dark mode support

**CATEGORY**: CONFIG

---

## COMPONENT INDEX

### Admin Components Index

**FILE**: `components/admin/index.ts`  
**EXPORTS**:

- SidebarProvider, useSidebar
- AdminSidebar
- AdminHeader
- PageHeader
- StatsCard
- RecentActivity
- QuickActions
- MediaPicker
- LanguageTabs
- TiptapEditor
- DynamicArrayField
- Breadcrumbs

**CATEGORY**: ADMIN

---

### UI Components Index

**FILE**: `components/ui/index.ts`  
**EXPORTS**: All UI primitives (Button, Card, Input, etc.)

**CATEGORY**: SHARED

---

## PROJECT STATISTICS

### File Breakdown by Category

**ADMIN**: ~55 files

- Admin pages, layouts, components
- Admin-specific business logic
- Section editors

**PUBLIC**: ~35 files

- Public pages and routes
- Public components
- Public-facing forms

**SHARED**: ~25 files

- Utility functions
- Common components (UI, providers)
- Schemas and types

**CONFIG**: ~15 files

- Next.js, Prisma, i18n configuration
- Database and auth setup
- Middleware

**GENERATED**: ~18 files

- Prisma generated types and models
- Automatically generated

**TOTAL**: 173 TypeScript/TSX files

### Key Metrics

- **Server Actions**: 9 main action files
- **Validation Schemas**: 2 main schema files
- **Components**: 60+ reusable components
- **API Routes**: 3 main endpoints
- **Database Models**: 14 Prisma models
- **Supported Languages**: 2 (English, Arabic)
- **Authentication**: JWT-based NextAuth
- **Styling**: Tailwind CSS 4 + class-variance-authority

---

## DEVELOPMENT PATTERNS & BEST PRACTICES

### Pattern 1: Server Actions with Validation

```typescript
"use server";

export async function actionName(data: unknown): Promise<ActionState<T>> {
  try {
    await requireAuth();
    const validated = Schema.parse(data);
    // Business logic
    revalidatePath("/path");
    return { success: true, data: result };
  } catch (error) {
    return { error: "Error message" };
  }
}
```

### Pattern 2: Client Component with Server Actions

```typescript
'use client'

import { useActionState } from 'react';
import { actionName } from '@/lib/actions';

export function Component() {
  const [state, formAction, isPending] = useActionState(actionName, {});

  return (
    <form action={formAction}>
      {/* Form fields */}
    </form>
  );
}
```

### Pattern 3: Bilingual Form Component

- Use LanguageTabs to switch languages
- Maintain separate state for EN/AR content
- Use language prop for RTL support in editors

### Pattern 4: Public Page with Dynamic Content

- Fetch from database or fallback to static content
- Generate metadata dynamically
- Use DynamicSectionRenderer for layout

### Pattern 5: Modal/Dialog Pattern

- Context provider for state
- useContext hook for consumers
- Controlled and uncontrolled modes supported

---

## DEPENDENCY MAP

### Critical Dependencies

- **next**: 16.2.2 (React server components, app router)
- **react**: 19.2.4 (UI framework)
- **next-auth**: 5 (Authentication)
- **@prisma/client**: Database ORM
- **zod**: Schema validation
- **tailwindcss**: 4 (Styling)
- **next-intl**: Internationalization
- **@tiptap/react**: Rich text editor
- **class-variance-authority**: Component variants
- **clsx + tailwind-merge**: Utility classes
- **lucide-react**: Icons

### Optional Dependencies

- **sharp**: Image processing
- **bcryptjs**: Password hashing
- **@prisma/adapter-pg**: PostgreSQL adapter

---

## CONFIGURATION REFERENCES

### Environment Variables

```
DATABASE_URL=          # PostgreSQL connection
NEXTAUTH_SECRET=       # JWT signing secret
NEXTAUTH_URL=          # Auth callback URL
NEXT_PUBLIC_APP_URL=   # Site URL for OG images
STORAGE_PROVIDER=      # 'local' or 's3'
LOCAL_UPLOAD_DIR=      # 'public/uploads'
LOCAL_BASE_URL=        # '/uploads'
S3_BUCKET=            # S3 bucket name
S3_REGION=            # AWS region
S3_ACCESS_KEY=        # AWS access key
S3_SECRET_KEY=        # AWS secret key
```

### Build & Deployment

- **Build**: `npm run build`
- **Dev**: `npm run dev` (localhost:3000)
- **Production**: `npm run start`
- **Linting**: `npm run lint`

---

## CONCLUSION

The Damira Pharma website is a comprehensive, production-ready CMS built on modern technologies. The architecture is clean, scalable, and follows Next.js 16 and React 19 best practices with strong emphasis on:

1. **Type Safety** - Full TypeScript coverage
2. **Validation** - Zod schemas for all inputs
3. **Performance** - Server-side rendering, streaming, optimization
4. **Internationalization** - Complete EN/AR support with RTL
5. **Security** - Authentication, authorization, input validation
6. **Maintainability** - Consistent patterns, clear separation of concerns

The codebase demonstrates enterprise-level engineering with careful attention to user experience (both admin and public), accessibility, and long-term maintainability.
