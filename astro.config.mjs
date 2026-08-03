// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import { remarkExcerpt } from './remark-excerpt.mjs';

// https://astro.build/config
export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [remarkExcerpt]
    })
  },
  integrations: [mdx()]
});
