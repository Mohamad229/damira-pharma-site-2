# وثائق قسم الإدارة - Damira Pharma

**المشروع**: نظام إدارة محتوى الصيدليات مع لوحة تحكم الإدارة  
**المكدس التقني**: Next.js 16 + React 19  
**الهدف**: نظام إدارة محتوى شامل لمستخدمي الإدارة (أدوار ADMIN، INTERNAL_USER)

---

## جدول المحتويات

1. [نظرة عامة على البنية المعمارية](#نظرة-عامة-على-البنية-المعمارية)
2. [المصادقة والتفويض](#المصادقة-والتفويض)
3. [تخطيط الإدارة والملاحة](#تخطيط-الإدارة-والملاحة)
4. [منطق الأعمال - إجراءات الخادم](#منطق-الأعمال)
5. [صفحات ومسارات الإدارة](#صفحات-ومسارات-الإدارة)
6. [مكونات الإدارة](#مكونات-الإدارة)
7. [النماذج والمحررات](#النماذج-والمحررات)
8. [مخطط قاعدة البيانات](#مخطط-قاعدة-البيانات)
9. [هيكل الملفات](#هيكل-الملفات)

---

## نظرة عامة على البنية المعمارية

### هيكل الطبقات

```
┌─────────────────────────────────────────┐
│       صفحات الإدارة (المسارات)        │
│   /admin/* (جميع المسارات المحمية)     │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│      مكونات الإدارة                    │
│   النماذج والمحررات والجداول والنوافذ │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│   إجراءات الخادم (منطق الأعمال)        │
│   /lib/actions/*.ts (عمليات CRUD)      │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│      قاعدة البيانات (Prisma + PostgreSQL)   │
└─────────────────────────────────────────┘

تدفق المصادقة:
middleware.ts → التحقق من الجلسة → إعادة التوجيه إلى /admin/login إذا لزم الأمر
```

### أنماط التصميم الرئيسية

1. **إجراءات الخادم** - تستخدم جميع الطفرات توجيه `'use server'`
2. **مكونات العميل** - واجهة الإدارة تستخدم `'use client'` للتفاعل
3. **الحد من البيانات Zod** - تحقق من جميع المدخلات قبل عمليات قاعدة البيانات
4. **نمط حالة الإجراء** - أنواع إرجاع موحدة: `{ error?, success?, data? }`
5. **وصول متحكم به بناءً على الأدوار** - يتطلب دور `ADMIN` لمعظم العمليات

---

## المصادقة والتفويض

### إعدادات المصادقة

**الملف**: [lib/auth.ts](lib/auth.ts)  
**الهدف**: إعدادات NextAuth مع جلسات JWT وتسجيل الدخول عبر البريد الإلكتروني والكلمة المرورية  
**الصادرات**:

- `handlers` - نقاط نهاية المصادقة GET/POST
- `auth()` - الحصول على الجلسة الحالية
- `signIn()` - بدء تسجيل الدخول
- `signOut()` - تسجيل الخروج

**الميزات**:

- المصادقة عبر البريد الإلكتروني والكلمة المرورية باستخدام موفر بيانات اعتماد
- جلسات JWT (انتهاء الصلاحية في 30 يوماً)
- تجزئة الكلمة المرورية باستخدام bcrypt
- تحميل Prisma بطريقة سيئة فقط أثناء المصادقة

### أدوات المصادقة

**الملف**: [lib/auth-utils.ts](lib/auth-utils.ts)  
**الهدف**: وظائف مساعدة للتحقق من المصادقة في مكونات الخادم/الإجراءات  
**الصادرات**:

- `getCurrentUser()` - الحصول على المستخدم الحالي أو غير محدد
- `requireAuth()` - تطلب المصادقة، رمي خطأ إذا كان مفقوداً
- `requireRole(roles)` - تطلب دوراً معيناً
- `hasRole(roles)` - التحقق من الدور (إرجاع قيمة منطقية)
- `isAdmin()` - هل المستخدم مسؤول؟

### تدفق تسجيل الدخول

```
1. يزور المستخدم /admin (middleware.ts يتحقق من المصادقة)
2. لا توجد جلسة → إعادة التوجيه إلى /admin/login
3. يرسل المستخدم بيانات اعتماد على صفحة تسجيل الدخول
4. الإجراء: lib/actions/auth.ts → login()
5. تم التحقق من الكلمة المرورية، تم إصدار رمز JWT
6. تخزين الجلسة في المتصفح
7. إعادة التوجيه إلى /admin عند النجاح
```

**الملفات ذات الصلة**:

- [middleware.ts](middleware.ts) - حماية المسار
- [app/(admin)/admin/login/page.tsx](<app/(admin)/admin/login/page.tsx>) - نموذج تسجيل الدخول
- [lib/actions/auth.ts](lib/actions/auth.ts) - إجراءات تسجيل الدخول/الخروج

---

## تخطيط الإدارة والملاحة

### هيكل التخطيط

```
/admin/layout.tsx
├── SidebarProvider (إدارة الحالة)
├── AdminSidebar (قائمة الملاحة)
├── AdminHeader (فتات الخبز وقائمة المستخدم)
└── main (منطقة محتوى الصفحة)
```

### الملفات

**التخطيط**: [app/(admin)/admin/layout.tsx](<app/(admin)/admin/layout.tsx>)

- يغلف جميع صفحات الإدارة
- يوفر سياق الشريط الجانبي
- ينشئ تخطيط سريع الاستجابة

**الشريط الجانبي**: [components/admin/admin-sidebar.tsx](components/admin/admin-sidebar.tsx)

- قائمة الملاحة مع الرموز
- تسليط الضوء على المسار النشط
- قابل للطي على سطح المكتب
- قسم الملف الشخصي للمستخدم
- زر تسجيل الخروج

**عناصر الملاحة**:

- لوحة التحكم → `/admin`
- المنتجات → `/admin/products`
- الصفحات → `/admin/pages`
- الوسائط → `/admin/media`
- النماذج → `/admin/forms`
- الإعدادات → `/admin/settings`
- المستخدمون → `/admin/users`

**رأس**: [components/admin/admin-header.tsx](components/admin/admin-header.tsx)

- تبديل القائمة للجوال
- ملاحة الفتات
- مكون البحث
- قائمة المستخدم مع الصورة الرمزية

**موفر الشريط الجانبي**: [components/admin/sidebar-provider.tsx](components/admin/sidebar-provider.tsx)

- سياق لحالة الشريط الجانبي (`isCollapsed`، `isMobileOpen`)
- استمرار localStorage
- إغلاق زر Escape على الجوال
- إدارة حجب التمرير

**المكونات ذات الصلة**:

- [components/admin/breadcrumbs.tsx](components/admin/breadcrumbs.tsx) - فتات الملاحة
- [components/admin/nav-item.tsx](components/admin/nav-item.tsx) - عنصر قائمة الشريط الجانبي

---

## منطق الأعمال - إجراءات الخادم

جميع منطق الأعمال في `/lib/actions/` ويستخدم نمط إجراءات الخادم.

### 1. إدارة المصادقة

**الملف**: [lib/actions/auth.ts](lib/actions/auth.ts)

```typescript
export async function login(prevState, formData): Promise<ActionState>;
export async function logout(): Promise<void>;
```

**الاستخدام**: تسجيل الدخول/الخروج على صفحات الإدارة  
**التحقق**: تنسيق البريد الإلكتروني والكلمة المرورية المطلوبة  
**الصفحات ذات الصلة**:

- [app/(admin)/admin/login/page.tsx](<app/(admin)/admin/login/page.tsx>)

---

### 2. إدارة المستخدمين (الإدارة)

**الملف**: [lib/actions/users.ts](lib/actions/users.ts)

**الدوال**:

```typescript
getUsers(page?, limit?)                    // قائمة المستخدمين المرقمة
getUserById(id)                            // تفاصيل مستخدم واحد
createUser(data)                           // إنشاء مستخدم إداري جديد
updateUser(id, data)                       // تحديث معلومات المستخدم
deleteUser(id)                             // حذف مستخدم
updateCurrentUser(data)                    // تحديث ملفك الخاص
```

**الميزات الرئيسية**:

- تجزئة كلمات المرور باستخدام bcrypt (12 جولة ملح)
- كلمات المرور مستبعدة من الاستجابات
- دعم الترقيم
- تعيين الدور (ADMIN، INTERNAL_USER)

**الصفحات ذات الصلة**:

- [app/(admin)/admin/users/page.tsx](<app/(admin)/admin/users/page.tsx>) - قائمة المستخدمين
- [app/(admin)/admin/users/new/page.tsx](<app/(admin)/admin/users/new/page.tsx>) - إنشاء مستخدم
- [app/(admin)/admin/users/[id]/edit/page.tsx](<app/(admin)/admin/users/[id]/edit/page.tsx>) - تحرير المستخدم
- [app/(admin)/admin/users/profile/page.tsx](<app/(admin)/admin/users/profile/page.tsx>) - ملفي الشخصي

**المكونات ذات الصلة**:

- [components/admin/user-form-client.tsx](<app/(admin)/admin/users/user-form-client.tsx>) - النموذج
- [components/admin/users-table-client.tsx](<app/(admin)/admin/users/users-table-client.tsx>) - جدول قائمة المستخدمين

---

### 3. إدارة المنتجات

**الملف**: [lib/actions/products.ts](lib/actions/products.ts)

**الدوال**:

```typescript
getProducts(options?)                      // قائمة المنتجات المصفاة مع الترقيم
getProductById(id)                         // تفاصيل المنتج الكاملة
createProduct(data)                        // إنشاء منتج بسيط/متقدم
updateProduct(id, data)                    // تحديث المنتج
deleteProduct(id)                          // حذف المنتج
publishProduct(id)                         // جعل المنتج عاماً
unpublishProduct(id)                       // جعل المنتج خاصاً
```

**المرشحات المدعومة**:

- النوع: SIMPLE، ADVANCED
- الحالة: AVAILABLE، PIPELINE
- الفئة، منطقة علاجية
- البحث بالاسم
- الترتيب حسب: الاسم، تاريخ الإنشاء، الحالة

**الميزات الرئيسية**:

- توليد URL slugs تلقائي
- منع slugs مكررة
- تتبع استخدام المنتج في النماذج/الصفحات
- دعم الترجمات ثنائية اللغة (EN/AR)
- معالجة مرفقات الوسائط
- تفاصيل متقدمة للمنتجات المعقدة

**الصفحات ذات الصلة**:

- [app/(admin)/admin/products/page.tsx](<app/(admin)/admin/products/page.tsx>) - قائمة المنتجات
- [app/(admin)/admin/products/new/page.tsx](<app/(admin)/admin/products/new/page.tsx>) - إنشاء منتج
- [app/(admin)/admin/products/[id]/edit/page.tsx](<app/(admin)/admin/products/[id]/edit/page.tsx>) - تحرير المنتج

**المكونات ذات الصلة**:

- [products/product-form-client.tsx](<app/(admin)/admin/products/product-form-client.tsx>) - نموذج المنتج
- [products/products-table-client.tsx](<app/(admin)/admin/products/products-table-client.tsx>) - جدول المنتجات

**نماذج قاعدة البيانات المستخدمة**:

- Product
- ProductTranslation
- ProductAdvancedDetails
- ProductAttachment
- Category
- TherapeuticArea
- Manufacturer

---

### 4. إدارة الصفحات

**الملف**: [lib/actions/pages.ts](lib/actions/pages.ts)

**الدوال**:

```typescript
getPages(page?, pageSize?)                 // قائمة الصفحات المرقمة
getPageById(id)                            // الصفحة مع الأقسام والترجمات
createPage(data)                           // إنشاء صفحة جديدة
updatePage(id, data)                       // تحديث البيانات الوصفية للصفحة
deletePage(id)                             // حذف الصفحة مع جميع الأقسام
getPageSections(pageId)                    // الحصول على أقسام الصفحة
createSection(data)                        // إضافة قسم إلى الصفحة
updateSection(id, data)                    // تحديث محتوى القسم
deleteSection(id)                          // إزالة القسم
reorderSections(pageId, sections)          // إعادة ترتيب الأقسام
```

**أنواع الأقسام المدعومة**:

1. HERO - أقسام اللافتات بزر CTA
2. TEXT - محتوى نص غني
3. CARDS - تخطيط شبكة البطاقات
4. STATS - عرض الإحصائيات
5. FEATURES - قوائم الميزات
6. CTA - أقسام استدعاء الإجراء
7. IMAGE_TEXT - تخطيط الصورة + النص

**الميزات الرئيسية**:

- توليد slug تلقائي مع التحقق من التفرد
- ترتيب الأقسام داخل الصفحات
- محتوى ثنائي اللغة لكل قسم
- عمليات CRUD كاملة مع التحقق

**الصفحات ذات الصلة**:

- [app/(admin)/admin/pages/page.tsx](<app/(admin)/admin/pages/page.tsx>) - قائمة الصفحات
- [app/(admin)/admin/pages/new/page.tsx](<app/(admin)/admin/pages/new/page.tsx>) - إنشاء صفحة
- [app/(admin)/admin/pages/[id]/edit/page.tsx](<app/(admin)/admin/pages/[id]/edit/page.tsx>) - تحرير الصفحة

**المكونات ذات الصلة**:

- [pages/page-form-client.tsx](<app/(admin)/admin/pages/page-form-client.tsx>) - نموذج الصفحة
- [pages/pages-table-client.tsx](<app/(admin)/admin/pages/pages-table-client.tsx>) - جدول الصفحات
- [pages/[id]/edit/page-editor-client.tsx](<app/(admin)/admin/pages/[id]/edit/page-editor-client.tsx>) - المحرر

**محررات الأقسام**:

- [sections/hero-section-editor.tsx](<app/(admin)/admin/pages/sections/hero-section-editor.tsx>)
- [sections/text-section-editor.tsx](<app/(admin)/admin/pages/sections/text-section-editor.tsx>)
- [sections/image-text-section-editor.tsx](<app/(admin)/admin/pages/sections/image-text-section-editor.tsx>)
- [sections/stats-section-editor.tsx](<app/(admin)/admin/pages/sections/stats-section-editor.tsx>)
- [sections/features-section-editor.tsx](<app/(admin)/admin/pages/sections/features-section-editor.tsx>)
- [sections/cards-section-editor.tsx](<app/(admin)/admin/pages/sections/cards-section-editor.tsx>)
- [sections/cta-section-editor.tsx](<app/(admin)/admin/pages/sections/cta-section-editor.tsx>)

**نماذج قاعدة البيانات المستخدمة**:

- Page
- PageTranslation
- PageSection
- PageSectionTranslation

---

### 5. إدارة تقديم النماذج

**الملف**: [lib/actions/forms.ts](lib/actions/forms.ts)

**الدوال**:

```typescript
getFormSubmissions(options); // البحث/فلترة التقديمات
getFormSubmissionById(id); // تفاصيل التقديم الفردي
updateSubmissionStatus(id, status); // تغيير الحالة (NEW/REVIEWED/ARCHIVED)
deleteFormSubmission(id); // إزالة التقديم
getFormSubmissionStats(); // إحصائيات لوحة التحكم
exportFormSubmissions(format); // تصدير إلى CSV/JSON
```

**أنواع النماذج**:

- CONTACT - استفسارات عامة
- PARTNERSHIP - طلبات الشراكة
- PRODUCT_INQUIRY - أسئلة المنتج

**حالات الحالة**:

- NEW - غير معالج
- REVIEWED - جاري معالجته
- ARCHIVED - مكتمل/مغلق

**خيارات الفلترة**:

- حسب النوع والحالة ونطاق التاريخ
- البحث باسم/بريد إلكتروني
- الترتيب حسب حقول متعددة
- الترقيم

**الصفحات ذات الصلة**:

- [app/(admin)/admin/forms/page.tsx](<app/(admin)/admin/forms/page.tsx>) - قائمة النماذج
- [app/(admin)/admin/forms/[id]/page.tsx](<app/(admin)/admin/forms/[id]/page.tsx>) - تفاصيل النموذج

**المكونات ذات الصلة**:

- [forms/forms-table-client.tsx](<app/(admin)/admin/forms/forms-table-client.tsx>) - جدول النماذج
- [forms/[id]/form-detail-client.tsx](<app/(admin)/admin/forms/[id]/form-detail-client.tsx>) - عرض التفاصيل

**نموذج قاعدة البيانات المستخدم**:

- FormSubmission

---

### 6. إدارة الوسائط

**الملف**: [lib/actions/media.ts](lib/actions/media.ts)

**الدوال**:

```typescript
getMedia(options); // قائمة الوسائط المرقمة
getMediaById(id); // ملف وسائط واحد
updateMediaName(id, name); // إعادة تسمية الوسائط
deleteMedia(id); // إزالة ملف واحد
deleteMultipleMedia(ids); // حذف دفعة
getMediaStats(); // إحصائيات استخدام التخزين
```

**البحث والفلترة**:

- البحث بالاسم الملف
- الفلترة حسب النوع (صورة، مستند)
- الترقيم مع حدود الحجم
- الترتيب حسب تاريخ التحميل

**الميزات الرئيسية**:

- تخزين معلومات المحمل
- تتبع أبعاد الصورة
- البيانات حول حجم الملف ونوع MIME
- التكامل مع وحدة التخزين

**الصفحات ذات الصلة**:

- [app/(admin)/admin/media/page.tsx](<app/(admin)/admin/media/page.tsx>) - مكتبة الوسائط

**المكونات ذات الصلة**:

- [media/media-library-client.tsx](<app/(admin)/admin/media/media-library-client.tsx>) - عرض المكتبة
- [media/media-card.tsx](components/admin/media/media-card.tsx) - بطاقة ملف فردي
- [media/upload-dialog.tsx](components/admin/media/upload-dialog.tsx) - واجهة التحميل
- [components/admin/media-picker.tsx](components/admin/media-picker.tsx) - محدد الوسائط
- [components/admin/media-field.tsx](components/admin/media-field.tsx) - عنصر نموذج غلاف

**مسارات API**:

- [app/api/admin/media/upload/route.ts](app/api/admin/media/upload/route.ts) - تحميل الملف

**نموذج قاعدة البيانات المستخدم**:

- Media

---

### 7. إدارة الإعدادات

**الملف**: [lib/actions/settings.ts](lib/actions/settings.ts)

إدارة جداول البحث والإعدادات على مستوى الموقع:

**الفئات**:

```typescript
getCategories();
createCategory(data);
updateCategory(id, data);
deleteCategory(id);
```

**المناطق العلاجية**:

```typescript
getTherapeuticAreas();
createTherapeuticArea(data);
updateTherapeuticArea(id, data);
deleteTherapeuticArea(id);
```

**الشركات المصنعة**:

```typescript
getManufacturers();
createManufacturer(data);
updateManufacturer(id, data);
deleteManufacturer(id);
```

**إعدادات الموقع**:

```typescript
getSiteSetting(key);
updateSiteSetting(key, value);
```

**الصفحات ذات الصلة**:

- [app/(admin)/admin/settings/page.tsx](<app/(admin)/admin/settings/page.tsx>) - صفحة الإعدادات

**المكونات ذات الصلة**:

- [settings/settings-management-client.tsx](<app/(admin)/admin/settings/settings-management-client.tsx>) - نموذج الإعدادات

**نماذج قاعدة البيانات المستخدمة**:

- Category
- TherapeuticArea
- Manufacturer
- SiteSetting

---

## مخططات التحقق

### مخطط نموذج الصفحة

**الملف**: [lib/schemas/page-form.ts](lib/schemas/page-form.ts)

يتحقق من إنشاء/تحرير الصفحة والقسم مع Zod:

```typescript
PageCreateSchema; // التحقق من إنشاء صفحة جديدة
PageUpdateSchema; // التحقق من تحديثات الصفحة
SectionCreateSchema; // التحقق من إنشاء القسم
SectionUpdateSchema; // التحقق من تحديثات القسم
SectionReorderSchema; // التحقق من إعادة ترتيب القسم
generateSlug(title); // توليد slugs آمنة للعناوين
```

**التحقق من الحقول**:

- العنوان: 1-255 حروف مطلوب
- Slug: أحرف صغيرة وشرطات وتوليد تلقائي وفريد
- MetaTitle: 0-60 حروف (SEO)
- MetaDescription: 0-160 حروف (SEO)
- isPublished: منطقي
- Translations: البيانات الوصفية EN/AR

---

### مخطط نموذج المنتج

**الملف**: [lib/schemas/product-form.ts](lib/schemas/product-form.ts)

يتحقق من نماذج المنتجات مع الوسائط والترجمات:

```typescript
ProductFormSchema; // التحقق الأساسي
CreateProductFormSchema; // مطلوب للإنشاء
UpdateProductFormSchema; // اختياري للتحديثات
```

**التحقق من الحقول**:

- الاسم: 1-200 حرف
- الوصف: 0-5000 حرف
- النوع: SIMPLE أو ADVANCED
- الحالة: AVAILABLE أو PIPELINE
- الفئة: مطلوبة
- المنطقة العلاجية: اختياري
- الشركة المصنعة: مطلوبة
- صورة الغلاف: اختياري
- المرفقات: مجموعة

---

## صفحات ومسارات الإدارة

### هيكل المسار

```
/admin/
├── login
│   └── page.tsx              # نموذج تسجيل الدخول
├── layout.tsx                # غلاف الإدارة
├── page.tsx                  # لوحة التحكم
├── products/
│   ├── page.tsx              # قائمة المنتجات
│   ├── product-form-client.tsx
│   ├── products-table-client.tsx
│   ├── new/
│   │   └── page.tsx          # إنشاء منتج
│   └── [id]/edit/
│       └── page.tsx          # تحرير المنتج
├── pages/
│   ├── page.tsx              # قائمة الصفحات
│   ├── page-form-client.tsx
│   ├── pages-table-client.tsx
│   ├── new/
│   │   └── page.tsx          # إنشاء صفحة
│   ├── [id]/edit/
│   │   ├── page.tsx          # تحرير الصفحة
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
│   ├── page.tsx              # مكتبة الوسائط
│   └── media-library-client.tsx
├── forms/
│   ├── page.tsx              # قائمة تقديم النماذج
│   ├── forms-table-client.tsx
│   └── [id]/
│       ├── page.tsx          # تفاصيل النموذج
│       └── form-detail-client.tsx
├── users/
│   ├── page.tsx              # قائمة المستخدمين
│   ├── user-form-client.tsx
│   ├── users-table-client.tsx
│   ├── new/
│   │   └── page.tsx          # إنشاء مستخدم
│   ├── [id]/edit/
│   │   └── page.tsx          # تحرير المستخدم
│   └── profile/
│       └── page.tsx          # ملفي الشخصي
├── settings/
│   ├── page.tsx              # الإعدادات
│   └── settings-management-client.tsx
├── loading.tsx               # هيكل التحميل
├── not-found.tsx             # صفحة 404
└── error.tsx                 # حدود الخطأ
```

---

## مكونات الإدارة

### مكونات التخطيط

**الشريط الجانبي للإدارة** [components/admin/admin-sidebar.tsx](components/admin/admin-sidebar.tsx)

- قائمة الملاحة القابلة للطي
- تسليط الضوء على المسار النشط
- قسم الملف الشخصي للمستخدم
- زر تسجيل الخروج

**رأس الإدارة** [components/admin/admin-header.tsx](components/admin/admin-header.tsx)

- تبديل قائمة الجوال
- ملاحة فتات الخبز
- شريط البحث
- جرس الإشعارات
- قائمة المستخدم المنسدلة

**موفر الشريط الجانبي** [components/admin/sidebar-provider.tsx](components/admin/sidebar-provider.tsx)

- موفر السياق لحالة الشريط الجانبي
- استمرار localStorage
- إدارة حالة الجوال/سطح المكتب

---

### مكونات الملاحة

**فتات الخبز** [components/admin/breadcrumbs.tsx](components/admin/breadcrumbs.tsx)

- توليد تلقائي من اسم المسار
- دعم العناصر المخصصة
- علامات نشطة

**عنصر الملاحة** [components/admin/nav-item.tsx](components/admin/nav-item.tsx)

- عنصر قائمة الشريط الجانبي
- دعم الرموز
- تسليط الضوء على الحالة النشطة

---

### مكونات لوحة التحكم

**رأس الصفحة** [components/admin/page-header.tsx](components/admin/page-header.tsx)

- عنوان وصف موحد للصفحة
- قسم أزرار الإجراء

**بطاقة الإحصائيات** [components/admin/stats-card.tsx](components/admin/stats-card.tsx)

- عرض إحصائيات لوحة التحكم
- رمز وتسمية وقيمة
- الملمسات اللونية
- حالة التحميل

**الإجراءات السريعة** [components/admin/quick-actions.tsx](components/admin/quick-actions.tsx)

- أزرار الملاحة السريعة
- إنشاء منتج وإنشاء صفحة وتحميل وسائط

**النشاط الأخير** [components/admin/recent-activity.tsx](components/admin/recent-activity.tsx)

- مكون خلاصة النشاط
- يعرض التغييرات الأخيرة

**الهياكل العظمية** [components/admin/skeletons.tsx](components/admin/skeletons.tsx)

- عناصر نائبة للتحميل
- أنواع هياكل عظمية مختلفة

---

### مكونات إدخال النموذج

**علامات اللغة** [components/admin/language-tabs.tsx](components/admin/language-tabs.tsx)

- مبدل محتوى ثنائي اللغة
- علامات EN/AR
- مؤشرات التغييرات غير المحفوظة

**حقل المجموعة الديناميكية** [components/admin/dynamic-array-field.tsx](components/admin/dynamic-array-field.tsx)

- إدارة المصفوفات في النماذج (الإحصائيات والبطاقات والميزات)
- إضافة/إزالة/تحرير العناصر
- حد الحد الأقصى للعناصر
- وظيفة الاستدعاء المخصصة

**حقل الوسائط** [components/admin/media-field.tsx](components/admin/media-field.tsx)

- تحديد الوسائط واحد في النماذج
- عرض المعاينة
- أزرار حذف/استبدال
- عرض نسبة العرض إلى الارتفاع

**محدد الوسائط** [components/admin/media-picker.tsx](components/admin/media-picker.tsx)

- نافذة لتحديد الوسائط من المكتبة
- البحث وفلترة النوع
- تحديد واحد/متعدد
- الترقيم

---

### محرر النص الغني

**محرر Tiptap** [components/admin/tiptap-editor.tsx](components/admin/tiptap-editor.tsx)

- محرر نص غني للمحتوى
- دعم ثنائي اللغة (RTL لـ AR)
- إدارة مثيل المحرر

**شريط أدوات Tiptap** [components/admin/tiptap-toolbar.tsx](components/admin/tiptap-toolbar.tsx)

- أزرار تنسيق المحرر
- تنسيق النص والقوائم والروابط والصور
- كتل الأكواد مع تمييز بناء الجملة

**نافذة رابط Tiptap** [components/admin/tiptap-link-modal.tsx](components/admin/tiptap-link-modal.tsx)

- حوار لإدراج/تحرير الروابط
- التحقق من صحة العنوان

**نافذة صورة Tiptap** [components/admin/tiptap-image-modal.tsx](components/admin/tiptap-image-modal.tsx)

- حوار لإدراج/تحرير الصور
- تكامل محدد الوسائط

---

### مكونات إدارة الوسائط

**مكتبة الوسائط** [components/admin/media/media-library.tsx](components/admin/media/media-library.tsx)

- واجهة إدارة الوسائط المستقلة
- عرض الشبكة/القائمة

**بطاقة الوسائط** [components/admin/media/media-card.tsx](components/admin/media/media-card.tsx)

- بطاقة ملف وسائط فردية
- معاينة الصورة المصغرة
- مربع اختيار التحديد
- أزرار الإجراء (عرض وتحرير وحذف)

**حوار التحميل** [components/admin/media/upload-dialog.tsx](components/admin/media/upload-dialog.tsx)

- نافذة لتحميل الملفات
- منطقة تحميل السحب
- حوار تحديد الملف
- تتبع التقدم
- تحميل ملفات متعددة
- معالجة الأخطاء

---

### مكونات الأداة

**بطاقة القسم** [components/admin/section-card.tsx](components/admin/section-card.tsx)

- بطاقة لعرض أقسام الصفحة
- شارة نوع القسم
- إجراءات التحرير/الحذف

---

## النماذج والمحررات

### نموذج المنتج

**الملف**: [app/(admin)/admin/products/product-form-client.tsx](<app/(admin)/admin/products/product-form-client.tsx>)

**الميزات**:

- إدخال ثنائي اللغة (علامات EN/AR)
- تحديد نوع المنتج (SIMPLE/ADVANCED)
- تحديد الحالة (AVAILABLE/PIPELINE)
- القوائم المنسدلة للفئة والشركة المصنعة
- محدد صورة الغلاف
- إدارة المرفقات
- قسم التفاصيل المتقدمة (للمنتجات المتقدمة)
- التحقق من النموذج مع Zod
- إجراءات الإرسال/الإلغاء

**تدفق البيانات**:

1. يتلقى النموذج بيانات المنتج الأولية (للتحرير) أو فارغة (للإنشاء)
2. يملأ المستخدم محتوى ثنائي اللغة
3. النموذج يتحقق باستخدام ProductFormSchema
4. تم استدعاء إجراء الخادم: `createProduct()` أو `updateProduct()`
5. إعادة تحقق من المسارات وعرض رسالة نجاح/خطأ

---

### نموذج الصفحة

**الملف**: [app/(admin)/admin/pages/page-form-client.tsx](<app/(admin)/admin/pages/page-form-client.tsx>)

**الميزات**:

- البيانات الوصفية للصفحة ثنائية اللغة (العنوان والعنوان ووصف Meta)
- إدارة القسم (إضافة وتحرير وحذف وإعادة ترتيب)
- نافذة محدد نوع القسم
- محررات الأقسام الفردية
- تبديل النشر/المسودة
- التحقق من النموذج
- توليد slug تلقائي

**تدفق محرر الصفحات**:

1. يعرض نموذج الصفحة البيانات الوصفية الأساسية
2. يفتح زر إضافة القسم محدد النوع
3. تحديد النوع يعرض محرر القسم ذي الصلة
4. تحرير تفاصيل القسم في نافذة
5. تعرض الأقسام كقائمة قابلة للإعادة
6. اسحب للإعادة أو استخدم عناصر التحكم
7. احفظ تحديثات الصفحة

---

### نموذج المستخدم

**الملف**: [app/(admin)/admin/users/user-form-client.tsx](<app/(admin)/admin/users/user-form-client.tsx>)

**الميزات**:

- حقول البريد الإلكتروني والاسم والكلمة المرورية
- تحديد الدور (ADMIN، INTERNAL_USER)
- كلمة مرور اختياري للمستخدمين الموجودين
- التحقق من النموذج
- إرسال/إلغاء

---

### نموذج الإعدادات

**الملف**: [app/(admin)/admin/settings/settings-management-client.tsx](<app/(admin)/admin/settings/settings-management-client.tsx>)

**الميزات**:

- تحرير البيانات الوصفية للموقع
- إدارة الفئات (CRUD)
- إدارة الشركات المصنعة (CRUD)
- إدارة المناطق العلاجية (CRUD)
- واجهة بعلامات للتنظيم

---

### محررات الأقسام

لكل نوع قسم محرر خاص به للمحتوى ثنائي اللغة:

**HeroSectionEditor** [app/(admin)/admin/pages/sections/hero-section-editor.tsx](<app/(admin)/admin/pages/sections/hero-section-editor.tsx>)

- العنوان والعنوان الفرعي
- إعداد زر CTA
- صورة الخلفية

**TextSectionEditor** [app/(admin)/admin/pages/sections/text-section-editor.tsx](<app/(admin)/admin/pages/sections/text-section-editor.tsx>)

- نص غني مع محرر Tiptap
- محتوى ثنائي اللغة

**ImageTextSectionEditor** [app/(admin)/admin/pages/sections/image-text-section-editor.tsx](<app/(admin)/admin/pages/sections/image-text-section-editor.tsx>)

- محدد الصورة
- محتوى النص
- تبديل موضع الصورة

**StatsSectionEditor** [app/(admin)/admin/pages/sections/stats-section-editor.tsx](<app/(admin)/admin/pages/sections/stats-section-editor.tsx>)

- مجموعة الإحصائيات الديناميكية
- قيمة الإحصائية والتسمية

**FeaturesSectionEditor** [app/(admin)/admin/pages/sections/features-section-editor.tsx](<app/(admin)/admin/pages/sections/features-section-editor.tsx>)

- مجموعة الميزات الديناميكية
- العنوان والرمز والوصف لكل ميزة

**CardsSectionEditor** [app/(admin)/admin/pages/sections/cards-section-editor.tsx](<app/(admin)/admin/pages/sections/cards-section-editor.tsx>)

- مجموعة البطاقات الديناميكية
- العنوان والصورة والوصف لكل بطاقة

**CtaSectionEditor** [app/(admin)/admin/pages/sections/cta-section-editor.tsx](<app/(admin)/admin/pages/sections/cta-section-editor.tsx>)

- عنوان CTA والوصف
- إعداد الزر

---

## مخطط قاعدة البيانات

### نماذج البيانات

**نموذج المستخدم**

```
id: String (PK)
email: String (unique)
password: String (bcrypt hashed)
name: String
role: ADMIN | INTERNAL_USER
createdAt: DateTime
updatedAt: DateTime
```

**نموذج المنتج**

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

**نموذج ترجمة المنتج**

```
id: String (PK)
productId: String (FK)
locale: en | ar
title: String
description: String
```

**نموذج تفاصيل المنتج المتقدمة**

```
id: String (PK)
productId: String (FK)
storageConditions: String
regulatoryInfo: String
```

**نموذج مرفق المنتج**

```
id: String (PK)
productId: String (FK)
mediaId: String (FK)
order: Int
```

**نموذج الصفحة**

```
id: String (PK)
slug: String (unique)
isPublished: Boolean
createdAt: DateTime
updatedAt: DateTime
→ translations: PageTranslation[]
→ sections: PageSection[]
```

**نموذج ترجمة الصفحة**

```
id: String (PK)
pageId: String (FK)
locale: en | ar
title: String
metaTitle: String nullable
metaDescription: String nullable
```

**نموذج قسم الصفحة**

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

**نموذج ترجمة قسم الصفحة**

```
id: String (PK)
sectionId: String (FK)
locale: en | ar
data: Json (localized section data)
```

**نموذج تقديم النموذج**

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

**نموذج الوسائط**

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

**نموذج الفئة**

```
id: String (PK)
name: String
slug: String
createdAt: DateTime
updatedAt: DateTime
```

**نموذج المنطقة العلاجية**

```
id: String (PK)
name: String
slug: String
createdAt: DateTime
updatedAt: DateTime
```

**نموذج الشركة المصنعة**

```
id: String (PK)
name: String
createdAt: DateTime
updatedAt: DateTime
```

**نموذج إعدادات الموقع**

```
id: String (PK)
key: String (unique)
value: String
createdAt: DateTime
updatedAt: DateTime
```

---

## هيكل الملفات

### مرجع سريع حسب الفئة

**المصادقة**:

- [lib/auth.ts](lib/auth.ts)
- [lib/auth-utils.ts](lib/auth-utils.ts)
- [lib/actions/auth.ts](lib/actions/auth.ts)
- [middleware.ts](middleware.ts)

**منطق الأعمال**:

- [lib/actions/users.ts](lib/actions/users.ts)
- [lib/actions/products.ts](lib/actions/products.ts)
- [lib/actions/pages.ts](lib/actions/pages.ts)
- [lib/actions/forms.ts](lib/actions/forms.ts)
- [lib/actions/media.ts](lib/actions/media.ts)
- [lib/actions/settings.ts](lib/actions/settings.ts)

**مخططات التحقق**:

- [lib/schemas/page-form.ts](lib/schemas/page-form.ts)
- [lib/schemas/product-form.ts](lib/schemas/product-form.ts)

**التخطيط والملاحة**:

- [app/(admin)/admin/layout.tsx](<app/(admin)/admin/layout.tsx>)
- [components/admin/admin-sidebar.tsx](components/admin/admin-sidebar.tsx)
- [components/admin/admin-header.tsx](components/admin/admin-header.tsx)
- [components/admin/sidebar-provider.tsx](components/admin/sidebar-provider.tsx)
- [components/admin/breadcrumbs.tsx](components/admin/breadcrumbs.tsx)
- [components/admin/nav-item.tsx](components/admin/nav-item.tsx)

**لوحة التحكم**:

- [app/(admin)/admin/page.tsx](<app/(admin)/admin/page.tsx>)
- [components/admin/page-header.tsx](components/admin/page-header.tsx)
- [components/admin/stats-card.tsx](components/admin/stats-card.tsx)
- [components/admin/quick-actions.tsx](components/admin/quick-actions.tsx)
- [components/admin/recent-activity.tsx](components/admin/recent-activity.tsx)

**المنتجات**:

- [app/(admin)/admin/products/page.tsx](<app/(admin)/admin/products/page.tsx>)
- [products/product-form-client.tsx](<app/(admin)/admin/products/product-form-client.tsx>)
- [products/products-table-client.tsx](<app/(admin)/admin/products/products-table-client.tsx>)

**الصفحات**:

- [app/(admin)/admin/pages/page.tsx](<app/(admin)/admin/pages/page.tsx>)
- [pages/page-form-client.tsx](<app/(admin)/admin/pages/page-form-client.tsx>)
- [pages/pages-table-client.tsx](<app/(admin)/admin/pages/pages-table-client.tsx>)
- [pages/[id]/edit/page-editor-client.tsx](<app/(admin)/admin/pages/[id]/edit/page-editor-client.tsx>)
- [pages/sections/\* editors](<app/(admin)/admin/pages/sections/>)

**الوسائط**:

- [app/(admin)/admin/media/page.tsx](<app/(admin)/admin/media/page.tsx>)
- [media/media-library-client.tsx](<app/(admin)/admin/media/media-library-client.tsx>)
- [components/admin/media/media-card.tsx](components/admin/media/media-card.tsx)
- [components/admin/media/upload-dialog.tsx](components/admin/media/upload-dialog.tsx)
- [components/admin/media-picker.tsx](components/admin/media-picker.tsx)

**النماذج**:

- [app/(admin)/admin/forms/page.tsx](<app/(admin)/admin/forms/page.tsx>)
- [forms/forms-table-client.tsx](<app/(admin)/admin/forms/forms-table-client.tsx>)
- [forms/[id]/form-detail-client.tsx](<app/(admin)/admin/forms/[id]/form-detail-client.tsx>)

**المستخدمون**:

- [app/(admin)/admin/users/page.tsx](<app/(admin)/admin/users/page.tsx>)
- [users/user-form-client.tsx](<app/(admin)/admin/users/user-form-client.tsx>)
- [users/users-table-client.tsx](<app/(admin)/admin/users/users-table-client.tsx>)

**الإعدادات**:

- [app/(admin)/admin/settings/page.tsx](<app/(admin)/admin/settings/page.tsx>)
- [settings/settings-management-client.tsx](<app/(admin)/admin/settings/settings-management-client.tsx>)

**محرر النص الغني**:

- [components/admin/tiptap-editor.tsx](components/admin/tiptap-editor.tsx)
- [components/admin/tiptap-toolbar.tsx](components/admin/tiptap-toolbar.tsx)
- [components/admin/tiptap-link-modal.tsx](components/admin/tiptap-link-modal.tsx)
- [components/admin/tiptap-image-modal.tsx](components/admin/tiptap-image-modal.tsx)
- [lib/tiptap-extensions.ts](lib/tiptap-extensions.ts)

**مكونات النموذج**:

- [components/admin/language-tabs.tsx](components/admin/language-tabs.tsx)
- [components/admin/dynamic-array-field.tsx](components/admin/dynamic-array-field.tsx)
- [components/admin/media-field.tsx](components/admin/media-field.tsx)

**الأدوات**:

- [components/admin/section-card.tsx](components/admin/section-card.tsx)
- [components/admin/skeletons.tsx](components/admin/skeletons.tsx)

---

## البدء السريع بالتطوير

### المهام الشائعة

**إنشاء منتج جديد**:

1. انتقل إلى `/admin/products/new`
2. ملء نموذج المنتج بمحتوى ثنائي اللغة
3. حدد النوع (SIMPLE/ADVANCED)
4. انقر فوق حفظ
5. إعادة توجيه إلى قائمة المنتجات

**إنشاء صفحة جديدة**:

1. انتقل إلى `/admin/pages/new`
2. أدخل عنوان الصفحة (توليد slug تلقائي)
3. أضف أقسام باستخدام زر "إضافة قسم"
4. تحرير كل قسم مع محرر مناسب
5. إعادة ترتيب الأقسام حسب الحاجة
6. انشر عند الحاجة

**تحميل الوسائط**:

1. انتقل إلى `/admin/media`
2. انقر فوق زر "تحميل"
3. السحب والإفلات أو تحديد الملفات
4. تظهر الملفات في المكتبة بعد التحميل
5. استخدم محدد الوسائط للتحديد في النماذج

**إدارة المستخدمين**:

1. انتقل إلى `/admin/users`
2. انقر فوق "مستخدم جديد" للإنشاء
3. تعيين بريد إلكتروني واسم وكلمة مرور ودور
4. يمكن تحرير المستخدمين الموجودين/حذفهم

**عرض تقديم النماذج**:

1. انتقل إلى `/admin/forms`
2. التصفية حسب النوع والحالة
3. انقر فوق التقديم لعرض التفاصيل
4. تحديث الحالة حسب الحاجة

---

## النشر والبيئة

### متغيرات البيئة المطلوبة

```
DATABASE_URL=postgresql://user:password@host:port/dbname
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
STORAGE_PROVIDER=local or s3
LOCAL_UPLOAD_DIR=public/uploads
LOCAL_BASE_URL=/uploads
```

### البناء والتشغيل

```bash
npm run build    # بناء الإنتاج
npm run start    # بدء خادم الإنتاج
npm run dev      # خادم التطوير
npm run lint     # التحقق من جودة الكود
```

---

## الخلاصة

قسم الإدارة هو نظام إدارة محتوى شامل مع:

- ✅ عمليات CRUD كاملة للمنتجات والصفحات والوسائط والنماذج والإعدادات
- ✅ دعم المحتوى ثنائي اللغة (EN/AR)
- ✅ تحرير نص غني مع Tiptap
- ✅ منشئ صفحات مرن مع عدة أنواع أقسام
- ✅ إدارة الوسائط مع التحميل والمكتبة
- ✅ تتبع تقديم النماذج
- ✅ إدارة المستخدمين مع وصول قائم على الأدوار
- ✅ مصادقة وتفويض كاملين
- ✅ التحقق من الأمان مع Zod
- ✅ تصميم سريع الاستجابة لسطح المكتب والجهاز اللوحي

جميع وظائف الإدارة مبنية مع إجراءات الخادم والسلامة من حيث النوع أنماط Next.js 16 الحديثة.
