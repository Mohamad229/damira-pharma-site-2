# Damira Pharma - Admin Page Layouts

**Purpose**: Visual reference guide showing the structure, layout, and components on each admin page. Use this to understand page composition and edit sections individually for UI/UX improvements.

**Last Updated**: 2025  
**Stack**: Next.js 16 + React 19  
**Frameworks**: Tailwind CSS 4, Shadcn UI, Tiptap Editor

---

## TABLE OF CONTENTS

1. [Admin Layout Structure Overview](#admin-layout-structure-overview)
2. [Authentication Pages](#authentication-pages)
3. [Dashboard](#dashboard)
4. [Product Management](#product-management)
5. [Page Management](#page-management)
6. [Media Management](#media-management)
7. [Form Submissions](#form-submissions)
8. [User Management](#user-management)
9. [Settings & Configuration](#settings--configuration)
10. [Shared Admin Components](#shared-admin-components)
11. [Development Notes](#development-notes)

---

## ADMIN LAYOUT STRUCTURE OVERVIEW

### Global Admin Template

All admin pages follow this structure:

```
┌─────────────────────────────────────────────────────────┐
│                   ADMIN HEADER                          │
│  [≡ Sidebar Toggle] [Breadcrumbs] [Search] [User ▼]    │
└─────────────────────────────────────────────────────────┘
│                                                         │
│ ┌────────────────┐  ┌─────────────────────────────────┐│
│ │                │  │                                 ││
│ │  SIDEBAR       │  │      PAGE CONTENT AREA          ││
│ │  (Navigation)  │  │  (Main section, dynamic)        ││
│ │                │  │                                 ││
│ │ • Dashboard    │  │  [Responsive layout]            ││
│ │ • Products     │  │  Grid, tables, forms, etc       ││
│ │ • Pages        │  │                                 ││
│ │ • Media        │  │                                 ││
│ │ • Forms        │  │                                 ││
│ │ • Settings     │  │                                 ││
│ │ • Users        │  │                                 ││
│ │                │  │                                 ││
│ │ [User Profile] │  │                                 ││
│ │ [Logout]       │  │                                 ││
│ │                │  │                                 ││
│ └────────────────┘  └─────────────────────────────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Responsive Behavior

- **Desktop (≥ 1024px)**: Sidebar visible, sticky header
- **Tablet (768px - 1023px)**: Collapsible sidebar, full-width content
- **Mobile (< 768px)**: Hamburger menu, overlay sidebar on demand

### File Structure

**Main Layout**: [app/(admin)/admin/layout.tsx](<app/(admin)/admin/layout.tsx>)

- Root admin wrapper
- SidebarProvider context
- AdminSidebar + AdminHeader + children
- RTL support for Arabic

**Sidebar**: [components/admin/admin-sidebar.tsx](components/admin/admin-sidebar.tsx)

- Fixed/collapsible left panel
- Navigation items with icons
- Active route highlighting
- User profile section

**Header**: [components/admin/admin-header.tsx](components/admin/admin-header.tsx)

- Mobile menu toggle
- Breadcrumb navigation
- Search component (optional)
- User dropdown menu

---

## AUTHENTICATION PAGES

### Login Page

**File**: [app/(admin)/admin/login/page.tsx](<app/(admin)/admin/login/page.tsx>)  
**Route**: `/admin/login`  
**Access**: Public (no auth required)

### Page Layout

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│              LOGIN CONTAINER                    │
│          ┌─────────────────────────┐           │
│          │                         │           │
│          │  [Logo]                 │           │
│          │                         │           │
│          │  Welcome Back           │           │
│          │  Sign in to your account│           │
│          │                         │           │
│          │ Email:                  │           │
│          │ [_______________________]           │
│          │                         │           │
│          │ Password:               │           │
│          │ [_______________________]           │
│          │                         │           │
│          │ [Remember me checkbox]  │           │
│          │                         │           │
│          │ [Sign In Button]        │           │
│          │                         │           │
│          │ [Error Message if any]  │           │
│          │                         │           │
│          └─────────────────────────┘           │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Login Page Components

| Component      | Purpose                          |
| -------------- | -------------------------------- |
| Logo           | Branding                         |
| Welcome Text   | Page title/description           |
| Email Input    | Email field (required)           |
| Password Input | Password field (required)        |
| Remember Me    | Checkbox for session persistence |
| Submit Button  | Login trigger                    |
| Error Display  | Error message if login fails     |

### Form Validation

```
Validation Rules:
- Email: valid email format required
- Password: required, minimum 6 characters (enforced server-side)

On Submit:
1. Client validation
2. Send to server action: lib/actions/auth.ts → login()
3. Hash password and verify
4. Create JWT session
5. Redirect to /admin on success
6. Show error message on failure
```

---

## DASHBOARD

**File**: [app/(admin)/admin/page.tsx](<app/(admin)/admin/page.tsx>)  
**Route**: `/admin`  
**Access**: ADMIN role required

### Page Layout

```
┌──────────────────────────────────────────────────────────┐
│         ADMIN HEADER (Breadcrumb: Dashboard)             │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                                                          │
│  PAGE TITLE AREA                                         │
│  Dashboard                                               │
│  Welcome back! Here's what's happening today.           │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │          STATS GRID (KPIs)                       │  │
│  ├──────────────┬──────────────┬──────────────────┤  │
│  │              │              │                  │  │
│  │  Total       │  Published   │  Pending Forms   │  │
│  │  Products    │  Pages       │                  │  │
│  │  ┌────────┐  │  ┌────────┐  │  ┌────────────┐ │  │
│  │  │  127   │  │  │   12   │  │  │     5      │ │  │
│  │  └────────┘  │  └────────┘  │  └────────────┘ │  │
│  │              │              │                  │  │
│  ├──────────────┼──────────────┼──────────────────┤  │
│  │              │              │                  │  │
│  │  Available   │  Pipeline    │  Media Files     │  │
│  │  Products    │  Products    │                  │  │
│  │  ┌────────┐  │  ┌────────┐  │  ┌────────────┐ │  │
│  │  │   98   │  │  │   29   │  │  │    342     │ │  │
│  │  └────────┘  │  └────────┘  │  └────────────┘ │  │
│  │              │              │                  │  │
│  └──────────────┴──────────────┴──────────────────┘  │
│                                                      │
│  QUICK ACTIONS SECTION                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ ➕ New       │  │ ➕ New Page  │  │ ⬆️ Upload │ │
│  │ Product      │  │              │  │ Media     │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│  [View all products] [View all pages] [View all]  │
│                                                      │
│  RECENT ACTIVITY SECTION                            │
│  "Recent Changes"                                   │
│  ┌────────────────────────────────────────────┐   │
│  │ • John added Product "Rinolac"            │   │
│  │   5 minutes ago                            │   │
│  │                                            │   │
│  │ • Admin updated Page "Services"            │   │
│  │   30 minutes ago                           │   │
│  │                                            │   │
│  │ • Sarah created new Form Response          │   │
│  │   2 hours ago                              │   │
│  │                                            │   │
│  │ • Team uploaded 5 media files              │   │
│  │   Yesterday at 3:22 PM                     │   │
│  │                                            │   │
│  └────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Dashboard Components

| Component         | File                                   | Purpose               |
| ----------------- | -------------------------------------- | --------------------- |
| Page Header       | `components/admin/page-header.tsx`     | Title and description |
| Stats Grid        | `components/admin/stats-card.tsx`      | KPI display cards     |
| Quick Actions     | `components/admin/quick-actions.tsx`   | Action buttons        |
| Recent Activity   | `components/admin/recent-activity.tsx` | Activity feed         |
| Loading Skeletons | `components/admin/skeletons.tsx`       | Placeholder states    |

### Data Flow

```
1. [app/(admin)/admin/page.tsx]
   ↓ (server component, ADMIN only)
2. Fetch stats:
   - Total products count
   - Published pages count
   - Pending forms count
   - Available vs pipeline products
   - Media files count
   ↓
3. Fetch recent activity (last 10 activities)
   ↓
4. Render: Header → Stats → Quick Actions → Activity
```

---

## PRODUCT MANAGEMENT

**Files**:

- [app/(admin)/admin/products/page.tsx](<app/(admin)/admin/products/page.tsx>) - List
- [app/(admin)/admin/products/new/page.tsx](<app/(admin)/admin/products/new/page.tsx>) - Create
- [app/(admin)/admin/products/[id]/edit/page.tsx](<app/(admin)/admin/products/[id]/edit/page.tsx>) - Edit

### Products List Page

**Route**: `/admin/products`

### Page Layout

```
┌──────────────────────────────────────────────────────────┐
│         PAGE HEADER (Breadcrumb: Products)              │
│  Products                                                │
│  Manage pharmaceutical products and their details       │
│  [➕ New Product Button]                                 │
└──────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  FILTER & SEARCH BAR                                       │
│  ┌─────────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │ 🔍 Search...    │  │ ▼ Type       │  │ ▼ Status    │  │
│  └─────────────────┘  └──────────────┘  └─────────────┘  │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ ▼ Category   │  │ ▼ Area       │  │ Sort by ▼   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  PRODUCTS TABLE                                            │
│  ┌─────┬──────────┬──────────┬────────┬────────┬────────┐ │
│  │ □   │ Product  │ Category │ Status │ Publish│ Action │ │
│  └─────┴──────────┴──────────┴────────┴────────┴────────┘ │
│  │ ☐ │ Rinolac  │ Nutrition│ Avail. │ ✓      │ Edit Del│ │
│  │ ☐ │ Rino Plus│ Nutrition│ Avail. │ ✓      │ Edit Del│ │
│  │ ☐ │ Product3 │ Critical │ Avail. │ ✗      │ Edit Del│ │
│  │ ☐ │ Product4 │ Oncology │ Future │ ✓      │ Edit Del│ │
│  │ ☐ │ Product5 │ Pediatr. │ Avail. │ ✓      │ Edit Del│ │
│  │ ☐ │ Product6 │ Oncology │ Avail. │ ✓      │ Edit Del│ │
│  │ ☐ │ Product7 │ Critical │ Avail. │ ✗      │ Edit Del│ │
│  │ ☐ │ Product8 │ Nutrition│ Future │ ✗      │ Edit Del│ │
│  │ ☐ │ Product9 │ Pediatr. │ Avail. │ ✓      │ Edit Del│ │
│  │ ☐ │ Product10│ Critical │ Avail. │ ✓      │ Edit Del│ │
│  └────────────────────────────────────────────────────────┘
│
│  Results: 1-10 of 127 | [← Prev] [1 2 3 4 ...] [Next →]
│
└────────────────────────────────────────────────────────────┘
```

### Product List Components

| Component        | File                                 | Purpose                                |
| ---------------- | ------------------------------------ | -------------------------------------- |
| Page Header      | `components/admin/page-header.tsx`   | Title and create button                |
| Search Box       | Inline                               | Search by product name                 |
| Filter Dropdowns | Inline                               | Filter by type, status, category, area |
| Sort Dropdown    | Inline                               | Sort options                           |
| Products Table   | `products/products-table-client.tsx` | Main data grid                         |
| Pagination       | Inline                               | Page navigation                        |

### Product Form Page

**Routes**:

- Create: `/admin/products/new`
- Edit: `/admin/products/[id]/edit`

### Page Layout

```
┌──────────────────────────────────────────────────────────┐
│  PAGE HEADER (Breadcrumb: Products > New/Edit)          │
│  Create Product / Edit Product                           │
│  [← Back]                                                │
└──────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  PRODUCT FORM                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  FORM TABS: [EN] [العربية]                           │ │
│  │                                                      │ │
│  │  BASIC INFORMATION                                  │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │ Product Name (EN):                             │ │ │
│  │  │ [_____________________________________]        │ │ │
│  │  │                                                │ │ │
│  │  │ Description (EN):                              │ │ │
│  │  │ ┌──────────────────────────────────────────┐  │ │ │
│  │  │ │ [Rich Text Editor - Tiptap]              │  │ │ │
│  │  │ │ Toolbar: B I U ~ Link Image Code         │  │ │ │
│  │  │ │                                          │  │ │ │
│  │  │ │ Lorem ipsum dolor sit amet, consectetur  │  │ │ │
│  │  │ │ adipiscing elit. Sed do eiusmod tempor.  │  │ │ │
│  │  │ │                                          │  │ │ │
│  │  │ └──────────────────────────────────────────┘  │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                      │ │
│  │  PRODUCT DETAILS                                    │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │ Product Type:       [SIMPLE ▼]              │ │ │
│  │  │ Status:             [AVAILABLE ▼]           │ │ │
│  │  │ Category:           [Select Category ▼]     │ │ │
│  │  │ Therapeutic Area:   [Optional ▼]            │ │ │
│  │  │ Manufacturer:       [Select ▼]              │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                      │ │
│  │  MEDIA & ATTACHMENTS                               │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │ Cover Image:                                 │ │ │
│  │  │ ┌──────────┐  [Select Image]                 │ │ │
│  │  │ │          │                                 │ │ │
│  │  │ │[Image]   │  Current: rinolac.jpg           │ │ │
│  │  │ │          │  [Clear]                        │ │ │
│  │  │ └──────────┘                                 │ │ │
│  │  │                                              │ │ │
│  │  │ Attachments:                                 │ │ │
│  │  │ ┌─────────────────────────────────────────┐  │ │ │
│  │  │ │ ☐ datasheet.pdf (2.5 MB)              │  │ │ │
│  │  │ │ ☐ clinical-study.pdf (5.2 MB)         │  │ │ │
│  │  │ │ ☐ safety-info.pdf (1.8 MB)            │  │ │ │
│  │  │ │                                        │  │ │ │
│  │  │ │ [+ Add Attachment]                     │  │ │ │
│  │  │ └─────────────────────────────────────────┘  │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                      │ │
│  │  ADVANCED DETAILS (if type = ADVANCED)             │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │ Storage Conditions:                          │ │ │
│  │  │ [_____________________________________]      │ │ │
│  │  │                                              │ │ │
│  │  │ Regulatory Info:                             │ │ │
│  │  │ [_____________________________________]      │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                      │ │
│  │  [← Cancel]  [Save Draft]  [Publish]               │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Product Form Components

| Component          | File                                       | Purpose                              |
| ------------------ | ------------------------------------------ | ------------------------------------ |
| Page Header        | `components/admin/page-header.tsx`         | Title and navigation                 |
| Language Tabs      | `components/admin/language-tabs.tsx`       | EN/AR content switching              |
| Text Inputs        | Inline                                     | Product name, storage conditions     |
| Rich Text Editor   | `components/admin/tiptap-editor.tsx`       | Description editing                  |
| Type Selector      | Inline                                     | SIMPLE or ADVANCED                   |
| Dropdowns          | Inline                                     | Status, category, area, manufacturer |
| Media Field        | `components/admin/media-field.tsx`         | Cover image selection                |
| Attachments Editor | `components/admin/dynamic-array-field.tsx` | Manage attachments                   |
| Action Buttons     | Inline                                     | Cancel, Save Draft, Publish          |

### Form Data Flow

```
1. User visits /admin/products/new or /admin/products/[id]/edit
   ↓
2. Form loads with either empty (create) or existing (edit) data
   ↓
3. User fills in bilingual content using tabs (EN/العربية)
   ↓
4. User selects type (SIMPLE/ADVANCED) - shows/hides fields
   ↓
5. User uploads or selects media
   ↓
6. User adds attachments using dynamic array field
   ↓
7. User clicks Save Draft or Publish
   ↓
8. Form validates with ProductFormSchema
   ↓
9. Server action called: createProduct() or updateProduct()
   ↓
10. Success: Notification and redirect to products list
    Error: Show error message in form
```

---

## PAGE MANAGEMENT

**Files**:

- [app/(admin)/admin/pages/page.tsx](<app/(admin)/admin/pages/page.tsx>) - List
- [app/(admin)/admin/pages/new/page.tsx](<app/(admin)/admin/pages/new/page.tsx>) - Create
- [app/(admin)/admin/pages/[id]/edit/page.tsx](<app/(admin)/admin/pages/[id]/edit/page.tsx>) - Edit

### Pages List Page

**Route**: `/admin/pages`

### Page Layout

```
┌──────────────────────────────────────────────────────────┐
│  PAGE HEADER (Breadcrumb: Pages)                        │
│  Pages                                                   │
│  Create and manage website pages with dynamic sections  │
│  [➕ New Page Button]                                    │
└──────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  SEARCH BAR                                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 🔍 Search by page name or slug...                  │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  PAGES TABLE                                               │
│  ┌─────┬──────────┬────────┬──────────┬──────┬─────────┐  │
│  │ □   │ Page     │ Slug   │ Status   │ Sec. │ Action  │  │
│  └─────┴──────────┴────────┴──────────┴──────┴─────────┘  │
│  │ ☐ │ Home     │ home   │ ✓ Pub    │ 8    │ Edit Del│  │
│  │ ☐ │ About    │ about  │ ✓ Pub    │ 5    │ Edit Del│  │
│  │ ☐ │ Services │ servic.│ ✗ Draft  │ 6    │ Edit Del│  │
│  │ ☐ │ Contact  │ contac.│ ✓ Pub    │ 0    │ Edit Del│  │
│  │ ☐ │ Partners │ partn..│ ✓ Pub    │ 4    │ Edit Del│  │
│  │ ☐ │ Compliance│compli..│ ✓ Pub   │ 7    │ Edit Del│  │
│  └────────────────────────────────────────────────────────┘
│
│  Results: All pages | [← Prev] [1 2 3] [Next →]
│
└────────────────────────────────────────────────────────────┘
```

### Page Editor Page

**Routes**:

- Create: `/admin/pages/new`
- Edit: `/admin/pages/[id]/edit`

### Page Layout

```
┌──────────────────────────────────────────────────────────┐
│  PAGE HEADER (Breadcrumb: Pages > Edit Home)            │
│  Edit Page: Home                                         │
│  [← Back]                                                │
└──────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  PAGE METADATA & SECTIONS EDITOR                           │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  PAGE INFO TABS: [EN] [العربية]                     │ │
│  │                                                      │ │
│  │  METADATA                                           │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │ Page Title:     [_____________________]        │ │ │
│  │  │ Page Slug:      [home] (auto-generated)        │ │ │
│  │  │ Meta Title:     [_____________________]        │ │ │
│  │  │ Meta Desc:      [_____________________]        │ │ │
│  │  │ Published:      [✓ Published / ☐ Draft]       │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                      │ │
│  │  SECTIONS EDITOR                                    │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │ Page Sections (Reorderable)                    │ │ │
│  │  │                                                 │ │ │
│  │  │ [1] ⋮⋮ HERO Section               [Edit] [Del] │ │ │
│  │  │         Title: "Welcome to Damira"             │ │ │
│  │  │         Subtitle: "Trusted, Healthy"           │ │ │
│  │  │                                                 │ │ │
│  │  │ [2] ⋮⋮ TEXT Section               [Edit] [Del] │ │ │
│  │  │         Company Introduction...                │ │ │
│  │  │                                                 │ │ │
│  │  │ [3] ⋮⋮ STATS Section              [Edit] [Del] │ │ │
│  │  │         50+ | 100+ | 15K+ | 35K+               │ │ │
│  │  │                                                 │ │ │
│  │  │ [4] ⋮⋮ FEATURES Section           [Edit] [Del] │ │ │
│  │  │         4 feature cards...                     │ │ │
│  │  │                                                 │ │ │
│  │  │ [5] ⋮⋮ IMAGE_TEXT Section         [Edit] [Del] │ │ │
│  │  │         Image + description...                 │ │ │
│  │  │                                                 │ │ │
│  │  │ [+ Add New Section ▼]                          │ │ │
│  │  │   [HERO] [TEXT] [CARDS] [STATS]                │ │ │
│  │  │   [FEATURES] [CTA] [IMAGE_TEXT]                │ │ │
│  │  │                                                 │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                      │ │
│  │  [← Cancel]  [Save Draft]  [Publish]               │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘

SECTION EDITOR MODAL (When clicking Edit on a section):
┌────────────────────────────────────────────────────────────┐
│  Edit HERO Section                              [X Close]  │
├────────────────────────────────────────────────────────────┤
│  LANGUAGE TABS: [EN] [العربية]                            │
│                                                            │
│  Section Type: HERO (Read-only)                          │
│                                                            │
│  Title (EN):                                              │
│  [_________________________________________]             │
│                                                            │
│  Subtitle (EN):                                           │
│  [_________________________________________]             │
│                                                            │
│  CTA Button Text:                                         │
│  [_________________________________________]             │
│                                                            │
│  CTA Button Link:                                         │
│  [_________________________________________]             │
│                                                            │
│  Background Image:                                        │
│  ┌──────────┐  [Select Image]                            │
│  │[Image]   │  [Clear]                                   │
│  └──────────┘                                            │
│                                                            │
│  [← Cancel]  [Update Section]                            │
└────────────────────────────────────────────────────────────┘
```

### Page Editor Components

| Component             | File                                 | Purpose                          |
| --------------------- | ------------------------------------ | -------------------------------- |
| Page Metadata         | Inline                               | Title, slug, meta tags           |
| Language Tabs         | `components/admin/language-tabs.tsx` | EN/AR switching                  |
| Sections List         | Inline                               | Reorderable sections             |
| Section Editor Modal  | Inline                               | Edit individual sections         |
| Section Type Selector | Inline                               | Add new section dropdown         |
| Individual Editors    | `sections/*.tsx`                     | Each section type has own editor |
| Action Buttons        | Inline                               | Cancel, Save, Publish            |

**Section Type Editors**:

- `hero-section-editor.tsx` - Hero/banner section
- `text-section-editor.tsx` - Rich text content
- `image-text-section-editor.tsx` - Image + text layout
- `stats-section-editor.tsx` - Statistics grid
- `features-section-editor.tsx` - Feature cards
- `cards-section-editor.tsx` - Card grid layout
- `cta-section-editor.tsx` - Call-to-action section

### Page Form Data Flow

```
1. User visits /admin/pages/[id]/edit
   ↓
2. Load page metadata and sections
   ↓
3. Display sections as reorderable list
   ↓
4. User edits page info (title, slug, meta tags)
   ↓
5. User edits sections:
   a. Select section from list
   b. Click [Edit] button
   c. Modal opens with section-specific editor
   d. Fill in bilingual content
   e. Click [Update Section]
   ↓
6. User can add new sections
   a. Click [+ Add New Section]
   b. Select section type
   c. Fill in initial data
   d. Section added to list
   ↓
7. User can reorder sections
   a. Drag sections using ⋮⋮ handle
   b. Or click move up/down buttons
   ↓
8. User publishes page
   a. Toggle "Published" checkbox
   b. Click [Publish]
   c. Validation runs
   d. Page saved and goes live
```

---

## MEDIA MANAGEMENT

**File**: [app/(admin)/admin/media/page.tsx](<app/(admin)/admin/media/page.tsx>)  
**Route**: `/admin/media`

### Page Layout

```
┌──────────────────────────────────────────────────────────┐
│  PAGE HEADER (Breadcrumb: Media)                        │
│  Media Library                                           │
│  Manage images, documents, and other media files        │
│  [⬆️ Upload Button]                                      │
└──────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  SEARCH & FILTER                                           │
│  ┌──────────────────────────────┐  ┌────────────────────┐ │
│  │ 🔍 Search files...           │  │ ▼ Filter by type   │ │
│  └──────────────────────────────┘  └────────────────────┘ │
│  [Storage used: 1.2 GB / 5 GB]                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  MEDIA GRID (Masonry Layout)                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │              │  │              │  │              │   │
│  │   [Image1]   │  │   [Image2]   │  │   [Image3]   │   │
│  │              │  │              │  │              │   │
│  │ rinolac.jpg  │  │ rinolac-2.jpg│  │ about-hero.  │   │
│  │ 2.5 MB       │  │ 1.8 MB       │  │ 3.2 MB       │   │
│  │ 1920×1080    │  │ 1920×1080    │  │ 1920×1080    │   │
│  │              │  │              │  │              │   │
│  │ ☐ [view] [✎] │  │ ☐ [view] [✎] │  │ ☐ [view] [✎] │   │
│  │ [⋯ Delete]   │  │ [⋯ Delete]   │  │ [⋯ Delete]   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   [File]     │  │              │  │              │   │
│  │ datasheet.pdf│  │   [Image4]   │  │   [Image5]   │   │
│  │ 2.5 MB       │  │              │  │              │   │
│  │ PDF          │  │ services-bg. │  │ product-3.   │   │
│  │              │  │ 1.5 MB       │  │ 4.2 MB       │   │
│  │ ☐ [view] [✎] │  │ 2048×1080    │  │ 1920×1080    │   │
│  │ [⋯ Delete]   │  │              │  │              │   │
│  │              │  │ ☐ [view] [✎] │  │ ☐ [view] [✎] │   │
│  │              │  │ [⋯ Delete]   │  │ [⋯ Delete]   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                            │
│  [← Prev] [1 2 3 4 5] [Next →]  Showing 15 of 342        │
│                                                            │
└────────────────────────────────────────────────────────────┘

UPLOAD DIALOG (Modal):
┌────────────────────────────────────────────────────────────┐
│  Upload Media Files                            [X Close]   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │                                                │ │ │
│  │  │    ↓ DRAG & DROP FILES HERE ↓                 │ │ │
│  │  │    or click to select files                   │ │ │
│  │  │                                                │ │ │
│  │  │    Supported: JPG, PNG, PDF, etc.             │ │ │
│  │  │    Max 50 MB per file                         │ │ │
│  │  │                                                │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                      │ │
│  │  Uploading:                                          │ │
│  │  ☒ photo1.jpg (2.3 MB) ▓▓▓▓▓▓▓░░░░░ 70%           │ │
│  │  ☒ photo2.png (1.8 MB) ▓▓▓▓▓▓▓▓▓▓▓ 100% ✓          │ │
│  │  ☒ document.pdf (3.1 MB) ▓░░░░░░░░░░ 10%           │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [Cancel] [Upload]                                       │
└────────────────────────────────────────────────────────────┘
```

### Media Management Components

| Component       | File                               | Purpose                  |
| --------------- | ---------------------------------- | ------------------------ |
| Page Header     | `components/admin/page-header.tsx` | Title and upload button  |
| Search Box      | Inline                             | Search media by filename |
| Filter Dropdown | Inline                             | Filter by type           |
| Media Grid      | `media/media-library-client.tsx`   | Masonry grid layout      |
| Media Card      | `media/media-card.tsx`             | Individual file card     |
| Upload Dialog   | `media/upload-dialog.tsx`          | File upload interface    |
| Pagination      | Inline                             | Page navigation          |

### Media Card Actions

Each media card shows:

- Thumbnail preview
- Filename and size
- Dimensions (for images)
- Selection checkbox
- View button (opens in new tab)
- Edit button (edit filename)
- Delete button (remove file)

---

## FORM SUBMISSIONS

**Files**:

- [app/(admin)/admin/forms/page.tsx](<app/(admin)/admin/forms/page.tsx>) - List
- [app/(admin)/admin/forms/[id]/page.tsx](<app/(admin)/admin/forms/[id]/page.tsx>) - Detail

### Forms List Page

**Route**: `/admin/forms`

### Page Layout

```
┌──────────────────────────────────────────────────────────┐
│  PAGE HEADER (Breadcrumb: Forms)                        │
│  Form Submissions                                        │
│  Manage and track form submissions from website         │
└──────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  FILTER & SEARCH                                           │
│  ┌────────────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ 🔍 Search name/email│  │ ▼ Type       │  │ ▼ Status   │ │
│  └────────────────────┘  └──────────────┘  └────────────┘ │
│                                                            │
│  From: [Date] To: [Date]  [🔄 Reset Filters]             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  SUBMISSIONS TABLE                                         │
│  ┌──────┬────────┬──────┬────────┬──────────┬────────────┐ │
│  │ Type │ Name   │Email │ Status │ Received │ Action    │ │
│  └──────┴────────┴──────┴────────┴──────────┴────────────┘ │
│  │Contact│ John D │john@.│ New    │ Today   │ [View] [✎] │
│  │Contact│ Sarah A│sarah@│Reviewed│Today   │ [View] [✎] │
│  │Partner│ LLC Co │info@ │ New    │Yesterday│ [View] [✎] │
│  │Product│ Ahmed M│ahmed@│ New    │Yesterday│ [View] [✎] │
│  │Contact│ Mike T │mike@ │Archived│ 2 days ago│[View] [✎]│
│  │Contact│ Lisa F │lisa@ │ New    │ 3 days ago│[View] [✎]│
│  │Partner│ Int Co │cont@ │Reviewed│ 3 days ago│[View] [✎]│
│  │Contact│ Bob S  │bob@  │Archived│ 5 days ago│[View] [✎]│
│  └────────────────────────────────────────────────────────┘
│
│  Results: 1-8 of 156 | [← Prev] [1 2 3 ...] [Next →]
│
└────────────────────────────────────────────────────────────┘
```

### Form Detail Page

**Route**: `/admin/forms/[id]`

### Page Layout

```
┌──────────────────────────────────────────────────────────┐
│  PAGE HEADER (Breadcrumb: Forms > Submission #123)       │
│  Contact Form Submission                                 │
│  [← Back]                                                │
└──────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  SUBMISSION DETAILS                                        │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  STATUS: [New ▼] [Reviewed ▼] [Archived ▼]         │ │
│  │  (Update status dropdown)                           │ │
│  │                                                      │ │
│  │  ────────────────────────────────────────────────   │ │
│  │                                                      │ │
│  │  Type:      CONTACT                                 │ │
│  │  Received:  April 13, 2025 at 2:34 PM              │ │
│  │  ID:        67a8f4c2d1e9b2c3...                    │ │
│  │                                                      │ │
│  │  ────────────────────────────────────────────────   │ │
│  │                                                      │ │
│  │  SUBMISSION DATA:                                   │ │
│  │                                                      │ │
│  │  Name:      John Smith                             │ │
│  │  Email:     john.smith@example.com                 │ │
│  │  Phone:     +1 (555) 123-4567                      │ │
│  │                                                      │ │
│  │  Message:                                           │ │
│  │  ─────────────────────────────────────────────     │ │
│  │  Hello, I am interested in learning more about     │ │
│  │  your product portfolio. Could you please send     │ │
│  │  me more information about your oncology and       │ │
│  │  critical care solutions?                          │ │
│  │                                                   │ │
│  │  Thank you,                                         │ │
│  │  John Smith                                         │ │
│  │  ─────────────────────────────────────────────     │ │
│  │                                                      │ │
│  │  ────────────────────────────────────────────────   │ │
│  │                                                      │ │
│  │  ACTIONS:                                           │ │
│  │  [📧 Reply] [📋 Copy] [🗑️ Delete] [📤 Export]     │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Form Components

| Component         | File                                | Purpose                       |
| ----------------- | ----------------------------------- | ----------------------------- |
| Page Header       | `components/admin/page-header.tsx`  | Title                         |
| Filter/Search     | Inline                              | Filter and search submissions |
| Submissions Table | `forms/forms-table-client.tsx`      | Data grid                     |
| Status Dropdown   | Inline                              | Change submission status      |
| Submission Detail | `forms/[id]/form-detail-client.tsx` | Full submission view          |
| Action Buttons    | Inline                              | Reply, copy, delete, export   |

---

## USER MANAGEMENT

**Files**:

- [app/(admin)/admin/users/page.tsx](<app/(admin)/admin/users/page.tsx>) - List
- [app/(admin)/admin/users/new/page.tsx](<app/(admin)/admin/users/new/page.tsx>) - Create
- [app/(admin)/admin/users/[id]/edit/page.tsx](<app/(admin)/admin/users/[id]/edit/page.tsx>) - Edit
- [app/(admin)/admin/users/profile/page.tsx](<app/(admin)/admin/users/profile/page.tsx>) - Profile

### Users List Page

**Route**: `/admin/users`

### Page Layout

```
┌──────────────────────────────────────────────────────────┐
│  PAGE HEADER (Breadcrumb: Users)                        │
│  Admin Users                                             │
│  Manage admin and internal user accounts                │
│  [➕ New User Button]                                    │
└──────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  SEARCH                                                    │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🔍 Search by name or email...                       │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  USERS TABLE                                               │
│  ┌──────┬──────────┬──────────────┬────────┬──────────────┐│
│  │ Name │ Email    │ Role         │ Created│ Action      ││
│  └──────┴──────────┴──────────────┴────────┴──────────────┘│
│  │ Admin│ admin@.. │ ADMIN        │ Jan 1 │ [Edit] [Del] ││
│  │ John │ john@..  │ INTERNAL_USR │ Apr 5 │ [Edit] [Del] ││
│  │ Sarah│ sarah@.. │ INTERNAL_USR │ Apr 8 │ [Edit] [Del] ││
│  │ Mike │ mike@..  │ ADMIN        │ Mar 12│ [Edit] [Del] ││
│  │ Lisa │ lisa@..  │ INTERNAL_USR │ Apr 10│ [Edit] [Del] ││
│  └────────────────────────────────────────────────────────┘
│
│  Results: All 5 users
│
└────────────────────────────────────────────────────────────┘
```

### User Form Page

**Routes**:

- Create: `/admin/users/new`
- Edit: `/admin/users/[id]/edit`

### Page Layout

```
┌──────────────────────────────────────────────────────────┐
│  PAGE HEADER (Breadcrumb: Users > New/Edit)              │
│  Create / Edit User                                       │
│  [← Back]                                                │
└──────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  USER FORM                                                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  ACCOUNT INFORMATION                               │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │ Full Name:                                     │ │ │
│  │  │ [_______________________________]              │ │ │
│  │  │                                                │ │ │
│  │  │ Email Address:                                 │ │ │
│  │  │ [_______________________________]              │ │ │
│  │  │                                                │ │ │
│  │  │ Role:                                          │ │ │
│  │  │ [ADMIN ▼]                                      │ │ │
│  │  │ Options: ADMIN, INTERNAL_USER                 │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                      │ │
│  │  PASSWORD                                           │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │ Password:                                      │ │ │
│  │  │ [_______________________________]              │ │ │
│  │  │ (Required for new users)                       │ │ │
│  │  │ (Leave blank to keep current for edit)         │ │ │
│  │  │                                                │ │ │
│  │  │ Confirm Password:                              │ │ │
│  │  │ [_______________________________]              │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                      │ │
│  │  [← Cancel]  [Save User]                           │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### My Profile Page

**Route**: `/admin/users/profile`

### Page Layout

```
┌──────────────────────────────────────────────────────────┐
│  PAGE HEADER (Breadcrumb: Profile)                      │
│  My Profile                                              │
│  [← Back]                                                │
└──────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  PROFILE INFORMATION                                       │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  MY ACCOUNT                                         │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │ Name:       John Smith                         │ │ │
│  │  │ Email:      john@admin.com                     │ │ │
│  │  │ Role:       ADMIN                              │ │ │
│  │  │ Member Since: January 1, 2025                  │ │ │
│  │  │ Last Login:  Today at 10:30 AM                 │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                      │ │
│  │  CHANGE PASSWORD                                   │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │ Current Password:                              │ │ │
│  │  │ [_______________________________]              │ │ │
│  │  │                                                │ │ │
│  │  │ New Password:                                  │ │ │
│  │  │ [_______________________________]              │ │ │
│  │  │                                                │ │ │
│  │  │ Confirm New Password:                          │ │ │
│  │  │ [_______________________________]              │ │ │
│  │  │                                                │ │ │
│  │  │ [Change Password]                              │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### User Components

| Component    | File                               | Purpose          |
| ------------ | ---------------------------------- | ---------------- |
| Page Header  | `components/admin/page-header.tsx` | Title            |
| Users Table  | `users/users-table-client.tsx`     | User list grid   |
| User Form    | `users/user-form-client.tsx`       | Create/edit form |
| Profile Page | Inline                             | View own profile |

---

## SETTINGS & CONFIGURATION

**File**: [app/(admin)/admin/settings/page.tsx](<app/(admin)/admin/settings/page.tsx>)  
**Route**: `/admin/settings`

### Page Layout

```
┌──────────────────────────────────────────────────────────┐
│  PAGE HEADER (Breadcrumb: Settings)                     │
│  Settings & Configuration                               │
│  Manage site settings, categories, and more             │
└──────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  SETTINGS TABS                                             │
│  [Categories] [Therapeutic Areas] [Manufacturers]        │
│  [Site Settings]                                          │
└────────────────────────────────────────────────────────────┘

TAB 1: CATEGORIES
┌────────────────────────────────────────────────────────────┐
│  CATEGORIES MANAGEMENT                                     │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  CATEGORY LIST & EDITOR                            │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │ Categories:                                    │ │ │
│  │  │ • Pain Relief      [Edit] [Delete]             │ │ │
│  │  │ • Nutrition        [Edit] [Delete]             │ │ │
│  │  │ • Critical Care    [Edit] [Delete]             │ │ │
│  │  │ • Oncology         [Edit] [Delete]             │ │ │
│  │  │ • Pediatrics       [Edit] [Delete]             │ │ │
│  │  │                                                │ │ │
│  │  │ [+ Add New Category]                           │ │ │
│  │  │                                                │ │ │
│  │  │ Category Name: [____________]                  │ │ │
│  │  │ [Save] [Cancel]                                │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘

TAB 2: THERAPEUTIC AREAS
┌────────────────────────────────────────────────────────────┐
│  THERAPEUTIC AREAS MANAGEMENT                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  AREAS LIST & EDITOR                              │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │ Therapeutic Areas:                             │ │ │
│  │  │ • Oncology         [Edit] [Delete]             │ │ │
│  │  │ • Critical Care    [Edit] [Delete]             │ │ │
│  │  │ • Nutrition        [Edit] [Delete]             │ │ │
│  │  │ • Pediatrics       [Edit] [Delete]             │ │ │
│  │  │ • Diagnostics      [Edit] [Delete]             │ │ │
│  │  │                                                │ │ │
│  │  │ [+ Add New Area]                               │ │ │
│  │  │                                                │ │ │
│  │  │ Area Name: [____________]                      │ │ │
│  │  │ [Save] [Cancel]                                │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘

TAB 3: MANUFACTURERS
┌────────────────────────────────────────────────────────────┐
│  MANUFACTURERS MANAGEMENT                                  │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  MANUFACTURERS LIST & EDITOR                       │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │ Manufacturers:                                 │ │ │
│  │  │ • Fonterra          [Edit] [Delete]            │ │ │
│  │  │ • Tayseer Arar      [Edit] [Delete]            │ │ │
│  │  │ • Ausnutria         [Edit] [Delete]            │ │ │
│  │  │                                                │ │ │
│  │  │ [+ Add New Manufacturer]                       │ │ │
│  │  │                                                │ │ │
│  │  │ Manufacturer Name: [____________]              │ │ │
│  │  │ [Save] [Cancel]                                │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘

TAB 4: SITE SETTINGS
┌────────────────────────────────────────────────────────────┐
│  SITE-WIDE SETTINGS                                        │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  General Settings                                   │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │ Site Name: [_____________________________]     │ │ │
│  │  │ Site URL:  [_____________________________]     │ │ │
│  │  │ Contact Email: [_____________________________]│ │ │
│  │  │ Support Phone: [_____________________________]│ │ │
│  │  │ Address: [_____________________________]      │ │ │
│  │  │                                              │ │ │
│  │  │ [Save Settings]                              │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Settings Components

| Component            | File                                      | Purpose                    |
| -------------------- | ----------------------------------------- | -------------------------- |
| Page Header          | `components/admin/page-header.tsx`        | Title                      |
| Tabbed Interface     | Inline                                    | Switch between sections    |
| Category Manager     | `settings/settings-management-client.tsx` | CRUD for categories        |
| Area Manager         | `settings/settings-management-client.tsx` | CRUD for therapeutic areas |
| Manufacturer Manager | `settings/settings-management-client.tsx` | CRUD for manufacturers     |
| Site Settings        | `settings/settings-management-client.tsx` | Site configuration         |

---

## SHARED ADMIN COMPONENTS

### Admin Header

**File**: `components/admin/admin-header.tsx`

```
┌─────────────────────────────────────────────────────────┐
│ [≡] [⌘K] Breadcrumbs > Current Page  [🔔] [👤 Admin ▼] │
└─────────────────────────────────────────────────────────┘
```

Features:

- Sidebar toggle (mobile)
- Command palette trigger
- Dynamic breadcrumbs
- Notification bell
- User dropdown menu

### Admin Sidebar

**File**: `components/admin/admin-sidebar.tsx`

```
┌──────────────────────┐
│ [Logo/Brand]         │
│                      │
│ 🏠 Dashboard         │
│ 📦 Products          │
│ 📄 Pages             │
│ 🖼️ Media             │
│ 📋 Forms             │
│ ⚙️ Settings          │
│ 👥 Users             │
│                      │
│ ────────────────     │
│                      │
│ [👤 Profile] [Logout]│
│                      │
└──────────────────────┘
```

Features:

- Sticky/collapsible
- Active route highlighting
- Icons and labels
- User profile section
- Bottom navigation

### Breadcrumb Navigation

**File**: `components/admin/breadcrumbs.tsx`

Generates breadcrumbs from URL pathname:

- Home → Dashboard
- Products → Products list
- Products → (Create) → Create new product
- Products → (Edit) → Edit product
- etc.

### Language Support

All admin forms support bilingual content editing with tabs:

- [EN] English (LTR)
- [العربية] Arabic (RTL)

---

## DEVELOPMENT NOTES

### Common UI Patterns

**Loading States**:

- Use skeleton placeholders
- Smooth fade-in transitions
- Don't show content until loaded

**Error Handling**:

- Toast notifications for actions
- Inline field validation messages
- Form-level error summaries

**Responsive Design**:

- Desktop: Full sidebar visible
- Tablet: Collapsible sidebar
- Mobile: Hamburger menu with overlay

**Accessibility**:

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators

### Adding New Admin Pages

1. Create folder under `/admin/` with page name
2. Create `page.tsx` (server component)
3. Create client components with `'use client'` directive
4. Add server action in `/lib/actions/` if needed
5. Add validation schema in `/lib/schemas/` if needed
6. Add navigation item in sidebar
7. Ensure role-based access control

### Form Submission Pattern

```
1. User fills form
2. onClick → Client component state update
3. Submit → Server action called
4. Server validates with Zod schema
5. Database operation
6. Return { success?, error?, data? }
7. Client shows toast notification
8. Redirect or update state
```

### Data Fetching

All admin pages use server components for initial data load:

```typescript
export default async function AdminPage() {
  // Server-side fetch
  const data = await fetchData();
  return <ClientComponent initialData={data} />;
}
```

Client components handle interactions and re-fetching via server actions.

---

## DEPLOYMENT & SECURITY

### Admin Access Control

- All `/admin/*` routes require authentication
- Middleware redirects unauthenticated users to `/admin/login`
- Role-based access control via `requireRole()` checks
- ADMIN role required for most operations

### Environment Variables

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://yourdomain.com
```

### CORS & Security

- Server actions automatically handle CSRF
- Session timeouts after 30 days
- Password hashing with bcrypt
- Type-safe database queries with Prisma
