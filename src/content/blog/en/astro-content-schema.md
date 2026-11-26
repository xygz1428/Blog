---
title: What Astro Content Collection Schemas Actually Prevent
description: Use zod to constrain frontmatter so that "a post silently disappears" becomes "the build fails with a clear error".
pubDate: 2026-11-26
category: 技术
tags: ['Astro', 'Markdown', 'Build']
cover: cover-schema.jpg
---

The most common problem when writing a blog is not typography — it is **a post that mysteriously does not show up**.

The cause is usually tiny: `pubDate` written as `2026/11/26`, a typo in `category`, or `draft` left on. None of these throw at runtime; the page just quietly misses one entry.

Astro content collections move this class of bug into the build step.

## What happens without a schema

Say `src/content/blog/hello.md` contains:

```yaml
---
title: Hello
pubDate: 2026/11/26
category: Tech-ish
---
```

The sort code calls `b.data.pubDate.getTime() - a.data.pubDate.getTime()`. If `pubDate` parses into an invalid date, `getTime()` returns `NaN` and the ordering becomes undefined — **the page still renders, the order is just wrong**, with no warning.

A misspelled `category` is even quieter: the category page filters on `=== '技术'`, so the post appears in no category at all.

## Defining constraints with zod

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

Three things matter here:

1. **`z.coerce.date()`** tries to convert strings into dates. `2026-11-26` passes, `2026/11/26` also passes, `yesterday` throws. It is more forgiving than a hand-written regex and stricter than no validation.
2. **`z.enum`** locks the category to four values. A typo fails immediately.
3. **`z.default()`** gives optional fields a fallback, so you do not have to write `tags` on every post.

## What the error looks like

Write a bad category on purpose and the build prints something like:

```
[InvalidContentEntryFrontmatterError]
blog → zh-cn/hello.md frontmatter does not match collection schema.
  category: Invalid enum value. Expected '科研' | '技术' | '学习' | '生活', received '技术类'
```

**File, field, expected values, actual value** — all present. Far more efficient than "one post is missing, let me count them".

## One detail people miss

Schema validation runs at **build time**, which means:

- `npm run dev` validates too, so mistakes surface immediately
- A failing CI build blocks deployment, so bad data never reaches production
- The already-deployed version is unaffected — a benefit of static sites

## A trap I hit

With `z.array(z.string())` for `tags`, writing:

```yaml
tags: Astro, Markdown
```

makes YAML parse a single string rather than an array, and the schema errors with `Expected array, received string`.

The correct form uses brackets:

```yaml
tags: ['Astro', 'Markdown']
```

## Summary

The value of a schema is not "being more disciplined" — it is **turning silent failures into loud ones**.

For a blog maintained by one person this matters more than usual: there is no colleague to review your frontmatter, so you rely on the machine to catch it at build time.
