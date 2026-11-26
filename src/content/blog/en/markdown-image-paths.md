---
title: Three Image Path Traps in Markdown
description: Sub-path deployment, directory moves, relative resolution — all three make images fail silently.
pubDate: 2026-11-23
category: 技术
tags: ['Markdown', 'Images', 'Deployment']
cover: cover-writing-guide.jpg
---

Broken images are the most common blog failure, and all three causes look identical: **the page renders, the image does not**.

## Trap 1: absolute paths under a sub-path deployment

The site lives at `https://<user>.github.io/Blog/`. Writing:

```markdown
![](/images/demo.png)
```

points `/images/` at the **domain root**, not `/Blog/`, so it 404s.

**Correct**: use a relative path.

```markdown
![](./images/demo.png)
```

At build time Astro resolves it into a hashed, base-prefixed URL:

```html
<img src="/Blog/_astro/demo.CKJBRs3P.webp">
```

**Note**: that prefix is added at build time, not written by you. Places where you hand-write `href` or `src` (navigation links, for example) still need their own base handling — usually a `withBase()` helper.

## Trap 2: moving a post breaks its relative paths

I moved posts from `src/content/blog/` into `src/content/blog/zh-cn/`, and every previously working `./images/x.png` broke — relative paths resolve **against the file's own directory**, so one level down means one level missing.

```
Before: blog/hello.md       → ./images/x.png = blog/images/x.png ✅
After:  blog/zh-cn/hello.md → ./images/x.png = blog/zh-cn/images/x.png ❌
```

**Fix**: change to `../images/x.png`, or move files and immediately build to inspect the `img src`.

**Lesson**: moving a Markdown file means fixing its image paths.

## Trap 3: the image is referenced but not in a processed directory

Astro only processes images that are **referenced and located inside the source tree**. Files in `public/` are copied verbatim — no optimisation, no hashing.

Two strategies:

| Location | Behaviour | Use for |
|---|---|---|
| `src/content/blog/images/` | Optimised at build, converted to WebP, hashed | Post illustrations (recommended) |
| `public/` | Copied as-is; you handle the base prefix yourself | favicon, robots.txt |

The difference is significant: a 46 KB PNG became a 19 KB WebP, plus automatic `loading="lazy"` and width/height attributes (which prevent layout shift).

## Two bonuses

Using relative paths inside the source tree also gives you:

- **Automatic compression** — no manual image optimisation
- **Cache safety** — filenames carry a content hash, so changing an image changes its name

## Checklist

When an image does not show up, check in order:

1. Does the path start with `/`? Change it to `./`
2. Is the file inside `src/content/blog/images/`?
3. Did the post move? Is the relative depth right?
4. What does the built output say? If `img src` contains `/Blog/_astro/`, it is correct.

```bash
grep -o '<img[^>]*src="[^"]*"' dist/blog/your-post/index.html
```

## Summary

| Trap | Symptom | Fix |
|---|---|---|
| Absolute path | 404 under a sub-path deployment | Use `./` relative paths |
| Directory move | Everything breaks at once | Add a `../` level |
| Wrong directory | Image shows but is not optimised | Put it in `src/content/blog/images/` |
