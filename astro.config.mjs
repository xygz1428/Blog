// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import { SITE } from './src/site.mjs';

// https://astro.build/config
export default defineConfig({
  // 部署地址与 base 前缀都在 src/site.mjs 里改
  site: SITE.url,
  base: SITE.base,

  integrations: [sitemap()],

  markdown: {
    // Astro 7 起默认处理器不再内置公式支持，这里显式用 remark/rehype 管线
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    // 代码高亮：浅色/深色双主题，跟随 data-theme 切换
    syntaxHighlight: {
      type: 'shiki',
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
