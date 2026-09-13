# SEO, Metadata & Assets Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the concrete metadata bugs in `BaseHead.astro`, replace the stock social-preview image with the site's own (already-present but unused) asset, and remove dead/duplicate files so the build stops warning and the repo stops shipping unused weight.

**Architecture:** `BaseHead.astro` has a mistyped meta attribute and points social-preview tags at a third-party Unsplash URL and an unverified Twitter handle. `public/cover.jpg` sits unused and oversized (6000x4000, unprocessed) — moving it into `src/assets/` lets Astro's built-in `astro:assets` pipeline resize/compress it at build time for use as the real OG image. Two other files are dead weight: a duplicate CV PDF under `src/pages/cv/` (the one actually served comes from `public/`) and an unused, EXIF-heavy profile photo (`public/images/pfp.jpg`) that nothing imports. Finally, the one raster image that *is* rendered today (`Topbar.astro`'s logo) is served as a raw `<img>` from `public/` — moving it through `astro:assets` gets automatic responsive `srcset`/compression, and its `alt` text gets fixed at the same time since it's the same element.

**Tech Stack:** Astro's built-in `astro:assets` image pipeline (no new dependency).

**Spec:** No standalone spec doc — derived from the SEO/metadata/dead-asset findings from the project audit conducted earlier in this session.

## Global Constraints

- No test suite exists. "Verify" steps mean `npm run build` succeeding and inspecting `dist/` output (`grep`, `file`, or opening the page), never a unit test.
- Do not change the visual design or copy of the page — this plan only touches `<head>` metadata and image delivery, not layout or text content.
- Keep `og:url` (`https://alexfarfan.lat/`) as-is — there are two domains referenced across the codebase (`alexfarfan.lat` here, `alexfarfan.me` in `Topbar.astro`'s link) and this plan does not have the information to know which is canonical. Do not guess; leave both untouched.
- This plan assumes Task 1 of `2026-09-13-security-and-tooling-upgrade.md` (dropping `@astrojs/tailwind`) is independent of this plan and can land in either order — no shared files.

---

### Task 1: Fix `BaseHead.astro` metadata bugs and use a real OG image

**Files:**
- Modify: `src/components/BaseHead.astro`
- Modify: `astro.config.mjs`
- Move: `public/cover.jpg` → `src/assets/cover.jpg`

**Interfaces:** None — this is a leaf component with no props, consumed only by `BaseLayout.astro`.

- [ ] **Step 1: Give the site a canonical `site` URL so asset URLs can be made absolute**

Astro needs `site` configured to turn a build-time image path into the absolute URL that `og:image`/`twitter:image` require.

```js
// astro.config.mjs
// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://alexfarfan.lat',
  integrations: [react()]
});
```

(This example assumes Task 1 of the security-and-tooling-upgrade plan already removed the `tailwind()` integration; if that plan hasn't run yet, keep the `tailwind()` entry in `integrations` and only add the `site` line.)

- [ ] **Step 2: Move the cover image into `src/assets` so Astro can process it**

```bash
mkdir -p src/assets
git mv public/cover.jpg src/assets/cover.jpg
```

- [ ] **Step 3: Generate an optimized OG image and fix the meta bugs in `BaseHead.astro`**

```astro
---
import "../styles/global.css";
import { getImage } from "astro:assets";
import coverImage from "../assets/cover.jpg";

const ogImage = await getImage({
  src: coverImage,
  width: 1200,
  height: 630,
  format: "jpg",
});
const ogImageUrl = new URL(ogImage.src, Astro.site).href;
---

<!-- Info SEO -->
<meta charset="utf-8" />
<title>Darío Alexander Farfán Navarro | Software Engineer</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="author" content="Darío Alexander Farfán Navarro" />
<meta
  name="description"
  content="🚀 Explora mi portafolio para acceder a recursos educativos y descubre soluciones tecnológicas innovadoras. Juntos, construyamos un futuro digital más informado y creativo. 💡"
/>
<meta
  name="keywords"
  content="portfolio,portfolio web,dario farfan,alex farfan,blog software,development, curso programacion"
/>
<meta name="robots" content="index, follow" />
<!-- meta Socials SEO -->
<meta
  property="og:title"
  content="Transformando Ideas en Código: Mi Viaje como Ingeniero de Software"
/>
<meta
  property="og:description"
  content="🚀 Explora mi portafolio para acceder a recursos educativos y descubre soluciones tecnológicas innovadoras. Juntos, construyamos un futuro digital más informado y creativo. 💡"
/>

<meta property="og:type" content="website" />
<meta property="og:url" content="https://alexfarfan.lat/" />
<meta property="og:image" content={ogImageUrl} />
<meta name="twitter:card" content="summary_large_image" />
<meta
  name="twitter:title"
  content="Transformando Ideas en Código: Mi Viaje como Ingeniero de Software"
/>
<meta
  name="twitter:description"
  content="🚀 Explora mi portafolio para acceder a recursos educativos y descubre soluciones tecnológicas innovadoras. Juntos, construyamos un futuro digital más informado y creativo. 💡"
/>
<meta name="twitter:image" content={ogImageUrl} />
<meta name="pinterest-rich-pin" content="true" />
<!-- favicon -->
<link
  rel="apple-touch-icon"
  sizes="180x180"
  href="/favicons/apple-touch-icon.png"
/>
<link
  rel="icon"
  type="image/png"
  sizes="32x32"
  href="/favicons/favicon-32x32.png"
/>
<link
  rel="icon"
  type="image/png"
  sizes="16x16"
  href="/favicons/favicon-16x16.png"
/>
<link rel="manifest" href="/favicons/site.webmanifest" />
<link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#1b1d20" />
<meta name="msapplication-TileColor" content="#1b1d20" />
<meta name="theme-color" content="#1b1d20" />
<!-- Inter Font: https://rsms.me/inter/ -->
<link rel="preconnect" href="https://rsms.me/" />
<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
```

What changed vs. the original: `name="your keywords"` → `name="keywords"`; `og:image`/`twitter:image` now point at a build-generated, 1200×630 copy of `cover.jpg` instead of an Unsplash URL; the unverified `twitter:site` (`@loweffort-alt`, which is a GitHub handle, not a Twitter/X one) tag is dropped rather than left wrong.

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: succeeds, and `dist/_astro/` contains a new hashed `cover.*.jpg` file at roughly 1200×630 (check with `file dist/_astro/cover.*.jpg`).

Run: `grep -o '<meta property="og:image"[^>]*>' dist/index.html`
Expected: the `content` attribute is an absolute `https://alexfarfan.lat/_astro/cover.*.jpg` URL, not the old Unsplash link.

Run: `grep -c 'name="your keywords"' dist/index.html`
Expected: `0`.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs src/components/BaseHead.astro src/assets/cover.jpg
git status  # confirm public/cover.jpg shows as deleted (moved)
git commit -m "fix: correct meta tag bugs and generate a real OG image from cover.jpg"
```

---

### Task 2: Remove dead and duplicate files

**Files:**
- Delete: `src/pages/cv/CV-AlexFarfan.pdf`
- Delete: `public/images/pfp.jpg`

**Interfaces:** None.

- [ ] **Step 1: Confirm nothing references these before deleting**

```bash
grep -rn "pfp.jpg" src/ public/ astro.config.mjs components.json 2>/dev/null
```
Expected: no output (already confirmed during the audit — this step re-verifies before an irreversible delete).

The CV under `src/pages/cv/CV-AlexFarfan.pdf` is never linked to directly — `contact.json.ts` and `src/pages/cv/index.astro`'s `<iframe>` both point at `/CV-AlexFarfan.pdf`, which resolves to the `public/` copy. The `src/pages/` copy only exists because Astro treats everything under `src/pages/` as a route source, which is exactly why it prints `[WARN] Unsupported file type ... found` on every build.

- [ ] **Step 2: Delete both files**

```bash
git rm src/pages/cv/CV-AlexFarfan.pdf
git rm public/images/pfp.jpg
```

- [ ] **Step 3: Verify**

Run: `npm run build 2>&1 | tee /tmp/build.log`
Run: `grep -c "Unsupported file type" /tmp/build.log`
Expected: `0` (down from 2 occurrences previously — the warning printed once per content-sync pass).

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/CV-AlexFarfan.pdf` (with `npm run dev` running)
Expected: `200` — the CV is still served correctly from `public/`.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: remove duplicate CV PDF and unused profile photo"
```

---

### Task 3: Serve the Topbar logo through `astro:assets` with a real `alt`

**Files:**
- Move: `public/images/circle-logo.png` → `src/assets/circle-logo.png`
- Modify: `src/components/landing/Header.astro` → no, modify `src/components/ui/Topbar.astro`

**Interfaces:** None — `Topbar.astro` takes no props today and this doesn't add any.

- [ ] **Step 1: Move the image into `src/assets`**

```bash
mkdir -p src/assets
git mv public/images/circle-logo.png src/assets/circle-logo.png
```

- [ ] **Step 2: Update `Topbar.astro` to import and render it via `astro:assets`**

Current (`src/components/ui/Topbar.astro:1-26`):
```astro
---
import ToggleTheme from "./ToggleTheme.astro";
import ToggleLanguage from "./ToggleLanguage.astro";
import { getLangFromUrl, useTranslations } from "@/i18n/utils";

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---

<header
  id="topbar"
  class="mx-auto max-w-xl md:flex md:items-center md:justify-between md:space-x-5 pt-12 lg:pt-24 sticky -top-9 lg:-top-[5.5rem]"
>
  <div class="flex items-center gap-5">
    <div class="shrink-0">
      <div class="relative">
        <img
          class="h-16 w-16 lg:h-24 lg:w-24 rounded-full aspect-square transition-all duration-300 border border-white/10"
          src="/images/circle-logo.png"
          alt="image"
        />
```

New:
```astro
---
import { Image } from "astro:assets";
import ToggleTheme from "./ToggleTheme.astro";
import ToggleLanguage from "./ToggleLanguage.astro";
import { getLangFromUrl, useTranslations } from "@/i18n/utils";
import circleLogo from "@/assets/circle-logo.png";

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---

<header
  id="topbar"
  class="mx-auto max-w-xl md:flex md:items-center md:justify-between md:space-x-5 pt-12 lg:pt-24 sticky -top-9 lg:-top-[5.5rem]"
>
  <div class="flex items-center gap-5">
    <div class="shrink-0">
      <div class="relative">
        <Image
          class="h-16 w-16 lg:h-24 lg:w-24 rounded-full aspect-square transition-all duration-300 border border-white/10"
          src={circleLogo}
          alt="Foto de perfil de Alexander Farfán Navarro"
          widths={[64, 96]}
          sizes="(min-width: 1024px) 96px, 64px"
        />
```

(Leave the rest of the file — the `<span>` overlay, the title/role block, and the `<style>`/`<script>` sections — untouched.)

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: succeeds; `dist/_astro/` contains resized `circle-logo.*.png`/`.webp` variants.

Run: `grep -o '<img[^>]*circle-logo[^>]*>' dist/index.html`
Expected: the tag now has a `srcset` attribute with multiple widths, and `alt="Foto de perfil de Alexander Farfán Navarro"` instead of `alt="image"`.

Run: `npm run dev`, open `http://localhost:4321/`, confirm the logo in the top bar still renders at the same visual size in both the normal and `.scrolled` (post-scroll) states.

- [ ] **Step 4: Commit**

```bash
git add src/assets/circle-logo.png src/components/ui/Topbar.astro
git commit -m "perf: serve the topbar logo through astro:assets with a real alt text"
```

---

## Self-Review Notes

- **Spec coverage:** the `keywords` typo, the stock OG image, the unverified `twitter:site`, the duplicate CV, the unused `pfp.jpg`, and the unoptimized `<img>` — every metadata/asset finding from the audit has a task.
- **Deliberately out of scope:** the `alexfarfan.lat` vs `alexfarfan.me` domain mismatch is flagged in Global Constraints but not fixed, since neither this plan nor the audit has grounds to say which one is stale — surface it to the project owner instead of guessing.
- **Type consistency:** N/A, no shared TS interfaces between these tasks.
