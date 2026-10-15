// واجهة المتجر
import { LEGAL_LINKS, buildLegal } from "./legal.js";

/* ---------------------------------------------------------------------------
   إعدادات النشاط — عدّل هذا القسم فقط.
   هذه البيانات تظهر في التذييل وصفحات السياسات، وهي مطلوبة نظاماً.
--------------------------------------------------------------------------- */
const SITE = {
  brand: "الوطنية",
  legalName: "مؤسسة الوطنية",
  city: "الرياض",
  phone: "+966593203502",
  whatsapp: "966593203502",
  email: "watneyanewofold@gmail.com",
  cr: "1025148421",
  vat: "",
  address: "الرياض، المملكة العربية السعودية",
  deliveryTime: "١ إلى ٣ أيام عمل",
  updated: "أكتوبر ٢٠٢٦",
};

const PRODUCT = {
  price: 50,
  title: "عرض الوطنية بـ 50 ريال",
  short: "دجاج طازج، صدور دجاج، وأرز بسمتي فاخر",
  image: "/assets/offer-snap-720.jpg",
  imageSmall: "/assets/offer-snap-420.jpg",
  thumb: "/assets/offer-snap-thumb.jpg",
  imageAlt: "إعلان عرض الوطنية: بوكس دجاج وصدور دجاج وأرز بسمتي بـ 50 ريال",
  items: [
    { title: "بوكس دجاج", note: "10 حبات، وزن الحبة 900 غرام" },
    { title: "بوكس صدور دجاج", note: "وزن الصحن 500 غرام" },
    { title: "كيس أرز بسمتي فاخر", note: "وزن 10 كيلو" },
  ],
};

const LEGAL = buildLegal(SITE);

const KEYS = {
  cart: "national-poultry-cart",
  address: "national-poultry-address",
};
const EMPTY_ADDRESS = { name: "", phone: "", city: "", details: "" };
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

const state = {
  count: 0,
  location: "/",
  address: { ...EMPTY_ADDRESS },
  submitted: false,
  error: "",
  notice: "",
};

/* ---------------------------------- utils --------------------------------- */
const n = (value) => value.toLocaleString("ar-SA");
const money = (value) => `${n(value)} ريال سعودي`;

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* التخزين غير متاح */
  }
}

const icons = {
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M3 7h18l-1.5 4H4.5z"/><path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 6h18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 17V5H2v12h3"/><path d="M14 8h4l3 3.5V17h-3"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v5.5c0 4.2 2.9 8 7 9.5 4.1-1.5 7-5.3 7-9.5V6z"/><path d="m9.3 12 1.9 1.9 3.6-3.8"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3h3l1.5 4-2 1.4a12 12 0 0 0 5.6 5.6L16 12l4 1.5v3a2.5 2.5 0 0 1-2.7 2.5C10.6 18.4 5.6 13.4 5 6.7A2.5 2.5 0 0 1 6.5 3Z"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6l1.9 5.1 5.1 1.9-5.1 1.9L12 16.6l-1.9-5.1L5 9.6l5.1-1.9z"/><path d="M18.6 15.4l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z"/></svg>',
};

const brandMark = `<span class="brand-mark" aria-hidden="true">${icons.leaf}</span>`;

const productImg = (cls, loading) => `
  <img
    class="${cls || ""}"
    src="${PRODUCT.image}"
    srcset="${PRODUCT.imageSmall} 420w, ${PRODUCT.image} 720w"
    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 70vw, 46vw"
    alt="${PRODUCT.imageAlt}"
    width="720" height="720"
    loading="${loading || "lazy"}"
    decoding="async"
    fetchpriority="${loading === "eager" ? "high" : "auto"}"
  />`;

/* -------------------------------- fragments ------------------------------- */
function topbar() {
  const notes = [
    "عرض محلي مميز",
  ];
  return `
    <div class="topbar">
      <div class="container topbar-inner">
        ${notes.map((t) => `<span>${t}</span>`).join('<i class="topbar-dot"></i>')}
      </div>
    </div>`;
}

function header() {
  return `
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="/" data-link aria-label="العودة إلى العرض">
          ${brandMark}
          <span class="brand-text">
            <span class="brand-name">${SITE.brand}</span>
            <span class="brand-sub">${SITE.city} · المملكة العربية السعودية</span>
          </span>
        </a>
        <nav class="main-nav" aria-label="روابط الصفحة">
          <a href="/" data-link>العرض</a>
          <a href="/#contents">المحتويات</a>
          <a href="/#how">طريقة الطلب</a>
          <a href="/shipping" data-link>التوصيل</a>
        </nav>
        <div class="header-actions">
          <a class="cart-btn" href="/cart" data-link aria-label="السلة">
            ${icons.cart}
            <span>السلة</span>
            <span class="count" data-count hidden>0</span>
          </a>
        </div>
      </div>
    </header>`;
}

function mobileBar() {
  return `
    <div class="mobile-bar" data-mobile-bar>
      <div class="mobile-bar-price">
        <span class="mobile-bar-number">50</span>
      </div>
      <button class="btn btn-primary" type="button" data-add>أضف إلى السلة ${icons.arrow}</button>
    </div>`;
}

function footer() {
  return `
    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          ${brandMark}
          <div>
            <strong>${SITE.brand}</strong>
            <span>${SITE.city} · المملكة العربية السعودية</span>
          </div>
        </div>
        <div class="footer-notes">
          <span>${icons.phone} <span dir="ltr">${SITE.phone}</span></span>
          <span>${icons.pin} ${SITE.address}</span>
        </div>
      </div>
      <div class="container footer-legal">
        <nav aria-label="صفحات السياسات">
          ${LEGAL_LINKS.map((l) => `<a href="${l.href}" data-link>${l.label}</a>`).join("")}
        </nav>
        <p class="footer-meta">
          السجل التجاري: <span dir="ltr">${SITE.cr}</span>${SITE.vat ? ` · الرقم الضريبي: <span dir="ltr">${SITE.vat}</span>` : ""}
        </p>
        <p class="footer-disclaimer">
          نحن نشاط تجاري مستقل ولا نتبع أي شركة أخرى ولا نمثلها. وأسماء العلامات المذكورة تخص أصحابها.
        </p>
      </div>
    </footer>`;
}

function homeView() {
  return `
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy reveal">
          <span class="eyebrow">${icons.spark} عرض مميز من ${SITE.brand}</span>
          <h1>عرض ${SITE.brand} بـ <span class="ink">50 ريالا</span></h1>
          <p class="hero-intro">تجميعة البيت التي تحبونها: دجاج طازج وصدور دجاج وأرز بسمتي فاخر، بسعر واحد شامل.</p>
          <ul class="hero-points">
            <li>${icons.check} دجاج طازج وصدور دجاج</li>
            <li>${icons.check} أرز بسمتي فاخر</li>
            <li>${icons.check} توصيل مجاني داخل ${SITE.city}</li>
          </ul>
          <div class="hero-actions">
            <button class="btn btn-primary" type="button" data-add>
              أضف العرض إلى السلة ${icons.arrow}
            </button>
            <a class="btn btn-ghost" href="/cart" data-link>عرض السلة</a>
          </div>
          <div class="hero-trust">
            <span class="free-pill">${icons.truck} توصيل مجاني</span>
            <span class="free-pill">${icons.clock} الوصول خلال ${SITE.deliveryTime}</span>
            <span class="free-pill">${icons.shield} منتجات مطابقة للمواصفات</span>
          </div>
        </div>
        <div class="hero-art reveal" data-delay="120">
          <div class="hero-media">
            ${productImg("", "eager")}
            <span class="badge badge-price">50 <small>ريال</small></span>
          </div>
          <div class="price-card">
            <div class="price-now">
              <span class="price-number">50</span>
              <span class="price-unit">ريال سعودي</span>
            </div>
            <div class="price-note">
              <span class="price-ref">قيمة العرض كاملة</span>
            </div>
            <button class="btn btn-primary btn-block" type="button" data-add>
              أضف العرض إلى السلة ${icons.arrow}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container features-grid">
        <div class="feature reveal">
          <span class="feature-icon">${icons.leaf}</span>
          <h3>منتج طازج</h3>
          <p>دجاج طازج يومياً بمكونات مختارة بعناية.</p>
        </div>
        <div class="feature reveal" data-delay="80">
          <span class="feature-icon">${icons.truck}</span>
          <h3>توصيل مجاني</h3>
          <p>نجهز الطلب ونوصله إلى باب بيتك دون رسوم إضافية.</p>
        </div>
        <div class="feature reveal" data-delay="160">
          <span class="feature-icon">${icons.shield}</span>
          <h3>جودة مضمونة</h3>
          <p>منتجات مطابقة للمواصفات، وإن وصلك خلل نستبدله أو نعيد المبلغ.</p>
        </div>
        <div class="feature reveal" data-delay="240">
          <span class="feature-icon">${icons.clock}</span>
          <h3>وصول سريع</h3>
          <p>يصلك الطلب خلال ${SITE.deliveryTime} من تأكيده.</p>
        </div>
      </div>
    </section>

    <section class="section" id="contents">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-kicker">محتويات العرض</span>
          <h2>كل ما تحتاجه على مائدة البيت</h2>
        </div>
        <div class="contents-grid">
          <div class="contents-media reveal">
            ${productImg()}
          </div>
          <div class="contents-list">
            ${PRODUCT.items
              .map(
                (item, i) => `
              <article class="offer-item reveal" data-delay="${i * 90}">
                <span class="item-number">${n(i + 1)}</span>
                <div>
                  <h3>${item.title}</h3>
                  <p>${item.note}</p>
                </div>
                <span class="item-check">${icons.check}</span>
              </article>`,
              )
              .join("")}
            <div class="contents-total reveal">
              <span>كل هذا بسعر</span>
              <strong>50 ريالا فقط</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section how" id="how">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-kicker">خطوة بسيطة إلى بيتك</span>
          <h2>كيف تطلب العرض؟</h2>
        </div>
        <ol class="steps">
          <li class="reveal">
            <span class="step-number">${n(1)}</span>
            <h3>أضف العرض</h3>
            <p>اضغط زر الإضافة ليصبح العرض في سلتك.</p>
          </li>
          <li class="reveal" data-delay="90">
            <span class="step-number">${n(2)}</span>
            <h3>اكتب العنوان</h3>
            <p>أدخل رقم الجوال والعنوان الوطني بالتفصيل.</p>
          </li>
          <li class="reveal" data-delay="180">
            <span class="step-number">${n(3)}</span>
            <h3>تأكيد الطلب</h3>
            <p>نرسل لك تأكيداً عبر واتساب للتحقق من العنوان والموعد قبل التوصيل.</p>
          </li>
          <li class="reveal" data-delay="270">
            <span class="step-number">${n(4)}</span>
            <h3>استلم في البيت</h3>
            <p>يصلك الطلب خلال ${SITE.deliveryTime} بعد التأكيد.</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="closing">
      <div class="container closing-inner reveal">
        <div>
          <h2>الكمية محدودة، اطلب الآن واستفيد من العرض.</h2>
          <p>التوصيل مجاني داخل ${SITE.city}، والوصول خلال ${SITE.deliveryTime}.</p>
        </div>
        <button class="btn btn-light" type="button" data-add>
          أضف العرض إلى السلة ${icons.arrow}
        </button>
      </div>
    </section>`;
}

function cartView() {
  if (!state.count) {
    return `
      <section class="container page">
        <div class="cart-head">
          <span class="section-kicker">خطوة بسيطة إلى بيتك</span>
          <h1>السلة والعنوان</h1>
          <p>راجع العرض، ثم اكتب عنوان التوصيل بالتفصيل.</p>
        </div>
        <div class="surface empty-cart">
          <span class="empty-icon">${icons.cart}</span>
          <h2>السلة تنتظر عرض ${SITE.brand}</h2>
          <p>لم تضف العرض إلى السلة بعد. اكتشف محتويات البوكس واطلبه الآن.</p>
          <a class="btn btn-primary" href="/" data-link>العودة إلى العرض ${icons.arrow}</a>
        </div>
      </section>`;
  }

  if (state.submitted) {
    return `
      <section class="container page">
        <div class="cart-head">
          <span class="section-kicker">خطوة بسيطة إلى بيتك</span>
          <h1>السلة والعنوان</h1>
          <p>راجع العرض، ثم اكتب عنوان التوصيل بالتفصيل.</p>
        </div>
        <div class="surface confirmation" role="status" aria-live="polite">
          <span class="confirmation-icon">${icons.check}</span>
          <span class="section-kicker">${SITE.brand} · ${SITE.city}</span>
          <h2>طلبك جاهز للإرسال</h2>
          <p class="delivery-estimate">${icons.truck} اضغط زر واتساب لإرسال الطلب إلينا. بعد استلامنا له نؤكده لك ونحدد موعد التوصيل خلال ${SITE.deliveryTime}.</p>
          <p class="confirmation-order">عرض ${SITE.brand} — ${money(PRODUCT.price * state.count)}، والتوصيل مجانا.</p>
          <a class="btn btn-primary" href="${whatsappOrderLink()}" target="_blank" rel="noopener">${icons.phone} إرسال الطلب على واتساب</a>
          <p class="confirmation-disclaimer">لم يصلنا طلبك بعد. يصل إلينا بعد إرساله على واتساب، أو يمكنك الاتصال بنا على <span dir="ltr">${SITE.phone}</span>.</p>
          <a class="btn btn-ghost" href="/" data-link>العودة إلى الصفحة الرئيسية ${icons.arrow}</a>
        </div>
      </section>`;
  }

  const subtotal = PRODUCT.price * state.count;
  const { address } = state;

  return `
    <section class="container page">
      <div class="cart-head">
        <span class="section-kicker">خطوة بسيطة إلى بيتك</span>
        <h1>السلة والعنوان</h1>
        <p>راجع العرض، ثم اكتب عنوان التوصيل بالتفصيل.</p>
      </div>

      <div class="cart-grid">
        <div class="surface cart-summary">
          <h2>عرضك في السلة</h2>
          <div class="cart-product">
            <img src="${PRODUCT.thumb}" alt="بوكس عرض ${SITE.brand}" width="240" height="240" loading="lazy" decoding="async" />
            <div>
              <h3>${PRODUCT.title}</h3>
              <p>${PRODUCT.short}</p>
            </div>
          </div>
          <div class="cart-line">
            <div class="quantity" aria-label="كمية العرض">
              <button type="button" aria-label="زيادة الكمية" data-step="1">${icons.plus}</button>
              <span>${n(state.count)}</span>
              <button type="button" aria-label="تقليل الكمية" data-step="-1">${icons.minus}</button>
            </div>
            <button type="button" class="remove-btn" data-remove>${icons.trash} إزالة العرض</button>
          </div>
          <div class="summary">
            <div class="summary-row"><span>قيمة العرض</span><span>${money(subtotal)}</span></div>
            <div class="summary-row"><span>التوصيل</span><span class="delivery-free">مجانا</span></div>
            <div class="summary-row total"><span>المجموع</span><span>${money(subtotal)}</span></div>
          </div>
        </div>

        <div class="surface">
          <h2>عنوان التوصيل في السعودية</h2>
          <form class="order-form" novalidate>
            <div class="form-grid">
              <label class="field">
                <span>اسم العميل (اختياري)</span>
                <input name="name" value="${address.name}" placeholder="الاسم الكامل" autocomplete="name" />
              </label>
              <label class="field">
                <span>رقم الجوال السعودي (+966)</span>
                <input name="phone" type="tel" inputmode="tel" dir="ltr" required value="${address.phone}" placeholder="مثال: +966 5X XXX XXXX" autocomplete="tel" />
              </label>
              <label class="field">
                <span>المدينة / المنطقة (اختياري)</span>
                <input name="city" value="${address.city}" placeholder="مثال: الرياض، جدة، مكة المكرمة، الدمام" autocomplete="address-level1" />
              </label>
              <label class="field field-wide">
                <span>العنوان الوطني في السعودية</span>
                <textarea name="details" required placeholder="المدينة، الحي، الشارع، رقم المبنى، الرمز البريدي والرقم الإضافي" autocomplete="street-address">${address.details}</textarea>
              </label>
            </div>
            ${state.error ? `<p class="form-error" role="alert">${state.error}</p>` : ""}
            <button class="btn btn-primary btn-block submit-order" type="submit">${icons.check} متابعة الطلب</button>
            <p class="form-note">بإرسال الطلب أنت توافق على <a href="/terms" data-link>الشروط والأحكام</a> و<a href="/privacy" data-link>سياسة الخصوصية</a>.</p>
          </form>
        </div>
      </div>
    </section>`;
}

function legalView(route) {
  const page = LEGAL[route];
  if (!page) return notFoundView();
  return `
    <section class="container page legal-page">
      <div class="cart-head">
        <span class="section-kicker">${SITE.brand}</span>
        <h1>${page.title}</h1>
        <p>${page.intro}</p>
      </div>
      <div class="surface legal-body">
        ${page.body}
        <p class="legal-updated">آخر تحديث: ${SITE.updated || "٢٠٢٦"}</p>
      </div>
    </section>`;
}

function notFoundView() {
  return `
    <section class="container page">
      <div class="surface empty-cart">
        <h2>الصفحة غير موجودة</h2>
        <p>الرابط الذي طلبته غير متاح.</p>
        <a class="btn btn-primary" href="/" data-link>العودة إلى العرض ${icons.arrow}</a>
      </div>
    </section>`;
}

/* --------------------------------- rendering ------------------------------- */
const root = document.getElementById("root");

function renderHeader() {
  const badge = root.querySelector("[data-count]");
  if (!badge) return;
  badge.textContent = n(state.count);
  badge.hidden = state.count === 0;
}

function observeReveals() {
  const targets = root.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add("is-visible"), delay);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  targets.forEach((t) => {
    io.observe(t);
    // حماية من عدم إطلاق المراقب في بعض الحالات (مثل التبويب غير النشط)
    setTimeout(() => t.classList.add("is-visible"), 900);
  });
}

function bindCartView() {
  root.querySelectorAll("[data-step]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = state.count + Number(btn.dataset.step);
      state.count = Math.max(1, next);
      persistCart();
      state.error = "";
      renderRoute();
    });
  });

  const remove = root.querySelector("[data-remove]");
  remove?.addEventListener("click", () => {
    state.count = 0;
    state.error = "";
    persistCart();
    renderRoute();
  });

  const form = root.querySelector(".order-form");
  form?.addEventListener("input", (event) => {
    const field = event.target.name;
    if (!field) return;
    state.address[field] = event.target.value;
    writeStore(KEYS.address, state.address);
  });
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    submitOrder();
  });
}

function renderRoute() {
  renderHeader();
  const path = state.location.replace(/\/+$/, "") || "/";
  const isCart = path.startsWith("/cart");
  const isLegal = Boolean(LEGAL[path]);
  const isKnown = path === "/" || isCart || isLegal;
  const view = isCart
    ? cartView()
    : isLegal
      ? legalView(path)
      : path === "/"
        ? homeView()
        : notFoundView();
  const shell = root.querySelector(".app-shell");
  shell.classList.toggle("is-cart", isCart);
  shell.classList.toggle("is-plain", isLegal || !isKnown);
  const main = shell.querySelector("main");
  main.innerHTML = view;
  main.className = isCart ? "page-wrap cart-page" : "page-wrap";
  bindCartView();
  observeReveals();
  window.scrollTo(0, 0);
}

function buildShell() {
  root.innerHTML = `
    <div class="app-shell">
      ${topbar()}
      ${header()}
      <main class="page-wrap"></main>
      ${footer()}
      ${mobileBar()}
    </div>`;
}

/* ------------------------------- interactions ------------------------------ */
function persistCart() {
  writeStore(KEYS.cart, { count: state.count });
}

function addToCart() {
  state.count += 1;
  state.error = "";
  persistCart();
  navigate("/cart");
}

function navigate(path) {
  if (path !== state.location) history.pushState({}, "", path);
  state.location = path;
  renderRoute();
}

function normalizePhone(input) {
  return input
    .replace(/[٠-٩۰-۹]/g, (ch) => {
      const idx = AR_DIGITS.indexOf(ch);
      return String(idx >= 0 ? idx : FA_DIGITS.indexOf(ch));
    })
    .replace(/\D/g, "");
}

function whatsappOrderLink() {
  const { address } = state;
  const subtotal = money(PRODUCT.price * state.count);
  const lines = [
    `طلب جديد من موقع ${SITE.brand}`,
    `العرض: ${PRODUCT.title}`,
    `الكمية: ${n(state.count)}`,
    `الإجمالي: ${subtotal} (التوصيل مجانا)`,
    address.name ? `الاسم: ${address.name}` : "",
    `الجوال: ${address.phone}`,
    address.city ? `المدينة: ${address.city}` : "",
    `العنوان: ${address.details}`,
  ].filter(Boolean);
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function submitOrder() {
  if (!state.count) {
    state.error = "السلة فارغة. أضف العرض أولاً لإكمال البيانات.";
    renderRoute();
    return;
  }
  if (!state.address.phone.trim() || !state.address.details.trim()) {
    state.error = "يرجى إدخال رقم الهاتف وعنوان التوصيل بالتفصيل.";
    renderRoute();
    return;
  }
  let digits = normalizePhone(state.address.phone);
  if (digits.length === 12 && digits.startsWith("966")) digits = digits.slice(3);
  if (digits.length !== 9 || !digits.startsWith("5")) {
    state.error =
      "يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 5 ويتكون من ٩ أرقام، مع رمز الدولة +966 أو بدونه.";
    renderRoute();
    return;
  }
  state.error = "";
  state.submitted = true;
  renderRoute();
}

/* ----------------------------------- boot ---------------------------------- */
function boot() {
  const storedCart = readStore(KEYS.cart, { count: 0 });
  state.count = Number(storedCart.count) || 0;
  state.address = readStore(KEYS.address, { ...EMPTY_ADDRESS });
  state.location = window.location.pathname;

  buildShell();
  renderRoute();

  document.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add]");
    if (add) {
      event.preventDefault();
      addToCart();
      return;
    }
    const link = event.target.closest("[data-link]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    const [path] = href.split("#");
    event.preventDefault();
    state.submitted = false;
    navigate(path || "/");
    if (href.includes("#")) {
      const target = document.getElementById(href.split("#")[1]);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  window.addEventListener("popstate", () => {
    state.location = window.location.pathname;
    state.submitted = false;
    renderRoute();
  });
}

boot();
