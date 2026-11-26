---
title: Astro 内容集合的 schema 校验到底在防什么
description: 用 zod 给 frontmatter 上约束，把「文章默默消失」变成「构建时明确报错」。
pubDate: 2026-11-26
category: 技术
tags: ['Astro', 'Markdown', '构建']
cover: cover-schema.jpg
---

写博客最容易遇到的坑不是排版，是**文章莫名其妙不显示**。

原因通常很小：`pubDate` 写成了 `2026/11/26`、`category` 拼错一个字、`draft` 忘了改。这些错误在运行时不会报，页面就是安静地少一篇。

Astro 的内容集合用 schema 把这类问题挡在构建阶段。

## 没有 schema 时会发生什么

假设 `src/content/blog/hello.md` 里写了：

```yaml
---
title: 你好
pubDate: 2026/11/26
category: 技术类
---
```

排序代码里写的是 `b.data.pubDate.getTime() - a.data.pubDate.getTime()`。如果 `pubDate` 被解析成一个无效日期，`getTime()` 返回 `NaN`，排序结果就变成未定义的顺序——**页面还在，但顺序乱了**，而且没有任何提示。

`category` 拼错则更隐蔽：分类页按 `=== '技术'` 过滤，拼错的文章不会出现在任何分类下。

## 用 zod 定义约束

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['科研', '技术', '学习', '生活']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

三个关键点：

1. **`z.coerce.date()`** 会尝试把字符串转成日期。写 `2026-11-26` 能过，写 `2026/11/26` 也能过，写 `昨天` 就会抛错。这比手写正则宽容，又比完全不校验严格。
2. **`z.enum`** 把分类锁死在四个值上。拼错立刻失败。
3. **`z.default()`** 让选填字段有兜底，不用每篇都写 `tags`。

## 报错长什么样

故意写错一个分类，构建会输出类似：

```
[InvalidContentEntryFrontmatterError]
blog → zh-cn/hello.md frontmatter does not match collection schema.
  category: Invalid enum value. Expected '科研' | '技术' | '学习' | '生活', received '技术类'
```

**文件、字段、期望值、实际值**全都有。这比"少了一篇文章然后自己数"高效得多。

## 一个容易忽略的细节

schema 校验发生在**构建期**，所以：

- 本地 `npm run dev` 时也会校验，改错能立刻看到
- CI 构建失败会阻止部署，不会把坏数据发到线上
- 但**已经部署的旧版本不受影响**——这是静态站的好处

## 我踩过的坑

给 `tags` 写 `z.array(z.string())` 时，如果文章里写成：

```yaml
tags: Astro, Markdown
```

YAML 会把它解析成一个字符串而不是数组，schema 报错 `Expected array, received string`。

正确写法是方括号：

```yaml
tags: ['Astro', 'Markdown']
```

## 小结

schema 的价值不在于"更规范"，而在于**把静默失败变成显式失败**。

对一个人维护的博客来说，这一点尤其重要——没有同事帮你 review，只能靠机器在构建时替你盯着。
