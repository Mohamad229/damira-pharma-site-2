# Damira Pharma - Admin Section Documentation

**Project**: Pharmaceutical CMS with Admin Dashboard  
**Stack**: Next.js 16 + React 19  
**Purpose**: Complete content management system for admin users (ADMIN, INTERNAL_USER roles)

---

## TABLE OF CONTENTS

1. [Architecture Overview](#architecture-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Admin Layout & Navigation](#admin-layout--navigation)
4. [Business Logic - Server Actions](#business-logic---server-actions)
5. [Admin Pages & Routes](#admin-pages--routes)
6. [Admin Components](#admin-components)
7. [Forms & Editors](#forms--editors)
8. [Database Schema](#database-schema)
9. [File Structure](#file-structure)

---

## ARCHITECTURE OVERVIEW

### Layer Structure

```
┌─────────────────────────────────────────┐
│       ADMIN PAGES (Routes)              │
│   /admin/* (all protected routes)       │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│      ADMIN COMPONENTS                   │
│   Forms, Editors, Tables, Modals        │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│   SERVER ACTIONS (Business Logic)       │
│   /lib/actions/*.ts (CRUD operations)   │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│      DATABASE (Prisma + PostgreSQL)     │
└─────────────────────────────────────────┘

Auth Flow:
middleware.ts → Checks session → Redirects to /admin/login if needed
```

### Key Design Patterns

1. **Server Actions** - All mutations use `'use server'` directive
2. **Client Components** - Admin UI uses `'use client'` for interactivity
3. **Zod Validation** - All inputs validated before database operations
4. **Action State Pattern** - Standardized return types: `{ error?, success?, data? }`
5. **Role-Based Access** - `ADMIN` role required for most operations

---

## AUTHENTICATION & AUTHORIZATION

### Auth Configuration

**File**: [lib/auth.ts](lib/auth.ts)  
**Purpose**: NextAuth configuration with JWT sessions and email/password login  
**Exports**:

- `handlers` - GET/POST auth endpoints
- `auth()` - Get current session
- `signIn()` - Initiate login
- `signOut()` - Logout user

**Features**:

- Email/password authentication via Credentials provider
- JWT sessions (30-day expiration)
- Password hashing with bcrypt
- Lazy-loads Prisma only during auth

### Auth Utilities

**File**: [lib/auth-utils.ts](lib/auth-utils.ts)  
**Purpose**: Helper functions for auth checks in server components/actions  
**Exports**:

- `getCurrentUser()` - Get current user or undefined
- `requireAuth()` - Require auth, throw error if missing
- `requireRole(roles)` - Require specific role
- `hasRole(roles)` - Check role (returns boolean)
- `isAdmin()` - Is user admin?

### Login Flow

```
1. User visits /admin (middleware.ts checks auth)
2. No session → Redirect to /admin/login
3. User submits credentials on login page
4. Action: lib/actions/auth.ts → login()
5. Password validated, JWT token issued
6. Session stored in browser
7. Redirect to /admin on success
```

**Related Files**:

- [middleware.ts](middleware.ts) - Route protection
- [app/(admin)/admin/login/page.tsx](<app/(admin)/admin/login/page.tsx>) - Login form
- [lib/actions/auth.ts](lib/actions/auth.ts) - Login/logout actions

---

## ADMIN LAYOUT & NAVIGATION

### Layout Structure

```
/admin/layout.tsx
├── SidebarProvider (state management)
├── AdminSidebar (collapsible navigation)
├── AdminHeader (breadcrumbs, user menu)
└── main (page content area)
```

### Files

**Layout**: [app/(admin)/admin/layout.tsx](<app/(admin)/admin/layout.tsx>)

- Wraps all admin pages
- Provides sidebar context
- Sets up responsive layout

**Sidebar**: [components/admin/admin-sidebar.tsx](components/admin/admin-sidebar.tsx)

- Navigation menu with icons
- Active route highlighting
- Collapsible on desktop
- User profile section
- Logout button

**Navigation Items**:

- Dashboard → `/admin`
- Products → `/admin/products`
- Pages → `/admin/pages`
- Media → `/admin/media`
- Forms → `/admin/forms`
- Settings → `/admin/settings`
- Users → `/admin/users`

**Header**: [components/admin/admin-header.tsx](components/admin/admin-header.tsx)

- Mobile menu toggle
- Breadcrumb navigation
- Search component
- User dropdown with avatar

**Sidebar Provider**: [components/admin/sidebar-provider.tsx](components/admin/sidebar-provider.tsx)

- Context for sidebar state (`isCollapsed`, `isMobileOpen`)
- localStorage persistence
- Escape key to close on mobile
- Body scroll lock management

**Related Components**:

- [components/admin/breadcrumbs.tsx](components/admin/breadcrumbs.tsx) - Navigation breadcrumbs
- [components/admin/nav-item.tsx](components/admin/nav-item.tsx) - Sidebar menu item

---

## BUSINESS LOGIC - SERVER ACTIONS

All business logic is in `/lib/actions/` and uses the server actions pattern.

### 1. Authentication Management

**File**: [lib/actions/auth.ts](lib/actions/auth.ts)

```typescript
export async function login(prevState, formData): Promise<ActionState>;
export async function logout(): Promise<void>;
```

**Usage**: Login/logout on admin pages  
**Validation**: Email format, password required  
**Related Pages**:

- [app/(admin)/admin/login/page.tsx](<app/(admin)/admin/login/page.tsx>)

---

### 2. User Management (Admin)

**File**: [lib/actions/users.ts](lib/actions/users.ts)

**Functions**:

```typescript
getUsers(page?, limit?)                    // Paginated user list
getUserById(id)                            // Single user details
createUser(data)                           // Create new admin user
updateUser(id, data)                       // Update user info
deleteUser(id)                             // Delete user
updateCurrentUser(data)                    // Update own profile
```

**Key Features**:

- Passwords hashed with bcrypt (12 salt rounds)
- Passwords excluded from responses
- Pagination support
- Role assignment (ADMIN, INTERNAL_USER)

**Related Pages**:

- [app/(admin)/admin/users/page.tsx](<app/(admin)/admin/users/page.tsx>) - User list
- [app/(admin)/admin/users/new/page.tsx](<app/(admin)/admin/users/new/page.tsx>) - Create user
- [app/(admin)/admin/users/[id]/edit/page.tsx](<app/(admin)/admin/users/[id]/edit/page.tsx>) - Edit user
- [app/(admin)/admin/users/profile/page.tsx](<app/(admin)/admin/users/profile/page.tsx>) - My profile

**Related Components**:

- [components/admin/user-form-client.tsx](<app/(admin)/admin/users/user-form-client.tsx>) - Form
- [components/admin/users-table-client.tsx](<app/(admin)/admin/users/users-table-client.tsx>) - User list table

---

### 3. Product Management

**File**: [lib/actions/products.ts](lib/actions/products.ts)

**Functions**:

```typescript
getProducts(options?)                      // Filtered product list with pagination
getProductById(id)                         // Full product detail
createProduct(data)                        // Create simple/advanced product
updateProduct(id, data)                    // Update product
deleteProduct(id)                          // Delete product
publishProduct(id)                         // Make product public
unpublishProduct(id)                       // Make product private
```

**Supported Filters**:

- Type: SIMPLE, ADVANCED
- Status: AVAILABLE, PIPELINE
- Category, Therapeutic Area
- Search by name
- Sort by: name, createdAt, status

**Key Features**:

- Auto-generates URL slugs
- Prevents duplicate slugs
- Tracks product usage in forms/pages
- Supports bilingual translations (EN/AR)
- Handles media attachments
- Advanced details for complex products

**Related Pages**:

- [app/(admin)/admin/products/page.tsx](<app/(admin)/admin/products/page.tsx>) - Product list
- [app/(admin)/admin/products/new/page.tsx](<app/(admin)/admin/products/new/page.tsx>) - Create product
- [app/(admin)/admin/products/[id]/edit/page.tsx](<app/(admin)/admin/products/[id]/edit/page.tsx>) - Edit product

**Related Components**:

- [products/product-form-client.tsx](<app/(admin)/admin/products/product-form-client.tsx>) - Product form
- [products/products-table-client.tsx](<app/(admin)/admin/products/products-table-client.tsx>) - Product table

**Database Models Used**:

- Product
- ProductTranslation
- ProductAdvancedDetails
- ProductAttachment
- Category
- TherapeuticArea
- Manufacturer

---

### 4. Page Management

**File**: [lib/actions/pages.ts](lib/actions/pages.ts)

**Functions**:

```typescript
getPages(page?, pageSize?)                 // Paginated page list
getPageById(id)                            // Page with sections and translations
createPage(data)                           // Create new page
updatePage(id, data)                       // Update page metadata
deletePage(id)                             // Delete page with sections
getPageSections(pageId)                    // Get page sections
createSection(data)                        // Add section to page
updateSection(id, data)                    // Update section content
deleteSection(id)                          // Remove section
reorderSections(pageId, sections)          // Reorder sections
```

**Section Types Supported**:

1. HERO - Banner sections with CTA
2. TEXT - Rich text content
3. CARDS - Card grid layouts
4. STATS - Statistics display
5. FEATURES - Feature lists
6. CTA - Call-to-action sections
7. IMAGE_TEXT - Image + text layouts

**Key Features**:

- Auto-slug generation with uniqueness check
- Section ordering within pages
- Bilingual content per section
- Full CRUD operations with validation

**Related Pages**:

- [app/(admin)/admin/pages/page.tsx](<app/(admin)/admin/pages/page.tsx>) - Page list
- [app/(admin)/admin/pages/new/page.tsx](<app/(admin)/admin/pages/new/page.tsx>) - Create page
- [app/(admin)/admin/pages/[id]/edit/page.tsx](<app/(admin)/admin/pages/[id]/edit/page.tsx>) - Edit page

**Related Components**:

- [pages/page-form-client.tsx](<app/(admin)/admin/pages/page-form-client.tsx>) - Page form
- [pages/pages-table-client.tsx](<app/(admin)/admin/pages/pages-table-client.tsx>) - Page table
- [pages/[id]/edit/page-editor-client.tsx](<app/(admin)/admin/pages/[id]/edit/page-editor-client.tsx>) - Editor

**Section Editors**:

- [sections/hero-section-editor.tsx](<app/(admin)/admin/pages/sections/hero-section-editor.tsx>)
- [sections/text-section-editor.tsx](<app/(admin)/admin/pages/sections/text-section-editor.tsx>)
- [sections/image-text-section-editor.tsx](<app/(admin)/admin/pages/sections/image-text-section-editor.tsx>)
- [sections/stats-section-editor.tsx](<app/(admin)/admin/pages/sections/stats-section-editor.tsx>)
- [sections/features-section-editor.tsx](<app/(admin)/admin/pages/sections/features-section-editor.tsx>)
- [sections/cards-section-editor.tsx](<app/(admin)/admin/pages/sections/cards-section-editor.tsx>)
- [sections/cta-section-editor.tsx](<app/(admin)/admin/pages/sections/cta-section-editor.tsx>)

**Database Models Used**:

- Page
- PageTranslation
- PageSection
- PageSectionTranslation

---

### 5. Form Submission Management

**File**: [lib/actions/forms.ts](lib/actions/forms.ts)

**Functions**:

```typescript
getFormSubmissions(options); // Search/filter submissions
getFormSubmissionById(id); // Single submission detail
updateSubmissionStatus(id, status); // Change status (NEW/REVIEWED/ARCHIVED)
deleteFormSubmission(id); // Remove submission
getFormSubmissionStats(); // Dashboard statistics
exportFormSubmissions(format); // Export to CSV/JSON
```

**Form Types**:

- CONTACT - General inquiries
- PARTNERSHIP - Partnership requests
- PRODUCT_INQUIRY - Product questions

**Status States**:

- NEW - Unprocessed
- REVIEWED - Being handled
- ARCHIVED - Completed/closed

**Filter Options**:

- By type, status, date range
- Search by name/email
- Sort by multiple fields
- Pagination

**Related Pages**:

- [app/(admin)/admin/forms/page.tsx](<app/(admin)/admin/forms/page.tsx>) - Form list
- [app/(admin)/admin/forms/[id]/page.tsx](<app/(admin)/admin/forms/[id]/page.tsx>) - Form detail

**Related Components**:

- [forms/forms-table-client.tsx](<app/(admin)/admin/forms/forms-table-client.tsx>) - Forms table
- [forms/[id]/form-detail-client.tsx](<app/(admin)/admin/forms/[id]/form-detail-client.tsx>) - Detail view

**Database Model Used**:

- FormSubmission

---

### 6. Media Management

**File**: [lib/actions/media.ts](lib/actions/media.ts)

**Functions**:

```typescript
getMedia(options); // Paginated media list
getMediaById(id); // Single media file
updateMediaName(id, name); // Rename media
deleteMedia(id); // Remove single file
deleteMultipleMedia(ids); // Batch delete
getMediaStats(); // Storage usage stats
```

**Filter & Search**:

- Search by filename
- Filter by type (image, document)
- Pagination with size limits
- Sort by upload date

**Key Features**:

- Stores uploader information
- Tracks image dimensions
- File size and MIME type data
- Integration with storage module

**Related Pages**:

- [app/(admin)/admin/media/page.tsx](<app/(admin)/admin/media/page.tsx>) - Media library

**Related Components**:

- [media/media-library-client.tsx](<app/(admin)/admin/media/media-library-client.tsx>) - Library view
- [media/media-card.tsx](components/admin/media/media-card.tsx) - Individual file card
- [media/upload-dialog.tsx](components/admin/media/upload-dialog.tsx) - Upload interface
- [components/admin/media-picker.tsx](components/admin/media-picker.tsx) - Media selector
- [components/admin/media-field.tsx](components/admin/media-field.tsx) - Form field wrapper

**API Routes**:

- [app/api/admin/media/upload/route.ts](app/api/admin/media/upload/route.ts) - File upload

**Database Model Used**:

- Media

---

### 7. Settings Management

**File**: [lib/actions/settings.ts](lib/actions/settings.ts)

Manages lookup tables and site-wide settings:

**Categories**:

```typescript
getCategories();
createCategory(data);
updateCategory(id, data);
deleteCategory(id);
```

**Therapeutic Areas**:

```typescript
getTherapeuticAreas();
createTherapeuticArea(data);
updateTherapeuticArea(id, data);
deleteTherapeuticArea(id);
```

**Manufacturers**:

```typescript
getManufacturers();
createManufacturer(data);
updateManufacturer(id, data);
deleteManufacturer(id);
```

**Site Settings**:

```typescript
getSiteSetting(key);
updateSiteSetting(key, value);
```

**Related Pages**:

- [app/(admin)/admin/settings/page.tsx](<app/(admin)/admin/settings/page.tsx>) - Settings page

**Related Components**:

- [settings/settings-management-client.tsx](<app/(admin)/admin/settings/settings-management-client.tsx>) - Settings form

**Database Models Used**:

- Category
- TherapeuticArea
- Manufacturer
- SiteSetting

---

## VALIDATION SCHEMAS

### Page Form Schema

**File**: [lib/schemas/page-form.ts](lib/schemas/page-form.ts)

Validates page and section creation/editing with Zod:

```typescript
PageCreateSchema; // Validate new page
PageUpdateSchema; // Validate page updates
SectionCreateSchema; // Validate section creation
SectionUpdateSchema; // Validate section updates
SectionReorderSchema; // Validate section reordering
generateSlug(title); // Auto-generate URL-safe slugs
```

**Field Validation**:

- Title: 1-255 chars, required
- Slug: lowercase, hyphens, auto-generated, unique
- MetaTitle: 0-60 chars (SEO)
- MetaDescription: 0-160 chars (SEO)
- isPublished: boolean
- Translations: EN/AR metadata

---

### Product Form Schema

**File**: [lib/schemas/product-form.ts](lib/schemas/product-form.ts)

Validates product forms with media and translations:

```typescript
ProductFormSchema; // Base validation
CreateProductFormSchema; // Required for creation
UpdateProductFormSchema; // Optional for updates
```

**Field Validation**:

- Name: 1-200 chars
- Description: 0-5000 chars
- Type: SIMPLE or ADVANCED
- Status: AVAILABLE or PIPELINE
- Category: required
- Therapeutic Area: optional
- Manufacturer: required
- Cover Image: optional
- Attachments: array

---

## ADMIN PAGES & ROUTES

### Route Structure

```
/admin/
├── login
│   └── page.tsx              # Login form
├── layout.tsx                # Admin wrapper layout
├── page.tsx                  # Dashboard
├── products/
│   ├── page.tsx              # Product list
│   ├── product-form-client.tsx
│   ├── products-table-client.tsx
│   ├── new/
│   │   └── page.tsx          # Create product
│   └── [id]/edit/
│       └── page.tsx          # Edit product
├── pages/
│   ├── page.tsx              # Page list
│   ├── page-form-client.tsx
│   ├── pages-table-client.tsx
│   ├── new/
│   │   └── page.tsx          # Create page
│   ├── [id]/edit/
│   │   ├── page.tsx          # Edit page
│   │   ├── page-editor-client.tsx
│   │   ├── section-list.tsx
│   │   ├── section-editor-modal.tsx
│   │   └── section-type-selector.tsx
│   └── sections/
│       ├── hero-section-editor.tsx
│       ├── text-section-editor.tsx
│       ├── image-text-section-editor.tsx
│       ├── stats-section-editor.tsx
│       ├── features-section-editor.tsx
│       ├── cards-section-editor.tsx
│       └── cta-section-editor.tsx
├── media/
│   ├── page.tsx              # Media library
│   └── media-library-client.tsx
├── forms/
│   ├── page.tsx              # Form submissions list
│   ├── forms-table-client.tsx
│   └── [id]/
│       ├── page.tsx          # Form detail
│       └── form-detail-client.tsx
├── users/
│   ├── page.tsx              # User list
│   ├── user-form-client.tsx
│   ├── users-table-client.tsx
│   ├── new/
│   │   └── page.tsx          # Create user
│   ├── [id]/edit/
│   │   └── page.tsx          # Edit user
│   └── profile/
│       └── page.tsx          # My profile
├── settings/
│   ├── page.tsx              # Settings
│   └── settings-management-client.tsx
├── loading.tsx               # Loading skeleton
├── not-found.tsx             # 404 page
└── error.tsx                 # Error boundary
```

---

## ADMIN COMPONENTS

### Layout Components

**AdminSidebar** [components/admin/admin-sidebar.tsx](components/admin/admin-sidebar.tsx)

- Collapsible navigation menu
- Active route highlighting
- User profile section
- Logout button

**AdminHeader** [components/admin/admin-header.tsx](components/admin/admin-header.tsx)

- Mobile menu toggle
- Breadcrumb navigation
- Search bar
- Notification bell
- User dropdown

**SidebarProvider** [components/admin/sidebar-provider.tsx](components/admin/sidebar-provider.tsx)

- Context provider for sidebar state
- localStorage persistence
- Mobile/desktop state management

---

### Navigation Components

**Breadcrumbs** [components/admin/breadcrumbs.tsx](components/admin/breadcrumbs.tsx)

- Auto-generates from pathname
- Custom items support
- Active markers

**NavItem** [components/admin/nav-item.tsx](components/admin/nav-item.tsx)

- Sidebar menu item
- Icon support
- Active state highlighting

---

### Dashboard Components

**PageHeader** [components/admin/page-header.tsx](components/admin/page-header.tsx)

- Standardized page title and description
- Action buttons section

**StatsCard** [components/admin/stats-card.tsx](components/admin/stats-card.tsx)

- Dashboard stat display
- Icon, label, value
- Color accents
- Loading state

**QuickActions** [components/admin/quick-actions.tsx](components/admin/quick-actions.tsx)

- Quick navigation buttons
- Create product, create page, upload media

**RecentActivity** [components/admin/recent-activity.tsx](components/admin/recent-activity.tsx)

- Activity feed component
- Shows recent changes

**Skeletons** [components/admin/skeletons.tsx](components/admin/skeletons.tsx)

- Loading placeholders
- Various skeleton types

---

### Form Input Components

**LanguageTabs** [components/admin/language-tabs.tsx](components/admin/language-tabs.tsx)

- Bilingual content switcher
- EN/AR tabs
- Unsaved changes indicators

**DynamicArrayField** [components/admin/dynamic-array-field.tsx](components/admin/dynamic-array-field.tsx)

- Manage arrays in forms (stats, cards, features)
- Add/remove/edit items
- Max items limit
- Custom render function

**MediaField** [components/admin/media-field.tsx](components/admin/media-field.tsx)

- Single media selection in forms
- Preview display
- Clear/replace buttons
- Aspect ratio display

**MediaPicker** [components/admin/media-picker.tsx](components/admin/media-picker.tsx)

- Modal for selecting media from library
- Search and type filtering
- Single/multiple selection
- Pagination

---

### Rich Text Editor

**TiptapEditor** [components/admin/tiptap-editor.tsx](components/admin/tiptap-editor.tsx)

- Rich text editor for content
- Bilingual support (RTL for AR)
- Editor instance management

**TiptapToolbar** [components/admin/tiptap-toolbar.tsx](components/admin/tiptap-toolbar.tsx)

- Editor formatting buttons
- Text formatting, lists, links, images
- Code blocks with syntax highlighting

**TiptapLinkModal** [components/admin/tiptap-link-modal.tsx](components/admin/tiptap-link-modal.tsx)

- Dialog for inserting/editing links
- URL validation

**TiptapImageModal** [components/admin/tiptap-image-modal.tsx](components/admin/tiptap-image-modal.tsx)

- Dialog for inserting/editing images
- Media picker integration

---

### Media Management Components

**MediaLibrary** [components/admin/media/media-library.tsx](components/admin/media/media-library.tsx)

- Standalone media management UI
- Grid/list view

**MediaCard** [components/admin/media/media-card.tsx](components/admin/media/media-card.tsx)

- Individual media file card
- Thumbnail preview
- Selection checkbox
- Action buttons (view, edit, delete)

**UploadDialog** [components/admin/media/upload-dialog.tsx](components/admin/media/upload-dialog.tsx)

- Modal for uploading files
- Drag-drop upload area
- File selection dialog
- Progress tracking
- Multiple file upload
- Error handling

---

### Utility Components

**SectionCard** [components/admin/section-card.tsx](components/admin/section-card.tsx)

- Card for displaying page sections
- Section type badge
- Edit/delete actions

---

## FORMS & EDITORS

### Product Form

**File**: [app/(admin)/admin/products/product-form-client.tsx](<app/(admin)/admin/products/product-form-client.tsx>)

**Features**:

- Bilingual input (EN/AR tabs)
- Product type selection (SIMPLE/ADVANCED)
- Status selection (AVAILABLE/PIPELINE)
- Category and manufacturer dropdowns
- Cover image picker
- Attachment management
- Advanced details section (for ADVANCED products)
- Form validation with Zod
- Submit/cancel actions

**Data Flow**:

1. Form receives initial product data (for edit) or empty (for create)
2. User fills in bilingual content
3. Form validates with ProductFormSchema
4. Server action called: `createProduct()` or `updateProduct()`
5. Revalidate paths and show success/error toast

---

### Page Form

**File**: [app/(admin)/admin/pages/page-form-client.tsx](<app/(admin)/admin/pages/page-form-client.tsx>)

**Features**:

- Bilingual page metadata (title, metaTitle, metaDescription)
- Section management (add, edit, delete, reorder)
- Section type selector modal
- Individual section editors
- Publish/draft toggle
- Form validation
- Auto-slug generation

**Page Editor Flow**:

1. Page form shows basic metadata
2. Add section button opens type selector
3. Select type shows relevant section editor
4. Edit section details in modal
5. Sections display as reorderable list
6. Drag to reorder or use order controls
7. Save page updates

---

### User Form

**File**: [app/(admin)/admin/users/user-form-client.tsx](<app/(admin)/admin/users/user-form-client.tsx>)

**Features**:

- Email, name, password fields
- Role selection (ADMIN, INTERNAL_USER)
- Optional password for existing users
- Form validation
- Submit/cancel

---

### Settings Form

**File**: [app/(admin)/admin/settings/settings-management-client.tsx](<app/(admin)/admin/settings/settings-management-client.tsx>)

**Features**:

- Site metadata editing
- Category management (CRUD)
- Manufacturer management (CRUD)
- Therapeutic area management (CRUD)
- Tabbed interface for organization

---

### Section Editors

Each section type has its own editor component for bilingual content:

**HeroSectionEditor** [app/(admin)/admin/pages/sections/hero-section-editor.tsx](<app/(admin)/admin/pages/sections/hero-section-editor.tsx>)

- Title and subtitle
- CTA button setup
- Background image

**TextSectionEditor** [app/(admin)/admin/pages/sections/text-section-editor.tsx](<app/(admin)/admin/pages/sections/text-section-editor.tsx>)

- Rich text with Tiptap editor
- Bilingual content

**ImageTextSectionEditor** [app/(admin)/admin/pages/sections/image-text-section-editor.tsx](<app/(admin)/admin/pages/sections/image-text-section-editor.tsx>)

- Image picker
- Text content
- Image position toggle

**StatsSectionEditor** [app/(admin)/admin/pages/sections/stats-section-editor.tsx](<app/(admin)/admin/pages/sections/stats-section-editor.tsx>)

- Dynamic stats array
- Stat value and label

**FeaturesSectionEditor** [app/(admin)/admin/pages/sections/features-section-editor.tsx](<app/(admin)/admin/pages/sections/features-section-editor.tsx>)

- Dynamic features array
- Title, icon, description per feature

**CardsSectionEditor** [app/(admin)/admin/pages/sections/cards-section-editor.tsx](<app/(admin)/admin/pages/sections/cards-section-editor.tsx>)

- Dynamic cards array
- Title, image, description per card

**CtaSectionEditor** [app/(admin)/admin/pages/sections/cta-section-editor.tsx](<app/(admin)/admin/pages/sections/cta-section-editor.tsx>)

- CTA title and description
- Button setup

---

## DATABASE SCHEMA

### Data Models

**User Model**

```
id: String (PK)
email: String (unique)
password: String (bcrypt hashed)
name: String
role: ADMIN | INTERNAL_USER
createdAt: DateTime
updatedAt: DateTime
```

**Product Model**

```
id: String (PK)
slug: String (unique)
name: String
description: String
type: SIMPLE | ADVANCED
status: AVAILABLE | PIPELINE
categoryId: String (FK)
therapeuticAreaId: String (FK nullable)
manufacturerId: String (FK)
coverImageId: String (FK nullable)
isPublished: Boolean
createdAt: DateTime
updatedAt: DateTime
→ translations: ProductTranslation[]
→ advancedDetails: ProductAdvancedDetails nullable
→ attachments: ProductAttachment[]
```

**ProductTranslation Model**

```
id: String (PK)
productId: String (FK)
locale: en | ar
title: String
description: String
```

**ProductAdvancedDetails Model**

```
id: String (PK)
productId: String (FK)
storageConditions: String
regulatoryInfo: String
```

**ProductAttachment Model**

```
id: String (PK)
productId: String (FK)
mediaId: String (FK)
order: Int
```

**Page Model**

```
id: String (PK)
slug: String (unique)
isPublished: Boolean
createdAt: DateTime
updatedAt: DateTime
→ translations: PageTranslation[]
→ sections: PageSection[]
```

**PageTranslation Model**

```
id: String (PK)
pageId: String (FK)
locale: en | ar
title: String
metaTitle: String nullable
metaDescription: String nullable
```

**PageSection Model**

```
id: String (PK)
pageId: String (FK)
type: HERO | TEXT | CARDS | STATS | FEATURES | CTA | IMAGE_TEXT
order: Int
data: Json (section-specific data)
createdAt: DateTime
updatedAt: DateTime
→ translations: PageSectionTranslation[]
```

**PageSectionTranslation Model**

```
id: String (PK)
sectionId: String (FK)
locale: en | ar
data: Json (localized section data)
```

**FormSubmission Model**

```
id: String (PK)
type: CONTACT | PARTNERSHIP | PRODUCT_INQUIRY
status: NEW | REVIEWED | ARCHIVED
name: String
email: String
phone: String nullable
company: String nullable
inquiryType: String nullable
message: String
createdAt: DateTime
updatedAt: DateTime
```

**Media Model**

```
id: String (PK)
name: String
url: String
type: String (MIME type)
mimeType: String
size: Int
width: Int nullable
height: Int nullable
uploadedById: String (FK nullable)
createdAt: DateTime
updatedAt: DateTime
```

**Category Model**

```
id: String (PK)
name: String
slug: String
createdAt: DateTime
updatedAt: DateTime
```

**TherapeuticArea Model**

```
id: String (PK)
name: String
slug: String
createdAt: DateTime
updatedAt: DateTime
```

**Manufacturer Model**

```
id: String (PK)
name: String
createdAt: DateTime
updatedAt: DateTime
```

**SiteSetting Model**

```
id: String (PK)
key: String (unique)
value: String
createdAt: DateTime
updatedAt: DateTime
```

---

## FILE STRUCTURE

### Quick Reference by Category

**Authentication**:

- [lib/auth.ts](lib/auth.ts)
- [lib/auth-utils.ts](lib/auth-utils.ts)
- [lib/actions/auth.ts](lib/actions/auth.ts)
- [middleware.ts](middleware.ts)

**Business Logic**:

- [lib/actions/users.ts](lib/actions/users.ts)
- [lib/actions/products.ts](lib/actions/products.ts)
- [lib/actions/pages.ts](lib/actions/pages.ts)
- [lib/actions/forms.ts](lib/actions/forms.ts)
- [lib/actions/media.ts](lib/actions/media.ts)
- [lib/actions/settings.ts](lib/actions/settings.ts)

**Validation Schemas**:

- [lib/schemas/page-form.ts](lib/schemas/page-form.ts)
- [lib/schemas/product-form.ts](lib/schemas/product-form.ts)

**Layout & Navigation**:

- [app/(admin)/admin/layout.tsx](<app/(admin)/admin/layout.tsx>)
- [components/admin/admin-sidebar.tsx](components/admin/admin-sidebar.tsx)
- [components/admin/admin-header.tsx](components/admin/admin-header.tsx)
- [components/admin/sidebar-provider.tsx](components/admin/sidebar-provider.tsx)
- [components/admin/breadcrumbs.tsx](components/admin/breadcrumbs.tsx)
- [components/admin/nav-item.tsx](components/admin/nav-item.tsx)

**Dashboard**:

- [app/(admin)/admin/page.tsx](<app/(admin)/admin/page.tsx>)
- [components/admin/page-header.tsx](components/admin/page-header.tsx)
- [components/admin/stats-card.tsx](components/admin/stats-card.tsx)
- [components/admin/quick-actions.tsx](components/admin/quick-actions.tsx)
- [components/admin/recent-activity.tsx](components/admin/recent-activity.tsx)

**Products**:

- [app/(admin)/admin/products/page.tsx](<app/(admin)/admin/products/page.tsx>)
- [products/product-form-client.tsx](<app/(admin)/admin/products/product-form-client.tsx>)
- [products/products-table-client.tsx](<app/(admin)/admin/products/products-table-client.tsx>)

**Pages**:

- [app/(admin)/admin/pages/page.tsx](<app/(admin)/admin/pages/page.tsx>)
- [pages/page-form-client.tsx](<app/(admin)/admin/pages/page-form-client.tsx>)
- [pages/pages-table-client.tsx](<app/(admin)/admin/pages/pages-table-client.tsx>)
- [pages/[id]/edit/page-editor-client.tsx](<app/(admin)/admin/pages/[id]/edit/page-editor-client.tsx>)
- [pages/sections/\* editors](<app/(admin)/admin/pages/sections/>)

**Media**:

- [app/(admin)/admin/media/page.tsx](<app/(admin)/admin/media/page.tsx>)
- [media/media-library-client.tsx](<app/(admin)/admin/media/media-library-client.tsx>)
- [components/admin/media/media-card.tsx](components/admin/media/media-card.tsx)
- [components/admin/media/upload-dialog.tsx](components/admin/media/upload-dialog.tsx)
- [components/admin/media-picker.tsx](components/admin/media-picker.tsx)

**Forms**:

- [app/(admin)/admin/forms/page.tsx](<app/(admin)/admin/forms/page.tsx>)
- [forms/forms-table-client.tsx](<app/(admin)/admin/forms/forms-table-client.tsx>)
- [forms/[id]/form-detail-client.tsx](<app/(admin)/admin/forms/[id]/form-detail-client.tsx>)

**Users**:

- [app/(admin)/admin/users/page.tsx](<app/(admin)/admin/users/page.tsx>)
- [users/user-form-client.tsx](<app/(admin)/admin/users/user-form-client.tsx>)
- [users/users-table-client.tsx](<app/(admin)/admin/users/users-table-client.tsx>)

**Settings**:

- [app/(admin)/admin/settings/page.tsx](<app/(admin)/admin/settings/page.tsx>)
- [settings/settings-management-client.tsx](<app/(admin)/admin/settings/settings-management-client.tsx>)

**Rich Text Editor**:

- [components/admin/tiptap-editor.tsx](components/admin/tiptap-editor.tsx)
- [components/admin/tiptap-toolbar.tsx](components/admin/tiptap-toolbar.tsx)
- [components/admin/tiptap-link-modal.tsx](components/admin/tiptap-link-modal.tsx)
- [components/admin/tiptap-image-modal.tsx](components/admin/tiptap-image-modal.tsx)
- [lib/tiptap-extensions.ts](lib/tiptap-extensions.ts)

**Form Components**:

- [components/admin/language-tabs.tsx](components/admin/language-tabs.tsx)
- [components/admin/dynamic-array-field.tsx](components/admin/dynamic-array-field.tsx)
- [components/admin/media-field.tsx](components/admin/media-field.tsx)

**Utilities**:

- [components/admin/section-card.tsx](components/admin/section-card.tsx)
- [components/admin/skeletons.tsx](components/admin/skeletons.tsx)

---

## DEVELOPMENT QUICK START

### Common Tasks

**Create a new product**:

1. Navigate to `/admin/products/new`
2. Fill product form with bilingual content
3. Select type (SIMPLE/ADVANCED)
4. Click save
5. Redirects to products list

**Create a new page**:

1. Navigate to `/admin/pages/new`
2. Enter page title (auto-generates slug)
3. Add sections using "Add Section" button
4. Edit each section with appropriate editor
5. Reorder sections as needed
6. Publish when ready

**Upload media**:

1. Navigate to `/admin/media`
2. Click "Upload" button
3. Drag-drop or select files
4. Files appear in library after upload
5. Use media picker to select in forms

**Manage users**:

1. Navigate to `/admin/users`
2. Click "New User" to create
3. Set email, name, password, role
4. Existing users can be edited/deleted

**View form submissions**:

1. Navigate to `/admin/forms`
2. Filter by type and status
3. Click submission to view details
4. Update status as needed

---

## DEPLOYMENT & ENVIRONMENT

### Required Environment Variables

```
DATABASE_URL=postgresql://user:password@host:port/dbname
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
STORAGE_PROVIDER=local or s3
LOCAL_UPLOAD_DIR=public/uploads
LOCAL_BASE_URL=/uploads
```

### Build & Run

```bash
npm run build    # Production build
npm run start    # Start production server
npm run dev      # Development server
npm run lint     # Check code quality
```

---

## CONCLUSION

The admin section is a comprehensive content management system with:

- ✅ Complete CRUD operations for products, pages, media, forms, and settings
- ✅ Bilingual content support (EN/AR)
- ✅ Rich text editing with Tiptap
- ✅ Flexible page builder with multiple section types
- ✅ Media management with upload and library
- ✅ Form submission tracking
- ✅ User management with role-based access
- ✅ Full authentication and authorization
- ✅ Type-safe validation with Zod
- ✅ Responsive design for desktop and tablet

All admin functionality is built with server actions, type safety, and modern Next.js 16 patterns.
