# وثائق الموقع العام - Damira Pharma

**المشروع**: موقع ويب عام للصيدليات  
**المكدس التقني**: Next.js 16 + React 19  
**الهدف**: موقع ويب عام متعدد اللغات للمرضى والعملاء (EN/AR مع دعم RTL)

---

## جدول المحتويات

1. [معمارية الموقع](#معمارية-الموقع)
2. [المسارات والصفحات العامة](#المسارات-والصفحات-العامة)
3. [توصيل المحتوى](#توصيل-المحتوى)
4. [المكونات والواجهة](#المكونات-والواجهة)
5. [النماذج والتقديمات](#النماذج-والتقديمات)
6. [كتالوج المنتجات](#كتالوج-المنتجات)
7. [المحلية](#المحلية)
8. [السيو والبيانات الوصفية](#السيو-والبيانات-الوصفية)
9. [هيكل الملفات](#هيكل-الملفات)

---

## معمارية الموقع

### هيكل الطبقات

```
┌─────────────────────────────────────────┐
│      صفحات عامة (المسارات)            │
│   /[locale]/* (جميع الصفحات العامة)   │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│    مكونات عامة                         │
│   محتوى وأشكال وملاحة                 │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│   إجراءات عامة (الاستعلامات/التقديمات)│
│   /lib/actions/public-*.ts              │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│      قاعدة البيانات (Prisma + PostgreSQL)   │
└─────────────────────────────────────────┘

توجيه متعدد اللغات:
/en/* (الإنجليزية الافتراضية)
/ar/* (العربية مع RTL)

نظام الاحتياطي:
محتوى الصفحة المنشور → قالب صفحة احتياطي
```

### الميزات الرئيسية

1. **العرض من جانب الخادم** - جميع الصفحات معروضة على الخادم لـ SEO والأداء
2. **دعم المحلية** - اللغة الإنجليزية (LTR) والعربية (RTL)
3. **محتوى ديناميكي** - الصفحات والمنتجات المأهولة من قاعدة البيانات
4. **محتوى احتياطي** - صفحات افتراضية إذا لم تكن منشورة
5. **محتوى غني** - معرض القسم يدعم عدة أنواع تخطيط
6. **تصميم سريع الاستجابة** - أول قوس CSS مع Tailwind
7. **محسن لـ SEO** - علامات ميتا ونتيجة مفتوحة وخريطة موقع وروبوتس
8. **تقديم النماذج** - نماذج الاتصال والشراكة والاستفسار عن المنتج

---

## المسارات والصفحات العامة

### هيكل المسار

```
/ (جذر)
├── [locale]/                          # بادئة الإعدادات (en/ar)
│   ├── layout.tsx                     # الجذر تخطيط العام
│   ├── page.tsx                       # الصفحة الرئيسية
│   ├── products/
│   │   ├── page.tsx                   # كتالوج المنتج
│   │   ├── loading.tsx                # تحميل هيكل الكتالوج
│   │   └── [slug]/
│   │       ├── page.tsx               # تفاصيل المنتج
│   │       └── loading.tsx            # تحميل هيكل التفاصيل
│   ├── contact/
│   │   ├── page.tsx                   # صفحة الاتصال مع النموذج
│   │   └── loading.tsx                # تحميل هيكل
│   ├── about/
│   │   ├── page.tsx                   # صفحة حول الشركة
│   │   └── loading.tsx                # تحميل هيكل
│   ├── services/
│   │   ├── page.tsx                   # صفحة الخدمات
│   │   └── loading.tsx                # تحميل هيكل
│   ├── partnerships/
│   │   ├── page.tsx                   # صفحة الشراكات
│   │   └── loading.tsx                # تحميل هيكل
│   ├── compliance/
│   │   ├── page.tsx                   # صفحة الامتثال
│   │   └── loading.tsx                # تحميل هيكل
│   ├── not-found/
│   │   └── page.tsx                   # صفحة 404 ثابتة
│   ├── error.tsx                      # حدود الخطأ
│   ├── not-found.tsx                  # معامل 404
│   └── loading.tsx                    # تحميل هيكل عام
│
└── api/
    ├── auth/[...nextauth]/route.ts   # نقاط نهاية المصادقة
    └── media/upload/route.ts         # رفع الملفات العام
```

---

## الصفحات والمسارات

### 1. الصفحة الرئيسية

**الملف**: [app/(public)/[locale]/page.tsx](<app/(public)/[locale]/page.tsx>)

**الهدف**: صفحة الهبوط مع أقسام ديناميكية من قاعدة البيانات

**الميزات**:

- جلب صفحة الرئيسية المنشورة من قاعدة البيانات
- الرجوع إلى الصفحة الرئيسية الافتراضية إذا لم تكن منشورة
- يعرض أنواع أقسام متعددة (HERO، TEXT، CARDS، STATS، FEATURES، CTA، IMAGE_TEXT)
- توليد البيانات الوصفية الديناميكية (العنوان والوصف وصورة OG)
- دعم ثنائي اللغة (EN/AR مع RTL)

**تدفق المحتوى**:

1. خادم جلب الصفحة مع slug "home"
2. إذا لم يتم العثور عليها فاستخدم محتوى احتياطي
3. دهان كل قسم مع SectionRenderer
4. تطبيق الحيويات تظهر على التمرير

**الملفات ذات الصلة**:

- [lib/public-pages.ts](lib/public-pages.ts) - صفحات منشورة للاستعلام
- [lib/public-page-fallbacks.ts](lib/public-page-fallbacks.ts) - الصفحة الرئيسية الافتراضية
- [components/public/section-renderer.tsx](components/public/section-renderer.tsx) - عرض القسم
- [lib/seo.ts](lib/seo.ts) - البيانات الوصفية SEO

---

### 2. كتالوج المنتجات

**الملف**: [app/(public)/[locale]/products/page.tsx](<app/(public)/[locale]/products/page.tsx>)

**الهدف**: قائمة المنتجات مع التصفية والبحث

**الميزات**:

- عرض الشبكة للمنتجات المنشورة
- التصفية حسب الفئة
- التصفية حسب المنطقة العلاجية
- التصفية حسب الحالة (AVAILABLE أو PIPELINE)
- البحث بعنوان المنتج
- الترقيم مع التالي/السابق
- خيارات الترتيب (الاسم والأحدث)
- تخطيط شبكة سريع الاستجابة

**المرشحات المتاحة**:

- منسدل الفئة (جلب من قاعدة البيانات)
- منسدل المنطقة العلاجية
- مرشح الحالة (عرض متاح وخط أنابيب أو كليهما)
- بحث نص مجاني

**تدفق البيانات**:

1. خادم جلب المنتجات المنشورة مع المرشحات
2. استخدام محلل استعلام الكتالوج لتحليل معاملات URL
3. يعرض النتائج المرقمة في شبكة
4. يحدث URL بالمرشحات الحالية للإشارة المرجعية

**مثال على العنوان**:

```
/en/products?category=pain-relief&search=ibuprofen&page=1
/ar/products?category=مسكنات&search=ايبوبروفين&page=1
```

**الملفات ذات الصلة**:

- [lib/actions/public-products.ts](lib/actions/public-products.ts) - استعلامات المنتج
- [lib/catalog/catalog-query.ts](lib/catalog/catalog-query.ts) - تحليل URL
- [components/public/products/product-card.tsx](components/public/products/product-card.tsx) - بطاقة المنتج
- [components/public/products/catalog-controls.tsx](components/public/products/catalog-controls.tsx) - شريط جانبي للمرشحات
- [components/public/products/product-pagination.tsx](components/public/products/product-pagination.tsx) - الترقيم

---

### 3. تفاصيل المنتج

**الملف**: [app/(public)/[locale]/products/[slug]/page.tsx](<app/(public)/[locale]/products/[slug]/page.tsx>)

**الهدف**: صفحة المنتج الفردية مع معلومات كاملة

**الميزات**:

- عنوان المنتج والوصف والبيانات الوصفية
- شارة حالة المنتج (AVAILABLE/PIPELINE)
- عرض الفئة والمنطقة العلاجية
- معلومات الشركة المصنعة
- قسم المرفقات (ملفات قابلة للتحميل)
- قسم المنتجات الذات صلة (فئة/منطقة مشابهة)
- نموذج الاستفسار عن المنتج
- توليد البيانات الوصفية SEO
- 404 إذا لم يكن المنتج منشوراً

**الأقسام**:

- رأس المنتج مع صورة الغلاف
- وصف كامل
- تفاصيل المنتج (الفئة والمنطقة والشركة المصنعة)
- شبكة المرفقات (على سبيل المثال ورقات PDF البيانات)
- دوللاب المنتجات ذات الصلة
- نموذج الاستفسار عن المنتج

**تدفق البيانات**:

1. خادم جلب المنتج بواسطة slug
2. إذا لم يكن منشوراً فارجع 404
3. جلب المنتجات ذات الصلة (نفس الفئة أو المنطقة)
4. توليد البيانات الوصفية باسم وصف المنتج
5. قالب المنتج النموذج

**الملفات ذات الصلة**:

- [lib/actions/public-products.ts](lib/actions/public-products.ts) - استعلامات المنتج
- [lib/seo.ts](lib/seo.ts) - البيانات الوصفية SEO
- [components/public/forms/public-inquiry-form.tsx](components/public/forms/public-inquiry-form.tsx) - نموذج الاستفسار
- [components/public/scroll-reveal.tsx](components/public/scroll-reveal.tsx) - الحيويات

---

### 4. صفحة الاتصال

**الملف**: [app/(public)/[locale]/contact/page.tsx](<app/(public)/[locale]/contact/page.tsx>)

**الهدف**: معلومات الاتصال والنموذج للاستفسارات

**الميزات**:

- عرض تفاصيل الاتصال بالشركة
- ساعات العمل
- معلومات العنوان الفعلي/الموقع
- نموذج الاتصال
- iframe الخريطة (اختياري)
- دعم متعدد اللغات

**النموذج**:

- حقل الاسم (مطلوب)
- حقل البريد الإلكتروني (مطلوب)
- حقل الهاتف (اختياري)
- textarea الرسالة (مطلوب)
- حماية الفخ الروبوتات
- رسائل التحقق المحلية (EN/AR)

**تدفق البيانات**:

1. يؤدي تقديم النموذج إلى إجراء خادم
2. التحقق من مخطط Zod
3. الحفظ في جدول FormSubmission برنامج "CONTACT"
4. عرض رسالة نجاح/خطأ
5. إدارة استقبال الإخطار

**الملفات ذات الصلة**:

- [components/public/forms/public-inquiry-form.tsx](components/public/forms/public-inquiry-form.tsx) - نموذج الاتصال
- [lib/actions/public-forms.ts](lib/actions/public-forms.ts) - إجراء نموذج الإرسال
- [lib/public-pages.ts](lib/public-pages.ts) - الحصول على محتوى الصفحة

---

### 5. صفحة حول الشركة

**الملف**: [app/(public)/[locale]/about/page.tsx](<app/(public)/[locale]/about/page.tsx>)

**الهدف**: معلومات الشركة وصفحة المهمة

**الميزات**:

- محتوى ديناميكي من قاعدة البيانات (إذا كان منشوراً)
- أقسام متعددة (بطل وضعي صورة نص وإحصائيات وميزات CTA)
- الرجوع إلى صفحة حول افتراضية إذا لم تكن منشورة
- بيان قيم الشركة والمهمة
- معلومات الفريق (إذا تم تضمينها في الأقسام)
- الجدول الزمني أو المعالم (إذا كانت في الأقسام)

**تدفق المحتوى**:

1. جلب الصفحة مع slug "about"
2. إذا لم يكن منشوراً استخدم محتوى احتياطي
3. أقسام النموذج مع SectionRenderer

**الملفات ذات الصلة**:

- [lib/public-pages.ts](lib/public-pages.ts) - صفحات منشورة للاستعلام
- [lib/public-page-fallbacks.ts](lib/public-page-fallbacks.ts) - محتوى احتياطي
- [components/public/section-renderer.tsx](components/public/section-renderer.tsx) - عرض القسم

---

### 6. صفحة الخدمات

**الملف**: [app/(public)/[locale]/services/page.tsx](<app/(public)/[locale]/services/page.tsx>)

**الهدف**: نظرة عامة على الخدمات والعروض

**الميزات**:

- وصفات الخدمة
- فئات الخدمة
- كيفية استخدام الخدمات
- محتوى ديناميكي من قاعدة البيانات

**تدفق المحتوى**:

1. جلب الصفحة مع slug "services"
2. أقسام الاستدعاء بخدمات متاحة
3. رجع إلى القيمة الافتراضية إذا لم يكن منشوراً

---

### 7. صفحة الشراكات

**الملف**: [app/(public)/[locale]/partnerships/page.tsx](<app/(public)/[locale]/partnerships/page.tsx>)

**الهدف**: فرص الشراكة ونموذج الاستفسار

**الميزات**:

- وصف فرصة الشراكة والفوائد
- نموذج الاستفسار عن الشراكة
- أنواع الشراكات المتاحة

**النموذج**:

- اسم الشركة
- اسم شخص الاتصال
- عنوان بريد الكتروني
- هاتف
- منسدل نوع الاستفسار (على سبيل المثال التوزيع والتجزئة والمؤسسة)
- رسالة
- حماية الفخ

**تدفق البيانات**:

1. تقديم النموذج يحفظ كنوع FormSubmission "PARTNERSHIP"
2. إدارة تحصل على إخطار
3. يرى المستخدم رسالة نجاح

**الملفات ذات الصلة**:

- [components/public/forms/public-inquiry-form.tsx](components/public/forms/public-inquiry-form.tsx) - نموذج الشراكة
- [lib/actions/public-forms.ts](lib/actions/public-forms.ts) - إجراء نموذج الإرسال

---

### 8. صفحة الامتثال

**الملف**: [app/(public)/[locale]/compliance/page.tsx](<app/(public)/[locale]/compliance/page.tsx>)

**الهدف**: معلومات الامتثال التنظيمي والشهادات

**الميزات**:

- شهادات الامتثال
- معلومات تنظيمية
- سياسات الخصوصية والأمان للبيانات
- أقسام محتوى ديناميكية

**الملفات ذات الصلة**:

- [lib/public-pages.ts](lib/public-pages.ts) - محتوى صفحة استعلام
- [lib/public-page-fallbacks.ts](lib/public-page-fallbacks.ts) - محتوى احتياطي

---

### 9. 404 لم يتم العثور عليه

**الملف**: [app/(public)/[locale]/not-found.tsx](<app/(public)/[locale]/not-found.tsx>)

**الهدف**: صفحة خطأ 404 للمسارات المفقودة

**الميزات**:

- رسالة خطأ صديقة للمستخدم
- ربط العودة إلى الصفحة الرئيسية
- التبديل اللغوي

---

### 10. حد الخطأ

**الملف**: [app/(public)/[locale]/error.tsx](<app/(public)/[locale]/error.tsx>)

**الهدف**: حد الخطأ للاستثناءات غير المعالجة

**الميزات**:

- عرض رسالة الخطأ
- إجراءات الاسترجاع
- توجيه المستخدم

---

### 11. حالات التحميل

**الملف**: [app/(public)/[locale]/loading.tsx](<app/(public)/[locale]/loading.tsx>)

**الهدف**: هيكل تحميل عام لأحمال الصفحة

**ملفات التحميل ذات الصلة**:

- [products/loading.tsx](<app/(public)/[locale]/products/loading.tsx>) - تحميل كتالوج المنتج
- [products/[slug]/loading.tsx](<app/(public)/[locale]/products/[slug]/loading.tsx>) - تحميل تفاصيل المنتج
- [contact/loading.tsx](<app/(public)/[locale]/contact/loading.tsx>) - تحميل صفحة الاتصال
- [about/loading.tsx](<app/(public)/[locale]/about/loading.tsx>) - تحميل صفحة حول
- [partnerships/loading.tsx](<app/(public)/[locale]/partnerships/loading.tsx>) - تحميل الشراكات
- [services/loading.tsx](<app/(public)/[locale]/services/loading.tsx>) - تحميل الخدمات
- [compliance/loading.tsx](<app/(public)/[locale]/compliance/loading.tsx>) - تحميل الامتثال

**المكون ذو الصلة**:

- [components/public/loading/public-page-skeleton.tsx](components/public/loading/public-page-skeleton.tsx) - واجهة هيكلية

---

## توصيل المحتوى

### محتوى ثابت مقابل ديناميكي

**محتوى قاعدة البيانات المنشورة**:

- صفحات مخصصة (الرئيسية والحول والخدمات وما إلى ذلك)
- أقسام الصفحة مع المحتوى
- منتجات مشمولة بالمنشور

**محتوى احتياطي** (`lib/public-page-fallbacks.ts`):

- مستخدمة عند عدم نشر الصفحات في قاعدة البيانات
- صفحات افتراضية مدمجة مسبقاً للمسارات الرئيسية
- يضمن أن الموقع يعرض دائماً المحتوى

**نمط جلب المحتوى**:

```
1. جرب جلب من قاعدة البيانات (منشور المحتوى)
   ↓ (إذا وجدت)
2. محتوى قاعدة البيانات النموذج
   ↓ (إذا لم يكن موجوداً)
3. استخدام قالب صفحة احتياطي
   ↓
4. محتوى النموذج احتياطي
```

### أنواع الأقسام والعرض

**أنواع الأقسام المتاحة**:

1. **HERO** - لافتة مع العنوان والعنوان الفرعي وزر CTA
   - الاستخدام: الصفحة الرئيسية واللافتات والمقدمات
   - الخصائص: العنوان والعنوان الفرعي والصورة وزر CTA

2. **TEXT** - لبنة محتوى نص غني
   - الاستخدام: الأوصاف والشروحات والمحتوى
   - الخصائص: HTML/نص منسق من محرر Tiptap

3. **IMAGE_TEXT** - صورة بجانب النص
   - الاستخدام: الميزات والشهادات ودراسات الحالات
   - الخصائص: الصورة والنص والتخطيط (يسار/يمين)

4. **STATS** - شبكة عرض الإحصائيات
   - الاستخدام: المقاييس الرئيسية والإنجازات
   - الخصائص: مجموعة من [قيمة label] أزواج

5. **FEATURES** - فئة قائمة الميزات
   - الاستخدام: ميزات المنتج والفوائد
   - الخصائص: مجموعة من مجموعات [العنوان والوصف والرمز]

6. **CARDS** - تخطيط شبكة البطاقة
   - الاستخدام: بطاقات الخدمة وفئات المنتجات
   - الخصائص: مجموعة من مجموعات [العنوان والوصف والصورة والرابط]

7. **CTA** - قسم استدعاء الإجراء
   - الاستخدام: أقسام ترويجية وحفز
   - الخصائص: العنوان والوصف والزر

**معرض القسم**:

- [components/public/section-renderer.tsx](components/public/section-renderer.tsx) - أقسام النوع من النموذج
- يدعم الحيويات تظهر على التمرير
- سريع الاستجابة على الهاتف المحمول/الجهاز اللوحي/سطح المكتب
- ثنائي اللغة (يطبق RTL للعربية)

---

## المكونات والواجهة

### مكونات التخطيط

**التخطيط العام**
[app/(public)/[locale]/layout.tsx](<app/(public)/[locale]/layout.tsx>)

- غلاف رئيسي لجميع الصفحات العامة
- يتضمن SiteHeader و SiteFooter
- ينشئ مزود لغات i18n
- دعم RTL للعربية
- علامات مخطط المنظمة لـ SEO

---

### مكونات الملاحة

**رأس الموقع** [components/public/site-header.tsx](components/public/site-header.tsx)

الميزات:

- الشعار/العلامة التجارية
- قائمة الملاحة الرئيسية
- مبدل اللغة (EN/AR)
- قائمة الهاتف المحمول
- تصميم سريع الاستجابة
- تسليط الضوء على المسار النشط

**عناصر الملاحة**:

- الرئيسية
- المنتجات
- حول
- الخدمات
- الشراكات
- الامتثال
- اتصل

---

**مبدل اللغة** [components/public/language-switcher.tsx](components/public/language-switcher.tsx)

الميزات:

- تبديل بين الإنجليزية والعربية
- تحديثات الإعدادات في العنوان
- يتذكره تفضيل المستخدم
- عرض اللغة الحالية
- RTL-aware التموضع

**الملاحة**:

- انقر EN → إعادة التوجيه `/ar/*` إلى `/en/*`
- انقر AR → إعادة التوجيه `/en/*` إلى `/ar/*`

---

**تذييل الموقع** [components/public/site-footer.tsx](components/public/site-footer.tsx)

الميزات:

- روابط سريعة للصفحات الرئيسية
- إشعار حقوق النشر
- روابط وسائل التواصل الاجتماعي (إذا تم تكوينها)
- دعم ثنائي اللغة
- معلومات الشركة

---

### مكونات المحتوى

**معرض القسم** [components/public/section-renderer.tsx](components/public/section-renderer.tsx)

الهدف: أقسام صفحة ديناميكية استدعاء استدعاء بناءً على النوع

**يدعم**:

- جميع أنواع الأقسام السبعة (HERO، TEXT، CARDS، STATS، FEATURES، CTA، IMAGE_TEXT)
- محتوى ثنائي اللغة
- حركات تمرير تمرير
- تخطيطات سريعة الاستجابة
- تحسين الصورة

**الاستخدام**:

```typescript
<SectionRenderer
  section={sectionData}
  locale={locale}
  index={index}
/>
```

---

**محتوى الصفحة** [components/public/page-content.tsx](components/public/page-content.tsx)

الهدف: غلاف محتوى الصفحة مع التخطيط

الميزات:

- جلب بيانات الصفحة بسبب الأرق
- جعل جميع الأقسام
- معالجة 404 للصفحات غير المنشورة
- توليد البيانات الوصفية

---

**تمرير Reveal** [components/public/scroll-reveal.tsx](components/public/scroll-reveal.tsx)

الهدف: مراقب التقاطع حركة عند التمرير

الميزات:

- الاختفاء في الحيويات
- التأخير القابل للتكوين
- مدخلات سلسة
- محسن الأداء
- RTL مدرك

---

### مكونات المنتج

**بطاقة المنتج** [components/public/products/product-card.tsx](components/public/products/product-card.tsx)

الميزات:

- صورة الصورة المصغرة للمنتج
- عنوان المنتج والفئة
- شارة الحالة (AVAILABLE/PIPELINE)
- ربط بصفحة التفاصيل
- تأثيرات التوجيه
- حجم سريع الاستجابة

**حقول العرض**:

- صورة الغلاف
- عنوان المنتج
- اسم الفئة
- شارة الحالة
- الشركة/الشركة المصنعة

---

**عناصر تحكم الكتالوج** [components/public/products/catalog-controls.tsx](components/public/products/catalog-controls.tsx)

الهدف: شريط جانبي للتصفية لكتالوج المنتج

**أنواع التصفية**:

1. **البحث** - البحث على نص مجاني باسم المنتج
2. **الفئة** - منسدل للفئات المتاحة
3. **منطقة علاجية** - منسدل للمناطق العلاجية
4. **الحالة** - عرض AVAILABLE و PIPELINE أو كليهما
5. **الترتيب** - الترتيب حسب الاسم والأحدث أو الصلة

**الميزات**:

- ربط معامل URL
- عرض المرشحات المطبقة الحالية
- زر مسح المرشحات
- انهيار سريع يستجيب الهاتف المحمول

---

**ترقيم المنتج** [components/public/products/product-pagination.tsx](components/public/products/product-pagination.tsx)

الهدف: عناصر التحكم في الترقيم لقائمة المنتج

الميزات:

- الزرار السابق/التالي للصفحة
- عرض رقم الصفحة الحالية
- عرض إجمالي الصفحات
- الحالة المعطلة عدما لا مزيد من الصفحات
- الدولة الحفاظ على معاملات URL

---

### مكونات النموذج

**نموذج الاستفسار العام** [components/public/forms/public-inquiry-form.tsx](components/public/forms/public-inquiry-form.tsx)

الهدف: نموذج عام للاتصال والشراكة والاستفسار عن المنتج

**الميزات**:

- تمييز نوع النموذج (الاتصال والشراكة والاستفسار_المنتج)
- دعم ثنائي اللغة (EN/AR مع RTL)
- حماية فخ الروبوتات الخفي
- حالة التحميل تعامل مع التقديمات
- رد الفعل التحقق
- رسائل نجاح/خطأ الخبز
- الحقول الشرطية بناءً على نوع النموذج

**حقول نموذج الاتصال**:

- الاسم (مطلوب)
- البريد الإلكتروني (مطلوب)
- الهاتف (اختياري)
- الرسالة (مطلوب)

**حقول نموذج الشراكة**:

- اسم الشركة (مطلوب)
- اسم الاتصال (مطلوب)
- البريد الإلكتروني (مطلوب)
- الهاتف (مطلوب)
- منسدل نوع الاستفسار
- الرسالة (مطلوب)

**حقول نموذج الاستفسار عن المنتج**:

- الاسم (مطلوب)
- البريد الإلكتروني (مطلوب)
- الهاتف (اختياري)
- منسدل نوع الاستفسار عن المنتج
- الرسالة (مطلوب)

**الإجراءات المستخدمة**:

- [lib/actions/public-forms.ts](lib/actions/public-forms.ts) - أرسل النموذج

---

### حالات التحميل

**هيكل صفحة عامة** [components/public/loading/public-page-skeleton.tsx](components/public/loading/public-page-skeleton.tsx)

الهدف: عنصر نائب للتحميل أثناء استدعاء الصفحة

عرض واجهة هيكلية مع:

- عنصر نائب رأس
- عناصر نائبة محتوى
- عنصر نائب تذييل
- حركات الوميض

---

## النماذج والتقديمات

### معالجة نموذج عام

**أنواع النماذج**:

1. **CONTACT** - استفسارات اتصال عامة
2. **PARTNERSHIP** - طلبات شراكة العمل
3. **PRODUCT_INQUIRY** - أسئلة الأشياء المحددة

### تدفق التقديم

```
1. ملئ المستخدم نموذج على صفحة عامة
   ↓
2. الناشر يؤدي إلى إجراء الخادم
   ↓
3. التحقق من مخطط Zod
   ↓
4. فحص فخ الروبوتات (حماية البريد المزعج)
   ↓
5. حفظ لقاعدة البيانات (جدول FormSubmission)
   ↓
6. رسالة النجاح العودة
   ↓
7. الإدارة ترى النموذج في لوحة بيانات /admin/forms
```

### إجراء الخادم

**الملف**: [lib/actions/public-forms.ts](lib/actions/public-forms.ts)

**الدالة**:

```typescript
export async function submitPublicForm(
  prevState,
  formData,
): Promise<ActionState>;
```

**التحقق**:

- التحقق من تنسيق البريد الإلكتروني
- فحص الحقول المطلوبة
- حدود طول الرسالة
- التحقق من فخ الفخ
- حماية CSRF (عبر معالجة نموذج Next.js)

**الميزات**:

- يحفظ بيانات النموذج الكاملة
- يتضمن الطابع الزمني
- يخزن نوع الاستفسار إذا تم توفيره
- معالجة الخطأ مع رسائل صديقة للمستخدم
- رسائل محلية (EN/AR)

---

## كتالوج المنتجات

### استعلامات المنتج

**الملف**: [lib/actions/public-products.ts](lib/actions/public-products.ts)

**الدوال**:

1. **getPublicProducts(locale, query)**
   - إرجاع المنتجات المنشورة المرقمة
   - يقبل المرشحات: الفئة والمنطقة العلاجية والحالة والبحث
   - دعم الترتيب
   - الترجمات ثنائية اللغة

2. **getPublicProductBySlug(locale, slug)**
   - جلب منتج واحد بواسطة slug
   - تضمين الترجمات
   - تضمين المرفقات
   - العودة بلا شيء إذا لم يكن منشوراً

3. **getPublishedProductSlugs()**
   - احصل على جميع slugs المنتج المنشور
   - مستخدم لتوليد خريطة الموقع

4. **getRelatedProducts(locale, productId, limit)**
   - احصل على منتجات ذات صلة (نفس الفئة/المنطقة)
   - استبعاد المنتج الحالي
   - القيمة الافتراضية 4 منتجات ذات صلة

### محلل استعلام الكتالوج

**الملف**: [lib/catalog/catalog-query.ts](lib/catalog/catalog-query.ts)

**الدوال**:

`parseCatalogSearchParams(query)`

- تحليل معامل استعلام URL إلى كائن مرشح منظم
- التعامل مع الترقيم والمرشحات والترتيب
- يتحقق من قيم المعامل
- إرجاع كائن استعلام منظم

`buildCatalogUrl(pathname, current, updates)`

- بناء عنوان كتالوج محدث مع مرشحات جديدة
- الحفاظ على المعاملات الموجودة غير جاري تحديثها
- التعامل مع مرشحات متعددة الاختيار

`buildCatalogPaginationHref(pathname, searchParams, nextPage)`

- بناء عناوين ترقيم
- الحفاظ على جميع المرشحات الحالية

### هيكل URL

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

## المحلية

### إعداد متعدد اللغات

**اللغات المدعومة**:

- **ar** - العربية (RTL - من اليمين إلى اليسار)
- **en** - الإنجليزية (LTR - من اليسار إلى اليمين)

### الإعدادات

**الملف**: [i18n/config.ts](i18n/config.ts)

```typescript
export const locales = ["en", "ar"];
export const defaultLocale = "en";
export const localeNames = { en: "English", ar: "العربية" };
export const localeDirection = { en: "ltr", ar: "rtl" };
```

### الموجهات

**الملف**: [i18n/routing.ts](i18n/routing.ts)

```
/en/*     ← صفحات الإنجليزية (الافتراضية بادئة حسب الحاجة تعني أن العناوين يمكنها حذف "en")
/ar/*     ← صفحات العربية (دائماً مع بادئة "ar")

أمثلة:
/products          ← إعادة توجيه إلى /en/products
/en/products       ← صفحة منتجات اللغة الإنجليزية
/ar/products       ← صفحة منتجات العربية
```

### مساعدي الملاحة

**الملف**: [i18n/navigation.ts](i18n/navigation.ts)

يوفر وظائف على علم محلية:

- `Link` - Link Next.js مع دعم المحلية
- `redirect` - تنقل مع دعم المحلية
- `usePathname` - احصل على اسم المسار بدون محلية
- `useRouter` - موجه محلي
- `getPathname` - احصل على المسار لمحلية معينة

### معالجة الطلب

**الملف**: [i18n/request.ts](i18n/request.ts)

- إعداد i18n من جانب الخادم
- يحمل الرسائل المحددة بالمحلية/الترجمات
- يتحقق من معامل المحلية
- الرجوع للمحلية الافتراضية

### دعم RTL

**التخطيط**: [app/(public)/[locale]/layout.tsx](<app/(public)/[locale]/layout.tsx>)

```typescript
<html dir={localeDirection[locale]} lang={locale}>
```

**CSS**: [app/globals.css](app/globals.css)

- متغيرات CSS تدعم RTL/LTR
- محاذاة النص تقلب في RTL
- الهامش/الحشو يقلب في RTL
- Tailwind يتضمن معدلات RTL

---

## السيو والبيانات الوصفية

### أدوات SEO

**الملف**: [lib/seo.ts](lib/seo.ts)

**الدوال**:

1. `getSiteUrl()` - الحصول على عنوان URL المطلق للموقع
2. `getAbsoluteUrl(pathname)` - تحويل نسبي إلى عنوان URL مطلق
3. `getLocalizedPath(locale, pathname)` - احصل على مسار بادئة المحلية
4. `buildLocaleAlternates(pathname)` - توليد البدائل hreflang
5. `createPublicMetadata(input)` - بناء كائن البيانات الوصفية Next.js
6. `buildOgImageUrl(title, locale)` - توليد عنوان URL صورة OG الديناميكي

### توليد البيانات الوصفية

**مثال الصفحة الرئيسية**:

```typescript
const metadata = createPublicMetadata({
  title: "Damira Pharma",
  description: "Leading pharmaceutical solutions in the Middle East",
  path: "/en",
  locale: "en",
  ogImage: { title: "Damira Pharma" },
});
```

**مثال صفحة المنتج**:

```typescript
const metadata = createPublicMetadata({
  title: product.name,
  description: product.description,
  path: `/products/${product.slug}`,
  locale,
  ogImage: { title: product.name },
});
```

### مكونات البيانات الوصفية

كل صفحة توليد:

- `title` - عنوان الصفحة
- `description` - وصف ميتا
- `keywords` - مفاتيح SEO
- `openGraph` - علامات OG (الصورة والعنوان والوصف)
- `twitter` - بيانات بطاقة Twitter
- `alternates` - hreflang لبدائل المحلية

### خريطة الموقع

**الملف**: [app/sitemap.ts](app/sitemap.ts)

توليد ديناميكي خريطة الموقع مع:

- جميع الصفحات العامة (كلا المحليات)
- جميع المنتجات المنشورة
- روابط بديلة محلية
- آخر تواريخ تعديل

المسار: `/sitemap.xml`

### الروبوتات

**الملف**: [app/robots.ts](app/robots.ts)

تكوين robots.txt:

- السماح لجميع البوتات بزحف الصفحات العامة
- منع قسم الإدارة
- أشر إلى خريطة الموقع

المسار: `/robots.txt`

### منتج صورة OG

**الملف**: [app/og/route.tsx](app/og/route.tsx)

توليد صورة Open Graph الديناميكي:

**المعاملات**:

- `title` - عنوان الصفحة
- `locale` - اللغة (en/ar)

**الميزات**:

- خلفية متدرجة
- تخطيط محلي (RTL للعربية)
- العلامة التجارية الثابتة
- دعم الخط للعربية

**الاستخدام**:

```html
<meta property="og:image" content="/og?title=Product%20Name&locale=en" />
```

---

## هيكل الملفات

### مرجع سريع حسب الفئة

**المسارات والصفحات**:

- [app/(public)/[locale]/layout.tsx](<app/(public)/[locale]/layout.tsx>)
- [app/(public)/[locale]/page.tsx](<app/(public)/[locale]/page.tsx>) - الصفحة الرئيسية
- [app/(public)/[locale]/products/page.tsx](<app/(public)/[locale]/products/page.tsx>)
- [app/(public)/[locale]/products/[slug]/page.tsx](<app/(public)/[locale]/products/[slug]/page.tsx>)
- [app/(public)/[locale]/contact/page.tsx](<app/(public)/[locale]/contact/page.tsx>)
- [app/(public)/[locale]/about/page.tsx](<app/(public)/[locale]/about/page.tsx>)
- [app/(public)/[locale]/services/page.tsx](<app/(public)/[locale]/services/page.tsx>)
- [app/(public)/[locale]/partnerships/page.tsx](<app/(public)/[locale]/partnerships/page.tsx>)
- [app/(public)/[locale]/compliance/page.tsx](<app/(public)/[locale]/compliance/page.tsx>)

**منطق العمل (الاستعلامات والتقديمات)**:

- [lib/actions/public-products.ts](lib/actions/public-products.ts) - استعلامات المنتج
- [lib/actions/public-forms.ts](lib/actions/public-forms.ts) - تقديمات النموذج
- [lib/public-pages.ts](lib/public-pages.ts) - استعلامات الصفحة المنشورة
- [lib/public-page-fallbacks.ts](lib/public-page-fallbacks.ts) - محتوى احتياطي

**الملاحة والتخطيط**:

- [components/public/site-header.tsx](components/public/site-header.tsx) - رأس
- [components/public/site-footer.tsx](components/public/site-footer.tsx) - تذييل
- [components/public/language-switcher.tsx](components/public/language-switcher.tsx) - تبديل اللغة

**المحتوى والأقسام**:

- [components/public/section-renderer.tsx](components/public/section-renderer.tsx) - عرض القسم
- [components/public/page-content.tsx](components/public/page-content.tsx) - غلاف الصفحة
- [components/public/scroll-reveal.tsx](components/public/scroll-reveal.tsx) - حركات التمرير

**المنتجات**:

- [components/public/products/product-card.tsx](components/public/products/product-card.tsx) - بطاقة المنتج
- [components/public/products/catalog-controls.tsx](components/public/products/catalog-controls.tsx) - المرشحات
- [components/public/products/product-pagination.tsx](components/public/products/product-pagination.tsx) - الترقيم
- [lib/catalog/catalog-query.ts](lib/catalog/catalog-query.ts) - تحليل URL

**النماذج**:

- [components/public/forms/public-inquiry-form.tsx](components/public/forms/public-inquiry-form.tsx) - مكون النموذج
- [lib/actions/public-forms.ts](lib/actions/public-forms.ts) - إجراء تقديم النموذج

**الأدوات**:

- [lib/seo.ts](lib/seo.ts) - البيانات الوصفية SEO
- [i18n/config.ts](i18n/config.ts) - إعدادات i18n
- [i18n/routing.ts](i18n/routing.ts) - توجيه i18n
- [i18n/navigation.ts](i18n/navigation.ts) - مساعدي i18n
- [app/sitemap.ts](app/sitemap.ts) - توليد خريطة الموقع
- [app/robots.ts](app/robots.ts) - robots.txt
- [app/og/route.tsx](app/og/route.tsx) - منتج صورة OG

**التحميل والخطأ**:

- [components/public/loading/public-page-skeleton.tsx](components/public/loading/public-page-skeleton.tsx) - هيكل التحميل
- [app/(public)/[locale]/error.tsx](<app/(public)/[locale]/error.tsx>) - حد الخطأ
- [app/(public)/[locale]/not-found.tsx](<app/(public)/[locale]/not-found.tsx>) - صفحة 404

---

## نماذج قاعدة البيانات - السياق العام

### المنتجات

مستخدم في كتالوج المنتج العام:

- المنتج (الاسم والوصف والحالة والنوع والفئة والشركة المصنعة وصورة الغلاف)
- ترجمة المنتج (العنوان ثنائي اللغة/الوصف)
- تفاصيل المنتج المتقدمة (ظروف التخزين والمعلومات التنظيمية)
- مرفق المنتج (الملفات القابلة للتحميل/ورقات البيانات)
- الفئة
- منطقة علاجية
- الشركة المصنعة

### الصفحات

مستخدم في محتوى الصفحة الديناميكي:

- الصفحة (slug ومنشور)
- صفحة الترجمة (العنوان ثنائي اللغة metaTitle metaDescription)
- قسم الصفحة (النوع الترتيب البيانات)
- ترجمة قسم الصفحة (بيانات قسم محلية)

### تقديمات النموذج

يخزن تقديمات النموذج العام:

- FormSubmission (النوع والحالة والاسم والبريد الإلكتروني والهاتف والشركة والرسالة ونوع الاستفسار)

---

## البدء السريع بالتطوير

### عرض الصفحات

**على خادم التطوير** (`npm run dev`):

- الصفحة الرئيسية للغة الإنجليزية: `http://localhost:3000/en`
- الصفحة الرئيسية للعربية: `http://localhost:3000/ar`
- المنتجات: `http://localhost:3000/en/products`
- تفاصيل المنتج: `http://localhost:3000/en/products/product-slug`
- اتصل: `http://localhost:3000/en/contact`

### إضافة صفحة ديناميكية جديدة

1. إنشاء محتوى الصفحة في قاعدة البيانات أو واجهة الإدارة
2. تعيين slug لمطابقة المسار (على سبيل المثال "about")
3. إنشاء أقسام بأنواع التخطيط المطلوبة
4. صفحة النشر
5. الزيارة `/en/slug` (توليد تلقائي للعربية أيضاً)

### إدارة المحتوى

1. صفحات الإدارة المنشورة → يظهر على الموقع العام
2. المنتجات المنشورة كـ AVAILABLE → عرض في الكتالوج
3. صفحات مشهورة → عرض مع الأقسام
4. النماذج المقدمة → الإدارة يرى في لوحة بيانات النماذج

---

## النشر والبيئة

### متغيرات البيئة المطلوبة

```
DATABASE_URL=postgresql://...        # قاعدة بيانات PostgreSQL
NEXTAUTH_SECRET=...                  # JWT السر NextAuth
NEXTAUTH_URL=https://yourdomain.com # عنوان URL استدعاء المصادقة
NEXT_PUBLIC_APP_URL=https://yourdomain.com # عنوان URL الموقع لصور OG
```

### البناء والتشغيل

```bash
npm run build    # بناء الإنتاج
npm run start    # بدء خادم الإنتاج
npm run dev      # خادم التطوير (localhost:3000)
npm run lint     # التحقق من جودة الكود
```

### خطوات النشر

1. بناء: `npm run build`
2. اختبر بناء الإنتاج محلياً: `npm run start`
3. نشر على Vercel أو منصة الاستضافة الخاصة بك
4. ضع متغيرات البيئة على الاستضافة
5. الموقع متاح تلقائياً في yourdomain.com

---

## تحسينات الأداء

1. **عرض من جانب الخادم** - جميع الصفحات قبل العرض لـ SEO
2. **تحسين الصورة** - Next.js مكون الصورة مع التحميل البطيء
3. **CSS** - Tailwind CSS مع تقليل الأشجار
4. **JavaScript** - مكونات الخادم تقلل حزمة عميل JS
5. **التخزين المؤقت** - المحتوى المنشور مخزن مؤقتاً بشكل مناسب
6. **Sitemap & Robots** - محسن لمحركات البحث
7. **Scroll Reveal** - مراقب التقاطع للحركات الفعالة

---

## الخلاصة

الموقع العام هو موقع ويب عالي الأداء متعدد اللغات للصيدليات مع:

- ✅ إدارة المحتوى الديناميكي من لوحة تحكم الإدارة
- ✅ دعم ثنائي اللغة (إنجليزي/عربي مع RTL)
- ✅ كتالوج المنتجات مع المرشحات والبحث
- ✅ تقديم النماذج لاستفسارات العملاء
- ✅ محسن لـ SEO مع علامات ميتا وخريطة الموقع وrobot.txt
- ✅ العرض من جانب الخادم لأحمال الصفحة السريعة
- ✅ تصميم سريع الاستجابة لجميع الأجهزة
- ✅ محتوى احتياطي يضمن دائماً عرض الموقع
- ✅ نوع آمن مع تغطية TypeScript الكاملة
- ✅ مكونات خادم React 19 الحديثة

المعمارية تسمح لمديري الإدارة بإنشاء وإدارة جميع محتوى الموقع العام من لوحة تحكم الإدارة مع الإتاحة الفورية على الموقع العام.
