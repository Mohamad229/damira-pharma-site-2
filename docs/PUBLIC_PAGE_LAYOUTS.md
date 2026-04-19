# Damira Pharma - Public Website Page Layouts

**Purpose**: Visual reference guide showing the structure, layout, and components on each public page. Use this to understand page composition and edit sections individually.

**Last Updated**: 2025  
**Stack**: Next.js 16 + React 19  
**Frameworks**: Tailwind CSS 4, Shadcn UI, Tiptap Editor

---

## TABLE OF CONTENTS

1. [Layout Structure Overview](#layout-structure-overview)
2. [Homepage](#homepage)
3. [Product Catalog](#product-catalog)
4. [Product Detail](#product-detail)
5. [Contact Page](#contact-page)
6. [About Page](#about-page)
7. [Services Page](#services-page)
8. [Partnerships Page](#partnerships-page)
9. [Compliance Page](#compliance-page)
10. [404 Not Found Page](#404-not-found-page)
11. [Section Component Types](#section-component-types)
12. [Shared Components](#shared-components)
13. [Development Notes](#development-notes)

---

## LAYOUT STRUCTURE OVERVIEW

### Global Page Template

All public pages follow this structure:

```
┌─────────────────────────────────────────────────────────┐
│                    SITE HEADER                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Logo | Nav Menu | Language Switcher | Mobile Menu│  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                    [MAIN CONTENT]
                    [Page Specific]
                    [Dynamic Sections]
                           │
┌─────────────────────────────────────────────────────────┐
│                    SITE FOOTER                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Quick Links | Company Info | Copyright          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### File Structure

**Layout Hierarchy**:

- [app/(public)/[locale]/layout.tsx](<app/(public)/[locale]/layout.tsx>) - Root public layout
  - Renders SiteHeader
  - Renders children (page content)
  - Renders SiteFooter
  - Applies locale/RTL settings

**Navigation Structure**:

- Home → `/[locale]/`
- Products → `/[locale]/products`
- Product Detail → `/[locale]/products/[slug]`
- Contact → `/[locale]/contact`
- About → `/[locale]/about`
- Services → `/[locale]/services`
- Partnerships → `/[locale]/partnerships`
- Compliance → `/[locale]/compliance`
- 404 → `/[locale]/not-found`

---

## HOMEPAGE

**File**: [app/(public)/[locale]/page.tsx](<app/(public)/[locale]/page.tsx>)  
**Route**: `/[locale]/`  
**Dynamic Content**: Yes (fetches from database or fallback)

### Page Layout

```
┌─────────────────────────────────────────────────┐
│            SITE HEADER (Fixed/Sticky)           │
│  Logo | Products | About | Services | Contact   │
│                    [Language EN/AR]              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│                  HERO SECTION                    │
│  (Title, Subtitle, CTA Button)                  │
│  ┌─────────────────────────────────────────────┐│
│  │  [HERO IMAGE]                               ││
│  │  "Welcome to Damira Pharma"                 ││
│  │  "Trusted, Healthy"                         ││
│  │  [CTA Button: "Explore Products"]           ││
│  └─────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘

SCROLL REVEAL ANIMATION ↓

┌─────────────────────────────────────────────────┐
│               TEXT SECTION 1                     │
│  (Company Introduction)                         │
│  ┌─────────────────────────────────────────────┐│
│  │ "Supporting healthcare excellence in Syria" ││
│  │                                              ││
│  │ Lorem ipsum dolor sit amet...                ││
│  │ [Rich text content from Tiptap]             ││
│  └─────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘

SCROLL REVEAL ANIMATION ↓

┌─────────────────────────────────────────────────┐
│            STATS SECTION (Grid)                  │
│  ┌──────────────┐  ┌──────────────┐  ...        │
│  │ 50+ Years    │  │ 100+ Centers │             │
│  │ Group Legacy │  │ Nationwide   │             │
│  └──────────────┘  └──────────────┘             │
│  ┌──────────────┐  ┌──────────────┐             │
│  │ 15,000+      │  │ 35,000+      │             │
│  │ Pharmacies   │  │ Points of Sale              │
│  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ANIMATION ↓

┌─────────────────────────────────────────────────┐
│           FEATURES SECTION (Cards)               │
│  ┌──────────────┐  ┌──────────────┐  ...        │
│  │ ⭐ Feature 1 │  │ ⭐ Feature 2 │             │
│  │ Description  │  │ Description  │             │
│  └──────────────┘  └──────────────┘             │
│     3-4 feature cards in grid                    │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ANIMATION ↓

┌─────────────────────────────────────────────────┐
│         IMAGE_TEXT SECTION (Alternating)         │
│  ┌─────────┐  "Title"                           │
│  │         │  Description text                  │
│  │ [Image] │  • Bullet point 1                  │
│  │         │  • Bullet point 2                  │
│  └─────────┘  • Bullet point 3                  │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ANIMATION ↓

┌─────────────────────────────────────────────────┐
│              CTA SECTION                         │
│  "Ready to Partner With Us?"                    │
│  "Let's build the future of healthcare"        │
│  [Primary Button: "Get Started"]                │
│  [Secondary Button: "Learn More"]               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            SITE FOOTER (Sticky)                  │
│  Quick Links | Company Info | Social            │
│  © 2025 Damira Pharma All Rights Reserved       │
└─────────────────────────────────────────────────┘
```

### Homepage Components Breakdown

| Component      | File                                  | Purpose                      |
| -------------- | ------------------------------------- | ---------------------------- |
| Header         | `components/public/site-header.tsx`   | Navigation and logo          |
| Hero Section   | Dynamic from DB                       | Title, subtitle, image, CTA  |
| Text Content   | Dynamic from DB                       | Rich text description        |
| Stats Grid     | Dynamic from DB                       | Key metrics (50+, 100+, etc) |
| Features Cards | Dynamic from DB                       | Feature highlights           |
| Image Text     | Dynamic from DB                       | Image beside description     |
| CTA Block      | Dynamic from DB                       | Call-to-action section       |
| Footer         | `components/public/site-footer.tsx`   | Links and copyright          |
| Scroll Reveal  | `components/public/scroll-reveal.tsx` | Fade-in animations           |

### Data Flow

```
1. [app/(public)/[locale]/page.tsx]
   ↓ (server component)
2. generateMetadata() - SEO metadata
   ↓
3. Fetch page with slug "home" from database
   ↓
4. If published: Use database content
   If not published: Use fallback from lib/public-page-fallbacks.ts
   ↓
5. Map through sections array
   ↓
6. For each section: <SectionRenderer section={section} />
   ↓
7. Render: Header → Sections → Footer
```

### Editable Sections

To edit individual homepage sections in the admin:

1. Navigate to **Admin Dashboard** → **Pages** → **Home**
2. Choose **English** or **العربية** language tab
3. Edit sections:
   - **HERO**: Title, subtitle, image, button text
   - **TEXT**: Use Tiptap editor for rich text
   - **STATS**: Edit values and labels
   - **FEATURES**: Add/remove/edit feature cards
   - **IMAGE_TEXT**: Choose image, edit text
   - **CTA**: Edit title, description, buttons

---

## PRODUCT CATALOG

**File**: [app/(public)/[locale]/products/page.tsx](<app/(public)/[locale]/products/page.tsx>)  
**Route**: `/[locale]/products`  
**Dynamic Content**: Yes (fetches published products from database)

### Page Layout

```
┌─────────────────────────────────────────────────┐
│            SITE HEADER                          │
│  Logo | Products | About | Services | Contact   │
│              [Language EN/AR]                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            PAGE TITLE SECTION                    │
│  "Our Product Portfolio"                        │
│  "Discover our comprehensive range of products" │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ LEFT SIDEBAR              │        MAIN CONTENT AREA        │
│ (Filters)                 │   (Product Grid)               │
├──────────────────────────┤────────────────────────────────┤
│                          │                                │
│ SEARCH BOX               │  ┌────────────┐ ┌────────────┐ │
│ ┌──────────────────────┐ │  │ Product 1  │ │ Product 2  │ │
│ │ [🔍 Search...      ] │ │  │            │ │            │ │
│ └──────────────────────┘ │  │ Available  │ │ Available  │ │
│                          │  └────────────┘ └────────────┘ │
│ CATEGORY FILTER          │                                │
│ ┌──────────────────────┐ │  ┌────────────┐ ┌────────────┐ │
│ │ ▼ Select Category... │ │  │ Product 3  │ │ Product 4  │ │
│ │  □ Pain Relief       │ │  │            │ │            │ │
│ │  □ Nutrition         │ │  │ Available  │ │ Pipeline   │ │
│ │  □ Critical Care     │ │  └────────────┘ └────────────┘ │
│ └──────────────────────┘ │                                │
│                          │  ┌────────────┐ ┌────────────┐ │
│ THERAPEUTIC AREA         │  │ Product 5  │ │ Product 6  │ │
│ ┌──────────────────────┐ │  │            │ │            │ │
│ │ ▼ Select Area...     │ │  │ Available  │ │ Available  │ │
│ │  □ Oncology          │ │  └────────────┘ └────────────┘ │
│ │  □ Pediatrics        │ │                                │
│ │  □ ICU               │ │  [Page 1 of 5]                 │
│ └──────────────────────┘ │  [← Previous | Next →]         │
│                          │                                │
│ STATUS FILTER            │                                │
│ ┌──────────────────────┐ │                                │
│ │ ○ Available Only     │ │                                │
│ │ ○ Pipeline Only      │ │                                │
│ │ ○ Show All           │ │                                │
│ └──────────────────────┘ │                                │
│                          │                                │
│ SORT OPTIONS             │                                │
│ ┌──────────────────────┐ │                                │
│ │ ▼ Sort By:           │ │                                │
│ │  • Newest First      │ │                                │
│ │  • Name (A→Z)        │ │                                │
│ │  • Name (Z→A)        │ │                                │
│ └──────────────────────┘ │                                │
│                          │                                │
└──────────────────────────┴────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            SITE FOOTER                          │
│  Quick Links | Company Info | Social            │
└─────────────────────────────────────────────────┘
```

### Product Catalog Components

| Component         | File                                                | Purpose                      |
| ----------------- | --------------------------------------------------- | ---------------------------- |
| Header            | `components/public/site-header.tsx`                 | Navigation                   |
| Search Box        | `components/public/products/catalog-controls.tsx`   | Free text search             |
| Category Filter   | `components/public/products/catalog-controls.tsx`   | Filter by category           |
| Area Filter       | `components/public/products/catalog-controls.tsx`   | Filter by therapeutic area   |
| Status Filter     | `components/public/products/catalog-controls.tsx`   | Filter by availability       |
| Sort Dropdown     | `components/public/products/catalog-controls.tsx`   | Sort options                 |
| Product Card Grid | `components/public/products/product-card.tsx`       | Grid layout (3 cols desktop) |
| Pagination        | `components/public/products/product-pagination.tsx` | Page navigation              |
| Footer            | `components/public/site-footer.tsx`                 | Footer                       |

### Product Card Structure

```
┌─────────────────────────────────┐
│                                 │
│  [PRODUCT IMAGE]                │
│  (Cover image, 3:2 aspect)      │
│                                 │
├─────────────────────────────────┤
│ Product Name                    │
│ Category Badge                  │
│ Status Badge (Available/Pipeline)│
│                                 │
│ [View Details →]                │
└─────────────────────────────────┘
```

### Data Flow

```
1. [app/(public)/[locale]/products/page.tsx]
   ↓ (server component)
2. Parse URL query params (category, search, page)
   ↓
3. Fetch published products from database
   ↓
4. Apply filters:
   - Search by name
   - Filter by category
   - Filter by therapeutic area
   - Filter by status
   ↓
5. Sort results
   ↓
6. Paginate (e.g., 12 per page)
   ↓
7. Render: Header → Filters + Grid → Pagination → Footer
```

### URL Parameters

```
/en/products?category=pain-relief&area=pediatrics&search=ibuprofen&status=available&sort=name&page=1

Parameters:
- category: Product category slug
- area: Therapeutic area slug
- search: Free text search
- status: "available" | "pipeline" | "all"
- sort: "newest" | "name_asc" | "name_desc"
- page: Page number (1-based)
```

### Editable Elements

In the **Admin Dashboard** → **Products**:

1. **Add/Edit Product**:
   - Name (EN/AR)
   - Description (EN/AR)
   - Category (dropdown)
   - Therapeutic Area (dropdown)
   - Cover Image
   - Attachments
   - Status (Available/Pipeline)
   - Publish toggle

2. **Manage Categories**:
   - Admin → Settings → Categories

3. **Manage Therapeutic Areas**:
   - Admin → Settings → Therapeutic Areas

---

## PRODUCT DETAIL

**File**: [app/(public)/[locale]/products/[slug]/page.tsx](<app/(public)/[locale]/products/[slug]/page.tsx>)  
**Route**: `/[locale]/products/[slug]` (e.g., `/en/products/rinolac`)  
**Dynamic Content**: Yes (fetches specific product)

### Page Layout

```
┌─────────────────────────────────────────────────┐
│            SITE HEADER                          │
│  Logo | Products | About | Services | Contact   │
│              [Language EN/AR]                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│         HERO/PRODUCT HEADER SECTION              │
│  ┌──────────────────────────────────────────┐  │
│  │                                          │  │
│  │        [LARGE PRODUCT IMAGE]             │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐│
│  │ Product Name                              ││
│  │ Status: [Available | Pipeline]            ││
│  │ Category: Pain Relief                     ││
│  │ Therapeutic Area: Pediatrics              ││
│  └────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│         PRODUCT DETAILS SECTION                  │
│ ┌──────────────────────────────────────────┐   │
│ │ DESCRIPTION                              │   │
│ │ ────────────────────────────────────────  │   │
│ │                                          │   │
│ │ Lorem ipsum dolor sit amet, consectetur │   │
│ │ adipiscing elit. [Rich text content]    │   │
│ │                                          │   │
│ └──────────────────────────────────────────┘   │
│                                                 │
│ ┌──────────────────────────────────────────┐   │
│ │ SPECIFICATIONS                           │   │
│ │ ────────────────────────────────────────  │   │
│ │ • Manufacturer: [Company Name]           │   │
│ │ • Category: [Category]                   │   │
│ │ • Therapeutic Area: [Area]               │   │
│ │ • Available Since: [Year]                │   │
│ └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│          ATTACHMENTS SECTION                     │
│  "Documentation & Resources"                    │
│  ┌──────────────┐  ┌──────────────┐  ...      │
│  │ 📄 Datasheet │  │ 📄 Product   │          │
│  │ PDF 2.5 MB   │  │ Info Sheet   │          │
│  │ [Download]   │  │ [Download]   │          │
│  └──────────────┘  └──────────────┘          │
│                                               │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ 📄 Safety    │  │ 📄 Clinical  │          │
│  │ Data Sheet   │  │ Studies      │          │
│  │ [Download]   │  │ [Download]   │          │
│  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│       RELATED PRODUCTS SECTION                   │
│  "Similar Products in [Category]"              │
│  ┌──────────────┐  ┌──────────────┐  ...      │
│  │ Related Prod │  │ Related Prod │          │
│  │ 1            │  │ 2            │          │
│  │ [View] →     │  │ [View] →     │          │
│  └──────────────┘  └──────────────┘          │
│                                               │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ Related Prod │  │ Related Prod │          │
│  │ 3            │  │ 4            │          │
│  │ [View] →     │  │ [View] →     │          │
│  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│       PRODUCT INQUIRY FORM                       │
│  "Have questions about this product?"           │
│  Let's connect.                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Name: [___________________]              │  │
│  │ Email: [__________________]              │  │
│  │ Phone: [__________________]              │  │
│  │ Subject: [_________________]             │  │
│  │ Message: [___________________]           │  │
│  │                                          │  │
│  │ [Submit Inquiry] → Success Message      │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            SITE FOOTER                          │
│  Quick Links | Company Info | Social            │
└─────────────────────────────────────────────────┘
```

### Product Detail Components

| Component            | File                                              | Purpose                            |
| -------------------- | ------------------------------------------------- | ---------------------------------- |
| Header               | `components/public/site-header.tsx`               | Navigation                         |
| Product Image Header | Inline                                            | Large product image display        |
| Product Meta         | Inline                                            | Name, status, category, area       |
| Description          | Inline                                            | Rich text product description      |
| Specifications       | Inline                                            | Product details metadata           |
| Attachments Grid     | Inline                                            | Downloadable documents/files       |
| Related Products     | `components/public/products/product-card.tsx`     | Similar products carousel          |
| Inquiry Form         | `components/public/forms/public-inquiry-form.tsx` | Contact form for product inquiries |
| Footer               | `components/public/site-footer.tsx`               | Footer                             |

### Data Flow

```
1. [app/(public)/[locale]/products/[slug]/page.tsx]
   ↓ (server component)
2. Extract slug from params
   ↓
3. Fetch published product by slug
   ↓
4. If not published: Return 404
   ↓
5. Generate SEO metadata (name, description, image)
   ↓
6. Fetch related products (same category or area)
   ↓
7. Render:
   - Header
   - Product details
   - Description
   - Attachments
   - Related products
   - Inquiry form
   - Footer
```

### Editable Elements

In the **Admin Dashboard** → **Products** → **Edit Product**:

1. **Product Information**:
   - Name (EN/AR)
   - Description (EN/AR, use Tiptap editor)
   - Category
   - Therapeutic Area
   - Manufacturer

2. **Media**:
   - Cover image
   - Multiple attachments (PDF, etc.)

3. **Related Products**:
   - Auto-populated by category/area
   - Or manually selected

---

## CONTACT PAGE

**File**: [app/(public)/[locale]/contact/page.tsx](<app/(public)/[locale]/contact/page.tsx>)  
**Route**: `/[locale]/contact`  
**Dynamic Content**: No (static page with contact form)

### Page Layout

```
┌─────────────────────────────────────────────────┐
│            SITE HEADER                          │
│  Logo | Products | About | Services | Contact   │
│              [Language EN/AR]                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│         PAGE TITLE SECTION                       │
│  "Get in Touch"                                 │
│  "We'd love to hear from you"                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LEFT COLUMN (2 cols)    │  RIGHT COLUMN        │
├────────────────────────┼──────────────────────┤
│                        │                      │
│ CONTACT INFORMATION    │  CONTACT FORM        │
│ ┌────────────────────┐ │  ┌──────────────────┐│
│ │ 📍 Address:        │ │  │ Name              ││
│ │ Erbin, Damascus    │ │  │ [_____________]   ││
│ │ Countryside, Syria │ │  │                  ││
│ │                    │ │  │ Email (required)  ││
│ │ 📞 Phone Numbers:  │ │  │ [_____________]   ││
│ │ +(963) 989 004 767 │ │  │                  ││
│ │ +(963) 114 076     │ │  │ Phone             ││
│ │                    │ │  │ [_____________]   ││
│ │ ✉️ Email:          │ │  │                  ││
│ │ info@damascuarma.sy│ │  │ Message           ││
│ │                    │ │  │ [_____________]   ││
│ │ 🕐 Business Hours: │ │  │ (honeypot field)  ││
│ │ Monday-Friday      │ │  │                  ││
│ │ 9:00 AM - 5:00 PM  │ │  │ [Send Message]    ││
│ │ Saturday-Sunday    │ │  │                  ││
│ │ CLOSED             │ │  │ ✓ Success!        ││
│ └────────────────────┘ │  │                  ││
│                        │  └──────────────────┘│
│ SOCIAL MEDIA           │                      │
│ 📱 LinkedIn            │                      │
│ 🐦 Twitter             │                      │
│ 📘 Facebook            │                      │
│                        │                      │
└────────────────────────┴──────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│           LOCATION MAP                           │
│  ┌─────────────────────────────────────────┐   │
│  │  [Google Maps / Location Embed]         │   │
│  │  (Optional if configured)               │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            SITE FOOTER                          │
│  Quick Links | Company Info | Social            │
└─────────────────────────────────────────────────┘
```

### Contact Page Components

| Component      | File                                              | Purpose                      |
| -------------- | ------------------------------------------------- | ---------------------------- |
| Header         | `components/public/site-header.tsx`               | Navigation                   |
| Contact Info   | Inline                                            | Address, phone, email, hours |
| Contact Form   | `components/public/forms/public-inquiry-form.tsx` | Email form submission        |
| Map (optional) | Inline                                            | Location map embed           |
| Footer         | `components/public/site-footer.tsx`               | Footer                       |

### Contact Form Fields

```
Form Type: CONTACT

Fields:
1. Name (text) - Required
2. Email (email) - Required, validated
3. Phone (tel) - Optional
4. Message (textarea) - Required, min 10 chars
5. Honeypot (hidden) - Spam protection

Validation:
- Email format: valid email required
- Message length: min 10 characters
- Localized error messages (EN/AR)

On Submit:
- Save to FormSubmission table with type "CONTACT"
- Send email notification to admin
- Show success message
- Clear form
```

### Data Flow

```
1. [app/(public)/[locale]/contact/page.tsx]
   ↓ (server component)
2. Render static contact page
   ↓
3. Get page content by slug "contact" (optional)
   ↓
4. Render contact info + form
   ↓
5. Form submission:
   ↓
6. [lib/actions/public-forms.ts] submitContactForm()
   ↓
7. Validate with Zod schema
   ↓
8. Save to database: FormSubmission
   ↓
9. Return success/error response
```

---

## ABOUT PAGE

**File**: [app/(public)/[locale]/about/page.tsx](<app/(public)/[locale]/about/page.tsx>)  
**Route**: `/[locale]/about`  
**Dynamic Content**: Yes (fetches from database or uses fallback)

### Page Layout

```
┌─────────────────────────────────────────────────┐
│            SITE HEADER                          │
│  Logo | Products | About | Services | Contact   │
│              [Language EN/AR]                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│                HERO SECTION                      │
│  "About Damira Pharma"                          │
│  "Building the future of healthcare"            │
│  [Hero Image]                                   │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│          TEXT SECTION - OUR STORY                │
│  "50+ Years of Excellence"                      │
│                                                 │
│  Lorem ipsum dolor sit amet...                  │
│  [Rich text content about company history]     │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│         IMAGE_TEXT - OUR MISSION                 │
│  ┌─────────┐   "Our Mission"                   │
│  │         │   To provide a world-class,      │
│  │[Image]  │   GDP-compliant ecosystem        │
│  │         │   for registration, storage,     │
│  │         │   and distribution...            │
│  └─────────┘                                    │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│        VALUES SECTION - FEATURES CARDS           │
│  ┌──────────────┐  ┌──────────────┐  ...      │
│  │ Quality &    │  │ Scientific   │          │
│  │ Compliance   │  │ Excellence   │          │
│  │              │  │              │          │
│  │ Rigorous... │  │ Decisions... │          │
│  └──────────────┘  └──────────────┘          │
│                                               │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ Ethics &     │  │ Team         │          │
│  │ Partnerships │  │ Development  │          │
│  │              │  │              │          │
│  │ Transparent..│  │ Continuous.. │          │
│  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│       ACHIEVEMENTS - STATS SECTION               │
│  ┌──────────────┐  ┌──────────────┐  ...      │
│  │ 50+ Years    │  │ 100+ Centers │          │
│  │ Group Legacy │  │ Nationwide   │          │
│  └──────────────┘  └──────────────┘          │
│                                               │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ 15,000+      │  │ 35,000+      │          │
│  │ Pharmacies   │  │ Points of Sale           │
│  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│       CERTIFICATIONS & PARTNERSHIPS               │
│  "Global Recognition & Partnerships"            │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ 🏆 ISO       │  │ ✓ FDA        │           │
│  │ Certified    │  │ Certified    │           │
│  └──────────────┘  └──────────────┘           │
│                                               │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ 🏆 GDP       │  │ ✓ GSP        │           │
│  │ Certified    │  │ Certified    │           │
│  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│            CTA SECTION                           │
│  "Ready to Partner With Damira?"                │
│  "Contact us to explore opportunities"         │
│  [Button: "Get in Touch"]                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            SITE FOOTER                          │
│  Quick Links | Company Info | Social            │
└─────────────────────────────────────────────────┘
```

### About Page Components

| Component          | File                                | Purpose                      |
| ------------------ | ----------------------------------- | ---------------------------- |
| Header             | `components/public/site-header.tsx` | Navigation                   |
| Hero Section       | Dynamic from DB                     | Title, subtitle, image       |
| Story Text         | Dynamic from DB                     | Company narrative            |
| Mission Image+Text | Dynamic from DB                     | Image with mission statement |
| Values Cards       | Dynamic from DB                     | Core values grid             |
| Achievements Stats | Dynamic from DB                     | Key metrics                  |
| CTA                | Dynamic from DB                     | Call-to-action               |
| Footer             | `components/public/site-footer.tsx` | Footer                       |

### Data Flow

```
1. [app/(public)/[locale]/about/page.tsx]
   ↓
2. Fetch page with slug "about"
   ↓
3. If published: Use database content
   If not: Use fallback content
   ↓
4. Render dynamic sections
```

---

## SERVICES PAGE

**File**: [app/(public)/[locale]/services/page.tsx](<app/(public)/[locale]/services/page.tsx>)  
**Route**: `/[locale]/services`  
**Dynamic Content**: Yes (fetches from database)

### Page Layout

```
┌─────────────────────────────────────────────────┐
│            SITE HEADER                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│         PAGE HERO - SERVICES INTRO              │
│  "Our Services"                                 │
│  "Comprehensive pharmaceutical solutions"      │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│        SERVICES GRID - CARDS SECTION             │
│  ┌──────────────┐  ┌──────────────┐  ...      │
│  │ Supply Chain │  │ Cold Chain   │          │
│  │ Management   │  │ Services     │          │
│  │              │  │              │          │
│  │ [Learn More]→│  │ [Learn More]→│          │
│  └──────────────┘  └──────────────┘          │
│                                               │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ Market Access│  │ Compliance   │          │
│  │ Support      │  │ & Regulatory │          │
│  │              │  │              │          │
│  │ [Learn More]→│  │ [Learn More]→│          │
│  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│      SERVICE DETAILS - IMAGE + TEXT              │
│  ┌───────┐  "Supply Chain Excellence"         │
│  │       │  Our purpose-built fleet...        │
│  │[Img1] │  • 2-8°C cold storage              │
│  │       │  • Real-time tracking              │
│  │       │  • 24/7 monitoring                 │
│  └───────┘                                    │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│        SERVICE DETAILS - FEATURES               │
│  ┌──────────────┐  ┌──────────────┐  ...      │
│  │ ✓ Feature 1  │  │ ✓ Feature 2  │          │
│  │              │  │              │          │
│  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│            CTA SECTION                           │
│  "Need a service? Contact us"                  │
│  [Button: "Request Service"]                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            SITE FOOTER                          │
└─────────────────────────────────────────────────┘
```

---

## PARTNERSHIPS PAGE

**File**: [app/(public)/[locale]/partnerships/page.tsx](<app/(public)/[locale]/partnerships/page.tsx>)  
**Route**: `/[locale]/partnerships`  
**Dynamic Content**: Yes (fetches from database)

### Page Layout

```
┌─────────────────────────────────────────────────┐
│            SITE HEADER                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│      PAGE HERO - PARTNERSHIPS INTRO              │
│  "Let's Partner Together"                       │
│  "Growth opportunities with Damira Pharma"     │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│     WHY PARTNER - CARDS SECTION                  │
│  ┌──────────────┐  ┌──────────────┐  ...      │
│  │ Strategic    │  │ Quality      │          │
│  │ Specialization│  │ Assured      │          │
│  │              │  │              │          │
│  │ Focus on.... │  │ ISO & FDA... │          │
│  └──────────────┘  └──────────────┘          │
│                                               │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ Market Access│  │ Financial    │          │
│  │ & Networks   │  │ Backing      │          │
│  │              │  │              │          │
│  │ 100+ centers │  │ 50+ year group           │
│  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│    PARTNERSHIP TYPES - FEATURES SECTION          │
│  ┌──────────────┐  ┌──────────────┐  ...      │
│  │ Distribution │  │ Retail       │          │
│  │ Partners     │  │ Partners     │          │
│  │              │  │              │          │
│  │ Nationwide.. │  │ Direct to.... │          │
│  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│       PARTNERSHIP INQUIRY FORM                   │
│  "Interested in Partnership?"                   │
│  ┌──────────────────────────────────────────┐  │
│  │ Company Name: [___________________]       │  │
│  │ Contact Person: [___________________]     │  │
│  │ Email: [___________________]              │  │
│  │ Phone: [___________________]              │  │
│  │ Partnership Type: [Select...]             │  │
│  │ Message: [___________________]            │  │
│  │                                          │  │
│  │ [Submit Inquiry]                          │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            SITE FOOTER                          │
└─────────────────────────────────────────────────┘
```

### Partnership Form Fields

```
Form Type: PARTNERSHIP

Fields:
1. Company Name (text) - Required
2. Contact Person (text) - Required
3. Email (email) - Required
4. Phone (tel) - Required
5. Partnership Type (dropdown) - Required
   Options:
   - Distribution
   - Retail
   - Enterprise
   - Other
6. Message (textarea) - Required
7. Honeypot (hidden)

On Submit:
- Save as FormSubmission type "PARTNERSHIP"
- Admin notification
- Success message
```

---

## COMPLIANCE PAGE

**File**: [app/(public)/[locale]/compliance/page.tsx](<app/(public)/[locale]/compliance/page.tsx>)  
**Route**: `/[locale]/compliance`  
**Dynamic Content**: Yes (fetches from database)

### Page Layout

```
┌─────────────────────────────────────────────────┐
│            SITE HEADER                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│    PAGE HERO - COMPLIANCE & CERTIFICATIONS       │
│  "Quality, Ethics & Compliance"                 │
│  "ISO & FDA Certified Since 1974"              │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│     CERTIFICATIONS - STATS/CARDS SECTION         │
│  ┌──────────────┐  ┌──────────────┐  ...      │
│  │ 🏆 ISO       │  │ ✓ FDA        │          │
│  │ Certified    │  │ Certified    │          │
│  │ Group        │  │ Group        │          │
│  └──────────────┘  └──────────────┘          │
│                                               │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ 🏆 GDP       │  │ ✓ GSP        │          │
│  │ Compliant    │  │ Compliant    │          │
│  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│      COMPLIANCE INITIATIVES - TEXT SECTION       │
│  "Our Commitment to Quality"                    │
│                                                 │
│  "We maintain the highest standards..."        │
│  [Rich text content]                           │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│   REGULATORY PILLARS - FEATURES CARDS            │
│  ┌──────────────┐  ┌──────────────┐  ...      │
│  │ Code of      │  │ No Off-Label │          │
│  │ Conduct      │  │ Promotion    │          │
│  │              │  │              │          │
│  │ Formal code..│  │ Scientific.. │          │
│  └──────────────┘  └──────────────┘          │
│                                               │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ Fair-Market  │  │ Training &   │          │
│  │ Arrangements │  │ Audits       │          │
│  │              │  │              │          │
│  │ Transparent..│  │ Regular.. │          │
│  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────┘

SCROLL REVEAL ↓

┌─────────────────────────────────────────────────┐
│    FACILITY INFORMATION - IMAGE + TEXT           │
│  ┌───────┐  "GDP & GSP Compliant Facility"    │
│  │       │  "1,500 m² facility with..."       │
│  │[Img]  │  • Climate-controlled storage      │
│  │       │  • 24/7 security systems           │
│  │       │  • HEPA & HVAC redundancy          │
│  └───────┘                                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            SITE FOOTER                          │
└─────────────────────────────────────────────────┘
```

---

## 404 NOT FOUND PAGE

**File**: [app/(public)/[locale]/not-found.tsx](<app/(public)/[locale]/not-found.tsx>)  
**Route**: Any undefined route  
**Dynamic Content**: No (static)

### Page Layout

```
┌─────────────────────────────────────────────────┐
│            SITE HEADER                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│              ERROR 404                          │
│         Page Not Found                          │
│                                                 │
│  The page you're looking for doesn't exist     │
│  or has been moved.                            │
│                                                 │
│         [Back to Home] [Browse Products]       │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            SITE FOOTER                          │
└─────────────────────────────────────────────────┘
```

---

## SECTION COMPONENT TYPES

### 1. HERO Section

**Used On**: Homepage, page introductions  
**Structure**:

```
┌─────────────────────────────────────────────┐
│                                             │
│        [BACKGROUND IMAGE / GRADIENT]        │
│                                             │
│        HERO TITLE                           │
│        Subtitle text                        │
│                                             │
│        [CTA Button] [Secondary Button]      │
│                                             │
│                                             │
└─────────────────────────────────────────────┘

Editable Fields (Admin):
- Title (EN/AR)
- Subtitle (EN/AR)
- Background Image
- Button Text (EN/AR)
- Button Link
- Button Style (primary/secondary)
```

### 2. TEXT Section

**Used On**: Descriptions, content blocks  
**Structure**:

```
┌─────────────────────────────────────────────┐
│                                             │
│ Heading                                     │
│                                             │
│ Lorem ipsum dolor sit amet, consectetur     │
│ adipiscing elit. Sed do eiusmod tempor...  │
│                                             │
│ • Bullet point 1                            │
│ • Bullet point 2                            │
│ • Bullet point 3                            │
│                                             │
└─────────────────────────────────────────────┘

Editable Fields (Admin):
- Rich text content (Tiptap editor)
- Heading (optional)
- Text alignment (left/center/right)
```

### 3. IMAGE_TEXT Section

**Used On**: Features, testimonials, case studies  
**Structure**:

```
LAYOUT 1 (Image Left):
┌─────────────────┐  ┌──────────────────────┐
│                 │  │ Heading              │
│    [Image]      │  │                      │
│                 │  │ Description text...  │
│                 │  │                      │
│                 │  │ • List item 1        │
│                 │  │ • List item 2        │
└─────────────────┘  └──────────────────────┘

LAYOUT 2 (Image Right):
┌──────────────────────┐  ┌─────────────────┐
│ Heading              │  │                 │
│                      │  │    [Image]      │
│ Description text...  │  │                 │
│                      │  │                 │
│ • List item 1        │  │                 │
│ • List item 2        │  │                 │
└──────────────────────┘  └─────────────────┘

Editable Fields (Admin):
- Image
- Heading (EN/AR)
- Description (EN/AR, rich text)
- Layout direction (left/right)
```

### 4. STATS Section

**Used On**: Metrics, achievements  
**Structure**:

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│              │  │              │  │              │
│     50+      │  │    100+      │  │   15,000+    │
│              │  │              │  │              │
│ Years of     │  │   Centers    │  │  Pharmacies  │
│ Group Legacy │  │   Nationwide │  │              │
│              │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘

Editable Fields (Admin):
- Add/edit/remove stats
- Value (number)
- Label (EN/AR)
```

### 5. FEATURES Section

**Used On**: Product features, benefits, pillars  
**Structure**:

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ ⭐           │  │ ⭐           │  │ ⭐           │
│              │  │              │  │              │
│ Feature Name │  │ Feature Name │  │ Feature Name │
│              │  │              │  │              │
│ Lorem ipsum  │  │ Lorem ipsum  │  │ Lorem ipsum  │
│ dolor...     │  │ dolor...     │  │ dolor...     │
│              │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘

Editable Fields (Admin):
- Add/edit/remove features
- Feature name (EN/AR)
- Description (EN/AR)
- Icon (emoji or image)
```

### 6. CARDS Section

**Used On**: Services, products, categories  
**Structure**:

```
┌────────────────────┐  ┌────────────────────┐
│                    │  │                    │
│   [Card Image]     │  │   [Card Image]     │
│                    │  │                    │
│ Card Title         │  │ Card Title         │
│                    │  │                    │
│ Card description   │  │ Card description   │
│ Lorem ipsum...     │  │ Lorem ipsum...     │
│                    │  │                    │
│ [Learn More →]     │  │ [Learn More →]     │
└────────────────────┘  └────────────────────┘

Editable Fields (Admin):
- Add/edit/remove cards
- Card image
- Title (EN/AR)
- Description (EN/AR)
- Link (URL)
- Button text (EN/AR)
```

### 7. CTA (Call-to-Action) Section

**Used On**: Promotional sections, next steps  
**Structure**:

```
┌─────────────────────────────────────────────┐
│                                             │
│   Ready to Partner With Us?                 │
│                                             │
│   Let's build the future of healthcare     │
│   in Syria together.                        │
│                                             │
│   [Primary Button] [Secondary Button]       │
│                                             │
└─────────────────────────────────────────────┘

Editable Fields (Admin):
- Heading (EN/AR)
- Description (EN/AR)
- Background color/image
- Primary button text (EN/AR) and link
- Secondary button text (EN/AR) and link
```

---

## SHARED COMPONENTS

### Site Header

**File**: `components/public/site-header.tsx`  
**Appears On**: All public pages (sticky/fixed)

**Structure**:

```
┌──────────────────────────────────────────────────┐
│ [Logo] [Home|Products|About|Services|Contact] [EN/AR] │
└──────────────────────────────────────────────────┘

Mobile (< 768px):
┌──────────────────────────────────────────────────┐
│ [Logo]                  [≡ Menu] [EN/AR]         │
│ ↓ (expands)                                       │
│ Home     Products     About                       │
│ Services Contact      ⊗                           │
└──────────────────────────────────────────────────┘

Editable Elements:
- Logo image
- Navigation links
- Language switcher
- Mobile menu items
```

### Language Switcher

**File**: `components/public/language-switcher.tsx`  
**Appears On**: Site header

**Behavior**:

- Click EN → keeps current page, changes URL locale to `/ar/*`
- Click AR → keeps current page, changes URL locale to `/en/*`
- Shows current language highlighted
- Remembers preference

### Site Footer

**File**: `components/public/site-footer.tsx`  
**Appears On**: All public pages (bottom)

**Structure**:

```
┌──────────────────────────────────────────────┐
│ Quick Links      │ Company Info             │
│ • Home           │ Address                  │
│ • Products       │ Phone                    │
│ • About          │ Email                    │
│ • Contact        │ Social Media             │
│                  │ Copyright © 2025         │
└──────────────────────────────────────────────┘
```

---

## DEVELOPMENT NOTES

### Adding New Page Sections

1. **Edit Page in Admin**:
   - Go to Admin → Pages
   - Click Edit on desired page
   - Add new section from dropdown (HERO, TEXT, etc.)
   - Fill in fields
   - Save

2. **Section Order**:
   - Sections render in order
   - Drag to reorder in admin

3. **Preview Before Publishing**:
   - Draft saves automatically
   - Preview button shows unpublished changes
   - Publish button makes live

### Editing Page Elements

**In the admin for each page**:

1. Navigate to desired page
2. Select language (EN/AR) tab
3. Edit sections individually
4. Click "Save Draft" or "Publish"

### Component Responsive Design

- **Desktop** (≥ 1024px): Full layout with all features
- **Tablet** (768px - 1023px): Stack sections, simplified filters
- **Mobile** (< 768px): Single column, hamburger menu

### RTL (Arabic) Support

- All text automatically right-to-left
- Images and layouts maintain correct positioning
- Forms adapt for RTL
- Navigation flows right-to-left

### Performance Optimizations

- Server-side rendering for SEO
- Image optimization with next/image
- Lazy loading for off-screen sections
- Scroll reveal animations (optional, configurable)

### SEO Best Practices

- Meta tags generated per page
- Open Graph image support
- Structured schema markup
- Sitemap generated automatically
- Dynamic robots.txt
