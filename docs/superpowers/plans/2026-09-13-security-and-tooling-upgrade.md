# Security & Tooling Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the critical/high `npm audit` vulnerabilities in this Astro portfolio by upgrading `astro` past the vulnerable range, and stop future regressions from reaching `main` unnoticed by adding a PR build-check and baseline lint/format config.

**Architecture:** `astro@<=7.2.7` is flagged critical by `npm audit` (XSS, SSRF, RCE-in-AVIF-optimization advisories); the fix requires `astro@^7.2.8`. The installed `@astrojs/tailwind` integration peer-caps at `astro ^5.0.0` and has no version supporting Astro 7, so it must be replaced with a plain PostCSS pipeline (Tailwind v3 itself is unaffected — only the Astro-specific wiring integration is dropped). Once the app builds clean on Astro 7, add ESLint (astro plugin) + the already-installed `prettier-plugin-astro`, and a GitHub Actions job that runs `npm run build` on every PR so broken builds are caught before merge instead of at deploy time.

**Tech Stack:** Astro 7, Tailwind CSS 3.4 via manual PostCSS config, ESLint + `eslint-plugin-astro`, Prettier, GitHub Actions.

**Spec:** No standalone spec doc exists for this maintenance work — this plan is derived directly from the `npm audit` output and dependency-compatibility checks performed against the live repo during the project audit earlier in this session.

## Global Constraints

- This repo has no test suite. Every "verify" step below means `npm run build` succeeding, `npm run astro check` passing, and/or a content check (`grep`) on the built output — never a unit test.
- Do not introduce Tailwind v4 or touch `tailwind.config.mjs`'s theme values — only the integration wiring changes.
- `npm run dev`, `npm run build`, `npm run preview` must keep working with the same behavior (dark mode, i18n routes, the `popover.tsx` React island) after every task.
- Target `astro` version: `^7.3.2` (latest at time of writing; audit's fixed floor is `7.2.8`).
- Target `@astrojs/react` version: `^6.0.5` (first line with no upper-bound conflict against Astro 7; peer deps for `react`/`react-dom` are unchanged, still `^18.3.1`).

---

### Task 1: Replace `@astrojs/tailwind` with a manual PostCSS pipeline

**Files:**
- Create: `postcss.config.cjs`
- Modify: `astro.config.mjs`
- Modify: `package.json`

**Interfaces:** None (build-config only, no runtime code touches this).

- [ ] **Step 1: Create the PostCSS config**

`global.css` already contains the `@tailwind base/components/utilities` directives directly (checked in `src/styles/global.css:1-3`), so `applyBaseStyles` from the old integration was never doing anything — a plain PostCSS pipeline is a drop-in replacement.

```js
// postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 2: Remove the integration from `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()]
});
```

- [ ] **Step 3: Update `package.json` dependencies**

Remove `@astrojs/tailwind` from `dependencies`. Add `postcss` and `autoprefixer` as direct `devDependencies` (they were only transitive via the removed integration — pin the versions already resolved in `package-lock.json` so behavior doesn't shift):

```json
"devDependencies": {
  "@tailwindcss/typography": "^0.5.15",
  "autoprefixer": "^10.4.20",
  "postcss": "^8.4.49"
}
```

- [ ] **Step 4: Install and verify the build**

Run: `npm install`
Run: `npm run build`
Expected: build succeeds with no PostCSS/Tailwind errors, and `dist/` is produced.

Run: `grep -o 'bg-black' dist/index.html | head -1` (or open `dist/_astro/*.css` and check it contains compiled Tailwind utility classes, e.g. `grep -l "\.dark\\:bg-black" dist/_astro/*.css`)
Expected: a match — confirms Tailwind classes were still compiled into CSS without the integration.

- [ ] **Step 5: Manual visual check**

Run: `npm run dev`, open `http://localhost:4321/`, confirm dark background, light/dark toggle, and layout spacing look unchanged from before this change (compare against the screenshot/behavior from the earlier local run in this session).

- [ ] **Step 6: Commit**

```bash
git add postcss.config.cjs astro.config.mjs package.json package-lock.json
git commit -m "build: replace @astrojs/tailwind integration with plain PostCSS config"
```

---

### Task 2: Upgrade Astro to `^7.3.2` and `@astrojs/react` to `^6.0.5`

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json` (via `npm install`)

**Interfaces:**
- Consumes: the PostCSS pipeline from Task 1 (must be in place first, since `@astrojs/tailwind` cannot install alongside Astro 7 at all — its peer range rejects it).

- [ ] **Step 1: Bump versions in `package.json`**

```json
"dependencies": {
  "@astrojs/react": "^6.0.5",
  "@radix-ui/react-popover": "^1.1.4",
  "@types/react": "^19.0.2",
  "@types/react-dom": "^19.0.2",
  "astro": "^7.3.2",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^0.469.0",
  "prettier-plugin-astro": "^0.14.1",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "tailwind-merge": "^2.6.0",
  "tailwindcss": "^3.4.17",
  "tailwindcss-animate": "^1.0.7"
}
```

- [ ] **Step 2: Install**

Run: `npm install`
Expected: no peer-dependency conflict errors (this only works because Task 1 already dropped `@astrojs/tailwind`).

- [ ] **Step 3: Verify the build and type-check**

Run: `npm run build`
Expected: succeeds, `dist/` regenerated.

Run: `npm run astro -- check`
Expected: no new type errors introduced by the Astro 7 types.

- [ ] **Step 4: Verify all three routes and the React island still work**

Run: `npm run dev`, then in another shell:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/en
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/es
```
Expected: `200` for all three.

Open `http://localhost:4321/` in a browser and click the `popover.tsx`-backed control (the shadcn/ui Popover) to confirm the React island still hydrates and opens under Astro 7 + the new Vite version it ships.

- [ ] **Step 5: Re-run the audit**

Run: `npm audit`
Expected: the `astro` critical advisory is gone. Note any remaining vulnerabilities that require a major bump elsewhere and leave those for a follow-up — don't chase transitive advisories with no direct fix in this task.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: upgrade astro to ^7.3.2 and @astrojs/react to ^6.0.5"
```

---

### Task 3: Add ESLint + Prettier configuration

**Files:**
- Create: `.eslintrc.cjs`
- Create: `.prettierrc.json`
- Modify: `package.json` (add `lint`/`format` scripts and new devDependencies)

**Interfaces:** None — dev-only tooling.

- [ ] **Step 1: Add devDependencies**

```json
"devDependencies": {
  "@tailwindcss/typography": "^0.5.15",
  "autoprefixer": "^10.4.20",
  "postcss": "^8.4.49",
  "eslint": "^9.17.0",
  "eslint-plugin-astro": "^1.3.1",
  "prettier": "^3.4.2"
}
```

- [ ] **Step 2: Create `.eslintrc.cjs`**

```js
module.exports = {
  extends: ['plugin:astro/recommended'],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
  ],
};
```

- [ ] **Step 3: Create `.prettierrc.json`**

Match the formatting already implicit in the existing `.astro` files (2-space indent, double quotes in markup, semicolons in scripts):

```json
{
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": { "parser": "astro" }
    }
  ]
}
```

- [ ] **Step 4: Add npm scripts**

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "lint": "eslint . --ext .js,.ts,.astro",
  "format": "prettier --check ."
}
```

- [ ] **Step 5: Install and verify**

Run: `npm install`
Run: `npm run lint`
Expected: completes (fix any real errors it surfaces on existing files — do not mass-reformat unrelated files in this task; if `format` reports many pre-existing files as unformatted, leave them and note it for a separate formatting-only PR).

- [ ] **Step 6: Commit**

```bash
git add .eslintrc.cjs .prettierrc.json package.json package-lock.json
git commit -m "chore: add ESLint and Prettier configuration"
```

---

### Task 4: Run the production build on every pull request

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:** None.

- [ ] **Step 1: Create the workflow**

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Build
        run: npm run build
```

- [ ] **Step 2: Verify locally**

Run: `npm ci && npm run lint && npm run build`
Expected: all three succeed in sequence, matching what the workflow will run.

- [ ] **Step 3: Commit and open a PR to see it run**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: run lint and build on every pull request"
git push -u origin HEAD
```

Open a PR and confirm the new `CI` check appears and passes in the GitHub Actions tab.

---

## Self-Review Notes

- **Spec coverage:** Task 1+2 cover the critical `npm audit` finding; Task 3 covers the missing lint/format setup; Task 4 covers the missing PR-time build validation. All four gaps identified in the audit are addressed.
- **Ordering matters:** Task 1 must land before Task 2 — installing `astro@^7.3.2` while `@astrojs/tailwind` is still in `package.json` will fail to resolve peer dependencies.
- **Type consistency:** No shared function signatures between tasks (all config-level changes), so no cross-task type-mismatch risk.
