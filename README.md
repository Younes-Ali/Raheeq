# Raheeq — Site v3 (Chewy font + intro sequence + Bottom Nav)

---

## 1. التشغيل

```bash
npm install
npm run dev
```

`npm run build` للنسخة النهائية.

---

## 2. إيه اللي اتغيّر في النسخة دي

- **الفونت الأساسي بقى Chewy** (من Google Fonts) في كل الموقع — العناوين والنصوص
- **الألوان اتبسّطت لـ 3 بس:** بيج (`--beige`)، أخضر غامق (`--dark-green` / `--dark-green-soft`)، أبيض (`--white`)
- **الناف بار بقى تحت** مش فوق، وبيعمل scale-up للقسم اللي انت واقف فيه دلوقتي (scroll-spy)
- **سيكوانس افتتاحية:** اسم "Raheeq" بيظهر في نص الشاشة الأول (grow from nothing)، يستنى شوية، بعدين يتحرك وينزل لمكانه في الناف بار تحت، وبعدين يبان محتوى الهيرو
- **أنيميشن الأرقام/القصة/الـ Essential:** نفس أسلوب "الظهور من العدم" (scale + fade) بتاع الهيرو
- **أنيميشن المنتجات والتقييمات:** أسلوب مختلف — كروت بتطلع فوق بعض (fade up متدرّج)
- **قسم الجاليري:** جملة في النص + كروت حواليها بـ hover effect لطيف (ترفع لفوق شوية)
- **الـ CTA:** fade up بسيط واحترافي (من غير scale)، والعناصر جواه (العنوان والزرار) بتظهر بتتابع

---

## 3. هيكل المشروع (اتقسّم فولدرز صح)

```
src/
├── main.jsx
├── App.jsx                    ← بيجمع كل السكاشن مع بعض
├── styles/
│   └── global.css              ← الألوان + الفونت + كلاسات مشتركة
├── data/
│   └── content.js               ← كل النصوص والبيانات (منتجات، تقييمات، إحصائيات)
├── hooks/
│   └── useSmoothScroll.js        ← Lenis + GSAP
├── components/
│   ├── intro/
│   │   └── IntroLogo.jsx          ← سيكوانس الافتتاحية
│   ├── nav/
│   │   └── BottomNav.jsx           ← الناف بار تحت
│   ├── animations/
│   │   ├── GrowReveal.jsx           ← "ظهور من العدم" (هيرو، أرقام، قصة، essential)
│   │   ├── StaggerCards.jsx         ← "كروت فوق بعض" (منتجات، تقييمات، جاليري)
│   │   ├── Counter.jsx               ← الأرقام المتحركة
│   │   └── MagneticButton.jsx        ← الزرار اللي بيتبع الماوس
│   └── ui/
│       └── VideoBackground.jsx        ← فيديو تلقائي (أو placeholder لو الملف مش موجود)
└── sections/
    ├── Hero.jsx
    ├── Stats.jsx
    ├── Mission.jsx
    ├── Essential.jsx
    ├── Products.jsx
    ├── Gallery.jsx
    ├── Testimonials.jsx
    ├── Cta.jsx
    └── Footer.jsx
```

**عايز تعدّل نص أو تضيف منتج؟** كل البيانات في `src/data/content.js` بس، مش محتاج تدوّر في الكومبوننتس.

**عايز تعدّل لون؟** كل حاجة من `src/styles/global.css` (متغيرات `--beige`, `--dark-green`, `--white`).

---

## 4. الفيديوهات (لسه زي الأول)

| المكان | المسار |
|---|---|
| خلفية الهيرو | `public/videos/hero.mp4` |
| خلفية الـ CTA | `public/videos/cta.mp4` |

بيتكشفوا تلقائيًا — حط الملف وشغّل السيرفر من الأول (`npm run dev` من تاني) لو كان شغّال بالفعل وقت ما حطيته.

**لو الفيديو متصوّر بكاميرا آيفون (HEVC/H.265):** المتصفح ممكن يرفض يشغّله. حوّله لـ H.264 عادي بأداة زي [CloudConvert](https://cloudconvert.com/mp4-converter).
