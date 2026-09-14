// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://loweffort-alt.github.io/portfolio-v4',
  base: '/portfolio-v4',
  integrations: [react()]
});
