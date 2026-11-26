---
title: "Shiki Dual Themes: A Config Key in the Wrong Place Fails Silently"
description: How syntaxHighlight and shikiConfig divide responsibilities in Astro 7, and one mistake that throws no error at all.
pubDate: 2026-11-24
category: 技术
tags: ['Astro', 'Shiki', 'Highlighting']
cover: cover-schema.jpg
---

My code blocks were dark even in light mode. After a round of debugging, the cause was **a config key written where nothing reads it**.

## Symptom

The page uses a warm off-white background, but code blocks were `#24292e` with light grey text — visually jarring.

Inspecting the output HTML:

```html
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8">
```

`github-dark` is Shiki's **default theme**. My dual-theme configuration was never applied.

## The wrong way

```js
markdown: {
  syntaxHighlight: {
    type: 'shiki',
    themes: { light: 'github-light', dark: 'github-dark' },  // ❌ invalid key
  },
}
```

`syntaxHighlight` accepts exactly two keys: `type` and `excludeLangs`. Anything else is **silently dropped** — no error, no warning.

That is what makes it painful: the build succeeds, pages render, only the styling is wrong.

## The right way

Themes belong in `shikiConfig`:

```js
markdown: {
  syntaxHighlight: { type: 'shiki' },
  shikiConfig: {
    themes: { light: 'github-light', dark: 'github-dark' },
    wrap: true,
  },
}
```

After the change the output becomes:

```html
<pre class="astro-code astro-code-themes github-light github-dark"
     style="background-color:#fff;--shiki-dark-bg:#24292e;color:#24292e;--shiki-dark:#e1e4e8">
```

What changed:

- an extra `astro-code-themes` class
- inline styles are now the **light** theme (`#fff` / `#24292e`)
- the dark colours move into CSS variables `--shiki-dark` / `--shiki-dark-bg`

## The matching CSS

The highlighter only emits variables; switching is your job:

```css
:root[data-theme='dark'] .astro-code,
:root[data-theme='dark'] .astro-code span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

Note that `.astro-code span` must be included — syntax colours are applied to spans, so styling only the `pre` is not enough.

## Another trap: `!important` stealing the background

I originally had:

```css
pre {
  background: var(--code-bg) !important;  /* ❌ */
}
```

It forced the light background over Shiki's inline dark background, while the syntax colours stayed light grey — **a contrast ratio of 1.03, i.e. invisible code**.

Removing the `!important` let Shiki's background apply and the syntax colours became readable.

**Rule**: do not fight the syntax highlighter over `background`.

## How to verify it worked

Do not trust "the build passed". Look at the output:

```bash
grep -o 'astro-code-themes' dist/blog/some-post/index.html
grep -o -- '--shiki-dark' dist/blog/some-post/index.html
```

Both must be present.

## Summary

| Item | Location |
|---|---|
| Highlighter type | `markdown.syntaxHighlight.type` |
| Themes | `markdown.shikiConfig.themes` |
| Wrapping | `markdown.shikiConfig.wrap` |
| Dark switching | your own CSS, targeting `.astro-code` and `.astro-code span` |

**Wrong config does not throw.** Problems like this are only found by inspecting the output.
