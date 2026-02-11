# Dependency Map

> **Purpose**: This document helps you understand what depends on what, making it easy to add or remove features without breaking things.

---

## 📦 Feature Domains

### 🏢 Experience Section

**What it includes:**
- Work experience timeline
- Company logos and links
- Skills and technologies display

**Data:**
- `src/data/experience/experiences-en.json`
- `src/data/experience/experiences-es.json`
- `src/data/experience/experiences-ja.json`

**Components:**
- `src/components/home/ExperienceSection.astro` ← **Main orchestrator**
- `src/components/ui/react/experience/ExperienceCard.tsx`
- `src/components/ui/react/experience/DualLogo.tsx`
- `src/components/ui/react/experience/TechLoopSlider.tsx`
- `src/components/ui/react/common/AnimatedTimeline.tsx`
- `src/components/ui/SkillBadge.tsx`

**Services:**
- `src/services/experience.ts` (calculateDuration, formatDate, getPresentText)

**Types:**
- `src/types/experience.ts`

**Config:**
- `src/config/tech-logos.json` (technology logo URLs)

**Assets:**
- `src/assets/images/leanmind-logo.jpg`
- `src/assets/images/clarity-logo.png`
- `src/assets/images/TII-logo.jpg`
- `src/assets/images/voxelgroup-logo.jpeg`

**💡 To remove this feature:**
1. Delete all files above
2. Remove `<ExperienceSection />` from `src/pages/[locale]/index.astro`
3. Keep `src/config/tech-logos.json` if used elsewhere

---

### 🏠 Hero Section

**What it includes:**
- Landing hero with animated text
- Call-to-action buttons

**Components:**
- `src/components/home/HeroSection.astro`
- `src/components/ui/AnimatedText.tsx`
- `src/components/ui/MagneticButton.tsx`
- `src/components/decorators/AuroraBackground.tsx`

**Services:**
- None (self-contained)

**Types:**
- `src/types/common.ts` (AnimationProps)

**💡 To remove this feature:**
1. Delete `src/components/home/HeroSection.astro`
2. Remove `<HeroSection />` from page
3. Keep shared UI components if used elsewhere

---

### 📝 Blog Section

**What it includes:**
- Blog posts with i18n support
- Post listing and detail pages

**Data:**
- `src/content/blog/en/*.md`
- `src/content/blog/es/*.md`
- `src/content/blog/ja/*.md`

**Components:**
- `src/components/home/BlogSection.astro`
- `src/pages/[locale]/blog/index.astro`
- `src/pages/[locale]/blog/[...slug].astro`

**Services:**
- `src/services/i18n.ts` (locale handling)

**Types:**
- `src/types/common.ts` (Locale)

**💡 To remove this feature:**
1. Delete `src/content/blog/`
2. Delete `src/pages/[locale]/blog/`
3. Delete `src/components/home/BlogSection.astro`
4. Remove from navigation

---

### 🌐 Internationalization (i18n)

**What it includes:**
- Multi-language support (EN, ES, JA)
- Locale routing
- Translated content

**Config:**
- `astro.config.mjs` (i18n settings)
- `vercel.json` (redirects)

**Pages:**
- `src/pages/[locale]/index.astro`
- `src/pages/index.astro` (root redirect)

**Services:**
- `src/services/i18n.ts`

**Types:**
- `src/types/i18n.ts`

**Content:**
- `src/content/about/en.mdx`, `es.mdx`, `ja.mdx`
- All localized data files

**💡 To remove this feature:**
1. Delete `src/services/i18n.ts`
2. Delete `src/types/i18n.ts`
3. Remove i18n config from `astro.config.mjs`
4. Flatten routes to single language

---

### 🎨 Common UI Components

**What it includes:**
- Reusable UI primitives

**Components:**
- `src/components/ui/Badge.astro`
- `src/components/ui/Button.astro`
- `src/components/ui/Card.astro`
- `src/components/ui/Input.astro`
- `src/components/ui/Link.astro`
- `src/components/ui/Textarea.astro`
- `src/components/ui/AnimatedText.tsx`
- `src/components/ui/FuzzyText.tsx`
- `src/components/ui/MagneticButton.tsx`
- `src/components/ui/SkillBadge.tsx`

**💡 To remove:**
- Only delete if no other components import them
- Check dependencies with `grep` before removing

---

### 🎭 Decorators

**What it includes:**
- Visual effect wrappers

**Components:**
- `src/components/decorators/AuroraBackground.tsx`
- `src/components/decorators/Parallax.tsx`
- `src/components/decorators/ParallaxSection.astro`
- `src/components/decorators/ScrollReveal.tsx`

**💡 To remove:**
- Check usage with `grep` before deleting
- Safe to remove if not imported anywhere

---

### 🏗️ Layout & Structure

**What it includes:**
- Page structure and navigation

**Components:**
- `src/components/layout/Header.astro`
- `src/components/layout/Footer.astro`
- `src/components/layout/ScrollToTop.astro`

**Layouts:**
- `src/layouts/Layout.astro`

**💡 To remove:**
- Required for site structure
- Removing breaks all pages

---

## 🔍 How to Check Dependencies

### Find all imports of a component:
```bash
grep -r "ComponentName" src/
```

### Find all files importing from a specific file:
```bash
grep -r "from.*path/to/file" src/
```

### Find all data consumers:
```bash
grep -r "import.*from.*data/experience" src/
```

---

## ✅ Safe Removal Checklist

Before removing any feature:

- [ ] Search for imports: `grep -r "FeatureName" src/`
- [ ] Check if data is used elsewhere
- [ ] Verify no broken links remain
- [ ] Test build: `bun run build`
- [ ] Test locally: `bun run dev`

---

## 📊 Dependency Graph (Simplified)

```
Pages (index.astro)
  └─ Sections (HeroSection, ExperienceSection, BlogSection, etc.)
      ├─ Domain Components (ExperienceCard, DualLogo, etc.)
      │   └─ UI Primitives (Badge, Button, SkillBadge)
      ├─ Decorators (Parallax, AuroraBackground)
      └─ Services (experience.ts, i18n.ts, data.ts)
          └─ Types (experience.ts, common.ts, i18n.ts)
```

---

**Last Updated:** Feb 11, 2026
