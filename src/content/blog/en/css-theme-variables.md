---
title: Three Ways to Build Theme Switching with CSS Variables
description: Comparing the data-attribute, class-toggle and prefers-color-scheme approaches, and where each one breaks.
pubDate: 2026-11-25
category: 技术
tags: ['CSS', 'Theme', 'Frontend']
cover: cover-schema.jpg
---

Dark/light switching looks simple, but the approach you pick determines which bugs you will hit. Three common ones, compared.

## Approach 1: toggle a `data-theme` attribute

```css
:root {
  --bg: #f5f1ea;
  --fg: #1f1b17;
}

:root[data-theme='dark'] {
  --bg: #1c1a1f;
  --fg: #d8dae0;
}

body {
  background: var(--bg);
  color: var(--fg);
}
```

```js
document.documentElement.setAttribute('data-theme', 'dark');
```

**Pros**: variables live in one place; no colour literals leak into components; one attribute switches the whole site.
**Cons**: you need a default in `:root`, otherwise the first paint has no colours.

## Approach 2: toggle a class

```css
.dark {
  --bg: #1c1a1f;
  --fg: #d8dae0;
}
```

**Pros**: roughly the same as approach 1.
**Cons**: `class` is a styling hook and gets clobbered by other logic (a component may already use a `dark` variant). `data-theme` is semantically clearer and will not collide with layout classes.

**Prefer `data-theme`**, and leave `class` for layout and components.

## Approach 3: `prefers-color-scheme` only

```css
@media (prefers-color-scheme: dark) {
  :root { --bg: #1c1a1f; }
}
```

**Pros**: zero JavaScript, follows the system.
**Cons**: **the user cannot override it**. If the OS is dark but you want light, there is no switch.

The correct approach combines both:

```js
const saved = localStorage.getItem('theme');
const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
const theme = saved || (prefersDark ? 'dark' : 'light');
document.documentElement.dataset.theme = theme;
```

## The detail you must handle: flash of wrong theme

If the theme is applied after `DOMContentLoaded`, the user sees one frame of white before it turns dark — jarring.

The fix is an **inline script in `<head>`**, executed before first paint:

```html
<script is:inline>
  (function () {
    try {
      var saved = localStorage.getItem('blog-theme');
      var prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
</script>
```

Three requirements:

1. It must be **inline** — an external script waits on the network
2. It must be wrapped in `try/catch` — `localStorage` throws in private mode
3. It must be in `<head>`, not at the end of `<body>`

## Three ways this goes wrong

**1. Reading and writing different keys**

I hit this: the reader used `blog-theme`, the writer used `Blog-theme`. It looked like "sometimes it works" — it was writing a key nobody read. After any bulk rename, grep for the old value.

**2. Forgetting one variable**

Add a colour to the light block but not the dark one and that region stays white in dark mode. **The two blocks must be maintained as a pair.**

**3. Syntax highlighting does not follow**

Static highlighters (Shiki/Prism) emit inline colours that CSS variables cannot override. You need a dual-theme setup where the highlighter emits `--shiki-dark` style variables and your CSS switches them.

## Summary

| Approach | Follows system | User can override | Recommendation |
|---|---|---|---|
| `data-theme` + inline script | ✅ | ✅ | **Recommended** |
| Class toggle | ✅ | ✅ | Works, weaker semantics |
| `prefers-color-scheme` only | ✅ | ❌ | Not enough |
