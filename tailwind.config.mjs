/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'selector',
  theme: {
    fontSize: {
      xs: ['var(--font-size-xs)', { lineHeight: 'var(--line-height-xs)' }],
      sm: ['var(--font-size-sm)', { lineHeight: 'var(--line-height-sm)' }],
      base: ['var(--font-size-base)', { lineHeight: 'var(--line-height-base)' }],
      lg: ['var(--font-size-lg)', { lineHeight: 'var(--line-height-lg)' }],
      xl: ['var(--font-size-xl)', { lineHeight: 'var(--line-height-xl)' }],
      '2xl': ['var(--font-size-2xl)', { lineHeight: 'var(--line-height-2xl)' }],
      '3xl': ['var(--font-size-3xl)', { lineHeight: 'var(--line-height-3xl)' }],
      '4xl': ['var(--font-size-4xl)', { lineHeight: 'var(--line-height-4xl)' }],
      '5xl': ['var(--font-size-5xl)', { lineHeight: 'var(--line-height-5xl)' }],
      '6xl': ['var(--font-size-6xl)', { lineHeight: 'var(--line-height-6xl)' }],
      '7xl': ['var(--font-size-7xl)', { lineHeight: 'var(--line-height-7xl)' }],
      '8xl': ['var(--font-size-8xl)', { lineHeight: 'var(--line-height-8xl)' }],
      '9xl': ['var(--font-size-9xl)', { lineHeight: 'var(--line-height-9xl)' }],
    },
    extend: {
      colors: {
        black: "#222222",
        white: "#f1f1f1",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    typography
  ],
}
