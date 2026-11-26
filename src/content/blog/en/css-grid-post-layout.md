---
title: CSS Grid creates a two-column layout of "text + table of contents"
description: Use minmax(0,1fr) and sticky positioning to create article directories, and the writing method degenerates into folding blocks under narrow screens.
pubDate: 2026-11-18
category: 技术
tags: ['CSS', '布局', 'Grid']
cover: cover-schema.jpg
---
Long articles require a table of contents. On the desktop, put the sticky bar on the right side, and on the mobile phone, use the top one - this layout can be written in just a few lines of Grid.

## basic structure

```html
<div class="post-layout">
  <article>...</article>
  <aside class="post-toc">...</aside>
</div>
```

```css
.post-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2.5rem;
}
```

Narrow screens are arranged in single columns first. The table of contents is located after the main text in the DOM, so it will appear below the main text by default.

## Convert widescreen to two columns

```css
@media (min-width: 1080px) {
  .post-layout {
    grid-template-columns: minmax(0, var(--measure)) 14rem;
    justify-content: center;
    align-items: start;
    gap: 3.5rem;
  }
}
```

Three main points:

**1. `minmax(0, 1fr)` instead of `1fr`**

The minimum value of `1fr` is `auto`. When encountering long code blocks or long links, the column will be broken, causing horizontal scrolling. `minmax(0, 1fr)` The mandatory minimum value is 0, and the content will scroll internally if it exceeds it.

This is the most common cause of grid layout overflow.

**2. `align-items: start`**

The default is `stretch`, which will cause the directory bar to be stretched to the full column height, and sticky positioning will be disabled (because it has no scrolling space).

**3. `justify-content: center`**

The total width of the two columns may be smaller than the container, and the center row is more balanced.

## Make directory bar sticky

```css
@media (min-width: 1080px) {
  .post-toc {
    position: sticky;
    top: 2rem;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
  }
}
```

`max-height` + `overflow-y` is to prevent the directory from exceeding the screen if it is very long. Note `top` Allow the height of the page header.

## Narrow screen degradation

When the screen is narrow, the table of contents is below the main text, and readers have to scroll to the end to see it - useless. Two options:

- Use `order: -1` to bring it to the front of the text
- Add `position: sticky` to fix at the top

Choose the first one here and make it into a foldable block:

```css
@media (max-width: 1079px) {
  .post-toc {
    order: -1;
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.7rem 0.9rem;
    background: var(--bg-soft);
  }
  .post-toc ul {
    max-height: 11rem;
    overflow-y: auto;
  }
}
```

`max-height` Limit the height of the directory block to prevent it from filling the first screen.

## Scroll to highlight the current chapter

In addition to layout, a little bit of JS is required: when scrolling, determine which title has scrolled past the upper part of the viewport, and highlight its corresponding directory item.

```js
const links = [...document.querySelectorAll('.post-toc a')];
const targets = links.map((link) => ({
  link,
  el: document.getElementById(decodeURIComponent(link.hash.slice(1))),
})).filter((t) => t.el);

function onScroll() {
  let current = null;
  for (const { link, el } of targets) {
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.2) current = link;
  }
  links.forEach((l) => l.classList.toggle('is-active', l === current));
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
```

Two details:

- `decodeURIComponent` handles Chinese anchors (the browser will encode `#最小二乘`)
- `{ passive: true }` Make scroll monitoring non-blocking and long pages smoother

## The pits that have been stepped on

**Table of contents is not displayed**: When there are less than 2 titles, I do not render the table of contents directly. As a result, an article with only 1 h2 has no table of contents - this is expected behavior, but remember to tell the reader.

**Sticky Failure**: When the parent element has `overflow: hidden`, `position: sticky` will become invalid. Check the ancestor chain of `.post-layout`.

**Chinese anchor point jump error**: `href="#中文"` will be encoded into `#%E4%B8%AD%E6%96%87` in HTML, and `hash` must be decoded to `getElementById`.

## summary

| question | solution |
|---|---|
| Long content breaks the column | `minmax(0, 1fr)` |
| Stickiness does not take effect | `align-items: start` + Check Ancestor `overflow` |
| Narrow screen catalog at the bottom | `order: -1` |
| Directory too long | `max-height` + `overflow-y: auto` |
