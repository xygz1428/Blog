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

    // 语法高亮类型；具体主题在下面的 shikiConfig 里配
    // 注意：syntaxHighlight 只认 type / excludeLangs，写 themes 会被静默忽略
    syntaxHighlight: { type: 'shiki' },

    shikiConfig: {
      // 浅色/深色双主题：Shiki 输出 CSS 变量，由 global.css 的 [data-theme='dark'] 切换
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
