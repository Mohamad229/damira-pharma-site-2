# Damira Pharma - Public Website Documentation

**Project**: Pharmaceutical CMS Public Website  
**Stack**: Next.js 16 + React 19  
**Purpose**: Multi-language public-facing website for patients and customers (EN/AR with RTL support)

---

## TABLE OF CONTENTS

1. [Website Architecture](#website-architecture)
2. [Public Routes & Pages](#public-routes--pages)
3. [Content Delivery](#content-delivery)
4. [Components & UI](#components--ui)
5. [Forms & Submissions](#forms--submissions)
6. [Product Catalog](#product-catalog)
7. [Internationalization](#internationalization)
8. [SEO & Metadata](#seo--metadata)
9. [File Structure](#file-structure)

---

## WEBSITE ARCHITECTURE

### Layer Structure

```
┌─────────────────────────────────────────┐
│      PUBLIC PAGES (Routes)              │
│   /[locale]/* (all public pages)        │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│    PUBLIC COMPONENTS                    │
│   Content, Forms, Navigation            │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│   PUBLIC ACTIONS (Queries/Submissions)  │
│   /lib/actions/public-*.ts              │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│      DATABASE (Prisma + PostgreSQL)     │
└─────────────────────────────────────────┘

Multi-language Routing:
/en/* (default English)
/ar/* (Arabic with RTL)

Fallback System:
Published page content → Fallback page template
```

### Key Features

1. **Server-Side Rendering** - All pages rendered on server for performance and SEO
2. **Multi-Language Support** - English (LTR) and Arabic (RTL)
3. **Dynamic Content** - Pages and products populated from database
4. **Fallback Content** - Default pages if not published
5. **Rich Content** - Section renderer supports multiple layout types
6. **Responsive Design** - Mobile-first CSS with Tailwind
7. **SEO Optimized** - Meta tags, open graph, sitemap, robots.txt
8. **Form Submissions** - Contact, partnership, and product inquiry forms

---

## PUBLIC ROUTES & PAGES

### Route Structure

```
/ (root)
├── [locale]/                          # Locale prefix (en/ar)
│   ├── layout.tsx                     # Root layout for public
│   ├── page.tsx                       # Homepage
│   ├── products/
│   │   ├── page.tsx                   # Product catalog
│   │   ├── loading.tsx                # Catalog loading skeleton
│   │   └── [slug]/
│   │       ├── page.tsx               # Product detail
│   │       └── loading.tsx            # Detail loading skeleton
│   ├── contact/
│   │   ├── page.tsx                   # Contact page with form
│   │   └── loading.tsx                # Loading skeleton
│   ├── about/
│   │   ├── page.tsx                   # About company page
│   │   └── loading.tsx                # Loading skeleton
│   ├── services/
│   │   ├── page.tsx                   # Services page
│   │   └── loading.tsx                # Loading skeleton
│   ├── partnerships/
│   │   ├── page.tsx                   # Partnerships page
│   │   └── loading.tsx                # Loading skeleton
│   ├── compliance/
│   │   ├── page.tsx                   # Compliance/regulatory page
│   │   └── loading.tsx                # Loading skeleton
│   ├── not-found/
│   │   └── page.tsx                   # Static 404 page
│   ├── error.tsx                      # Error boundary
│   ├── not-found.tsx                  # 404 handler
│   └── loading.tsx                    # General loading skeleton
│
└── api/
    ├── auth/[...nextauth]/route.ts   # Authentication endpoints
    └── media/upload/route.ts         # Public file upload
```

---

## PAGES & ROUTES

### 1. Homepage

**File**: [app/(public)/[locale]/page.tsx](<app/(public)/[locale]/page.tsx>)

**Purpose**: Landing page with dynamic sections from database

**Features**:

- Fetches published home page from database
- Falls back to default home page if not published
- Renders multiple section types (HERO, TEXT, CARDS, STATS, FEATURES, CTA, IMAGE_TEXT)
- Generates dynamic metadata (title, description, OG image)
- Bilingual support (EN/AR with RTL)

**Content Flow**:

1. Server fetches page with slug "home"
2. If not found, uses fallback content
3. Renders each section with SectionRenderer
4. Apply scroll reveal animations

**Related Files**:

- [lib/public-pages.ts](lib/public-pages.ts) - Query published pages
- [lib/public-page-fallbacks.ts](lib/public-page-fallbacks.ts) - Default home page
- [components/public/section-renderer.tsx](components/public/section-renderer.tsx) - Section rendering
- [lib/seo.ts](lib/seo.ts) - SEO metadata

---

### 2. Product Catalog

**File**: [app/(public)/[locale]/products/page.tsx](<app/(public)/[locale]/products/page.tsx>)

**Purpose**: Product listing with filters and search

**Features**:

- Grid display of published products
- Filter by category
- Filter by therapeutic area
- Filter by status (AVAILABLE or PIPELINE)
- Search by product name
- Pagination with next/previous
- Sort options (name, newest)
- Responsive grid layout

**Filters Available**:

- Category dropdown (fetched from database)
- Therapeutic area dropdown
- Status filter (show available, pipeline, or both)
- Free text search

**Data Flow**:

1. Server fetches published products with filters
2. Uses catalog query parser to parse URL parameters
3. Displays paginated results in grid
4. Updates URL with current filters for bookmarking

**URL Example**:

```
/en/products?category=pain-relief&search=ibuprofen&page=1
/ar/products?category=مسكنات&search=ايبوبروفين&page=1
```

**Related Files**:

- [lib/actions/public-products.ts](lib/actions/public-products.ts) - Product queries
- [lib/catalog/catalog-query.ts](lib/catalog/catalog-query.ts) - URL parsing
- [components/public/products/product-card.tsx](components/public/products/product-card.tsx) - Product card
- [components/public/products/catalog-controls.tsx](components/public/products/catalog-controls.tsx) - Filter sidebar
- [components/public/products/product-pagination.tsx](components/public/products/product-pagination.tsx) - Pagination

---

### 3. Product Detail

**File**: [app/(public)/[locale]/products/[slug]/page.tsx](<app/(public)/[locale]/products/[slug]/page.tsx>)

**Purpose**: Individual product page with full information

**Features**:

- Product name, description, and metadata
- Product status badge (AVAILABLE/PIPELINE)
- Category and therapeutic area display
- Manufacturer information
- Attachments section (downloadable files)
- Related products section (similar category/area)
- Contact form for product inquiries
- SEO metadata generation
- 404 if product not published

**Sections**:

- Product header with cover image
- Full description
- Product details (category, area, manufacturer)
- Attachments grid (e.g., PDF datasheets)
- Related products carousel
- Product inquiry form

**Data Flow**:

1. Server fetches product by slug
2. If not published, return 404
3. Fetch related products (same category or area)
4. Generate metadata with product name and description
5. Render product template

**Related Files**:

- [lib/actions/public-products.ts](lib/actions/public-products.ts) - Product queries
- [lib/seo.ts](lib/seo.ts) - SEO metadata
- [components/public/forms/public-inquiry-form.tsx](components/public/forms/public-inquiry-form.tsx) - Inquiry form
- [components/public/scroll-reveal.tsx](components/public/scroll-reveal.tsx) - Animations

---

### 4. Contact Page

**File**: [app/(public)/[locale]/contact/page.tsx](<app/(public)/[locale]/contact/page.tsx>)

**Purpose**: Contact information and form for inquiries

**Features**:

- Company contact details display
- Business hours
- Physical address/location info
- Contact form
- Map iframe (optional)
- Multi-language support

**Form**:

- Name field (required)
- Email field (required)
- Phone field (optional)
- Message textarea (required)
- Honeypot spam protection
- Localized validation messages (EN/AR)

**Data Flow**:

1. Form submission triggers server action
2. Validates with Zod schema
3. Saves to FormSubmission table with type "CONTACT"
4. Shows success/error message
5. Admin receives notification

**Related Files**:

- [components/public/forms/public-inquiry-form.tsx](components/public/forms/public-inquiry-form.tsx) - Contact form
- [lib/actions/public-forms.ts](lib/actions/public-forms.ts) - Submit form action
- [lib/public-pages.ts](lib/public-pages.ts) - Get page content

---

### 5. About Page

**File**: [app/(public)/[locale]/about/page.tsx](<app/(public)/[locale]/about/page.tsx>)

**Purpose**: Company information and mission page

**Features**:

- Dynamic content from database (if published)
- Multiple sections (hero, text, image-text, stats, features, CTA)
- Fallback to default about page if not published
- Company values and mission statement
- Team information (if included in sections)
- Timeline or milestones (if in sections)

**Content Flow**:

1. Fetch page with slug "about"
2. If not published, use fallback content
3. Render sections with SectionRenderer

**Related Files**:

- [lib/public-pages.ts](lib/public-pages.ts) - Query published pages
- [lib/public-page-fallbacks.ts](lib/public-page-fallbacks.ts) - Fallback content
- [components/public/section-renderer.tsx](components/public/section-renderer.tsx) - Section rendering

---

### 6. Services Page

**File**: [app/(public)/[locale]/services/page.tsx](<app/(public)/[locale]/services/page.tsx>)

**Purpose**: Services overview and offerings

**Features**:

- Service descriptions
- Service categories
- How to use services
- Dynamic content from database

**Content Flow**:

1. Fetch page with slug "services"
2. Render sections showing available services
3. Fallback to default if not published

---

### 7. Partnerships Page

**File**: [app/(public)/[locale]/partnerships/page.tsx](<app/(public)/[locale]/partnerships/page.tsx>)

**Purpose**: Partnership opportunities and inquiry form

**Features**:

- Partnership description and benefits
- Partnership inquiry form
- Types of partnerships available

**Form**:

- Company name
- Contact person name
- Email address
- Phone
- Inquiry type dropdown (e.g., distribution, retail, enterprise)
- Message
- Honeypot protection

**Data Flow**:

1. Form submission saves as FormSubmission type "PARTNERSHIP"
2. Admin is notified
3. User sees success message

**Related Files**:

- [components/public/forms/public-inquiry-form.tsx](components/public/forms/public-inquiry-form.tsx) - Partnership form
- [lib/actions/public-forms.ts](lib/actions/public-forms.ts) - Submit form action

---

### 8. Compliance Page

**File**: [app/(public)/[locale]/compliance/page.tsx](<app/(public)/[locale]/compliance/page.tsx>)

**Purpose**: Regulatory compliance and certification information

**Features**:

- Compliance certifications
- Regulatory information
- Data privacy and security policies
- Dynamic content sections

**Related Files**:

- [lib/public-pages.ts](lib/public-pages.ts) - Query page content
- [lib/public-page-fallbacks.ts](lib/public-page-fallbacks.ts) - Fallback content

---

### 9. 404 Not Found

**File**: [app/(public)/[locale]/not-found.tsx](<app/(public)/[locale]/not-found.tsx>)

**Purpose**: 404 error page for missing routes

**Features**:

- User-friendly error message
- Link back to homepage
- Language switching

---

### 10. Error Boundary

**File**: [app/(public)/[locale]/error.tsx](<app/(public)/[locale]/error.tsx>)

**Purpose**: Error boundary for unhandled exceptions

**Features**:

- Error message display
- Recovery actions
- User guidance

---

### 11. Loading States

**File**: [app/(public)/[locale]/loading.tsx](<app/(public)/[locale]/loading.tsx>)

**Purpose**: Generic loading skeleton for page loads

**Related Loading Files**:

- [products/loading.tsx](<app/(public)/[locale]/products/loading.tsx>) - Product catalog loading
- [products/[slug]/loading.tsx](<app/(public)/[locale]/products/[slug]/loading.tsx>) - Product detail loading
- [contact/loading.tsx](<app/(public)/[locale]/contact/loading.tsx>) - Contact page loading
- [about/loading.tsx](<app/(public)/[locale]/about/loading.tsx>) - About page loading
- [partnerships/loading.tsx](<app/(public)/[locale]/partnerships/loading.tsx>) - Partnerships loading
- [services/loading.tsx](<app/(public)/[locale]/services/loading.tsx>) - Services loading
- [compliance/loading.tsx](<app/(public)/[locale]/compliance/loading.tsx>) - Compliance loading

**Related Component**:

- [components/public/loading/public-page-skeleton.tsx](components/public/loading/public-page-skeleton.tsx) - Skeleton UI

---

## CONTENT DELIVERY

### Static vs Dynamic Content

**Published Database Content**:

- Custom pages (Home, About, Services, etc.)
- Page sections with content
- Products marked as published

**Fallback Content** (`lib/public-page-fallbacks.ts`):

- Used when pages not published in database
- Pre-built default pages for main routes
- Ensures site always shows content

**Content Fetching Pattern**:

```
1. Try fetch from database (published content)
   ↓ (if found)
2. Render database content
   ↓ (if not found)
3. Use fallback page template
   ↓
4. Render fallback content
```

### Section Types & Rendering

**Available Section Types**:

1. **HERO** - Banner with title, subtitle, CTA button
   - Use: Homepage, page banners, introductions
   - Properties: Title, subtitle, image, CTA button

2. **TEXT** - Rich text content block
   - Use: Descriptions, explanations, content
   - Properties: HTML/formatted text from Tiptap editor

3. **IMAGE_TEXT** - Image alongside text
   - Use: Features, testimonials, case studies
   - Properties: Image, text, layout (left/right)

4. **STATS** - Statistics display grid
   - Use: Key metrics, achievements
   - Properties: Array of [value, label] pairs

5. **FEATURES** - Feature list grid
   - Use: Product features, benefits
   - Properties: Array of [title, description, icon] groups

6. **CARDS** - Card grid layout
   - Use: Service cards, product categories
   - Properties: Array of [title, description, image, link] cards

7. **CTA** - Call-to-action section
   - Use: Promotional sections, prompts
   - Properties: Title, description, button

**Section Renderer**:

- [components/public/section-renderer.tsx](components/public/section-renderer.tsx) - Renders sections by type
- Supports scroll reveal animations
- Responsive on mobile/tablet/desktop
- Bilingual (applies RTL for Arabic)

---

## COMPONENTS & UI

### Layout Components

**Public Layout**
[app/(public)/[locale]/layout.tsx](<app/(public)/[locale]/layout.tsx>)

- Main wrapper for all public pages
- Includes SiteHeader and SiteFooter
- Sets up i18n locale provider
- RTL support for Arabic
- Organization schema markup for SEO

---

### Navigation Components

**Site Header** [components/public/site-header.tsx](components/public/site-header.tsx)

Features:

- Logo/branding
- Main navigation menu
- Language switcher (EN/AR)
- Mobile hamburger menu
- Responsive design
- Active route highlighting

**Navigation Items**:

- Home
- Products
- About
- Services
- Partnerships
- Compliance
- Contact

---

**Language Switcher** [components/public/language-switcher.tsx](components/public/language-switcher.tsx)

Features:

- Toggle between English and Arabic
- Updates locale in URL
- Preserves current page
- Remembers user preference
- Shows current language
- RTL-aware positioning

**Navigation**:

- Click EN → redirects `/ar/*` to `/en/*`
- Click AR → redirects `/en/*` to `/ar/*`

---

**Site Footer** [components/public/site-footer.tsx](components/public/site-footer.tsx)

Features:

- Quick links to main pages
- Copyright notice
- Social links (if configured)
- Bilingual support
- Company info

---

### Content Components

**Section Renderer** [components/public/section-renderer.tsx](components/public/section-renderer.tsx)

Purpose: Renders dynamic page sections based on type

**Supports**:

- All 7 section types (HERO, TEXT, CARDS, STATS, FEATURES, CTA, IMAGE_TEXT)
- Bilingual content
- Scroll reveal animations
- Responsive layouts
- Image optimization

**Usage**:

```typescript
<SectionRenderer
  section={sectionData}
  locale={locale}
  index={index}
/>
```

---

**Page Content** [components/public/page-content.tsx](components/public/page-content.tsx)

Purpose: Wrapper for page content with layout

Features:

- Fetches page data by slug
- Renders all sections
- Handles 404 for unpublished pages
- Metadata generation

---

**Scroll Reveal** [components/public/scroll-reveal.tsx](components/public/scroll-reveal.tsx)

Purpose: Intersection observer animation on scroll

Features:

- Fade-in animations
- Configurable delay
- Smooth entrances
- Performance optimized
- Right-to-left aware

---

### Product Components

**Product Card** [components/public/products/product-card.tsx](components/public/products/product-card.tsx)

Features:

- Product image thumbnail
- Product name and category
- Status badge (AVAILABLE/PIPELINE)
- Link to product detail page
- Hover effects
- Responsive sizing

**Display Fields**:

- Cover image
- Product name
- Category name
- Status badge
- Company/Manufacturer

---

**Catalog Controls** [components/public/products/catalog-controls.tsx](components/public/products/catalog-controls.tsx)

Purpose: Filter sidebar for product catalog

**Filter Types**:

1. **Search** - Free text search by product name
2. **Category** - Dropdown of available categories
3. **Therapeutic Area** - Dropdown of therapeutic areas
4. **Status** - Show AVAILABLE, PIPELINE, or both
5. **Sort** - Sort by name, newest, or relevance

**Features**:

- URL parameter binding
- Currently applied filters display
- Clear filters button
- Mobile-responsive collapse

---

**Product Pagination** [components/public/products/product-pagination.tsx](components/public/products/product-pagination.tsx)

Purpose: Pagination controls for product listing

Features:

- Previous/next page buttons
- Current page number
- Total pages display
- Disabled state when no more pages
- State preservation with URL params

---

### Form Components

**Public Inquiry Form** [components/public/forms/public-inquiry-form.tsx](components/public/forms/public-inquiry-form.tsx)

Purpose: Generic form for contact, partnership, and product inquiry

**Features**:

- Form type discrimination (CONTACT, PARTNERSHIP, PRODUCT_INQUIRY)
- Bilingual support (EN/AR with RTL)
- Honeypot spam protection (hidden field)
- Loading state handles submissions
- Validation feedback
- Success/error toast messages
- Conditional fields based on form type

**Contact Form Fields**:

- Name (required)
- Email (required)
- Phone (optional)
- Message (required)

**Partnership Form Fields**:

- Company name (required)
- Contact name (required)
- Email (required)
- Phone (required)
- Inquiry type dropdown
- Message (required)

**Product Inquiry Form Fields**:

- Name (required)
- Email (required)
- Phone (optional)
- Product inquiry type dropdown
- Message (required)

**Actions Used**:

- [lib/actions/public-forms.ts](lib/actions/public-forms.ts) - Submit form

---

### Loading States

**Public Page Skeleton** [components/public/loading/public-page-skeleton.tsx](components/public/loading/public-page-skeleton.tsx)

Purpose: Loading placeholder while page renders

Displays skeleton UI with:

- Header placeholder
- Content placeholders
- Footer placeholder
- Shimmer animations

---

## FORMS & SUBMISSIONS

### Public Form Handling

**Form Types**:

1. **CONTACT** - General contact inquiries
2. **PARTNERSHIP** - Business partnership requests
3. **PRODUCT_INQUIRY** - Questions about specific products

### Submission Flow

```
1. User fills form on public page
   ↓
2. Submit triggers server action
   ↓
3. Validate with Zod schema
   ↓
4. Honeypot check (spam protection)
   ↓
5. Save to database (FormSubmission table)
   ↓
6. Return success message
   ↓
7. Admin sees form in /admin/forms dashboard
```

### Server Action

**File**: [lib/actions/public-forms.ts](lib/actions/public-forms.ts)

**Function**:

```typescript
export async function submitPublicForm(
  prevState,
  formData,
): Promise<ActionState>;
```

**Validation**:

- Email format validation
- Required fields check
- Message length limits
- Honeypot verification
- CSRF protection (via Next.js form handling)

**Features**:

- Saves complete form data
- Includes timestamp
- Stores inquiry type if provided
- Error handling with user-friendly messages
- Localized messages (EN/AR)

---

## PRODUCT CATALOG

### Product Queries

**File**: [lib/actions/public-products.ts](lib/actions/public-products.ts)

**Functions**:

1. **getPublicProducts(locale, query)**
   - Returns paginated published products
   - Accepts filters: category, therapeutic area, status, search
   - Supports sorting
   - Bilingual translations

2. **getPublicProductBySlug(locale, slug)**
   - Fetch single product by slug
   - Include translations
   - Include attachments
   - Return null if not published

3. **getPublishedProductSlugs()**
   - Get all published product slugs
   - Used for sitemap generation

4. **getRelatedProducts(locale, productId, limit)**
   - Get related products (same category/area)
   - Exclude current product
   - Default 4 related products

### Catalog Query Parser

**File**: [lib/catalog/catalog-query.ts](lib/catalog/catalog-query.ts)

**Functions**:

`parseCatalogSearchParams(query)`

- Parse URL query params into structured filter object
- Handles pagination, filters, sorting
- Validates parameter values
- Returns structured query object

`buildCatalogUrl(pathname, current, updates)`

- Build updated catalog URL with new filters
- Preserves existing params not being updated
- Handles multi-select filters

`buildCatalogPaginationHref(pathname, searchParams, nextPage)`

- Build pagination URLs
- Preserves all current filters

### URL Structure

```
/en/products
  ?category=pain-relief
  &area=neurology
  &status=available
  &search=ibuprofen
  &sortBy=name
  &page=2

/ar/products
  ?category=مسكنات
  &area=أمراض الأعصاب
  &status=متاح
  &search=ايبوبروفين
  &sortBy=الاسم
  &page=2
```

---

## INTERNATIONALIZATION

### Multi-Language Setup

**Supported Languages**:

- **en** - English (LTR - left-to-right)
- **ar** - Arabic (RTL - right-to-left)

### Configuration

**File**: [i18n/config.ts](i18n/config.ts)

```typescript
export const locales = ["en", "ar"];
export const defaultLocale = "en";
export const localeNames = { en: "English", ar: "العربية" };
export const localeDirection = { en: "ltr", ar: "rtl" };
```

### Routing

**File**: [i18n/routing.ts](i18n/routing.ts)

```
/en/*     ← English pages (default, prefix as-needed means URLs can omit 'en')
/ar/*     ← Arabic pages (always prefixed with 'ar')

Examples:
/products          ← redirects to /en/products
/en/products       ← English products page
/ar/products       ← Arabic products page
```

### Navigation Helpers

**File**: [i18n/navigation.ts](i18n/navigation.ts)

Provides locale-aware functions:

- `Link` - Next.js Link with locale support
- `redirect` - Navigate with locale support
- `usePathname` - Get pathname without locale
- `useRouter` - Localized router
- `getPathname` - Get path for specific locale

### Request Handling

**File**: [i18n/request.ts](i18n/request.ts)

- Server-side i18n setup
- Loads locale-specific messages/translations
- Validates locale param
- Fallback to default locale

### RTL Support

**Layout**: [app/(public)/[locale]/layout.tsx](<app/(public)/[locale]/layout.tsx>)

```typescript
<html dir={localeDirection[locale]} lang={locale}>
```

**CSS**: [app/globals.css](app/globals.css)

- CSS variables support RTL/LTR
- Text alignment flips in RTL
- Margin/padding flips in RTL
- Tailwind includes RTL modifiers

---

## SEO & METADATA

### SEO Utilities

**File**: [lib/seo.ts](lib/seo.ts)

**Functions**:

1. `getSiteUrl()` - Get absolute site URL
2. `getAbsoluteUrl(pathname)` - Convert relative to absolute URL
3. `getLocalizedPath(locale, pathname)` - Get locale-prefixed path
4. `buildLocaleAlternates(pathname)` - Generate hreflang alternates
5. `createPublicMetadata(input)` - Build Next.js Metadata object
6. `buildOgImageUrl(title, locale)` - Generate dynamic OG image URL

### Metadata Generation

**Homepage Example**:

```typescript
const metadata = createPublicMetadata({
  title: "Damira Pharma",
  description: "Leading pharmaceutical solutions in the Middle East",
  path: "/en",
  locale: "en",
  ogImage: { title: "Damira Pharma" },
});
```

**Product Page Example**:

```typescript
const metadata = createPublicMetadata({
  title: product.name,
  description: product.description,
  path: `/products/${product.slug}`,
  locale,
  ogImage: { title: product.name },
});
```

### Metadata Components

Each page generates:

- `title` - Page title
- `description` - Meta description
- `keywords` - SEO keywords
- `openGraph` - OG tags (image, title, description)
- `twitter` - Twitter card data
- `alternates` - hreflang for locale alternates

### Sitemap

**File**: [app/sitemap.ts](app/sitemap.ts)

Dynamically generates sitemap with:

- All public pages (both locales)
- All published products
- Locale alternate links
- Last modified dates

URL: `/sitemap.xml`

### Robots

**File**: [app/robots.ts](app/robots.ts)

Robots.txt configuration:

- Allow all bots to crawl public pages
- Disallow admin section
- Point to sitemap

URL: `/robots.txt`

### OG Image Generator

**File**: [app/og/route.tsx](app/og/route.tsx)

Dynamic Open Graph image generation:

**Parameters**:

- `title` - Page title
- `locale` - Language (en/ar)

**Features**:

- Gradient background
- Localized layout (RTL for Arabic)
- Consistent branding
- Font support for Arabic

**Usage**:

```html
<meta property="og:image" content="/og?title=Product%20Name&locale=en" />
```

---

## FILE STRUCTURE

### Quick Reference by Category

**Routes & Pages**:

- [app/(public)/[locale]/layout.tsx](<app/(public)/[locale]/layout.tsx>)
- [app/(public)/[locale]/page.tsx](<app/(public)/[locale]/page.tsx>) - Homepage
- [app/(public)/[locale]/products/page.tsx](<app/(public)/[locale]/products/page.tsx>)
- [app/(public)/[locale]/products/[slug]/page.tsx](<app/(public)/[locale]/products/[slug]/page.tsx>)
- [app/(public)/[locale]/contact/page.tsx](<app/(public)/[locale]/contact/page.tsx>)
- [app/(public)/[locale]/about/page.tsx](<app/(public)/[locale]/about/page.tsx>)
- [app/(public)/[locale]/services/page.tsx](<app/(public)/[locale]/services/page.tsx>)
- [app/(public)/[locale]/partnerships/page.tsx](<app/(public)/[locale]/partnerships/page.tsx>)
- [app/(public)/[locale]/compliance/page.tsx](<app/(public)/[locale]/compliance/page.tsx>)

**Business Logic (Queries & Submissions)**:

- [lib/actions/public-products.ts](lib/actions/public-products.ts) - Product queries
- [lib/actions/public-forms.ts](lib/actions/public-forms.ts) - Form submissions
- [lib/public-pages.ts](lib/public-pages.ts) - Published page queries
- [lib/public-page-fallbacks.ts](lib/public-page-fallbacks.ts) - Fallback content

**Navigation & Layout**:

- [components/public/site-header.tsx](components/public/site-header.tsx) - Header
- [components/public/site-footer.tsx](components/public/site-footer.tsx) - Footer
- [components/public/language-switcher.tsx](components/public/language-switcher.tsx) - Language toggle

**Content & Sections**:

- [components/public/section-renderer.tsx](components/public/section-renderer.tsx) - Section rendering
- [components/public/page-content.tsx](components/public/page-content.tsx) - Page wrapper
- [components/public/scroll-reveal.tsx](components/public/scroll-reveal.tsx) - Scroll animations

**Products**:

- [components/public/products/product-card.tsx](components/public/products/product-card.tsx) - Product card
- [components/public/products/catalog-controls.tsx](components/public/products/catalog-controls.tsx) - Filters
- [components/public/products/product-pagination.tsx](components/public/products/product-pagination.tsx) - Pagination
- [lib/catalog/catalog-query.ts](lib/catalog/catalog-query.ts) - URL parsing

**Forms**:

- [components/public/forms/public-inquiry-form.tsx](components/public/forms/public-inquiry-form.tsx) - Form component
- [lib/actions/public-forms.ts](lib/actions/public-forms.ts) - Form submission action

**Utilities**:

- [lib/seo.ts](lib/seo.ts) - SEO metadata
- [i18n/config.ts](i18n/config.ts) - i18n configuration
- [i18n/routing.ts](i18n/routing.ts) - i18n routing
- [i18n/navigation.ts](i18n/navigation.ts) - i18n helpers
- [app/sitemap.ts](app/sitemap.ts) - Sitemap generation
- [app/robots.ts](app/robots.ts) - Robots.txt
- [app/og/route.tsx](app/og/route.tsx) - OG image generator

**Loading & Error**:

- [components/public/loading/public-page-skeleton.tsx](components/public/loading/public-page-skeleton.tsx) - Loading skeleton
- [app/(public)/[locale]/error.tsx](<app/(public)/[locale]/error.tsx>) - Error boundary
- [app/(public)/[locale]/not-found.tsx](<app/(public)/[locale]/not-found.tsx>) - 404 page

---

## DATABASE MODELS - PUBLIC CONTEXT

### Products

Used for public product catalog:

- Product (name, description, status, type, category, manufacturer, cover image)
- ProductTranslation (bilingual title/description)
- ProductAdvancedDetails (storage conditions, regulatory info)
- ProductAttachment (downloadable files/datasheets)
- Category
- TherapeuticArea
- Manufacturer

### Pages

Used for dynamic page content:

- Page (slug, publishedAt)
- PageTranslation (bilingual title, metaTitle, metaDescription)
- PageSection (type, order, data)
- PageSectionTranslation (section content translations)

### Form Submissions

Stores public form submissions:

- FormSubmission (type, status, name, email, phone, company, message, inquiry type)

---

## DEVELOPMENT QUICK START

### Viewing Pages

**On development server** (`npm run dev`):

- English homepage: `http://localhost:3000/en`
- Arabic homepage: `http://localhost:3000/ar`
- Products: `http://localhost:3000/en/products`
- Product detail: `http://localhost:3000/en/products/product-slug`
- Contact: `http://localhost:3000/en/contact`

### Adding New Dynamic Page

1. Create page content in database or admin interface
2. Set slug to match route (e.g., "about")
3. Create sections with desired layout types
4. Publish page
5. Visit `/en/slug` (auto-generates for Arabic too)

### Content Management

1. Admin publishes content → Appears on public site
2. Products marked as AVAILABLE → Show in catalog
3. Pages published → Display with sections
4. Forms submitted → Admin sees in forms dashboard

---

## DEPLOYMENT & ENVIRONMENT

### Required Environment Variables

```
DATABASE_URL=postgresql://...        # PostgreSQL database
NEXTAUTH_SECRET=...                  # NextAuth JWT secret
NEXTAUTH_URL=https://yourdomain.com # Auth callback URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com # Site URL for OG images
```

### Build & Run

```bash
npm run build    # Production build
npm run start    # Start production server
npm run dev      # Development server (localhost:3000)
npm run lint     # Check code quality
```

### Deployment Steps

1. Build: `npm run build`
2. Test production build locally: `npm run start`
3. Deploy to Vercel or your hosting platform
4. Set environment variables on hosting
5. Site automatically available at yourdomain.com

---

## PERFORMANCE OPTIMIZATIONS

1. **Server-Side Rendering** - All pages pre-rendered for SEO
2. **Image Optimization** - Next.js Image component with lazy loading
3. **CSS** - Tailwind CSS with tree-shaking
4. **JavaScript** - Server components reduce client JS bundle
5. **Caching** - Published content cached appropriately
6. **Sitemap & Robots** - Optimized for search engines
7. **Scroll Reveal** - Intersection Observer for efficient animations

---

## CONCLUSION

The public website is a high-performance, multi-language pharmaceutical website with:

- ✅ Dynamic content management from admin dashboard
- ✅ Bilingual support (English/Arabic with RTL)
- ✅ Product catalog with filters and search
- ✅ Form submissions for customer inquiries
- ✅ SEO-optimized with meta tags, sitemap, robots.txt
- ✅ Server-side rendering for fast page loads
- ✅ Responsive design for all devices
- ✅ Fallback content ensures site always displays
- ✅ Type-safe with full TypeScript coverage
- ✅ Modern React 19 server components

The architecture allows admins to create and manage all public content from the admin dashboard, with immediate availability on the public site.
