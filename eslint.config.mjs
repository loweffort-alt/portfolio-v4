import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";

export default [
  {
    ignores: ["dist/**", ".astro/**"],
  },
  {
    // Plain JS/CJS/ESM config files (astro.config.mjs, tailwind.config.mjs,
    // postcss.config.cjs, ...) run under Node, not the browser.
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["**/*.astro/*.js"],
    languageOptions: {
      globals: { ...globals.node },
    },
    ...js.configs.recommended,
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.{ts,tsx,mts,cts}"],
    // Scripts embedded in .astro files are linted as virtual `*.astro/*.ts`
    // files by eslint-plugin-astro's own config below, which already sets
    // up the right parser/globals/processor for them.
    ignores: ["**/*.astro/*.ts"],
  })),
  ...eslintPluginAstro.configs.recommended,
];
