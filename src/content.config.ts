import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 博客文章集合。
 *
 * 新增文章：在 src/content/blog/ 下放一个 .md 文件，frontmatter 至少写 title / pubDate。
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // 四选一，与 src/site.mjs 的 categories 对应
    category: z.enum(['科研', '技术', '学习', '生活']).default('技术'),
    tags: z.array(z.string()).default([]),
    // 封面图文件名，图片放 src/content/blog/images/ 下
    cover: z.string().optional(),
    // true 时不会出现在列表与 RSS 里
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
