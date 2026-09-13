# i18n & Data Architecture Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the duplicate-content routing bug at `/`, and simplify the hand-rolled `src/data/*.json.ts` content pattern and the ad-hoc project-title translation so the codebase has one consistent way to store localized content.

**Architecture:** Today `src/pages/index.astro`, `src/pages/en/index.astro`, and `src/pages/es/index.astro` are three byte-for-byte identical files — `/` and `/en` both render the same English content, which is duplicate content for no reason. Turning on Astro's native `i18n` routing config lets Astro auto-generate a redirect from `/` to `/en` instead, so the duplicate file can just be deleted. Separately, every file in `src/data/` wraps an array in an unnecessary `const one = {...}; const two = {...}; export const bytitle = {one, two}; export const x = Object.values(bytitle)` indirection — collapsing these to plain array literals removes indirection with zero behavior change, since only the final array (`articles`, `works`, `contact`, `projects`) is ever imported. `projects.json.ts` additionally reinvents translation with a one-off `title`/`titleEng` pair instead of going through the existing `t()` system — reshaping it to `{ es, en }` per project brings it in line with how every other piece of UI text in the app is localized.

**Tech Stack:** Astro's built-in `i18n` config (no new dependency).

**Spec:** No standalone spec doc — derived from the i18n/data-architecture findings from the project audit conducted earlier in this session.

## Global Constraints

- No test suite exists. "Verify" steps mean `npm run build` succeeding, checking `dist/` output, and manually loading routes in the browser/`curl` — never a unit test.
- This is the highest-risk of the three improvement plans from this audit (it touches routing and the shape of every data file) — run it on its own branch and check all three locale routes plus every `Content/*.astro` section manually before merging.
- Do not change the `ui` translation strings in `src/i18n/languages.json.ts` — this plan only touches routing and the `src/data/` layer.
- Every exported array's **name** (`articles`, `works`, `contact`, `projects`) must stay the same, since `src/components/landing/Content/*.astro` import them by that name — only the internal construction changes.

---

### Task 1: Turn on native Astro i18n routing and remove the duplicate root page

**Files:**
- Modify: `astro.config.mjs`
- Delete: `src/pages/index.astro`

**Interfaces:** None — `en/index.astro` and `es/index.astro` are unchanged; only what serves `/` changes, from a third copy of the page to a generated redirect.

- [ ] **Step 1: Add `i18n` config**

```js
// astro.config.mjs
// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://alexfarfan.lat',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [react()]
});
```

(`site` is included here because Astro's i18n redirect generation needs it; skip re-adding it if the SEO-and-assets plan already set it.)

- [ ] **Step 2: Delete the duplicate root page**

```bash
git rm src/pages/index.astro
```

With `prefixDefaultLocale: true` and no `src/pages/index.astro` of your own, Astro auto-generates a `/` route that redirects to `/en` (the `defaultLocale`).

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: succeeds. Inspect `dist/index.html` — it should now be a redirect page (a `<meta http-equiv="refresh">` to `/en` plus a fallback link), not the full rendered homepage.

- [ ] **Step 4: Verify all three URLs in the browser**

Run: `npm run dev`, then:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/en
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/es
curl -sL -o /dev/null -w "%{http_code}\n" http://localhost:4321/
```
Expected: `200` for `/en` and `/es`; the last command (`-L` follows the redirect) also ends at `200`. Open `http://localhost:4321/` directly in a browser and confirm it lands on `/en` showing the same homepage as before.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs
git commit -m "refactor(i18n): use native Astro i18n routing, redirect / to /en instead of duplicating it"
```

---

### Task 2: Collapse `src/data/*.json.ts` to plain array exports

**Files:**
- Modify: `src/data/articles.json.ts`
- Modify: `src/data/works.json.ts`
- Modify: `src/data/contact.json.ts`

**Interfaces:**
- Produces: `articles: Template[]`, `works: Template[]`, `contact: Template[]` — same export names and same `Template` shape as before, consumed by `src/components/landing/Content/Articles.astro`, `Works.astro`, and `Contacts.astro` respectively (verified: those three components only import the array, never `bytitle`/`bytype`, so they need no changes).

- [ ] **Step 1: Rewrite `src/data/articles.json.ts`**

```ts
export interface Template {
  link: string;
  title: string;
  date: string;
}

export const articles: Template[] = [
  {
    link: "https://loweffort.notion.site/Introducci-n-a-NodeJS-06f3552c1bde4fbdbf5ca1301bc8d747?pvs=4",
    title: "Introduction to NodeJS",
    date: "13.02.2023",
  },
  {
    link: "https://loweffort.notion.site/NodeJS-01-b3bf324784cf4618b32c6199ce24bf34?pvs=4",
    title: "NodeJS 01",
    date: "10.02.2022",
  },
  {
    link: "https://loweffort.notion.site/Docker-Basics-8ca86e7064884b3cb648f217fb11a91f?pvs=4",
    title: "Docker Basics",
    date: "10.02.2022",
  },
  {
    link: "https://loweffort.notion.site/Lua-decf6c31e65d45c69929a95f327214e2",
    title: "Lua",
    date: "03.03.2024",
  },
  {
    link: "https://loweffort.notion.site/Advance-ReadMe-ed082419606e445b83f60d1466368dae?pvs=4",
    title: "Neovim 2023 Setup",
    date: "03.02.2023",
  },
];
```

- [ ] **Step 2: Rewrite `src/data/works.json.ts`**

```ts
export interface Template {
  link: string;
  title: string;
  status: number;
}

// 1 == Terminado
// 0 == En Progreso
export const works: Template[] = [
  {
    link: "https://neo-devs-hero-ai.vercel.app/",
    title: "HeroAI",
    status: 1,
  },
  {
    link: "https://fanaweb.vercel.app/",
    title: "FANA Automotriz",
    status: 1,
  },
  {
    link: "https://service-entretien-sjs.vercel.app/",
    title: "SJS | Entretien Service",
    status: 1,
  },
  {
    link: "http://18.220.232.202:3000/",
    title: "GeoShake",
    status: 0,
  },
];
```

- [ ] **Step 3: Rewrite `src/data/contact.json.ts`**

Preserve the current render order (LinkedIn, Github, CV, Email — i.e. what `Object.values({five, one, four, three})` produced before):

```ts
export interface Template {
  link: string;
  type: string;
  title: string;
}

export const contact: Template[] = [
  {
    link: "https://www.linkedin.com/in/alexfarfan/",
    type: "LinkedIn",
    title: "alexfarfan",
  },
  {
    link: "https://github.com/loweffort-alt",
    type: "Github",
    title: "loweffort-alt",
  },
  {
    link: "/CV-AlexFarfan.pdf",
    type: "CV",
    title: "Curriculum Vitae",
  },
  {
    link: "mailto:farfan_alexander@outlook.com",
    type: "Email",
    title: "farfan_alexander@outlook.com",
  },
];
```

- [ ] **Step 4: Verify**

Run: `npm run astro -- check`
Expected: no type errors (the `Template` shape is unchanged, so `Content/Articles.astro`, `Works.astro`, `Contacts.astro` type-check exactly as before).

Run: `npm run build`, then open `http://localhost:4321/en` (via `npm run preview` or `npm run dev`) and confirm the Works, Articles, and Contacts sections render the exact same items, in the exact same order, as before this change.

- [ ] **Step 5: Commit**

```bash
git add src/data/articles.json.ts src/data/works.json.ts src/data/contact.json.ts
git commit -m "refactor(data): collapse bytitle/Object.values indirection to plain array exports"
```

---

### Task 3: Unify project-title translation into the same `t()`-style pattern

**Files:**
- Modify: `src/data/projects.json.ts`
- Modify: `src/components/landing/Content/Projects.astro`

**Interfaces:**
- Produces: `projects: Template[]` where `Template.title` is now `{ es: string; en: string }` instead of a bare `string` + separate `titleEng?: string`.
- Consumes (in `Projects.astro`): `lang` from `getLangFromUrl(Astro.url)` (unchanged) — now used as `template.title[lang]` instead of the previous ternary.

- [ ] **Step 1: Rewrite `src/data/projects.json.ts`**

```ts
export interface Template {
  link: {
    Github: string;
    Doc: string;
    Figma?: string;
    AndroidRepo?: string;
    Server?: string;
    Cliente?: string;
  };
  title: {
    es: string;
    en: string;
  };
  state: number;
}

export const projects: Template[] = [
  {
    link: {
      Github: "https://github.com/loweffort-alt/ToDoLock-server",
      Doc: "/",
      Figma:
        "https://www.figma.com/community/file/1275291490973723744/rest-api-diagram-eng-esp",
      Cliente: "https://loweffort-alt.github.io/ToDoLock-client/",
    },
    title: {
      es: "ToDoLock: Gestión de Tareas con Sesiones de Usuario",
      en: "ToDoLock: Task Management with User Sessions",
    },
    state: 1,
  },
  {
    link: {
      Github: "https://github.com/loweffort-alt/check-in_simulator",
      Doc: "https://loweffort.notion.site/Airport-API-Documentation-3588c8a12db64b8dbd725a7b7b65a6c7",
      Server: "https://check-in-simulator-f7j8.onrender.com/flights/1/passengers",
      Cliente: "/",
    },
    title: {
      es: "Check-In Virtual: ¡Listos para Despegar!",
      en: "Virtual Check-In: Ready for Takeoff!",
    },
    state: 0,
  },
  {
    link: {
      Github: "https://github.com/loweffort-alt/web-accel",
      Doc: "/",
      Server: "https://server-acce.onrender.com/proxy",
      Cliente: "https://loweffort-alt.github.io/web-accel/",
    },
    title: {
      es: "QuakeSense: Centro de Monitoreo de Estaciones Sísmicas",
      en: "QuakeSense: Seismic Station Monitoring Center",
    },
    state: 0,
  },
  {
    link: {
      Github: "https://github.com/loweffort-alt/NeoDevs-HeroAI",
      Doc: "/",
      Server: "https://github.com/rafaelcg14/hero-ai-backend",
      Cliente: "https://neo-devs-hero-ai.vercel.app/",
    },
    title: {
      es: "HeroAI: Una IA que convierte tus notas en preguntas",
      en: "HeroAI: An AI that turns your notes into questions",
    },
    state: 1,
  },
];
```

- [ ] **Step 2: Update `Projects.astro` to read the new shape**

Current (`src/components/landing/Content/Projects.astro:22-24`):
```astro
              <p class="text-black dark:text-white">
                {lang === "es" ? template.title : template.titleEng}
              </p>
```

New:
```astro
              <p class="text-black dark:text-white">
                {template.title[lang]}
              </p>
```

No other line in `Projects.astro` changes — `lang` is still `getLangFromUrl(Astro.url)` from the existing frontmatter, and `t("hFour")`, `t("pFinished")`/`t("pInProgress")` are untouched.

- [ ] **Step 3: Verify**

Run: `npm run astro -- check`
Expected: no type errors — `lang` is typed as `keyof typeof ui` (`"en" | "es"`), which matches the keys of the new `title` object exactly, so `template.title[lang]` type-checks.

Run: `npm run dev`, open `http://localhost:4321/en` and `http://localhost:4321/es`, and confirm all four project titles show the correct language on each route (compare against the original `title`/`titleEng` values above to make sure none got swapped during the rewrite).

- [ ] **Step 4: Commit**

```bash
git add src/data/projects.json.ts src/components/landing/Content/Projects.astro
git commit -m "refactor(i18n): store project titles as {es, en} instead of a title/titleEng pair"
```

---

## Self-Review Notes

- **Spec coverage:** the `/`-vs-`/en` duplicate content issue, the `bytitle`/`Object.values` indirection across all four data files, and the one-off `title`/`titleEng` translation pattern are all covered.
- **Ordering:** Tasks are independent of each other (Task 1 touches routing config, Tasks 2-3 touch `src/data/`) and can be done in any order or split across separate PRs; Task 3 depends on nothing from Task 2 since it only touches `projects.json.ts`, which Task 2 doesn't modify.
- **Type consistency:** `Template.title` changes from `string` (+ optional `titleEng?: string`) to `{ es: string; en: string }` in Task 3 — the only consumer of that field, `Projects.astro`, is updated in the same task, and no other file reads `projects[i].title`.
- **Risk flagged in Global Constraints:** Task 1 changes production URLs (`/` no longer serves full HTML, it redirects) — call this out to the project owner explicitly since it changes what search engines and existing bookmarks/backlinks to `/` will see (a redirect instead of a 200), even though it fixes a real duplicate-content issue.
